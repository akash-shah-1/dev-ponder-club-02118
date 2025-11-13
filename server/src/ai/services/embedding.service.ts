import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OpenAiService } from './openai.service';

@Injectable()
export class EmbeddingService {
  constructor(
    private prisma: PrismaService,
    private openAiService: OpenAiService,
  ) {}

  async createEmbedding(
    contentType: string,
    contentId: string,
    content: string,
  ) {
    const embedding = await this.openAiService.createEmbedding(content);

    // Store embedding in database
    // Note: pgvector integration will be needed for production
    await this.prisma.aiEmbedding.upsert({
      where: {
        contentType_contentId: {
          contentType,
          contentId,
        },
      },
      create: {
        contentType,
        contentId,
        content,
        metadata: { createdAt: new Date() },
      },
      update: {
        content,
        updatedAt: new Date(),
      },
    });

    return { success: true };
  }

  async findSimilar(text: string, contentType: string, limit: number = 5) {
    // Mock similarity search
    // TODO: Implement real vector similarity search with pgvector
    
    if (contentType === 'question') {
      const questions = await this.prisma.question.findMany({
        take: limit,
        orderBy: { views: 'desc' },
        include: {
          tags: true,
          author: true,
        },
      });

      return questions.map((q, idx) => ({
        ...q,
        similarity: 0.9 - idx * 0.1, // Mock similarity score
      }));
    }

    return [];
  }

  async batchCreateEmbeddings(items: Array<{ type: string; id: string; content: string }>) {
    const results = [];
    
    for (const item of items) {
      try {
        await this.createEmbedding(item.type, item.id, item.content);
        results.push({ id: item.id, success: true });
      } catch (error) {
        results.push({ id: item.id, success: false, error: error.message });
      }
    }

    return results;
  }
}
