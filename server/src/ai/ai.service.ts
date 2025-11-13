import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { EmbeddingService } from './services/embedding.service';
import { ContextService } from './services/context.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(
    private configService: ConfigService,
    private embeddingService: EmbeddingService,
    private contextService: ContextService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: this.configService.get<string>('GEMINI_MODEL') || 'gemini-1.5-flash' 
    });
  }

  async chat(question: string) {
    const maxRetries = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Step 1: Find similar questions using vector search
        this.logger.log(`Searching for similar questions...`);
        const similarQuestions = await this.embeddingService.findSimilar(
          question,
          'question',
          5
        );

        this.logger.log(`Found ${similarQuestions.length} similar questions`);
        if (similarQuestions.length > 0) {
          this.logger.log(`Top similarity: ${(similarQuestions[0].similarity * 100).toFixed(1)}%`);
        }

        // Step 2: Build context from similar Q&As
        const context = await this.contextService.buildContext(
          { title: question, description: question, tags: [], category: '' },
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
          model: this.configService.get<string>('GEMINI_MODEL') || 'gemini-1.5-flash',
          tokensUsed: 0,
          similarQuestions: similarQuestions.map(q => ({
            id: q.id,
            title: q.title,
            similarity: q.similarity,
            tags: q.tags?.map(t => (typeof t === 'string' ? t : t.name)) || [],
            answerCount: q._count?.answers || 0,
          })),
          contextUsed: similarQuestions.length > 0,
        };
      } catch (error) {
        lastError = error;
        this.logger.error(`Gemini API Error (attempt ${attempt}/${maxRetries}):`, error.message);
        
        // If it's a 503 (overloaded) and we have retries left, wait and try again
        if (error.status === 503 && attempt < maxRetries) {
          const waitTime = attempt * 2000; // 2s, 4s, 6s
          this.logger.log(`Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        
        // For other errors or last attempt, throw
        break;
      }
    }

    throw new Error('Failed to get AI response: ' + lastError.message);
  }

  private buildPromptWithContext(question: string, context: any): string {
    let prompt = `You are a CODING-ONLY assistant. ONLY answer programming questions.

User Question: ${question}

`;

    if (context.similarQuestions.length > 0) {
      prompt += `\n📚 Similar Questions in Database:\n`;
      context.similarQuestions.forEach((q, idx) => {
        prompt += `${idx + 1}. "${q.title}" (${(q.similarity * 100).toFixed(0)}% match)\n`;
      });
      prompt += `\n`;
    }

    if (context.relevantAnswers.length > 0) {
      prompt += `✅ Previous Solutions:\n`;
      context.relevantAnswers.forEach((a, idx) => {
        prompt += `${idx + 1}. ${a.content.substring(0, 200)}...\n`;
      });
      prompt += `\n`;
    }

    prompt += `---

CRITICAL RULES:
1. ONLY answer coding/programming questions
2. Detect if question is about coding:
   - Keywords: error, issue, problem, bug, code, API, auth, database, function, etc.
   - If mentions tech terms (React, Node, Python, etc.) → It's coding
   - Pure greetings ("hi", "hello", "hey") → NOT coding
   - "stuck in X" where X is tech → It's coding
3. If NOT coding (only greetings, weather, personal advice):
   - Say: "I only assist with coding questions. Please ask about programming, errors, or technical issues."
4. Keep responses under 150 words
5. Be direct - no fluff
6. If similar questions exist, mention them: "This is similar to [question title]"
7. Use bullet points
8. Include minimal code only if needed

Format for CODING questions:
- Problem: [1 sentence]
- Solution: [2-3 bullets]
- Why: [1 sentence]

Your Response:`;

    return prompt;
  }

  async generateDetailedAnswer(questionId: string, questionTitle: string, questionDescription: string) {
    try {
      // Use the image generation model for detailed answers with diagrams
      const imageModel = this.genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash-exp'
      });

      // Build a detailed prompt for comprehensive answer with examples
      const prompt = `You are an expert programming tutor. Provide a comprehensive, detailed answer to this coding question.

Question: ${questionTitle}

Description: ${questionDescription}

REQUIREMENTS:
1. Provide a DETAILED explanation (not just a brief answer)
2. Include PRACTICAL CODE EXAMPLES with comments
3. Explain WHY the solution works
4. Include BEST PRACTICES
5. Add COMMON PITFALLS to avoid
6. If applicable, suggest alternative approaches
7. Use clear formatting with sections

FORMAT YOUR RESPONSE AS:

## Understanding the Problem
[Explain what the issue is and why it occurs]

## Solution
[Provide the main solution with detailed code example]

\`\`\`javascript
// Your code example here with comments
\`\`\`

## Explanation
[Explain how and why the solution works]

## Best Practices
- [Practice 1]
- [Practice 2]
- [Practice 3]

## Common Pitfalls
- [Pitfall 1 and how to avoid it]
- [Pitfall 2 and how to avoid it]

## Alternative Approaches
[If applicable, mention other ways to solve this]

Provide a thorough, educational response that helps the developer truly understand the solution.`;

      const result = await imageModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        answer: text,
        model: 'gemini-2.0-flash-exp',
        questionId,
        isAiGenerated: true,
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Failed to generate detailed answer:`, error.message);
      throw new Error('Failed to generate AI answer: ' + error.message);
    }
  }
}
