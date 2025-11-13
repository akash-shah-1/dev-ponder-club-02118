import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { EmbeddingService } from './services/embedding.service';
import { ContextService } from './services/context.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(
    private configService: ConfigService,
    private embeddingService: EmbeddingService,
    private contextService: ContextService,
    private prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: this.configService.get<string>('GEMINI_MODEL') || 'gemini-2.5-flash-lite'
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
          model: this.configService.get<string>('GEMINI_MODEL') || 'gemini-2.5-flash-lite',
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

  private detectNeedForDiagram(title: string, description: string): boolean {
    const text = `${title} ${description}`.toLowerCase();

    // Keywords that suggest visual diagrams would be helpful
    const diagramKeywords = [
      'architecture', 'flow', 'diagram', 'structure', 'design pattern',
      'lifecycle', 'workflow', 'process', 'state machine', 'component tree',
      'data flow', 'system design', 'how does', 'how it works',
      'relationship between', 'hierarchy', 'sequence', 'pipeline',
      'visualization', 'graph', 'tree structure', 'network',
    ];

    return diagramKeywords.some(keyword => text.includes(keyword));
  }

  async generateDetailedAnswer(questionId: string, questionTitle: string, questionDescription: string) {
    // Detect if question needs visual diagrams
    const needsDiagram = this.detectNeedForDiagram(questionTitle, questionDescription);

    // Try multiple models in order of preference
    const models = needsDiagram
      ? [
        'gemini-2.0-flash-preview-image-generation', // For diagrams
        this.configService.get<string>('GEMINI_MODEL') || 'gemini-2.5-flash',
        'gemini-2.5-flash',
      ]
      : [
        this.configService.get<string>('GEMINI_MODEL') || 'gemini-2.5-flash',
        'gemini-2.5-flash-lite', // Fallback 1: Most stable
        'gemini-2.0-flash-lite', // Fallback 2: Good availability
      ];

    let lastError;

    for (const modelName of models) {
      const maxRetries = 2; // 2 retries per model

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          this.logger.log(`Attempting to generate answer with ${modelName} (attempt ${attempt}/${maxRetries})${needsDiagram ? ' [Diagram mode]' : ''}`);

          const detailedModel = this.genAI.getGenerativeModel({
            model: modelName
          });

          // Build a detailed prompt for comprehensive answer with examples
          const isImageModel = modelName.includes('image-generation');

          const prompt = isImageModel
            ? `You are an expert programming tutor with the ability to create visual diagrams. Provide a comprehensive answer to this coding question with BOTH text explanation AND visual diagrams.

Question: ${questionTitle}

Description: ${questionDescription}

REQUIREMENTS:
1. Generate a VISUAL DIAGRAM showing the architecture/flow/structure
2. Provide DETAILED text explanation
3. Include PRACTICAL CODE EXAMPLES with comments
4. Explain WHY the solution works
5. Include BEST PRACTICES and COMMON PITFALLS

FORMAT YOUR RESPONSE AS:

## Visual Overview
[Generate a diagram showing the architecture, flow, or structure]

## Understanding the Problem
[Explain what the issue is and why it occurs]

## Solution
[Provide the main solution with detailed code example]

\`\`\`javascript`
            : `You are an expert programming tutor. Provide a comprehensive, detailed answer to this coding question.

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

          const result = await detailedModel.generateContent(prompt);
          const response = await result.response;

          // Extract text and images (if any)
          const text = response.text();
          const images: string[] = [];

          // Check if response has images (for image generation model)
          if (isImageModel && response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
              if (part.inlineData?.mimeType?.startsWith('image/')) {
                // Convert base64 image data to data URL
                const imageData = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                images.push(imageData);
              }
            }
          }

          this.logger.log(`✅ Successfully generated answer with ${modelName}${images.length > 0 ? ` (${images.length} images)` : ''}`);

          const aiAnswerData = {
            answer: text,
            model: modelName,
            questionId,
            isAiGenerated: true,
            generatedAt: new Date().toISOString(),
            images: images.length > 0 ? images : undefined,
          };

          // Save AI answer to database
          try {
            await this.prisma.aiAnswer.upsert({
              where: { questionId },
              create: {
                questionId,
                answer: text,
                model: modelName,
                images: images.length > 0 ? images : [],
              },
              update: {
                answer: text,
                model: modelName,
                images: images.length > 0 ? images : [],
              },
            });
            this.logger.log(`💾 Saved AI answer to database for question ${questionId}`);
          } catch (dbError) {
            this.logger.error(`Failed to save AI answer to database:`, dbError.message);
            // Continue anyway, return the answer even if save fails
          }

          return aiAnswerData;
        } catch (error) {
          lastError = error;
          this.logger.error(`Failed with ${modelName} (attempt ${attempt}/${maxRetries}):`, error.message);

          // If it's a quota error (429) or overloaded (503) and we have retries left, wait and try again
          if ((error.status === 429 || error.status === 503) && attempt < maxRetries) {
            const waitTime = error.status === 503 ? 3000 : 2000; // 3s for 503, 2s for 429
            this.logger.log(`Waiting ${waitTime}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }

          // If last attempt with this model, break to try next model
          break;
        }
      }

      // If we get here, all retries for this model failed, try next model
      this.logger.log(`All retries failed for ${modelName}, trying next model...`);
    }

    // If all retries failed, throw error with helpful message
    const errorMessage = lastError?.status === 503
      ? 'AI service is currently overloaded. Please try again in a few moments.'
      : lastError?.status === 429
        ? 'API quota exceeded. Please try again later.'
        : 'Failed to generate AI answer. Please try again.';

    throw new Error(errorMessage);
  }

  async getAiAnswer(questionId: string) {
    try {
      const aiAnswer = await this.prisma.aiAnswer.findUnique({
        where: { questionId },
      });

      if (!aiAnswer) {
        return null;
      }

      return {
        answer: aiAnswer.answer,
        model: aiAnswer.model,
        questionId: aiAnswer.questionId,
        isAiGenerated: true,
        generatedAt: aiAnswer.createdAt.toISOString(),
        images: aiAnswer.images.length > 0 ? aiAnswer.images : undefined,
      };
    } catch (error) {
      this.logger.error(`Failed to get AI answer:`, error.message);
      return null;
    }
  }

  async generateSummary(questionId: string, questionTitle: string, questionDescription: string, answers: any[]) {
    try {
      // Build context with question and all answers
      let context = `Question: ${questionTitle}\n\nDescription: ${questionDescription}\n\n`;

      // Find answer with most upvotes
      let topAnswer = null;
      let maxUpvotes = 0;
      
      if (answers && answers.length > 0) {
        context += `Answers (${answers.length}):\n\n`;
        answers.forEach((answer, index) => {
          const upvotes = answer.upvotes || 0;
          if (upvotes > maxUpvotes) {
            maxUpvotes = upvotes;
            topAnswer = { index: index + 1, upvotes, content: answer.content };
          }
          context += `Answer ${index + 1} (${upvotes} upvotes):\n${answer.content}\n\n`;
        });
      } else {
        context += `No answers yet.\n`;
      }

      const prompt = `You are a technical summarizer. Provide a concise, clear summary of this Q&A thread.

${context}

${topAnswer && topAnswer.upvotes > 0 ? `\nNOTE: Answer ${topAnswer.index} has the most upvotes (${topAnswer.upvotes}) - this is likely the most helpful solution.\n` : ''}

REQUIREMENTS:
1. Summarize the MAIN PROBLEM in 1-2 sentences
2. List KEY SOLUTIONS mentioned (if any)
3. If there's a highly upvoted answer, mention it as the recommended solution
4. Keep it under 200 words
5. Use proper markdown formatting with line breaks

CRITICAL: Use proper markdown formatting with blank lines between sections!

FORMAT (with proper line breaks):

## Problem Summary

[Brief description of the issue]

## Solutions

- [Solution 1]
- [Solution 2]

${topAnswer && topAnswer.upvotes > 0 ? `## Most Upvoted Solution\n\nAnswer ${topAnswer.index} with ${topAnswer.upvotes} upvotes is the community-recommended solution.\n\n` : ''}## Key Takeaways

- [Takeaway 1]
- [Takeaway 2]

IMPORTANT: Make sure to add blank lines between sections for proper formatting!`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const summary = response.text();

      return {
        summary,
        questionId,
        generatedAt: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Failed to generate summary:`, error.message);
      throw new Error('Failed to generate summary. Please try again.');
    }
  }
}
