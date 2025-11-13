import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-pro' 
    });
  }

  async chat(question: string) {
    const maxRetries = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const prompt = `You are a helpful coding assistant. Provide clear, detailed explanations with code examples when relevant. Format your responses in markdown.

User Question: ${question}`;

        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return {
          answer: text,
          model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
          tokensUsed: 0, // Gemini doesn't provide token count in free tier
        };
      } catch (error) {
        lastError = error;
        console.error(`Gemini API Error (attempt ${attempt}/${maxRetries}):`, error.message);
        
        // If it's a 503 (overloaded) and we have retries left, wait and try again
        if (error.status === 503 && attempt < maxRetries) {
          const waitTime = attempt * 2000; // 2s, 4s, 6s
          console.log(`Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
        
        // For other errors or last attempt, throw
        break;
      }
    }

    throw new Error('Failed to get AI response: ' + lastError.message);
  }
}
