import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EmbeddingService } from './embedding.service';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    private prisma: PrismaService,
    private embeddingService: EmbeddingService,
  ) {}

  async ingestQuestions(limit: number = 100) {
    this.logger.log(`Starting question ingestion (limit: ${limit})`);

    const questions = await this.prisma.question.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        tags: true,
      },
    });

    const items = questions.map((q) => {
      const tagNames = q.tags.map(t => (typeof t === 'string' ? t : t.name)).join(', ');
      return {
        type: 'question',
        id: q.id,
        content: `${q.title}\n\n${q.description}\n\nTags: ${tagNames}`,
      };
    });

    const results = await this.embeddingService.batchCreateEmbeddings(items, 10);
    
    const successCount = results.filter((r) => r.success).length;
    const failedCount = results.filter((r) => !r.success).length;
    
    this.logger.log(`✅ Ingested ${successCount}/${questions.length} questions`);
    if (failedCount > 0) {
      this.logger.warn(`⚠️  Failed: ${failedCount} questions`);
    }

    return { 
      total: questions.length, 
      success: successCount,
      failed: failedCount,
      results: results.filter(r => !r.success), // Return failed items for debugging
    };
  }

  async ingestAnswers(limit: number = 100) {
    this.logger.log(`Starting answer ingestion (limit: ${limit})`);

    const answers = await this.prisma.answer.findMany({
      where: {
        isAccepted: true, // Only ingest accepted answers
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const items = answers.map((a) => ({
      type: 'answer',
      id: a.id,
      content: a.content,
    }));

    const results = await this.embeddingService.batchCreateEmbeddings(items);
    
    const successCount = results.filter((r) => r.success).length;
    this.logger.log(`Ingested ${successCount}/${answers.length} answers`);

    return { total: answers.length, success: successCount };
  }

  async ingestAll() {
    this.logger.log('Starting full ingestion pipeline');

    const questionResults = await this.ingestQuestions(500);
    const answerResults = await this.ingestAnswers(500);

    return {
      questions: questionResults,
      answers: answerResults,
      timestamp: new Date(),
    };
  }
}
