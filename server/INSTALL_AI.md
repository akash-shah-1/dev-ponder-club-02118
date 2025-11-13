# AI Service Installation Guide

## 🚀 Quick Setup

### 1. Install Dependencies (Optional - for production)

```bash
npm install openai @nestjs/schedule
```

**Note**: The AI service currently uses mock responses. OpenAI integration is optional for now.

### 2. Enable pgvector in Neon Database

Run this SQL in your Neon database console:

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
```

### 3. Run Database Migration

```bash
npm run db:push
```

This will:
- Add AI fields to Answer model (isAiGenerated, aiModel, aiConfidence)
- Create AiQuery table for logging
- Create AiEmbedding table for vector search

### 4. Update Environment Variables

Add to your `.env` file:

```env
# AI Services (Optional - using mock for now)
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4-turbo-preview
AI_MAX_TOKENS=2000
AI_TEMPERATURE=0.7
```

### 5. Start the Server

```bash
npm run start:dev
```

## 📡 API Endpoints

### Generate AI Answer
```
POST /ai/generate-answer/:questionId
Authorization: Bearer <token>
```

### Check Existing AI Answer
```
GET /ai/check-existing/:questionId
```

### Find Similar Questions
```
GET /ai/similar-questions/:questionId
```

### Get AI Stats
```
GET /ai/stats
Authorization: Bearer <token>
```

## 🎯 How It Works

### Current Implementation (Mock Mode)
1. User clicks "Generate AI Answer" button
2. System checks if AI answer already exists
3. Finds similar questions (mock similarity)
4. Generates educational mock response
5. Posts as regular answer with AI badge

### Future Production Mode
1. Convert question to embeddings using OpenAI
2. Search vector DB for similar questions (pgvector)
3. Build context from past solutions
4. Generate answer using GPT-4.1
5. Store embeddings for future learning

## 🔧 Customization

### Modify AI Response Template
Edit: `server/src/ai/services/openai.service.ts`
- Method: `generateMockResponse()`

### Adjust Similarity Threshold
Edit: `server/src/ai/services/embedding.service.ts`
- Method: `findSimilar()`

### Change AI Behavior
Edit: `server/src/ai/ai.service.ts`
- Method: `generateAnswer()`

## 📊 Database Schema

### Answer Model Updates
```prisma
model Answer {
  isAiGenerated Boolean  @default(false)
  aiModel       String?
  aiConfidence  Float?
}
```

### New Models
```prisma
model AiQuery {
  id           String
  questionId   String
  userId       String?
  prompt       String
  response     String
  model        String
  tokensUsed   Int
  confidence   Float?
  wasHelpful   Boolean?
}

model AiEmbedding {
  id          String
  contentType String
  contentId   String
  content     String
  embedding   vector(1536)?
  metadata    Json?
}
```

## 🎨 Frontend Components

### AiAnswerButton
Add to question detail page:
```tsx
import { AiAnswerButton } from '@/components/ai/AiAnswerButton';

<AiAnswerButton 
  questionId={question.id} 
  onAnswerGenerated={refetchAnswers}
/>
```

### AiAnswerCard
Wrap AI answers:
```tsx
import { AiAnswerCard } from '@/components/ai/AiAnswerCard';

{answer.isAiGenerated && (
  <AiAnswerCard 
    content={answer.content}
    model={answer.aiModel}
    confidence={answer.aiConfidence}
  >
    <MarkdownContent content={answer.content} />
  </AiAnswerCard>
)}
```

### AiAnswerBadge
Show on answer cards:
```tsx
import { AiAnswerBadge } from '@/components/ai/AiAnswerBadge';

{answer.isAiGenerated && (
  <AiAnswerBadge 
    model={answer.aiModel}
    confidence={answer.aiConfidence}
  />
)}
```

## 🔐 Security Notes

1. AI generation requires authentication
2. Only one AI answer per question
3. Rate limiting applies (100 requests/minute)
4. AI answers can be voted/commented like regular answers
5. Only moderators can edit AI answers

## 📈 Monitoring

Check AI usage stats:
```bash
curl http://localhost:3000/ai/stats \
  -H "Authorization: Bearer <token>"
```

Response:
```json
{
  "totalQueries": 150,
  "totalAiAnswers": 145,
  "acceptedAiAnswers": 87,
  "acceptanceRate": "60.00"
}
```

## 🚧 Roadmap

- [ ] Real OpenAI GPT-4.1 integration
- [ ] Production pgvector similarity search
- [ ] Scheduled ingestion jobs
- [ ] User feedback collection
- [ ] A/B testing different prompts
- [ ] Multi-language support
- [ ] Code execution sandbox
- [ ] Confidence scoring improvements

## 🐛 Troubleshooting

### "AI answer already exists"
- Only one AI answer per question is allowed
- Delete existing AI answer to regenerate

### Mock responses not varied
- This is expected in mock mode
- Real AI will provide unique responses

### Vector search not working
- Ensure pgvector extension is enabled in Neon
- Run database migration
- Check Neon console for extension status

## 📚 Resources

- [OpenAI API Docs](https://platform.openai.com/docs)
- [pgvector GitHub](https://github.com/pgvector/pgvector)
- [Neon Vector Docs](https://neon.tech/docs/extensions/pgvector)
