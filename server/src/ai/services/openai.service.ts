import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenAiService {
  private apiKey: string;
  private model: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY') || '';
    this.model = this.configService.get<string>('OPENAI_MODEL') || 'gpt-4-turbo-preview';
  }

  async generateAnswer(question: any, context: any) {
    // For now, return mock response
    // TODO: Integrate real OpenAI API
    const mockResponse = this.generateMockResponse(question, context);
    
    return {
      content: mockResponse,
      model: 'mock-gpt-4',
      tokensUsed: 500,
      confidence: 0.85,
    };
  }

  private generateMockResponse(question: any, context: any): string {
    const hasContext = context.similarQuestions?.length > 0;
    
    let response = `## Understanding the Issue\n\n`;
    
    if (hasContext) {
      response += `I noticed this question is similar to some previous discussions on our platform. Let me explain the concept and provide a solution.\n\n`;
    }
    
    response += `The issue you're experiencing with **"${question.title}"** typically occurs when:\n\n`;
    response += `1. **Root Cause**: The underlying problem is often related to how the system handles this particular scenario.\n\n`;
    response += `2. **Why This Happens**: This behavior is expected because of the way the framework/library processes these operations.\n\n`;
    
    response += `## Solution Approach\n\n`;
    response += `Here's how to resolve this step by step:\n\n`;
    response += `\`\`\`javascript\n`;
    response += `// Example solution based on your question\n`;
    response += `// This demonstrates the concept\n`;
    response += `const solution = () => {\n`;
    response += `  // Step 1: Initialize properly\n`;
    response += `  // Step 2: Handle the edge case\n`;
    response += `  // Step 3: Return expected result\n`;
    response += `};\n`;
    response += `\`\`\`\n\n`;
    
    response += `## Why This Works\n\n`;
    response += `This solution addresses the root cause by ensuring that the system properly handles the scenario. `;
    response += `The key insight is understanding the lifecycle and timing of operations.\n\n`;
    
    if (hasContext) {
      response += `## Related Discussions\n\n`;
      response += `You might also find these related questions helpful:\n`;
      context.similarQuestions.slice(0, 2).forEach((sq: any, idx: number) => {
        response += `${idx + 1}. ${sq.title} (${(sq.similarity * 100).toFixed(0)}% similar)\n`;
      });
      response += `\n`;
    }
    
    response += `## Next Steps\n\n`;
    response += `1. Try implementing the solution above\n`;
    response += `2. Test with your specific use case\n`;
    response += `3. Let me know if you need clarification on any part\n\n`;
    
    response += `*Note: This is an AI-generated answer. Please verify the solution works for your specific context.*`;
    
    return response;
  }

  async createEmbedding(text: string): Promise<number[]> {
    // Mock embedding - returns random vector
    // TODO: Integrate real OpenAI embeddings API
    return Array.from({ length: 1536 }, () => Math.random());
  }
}
