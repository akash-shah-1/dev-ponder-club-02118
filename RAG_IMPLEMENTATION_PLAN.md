# 🚀 RAG System Implementation Plan
## Gemini Embeddings + Vector Search + Context-Aware AI

---

## 📊 Overview

Transform the current chatbot into an intelligent, context-aware system that:
- **Learns** from your Q&A database
- **Suggests** similar questions before answering
- **Provides** context-aware responses using Gemini
- **Grows** smarter with every new Q&A

---

## 🎯 Implementation Phases

### **Phase 1: Database & Infrastructure Setup** ⏱️ 2-3 hours

#### 1.1 Enable pgvector Extension
```sql
-- Run in your PostgreSQL database
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify installation
SELECT * FROM pg_extension WHERE extname = 'vector';
```

#### 1.2 Add Database Indexes
```sql
-- Add index for faster vector searches
CREATE INDEX IF NOT EXISTS ai_embeddings_vector_idx 
ON ai_embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Add index for content type filtering
CREATE INDEX IF NOT EXISTS ai_embeddings_content_type_idx 
ON ai_embeddings(content_type, content_id);
```

#### 1.3 Environment Variables
```env
# Add to server/.env
GEMINI_API_KEY=your_existing_key
GEMINI_MODEL=gemini-2.5-flash-lite
GEMINI_EMBEDDING_MODEL=text-embedding-004
SIMILARITY_THRESHOLD=0.75
BATCH_SIZE=10
```

**Status**: ✅ `embedding.service.ts` updated with real Gemini embeddings

---

### **Phase 2: Initial Data Ingestion** ⏱️ 3-4 hours

#### 2.1 Update Ingestion Service
**File**: `server/src/ai/services/ingestion.service.ts`

**Changes Needed**:
```typescript
// Add method to ingest with better error handling
async ingestQuestionsWithRetry(limit: number = 100) {
  const questions = await this.prisma.question.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: { tags: true },
  });

  const items = questions.map(q => ({
    type: 'question',
    id: q.id,
    content: `${q.title}\n\n${q.description}\n\nTags: ${q.tags.map(t => t.name).join(', ')}`,
  }));

  return await this.embeddingService.batchCreateEmbeddings(items, 10);
}
```

#### 2.2 Create Ingestion Endpoint
**File**: `server/src/ai/ai.controller.ts`

```typescript
@Post('ingest/questions')
@UseGuards(ClerkAuthGuard) // Admin only
async ingestQuestions(@Query('limit') limit?: number) {
  return this.aiService.ingestQuestions(limit || 100);
}

@Post('ingest/answers')
@UseGuards(ClerkAuthGuard) // Admin only
async ingestAnswers(@Query('limit') limit?: number) {
  return this.aiService.ingestAnswers(limit || 100);
}

@Get('embeddings/stats')
async getEmbeddingStats() {
  return this.embeddingService.getStats();
}
```

#### 2.3 Run Initial Ingestion
```bash
# Via API (recommended)
curl -X POST http://localhost:3001/ai/ingest/questions?limit=500 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Or create a script
npm run ingest:all
```

**Expected Output**:
```
🌱 Starting question ingestion (limit: 500)
Progress: 10/500 (2.0%)
Progress: 20/500 (4.0%)
...
✅ Completed: 487/500 embeddings generated
```

---

### **Phase 3: Automatic Ingestion Hooks** ⏱️ 2-3 hours

#### 3.1 Question Creation Hook
**File**: `server/src/questions/questions.service.ts`

```typescript
import { EmbeddingService } from '../ai/services/embedding.service';

constructor(
  private prisma: PrismaService,
  private embeddingService: EmbeddingService, // Inject
) {}

async create(createQuestionDto: CreateQuestionDto, authorId: string) {
  const { tags, ...questionData } = createQuestionDto;

  // ... existing creation logic ...

  const question = await this.prisma.question.create({...});

  // 🆕 Generate embedding asynchronously (don't block response)
  this.generateEmbeddingAsync(question).catch(err => 
    console.error('Failed to generate embedding:', err)
  );

  return question;
}

private async generateEmbeddingAsync(question: any) {
  const content = `${question.title}\n\n${question.description}`;
  await this.embeddingService.createEmbedding('question', question.id, content);
}
```

#### 3.2 Answer Acceptance Hook
**File**: `server/src/answers/answers.service.ts`

```typescript
import { EmbeddingService } from '../ai/services/embedding.service';

constructor(
  private prisma: PrismaService,
  private embeddingService: EmbeddingService, // Inject
) {}

async acceptAnswer(id: string, userId: string) {
  // ... existing logic ...

  const answer = await this.prisma.answer.update({
    where: { id },
    data: { isAccepted: true },
  });

  // 🆕 Generate embedding for accepted answer
  this.generateEmbeddingAsync(answer).catch(err =>
    console.error('Failed to generate embedding:', err)
  );

  return answer;
}

private async generateEmbeddingAsync(answer: any) {
  await this.embeddingService.createEmbedding('answer', answer.id, answer.content);
}
```

#### 3.3 Update Module Imports
**File**: `server/src/questions/questions.module.ts`

```typescript
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule], // Add this
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
```

**File**: `server/src/answers/answers.module.ts`

```typescript
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule], // Add this
  controllers: [AnswersController],
  providers: [AnswersService],
  exports: [AnswersService],
})
```

---

### **Phase 4: Enhanced AI Service** ⏱️ 4-5 hours

#### 4.1 Update AI Service with Vector Search
**File**: `server/src/ai/ai.service.ts`

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { EmbeddingService } from './services/embedding.service';
import { ContextService } from './services/context.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(
    private embeddingService: EmbeddingService,
    private contextService: ContextService,
  ) {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite' 
    });
  }

  async chat(question: string) {
    try {
      // Step 1: Find similar questions using vector search
      this.logger.log(`Searching for similar questions...`);
      const similarQuestions = await this.embeddingService.findSimilar(
        question,
        'question',
        5
      );

      // Step 2: Build context from similar Q&As
      const context = await this.contextService.buildContext(
        { title: question, description: question },
        similarQuestions
      );

      // Step 3: Build enhanced prompt with context
      const prompt = this.buildPromptWithContext(question, context);

      // Step 4: Get AI response
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        answer: text,
        model: process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite',
        tokensUsed: 0,
        similarQuestions: similarQuestions.map(q => ({
          id: q.id,
          title: q.title,
          similarity: q.similarity,
          tags: q.tags?.map(t => t.name) || [],
          answerCount: q._count?.answers || 0,
        })),
        contextUsed: similarQuestions.length > 0,
      };
    } catch (error) {
      this.logger.error(`AI chat error: ${error.message}`);
      throw error;
    }
  }

  private buildPromptWithContext(question: string, context: any): string {
    let prompt = `You are a helpful coding assistant with access to a Q&A database.

User Question: ${question}

`;

    if (context.similarQuestions.length > 0) {
      prompt += `\n📚 CONTEXT - Similar Questions Found:\n`;
      context.similarQuestions.forEach((q, idx) => {
        prompt += `\n${idx + 1}. "${q.title}" (${(q.similarity * 100).toFixed(0)}% similar)\n`;
        prompt += `   Tags: ${q.tags.join(', ')}\n`;
      });
    }

    if (context.relevantAnswers.length > 0) {
      prompt += `\n✅ CONTEXT - Previous Solutions:\n`;
      context.relevantAnswers.forEach((a, idx) => {
        prompt += `\n${idx + 1}. From: "${a.questionTitle}"\n`;
        prompt += `   Solution: ${a.content}\n`;
      });
    }

    prompt += `\n---

Instructions:
1. If similar questions exist, acknowledge them and explain how this question relates
2. Provide a detailed, step-by-step answer
3. Include code examples when relevant
4. Format your response in markdown
5. If the context provides a solution, adapt it to this specific question

Your Response:`;

    return prompt;
  }
}
```

---

### **Phase 5: Frontend Integration** ⏱️ 3-4 hours

#### 5.1 Update AI Service Response Type
**File**: `client/src/api/services/ai.service.ts`

```typescript
export interface SimilarQuestion {
  id: string;
  title: string;
  similarity: number;
  tags: string[];
  answerCount: number;
}

export interface AiChatResponse {
  answer: string;
  model: string;
  tokensUsed: number;
  similarQuestions?: SimilarQuestion[];
  contextUsed?: boolean;
}
```

#### 5.2 Update Chatbot Component
**File**: `client/src/components/AIChatbot.tsx`

Add similar questions display:

```typescript
// After AI response, before displaying answer
{message.similarQuestions && message.similarQuestions.length > 0 && (
  <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
    <div className="flex items-center gap-2 mb-2">
      <Sparkles className="h-4 w-4 text-purple-600" />
      <span className="text-sm font-semibold text-purple-900 dark:text-purple-100">
        Found {message.similarQuestions.length} Similar Questions
      </span>
    </div>
    <div className="space-y-2">
      {message.similarQuestions.map((sq) => (
        <Link 
          key={sq.id} 
          to={`/questions/${sq.id}`}
          onClick={() => setIsOpen(false)}
          className="block"
        >
          <div className="p-2 rounded bg-white dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border border-purple-100 dark:border-purple-800">
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm flex-1">{sq.title}</span>
              <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700 border-purple-300">
                {(sq.similarity * 100).toFixed(0)}%
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {sq.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {sq.answerCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  • {sq.answerCount} answers
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
)}
```

---

### **Phase 6: Testing & Validation** ⏱️ 2-3 hours

#### 6.1 Test Checklist

**Embedding Generation**:
- [ ] New questions generate embeddings automatically
- [ ] Accepted answers generate embeddings
- [ ] Batch ingestion completes successfully
- [ ] Error handling works (API failures, rate limits)

**Vector Search**:
- [ ] Similar questions are found correctly
- [ ] Similarity scores are accurate (0.0 - 1.0)
- [ ] Threshold filtering works (0.75+)
- [ ] Search performance is acceptable (<500ms)

**AI Responses**:
- [ ] Context is included in prompts
- [ ] Similar questions are returned
- [ ] Responses reference context when available
- [ ] Fallback works when no similar questions found

**Frontend**:
- [ ] Similar questions display correctly
- [ ] Links work and close chatbot
- [ ] Similarity badges show percentages
- [ ] Mobile responsive

#### 6.2 Test Scenarios

**Scenario 1: Exact Match**
```
User: "How to fix undefined error in React?"
Expected: 
- Find 3-5 similar questions about undefined errors
- AI response references previous solutions
- Similarity scores > 0.85
```

**Scenario 2: Semantic Match**
```
User: "Cannot read property of null"
Expected:
- Find questions about "undefined", "null pointer", "property access"
- Similarity scores 0.75-0.90
- Context-aware response
```

**Scenario 3: New Topic**
```
User: "How to implement blockchain in React?"
Expected:
- No similar questions found (or very low similarity)
- AI provides general answer
- No context used
```

---

### **Phase 7: Monitoring & Analytics** ⏱️ 2-3 hours

#### 7.1 Add Logging
```typescript
// In ai.service.ts
this.logger.log(`Vector search: ${similarQuestions.length} results`);
this.logger.log(`Similarity scores: ${similarQuestions.map(q => q.similarity.toFixed(2)).join(', ')}`);
this.logger.log(`Context used: ${context.similarQuestions.length} questions, ${context.relevantAnswers.length} answers`);
```

#### 7.2 Create Admin Endpoint
```typescript
@Get('admin/stats')
@UseGuards(ClerkAuthGuard)
async getSystemStats() {
  const embeddingStats = await this.embeddingService.getStats();
  const recentSearches = await this.getRecentSearches();
  
  return {
    embeddings: embeddingStats,
    searches: recentSearches,
    timestamp: new Date(),
  };
}
```

---

## 📈 Success Metrics

### Week 1
- ✅ 80%+ of existing Q&As have embeddings
- ✅ Vector search returns results in <500ms
- ✅ Similar questions shown in 60%+ of queries

### Week 2
- ✅ AI responses reference context 70%+ of time
- ✅ Users click on similar questions 40%+ of time
- ✅ New Q&As automatically indexed

### Month 1
- ✅ 90%+ embedding coverage
- ✅ Average similarity score > 0.80 for matches
- ✅ Reduced duplicate questions by 30%

---

## 🚨 Common Issues & Solutions

### Issue 1: pgvector Extension Not Found
```sql
-- Install pgvector extension
CREATE EXTENSION vector;

-- If permission denied, run as superuser
\c postgres
CREATE EXTENSION vector;
```

### Issue 2: Slow Vector Search
```sql
-- Add index (if not exists)
CREATE INDEX ai_embeddings_vector_idx 
ON ai_embeddings USING ivfflat (embedding vector_cosine_ops);

-- Analyze table
ANALYZE ai_embeddings;
```

### Issue 3: Rate Limiting (Gemini API)
```typescript
// Add delay between batch requests
await new Promise(resolve => setTimeout(resolve, 1000));

// Reduce batch size
const BATCH_SIZE = 5; // Instead of 10
```

### Issue 4: Low Similarity Scores
```env
# Adjust threshold
SIMILARITY_THRESHOLD=0.70  # Lower from 0.75
```

---

## 🎓 Next Steps After Implementation

1. **Fine-tune Similarity Threshold**: Adjust based on real usage
2. **Add User Feedback**: "Was this helpful?" buttons
3. **Implement Caching**: Cache frequent queries
4. **Add Analytics Dashboard**: Track usage patterns
5. **Optimize Prompts**: Improve context formatting
6. **Add More Content Types**: Include comments, discussions

---

## 📚 Resources

- [Gemini Embedding API Docs](https://ai.google.dev/docs/embeddings_guide)
- [pgvector Documentation](https://github.com/pgvector/pgvector)
- [Vector Search Best Practices](https://www.pinecone.io/learn/vector-search/)
- [RAG Architecture Guide](https://www.anthropic.com/index/retrieval-augmented-generation)

---

## ✅ Implementation Checklist

### Phase 1: Setup
- [ ] Enable pgvector extension
- [ ] Add database indexes
- [ ] Update environment variables
- [ ] Test database connection

### Phase 2: Ingestion
- [ ] Update ingestion service
- [ ] Create ingestion endpoints
- [ ] Run initial ingestion
- [ ] Verify embeddings in database

### Phase 3: Hooks
- [ ] Add question creation hook
- [ ] Add answer acceptance hook
- [ ] Update module imports
- [ ] Test automatic ingestion

### Phase 4: AI Service
- [ ] Implement vector search
- [ ] Build context service
- [ ] Update AI prompts
- [ ] Test with sample queries

### Phase 5: Frontend
- [ ] Update API types
- [ ] Add similar questions UI
- [ ] Test user flow
- [ ] Mobile testing

### Phase 6: Testing
- [ ] Run all test scenarios
- [ ] Performance testing
- [ ] Error handling testing
- [ ] User acceptance testing

### Phase 7: Monitoring
- [ ] Add logging
- [ ] Create admin dashboard
- [ ] Set up alerts
- [ ] Document metrics

---

**Estimated Total Time**: 18-25 hours (2-3 days of focused work)

**Priority**: High - This transforms the chatbot from generic to context-aware

**Dependencies**: 
- Gemini API key (already have)
- PostgreSQL with pgvector (need to enable)
- Existing Q&A data (already have)

**Risk Level**: Low - Can be implemented incrementally without breaking existing features
