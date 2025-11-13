import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  private genAI: GoogleGenerativeAI;
  private embeddingModel: any;
  
  // 🆕 Embedding cache for performance
  private embeddingCache = new Map<string, number[]>();
  private readonly MAX_CACHE_SIZE = 1000;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Use Gemini's embedding model
    this.embeddingModel = this.genAI.getGenerativeModel({
      model: 'text-embedding-004'
    });
  }

  /**
   * Generate embedding using Gemini API with caching
   */
  async generateEmbedding(text: string): Promise<number[]> {
    // Create cache key (normalized)
    const cacheKey = text.toLowerCase().trim();
    
    // Check cache first
    if (this.embeddingCache.has(cacheKey)) {
      this.logger.log(`✅ Cache hit for: "${text.substring(0, 50)}..."`);
      return this.embeddingCache.get(cacheKey)!;
    }
    
    // Cache miss - generate embedding
    this.logger.log(`🔄 Generating embedding for: "${text.substring(0, 50)}..."`);
    
    try {
      const result = await this.embeddingModel.embedContent(text);
      const embedding = result.embedding.values;
      
      // Store in cache
      this.embeddingCache.set(cacheKey, embedding);
      
      // Limit cache size (LRU-style)
      if (this.embeddingCache.size > this.MAX_CACHE_SIZE) {
        const firstKey = this.embeddingCache.keys().next().value;
        this.embeddingCache.delete(firstKey);
        this.logger.log('🗑️ Cache size limit reached, removed oldest entry');
      }
      
      return embedding;
    } catch (error) {
      this.logger.error(`Failed to generate embedding: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create and store embedding for content
   */
  async createEmbedding(
    contentType: string,
    contentId: string,
    content: string,
  ) {
    try {
      // Generate embedding using Gemini
      const embeddingValues = await this.generateEmbedding(content);

      // Convert to pgvector format: [1,2,3] -> '[1,2,3]'
      const embeddingString = `[${embeddingValues.join(',')}]`;

      // Generate a unique ID using crypto
      const crypto = require('crypto');
      const id = crypto.randomUUID();

      // Store in database with raw SQL for vector type
      await this.prisma.$executeRaw`
        INSERT INTO ai_embeddings (id, "contentType", "contentId", content, embedding, metadata, "createdAt", "updatedAt")
        VALUES (
          ${id},
          ${contentType},
          ${contentId},
          ${content},
          ${embeddingString}::vector,
          ${JSON.stringify({ generatedAt: new Date() })}::jsonb,
          NOW(),
          NOW()
        )
        ON CONFLICT ("contentType", "contentId") 
        DO UPDATE SET
          content = ${content},
          embedding = ${embeddingString}::vector,
          "updatedAt" = NOW()
      `;

      this.logger.log(`Created embedding for ${contentType}:${contentId}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to create embedding: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Find similar content using vector similarity search
   */
  async findSimilar(text: string, contentType: string, limit: number = 5) {
    try {
      // Generate embedding for search query
      const queryEmbedding = await this.generateEmbedding(text);
      const embeddingString = `[${queryEmbedding.join(',')}]`;

      // Perform cosine similarity search
      const results = await this.prisma.$queryRaw<Array<{
        contentId: string;
        contentType: string;
        content: string;
        similarity: number;
      }>>`
        SELECT 
          "contentId",
          "contentType",
          content,
          1 - (embedding <=> ${embeddingString}::vector) as similarity
        FROM ai_embeddings
        WHERE "contentType" = ${contentType}
        ORDER BY embedding <=> ${embeddingString}::vector
        LIMIT ${limit}
      `;

      this.logger.log(`Vector search found ${results.length} results`);
      if (results.length > 0) {
        this.logger.log(`Top similarities: ${results.map(r => r.similarity.toFixed(3)).join(', ')}`);
      }

      // Get threshold from config
      const threshold = parseFloat(
        this.configService.get<string>('SIMILARITY_THRESHOLD') || '0.75'
      );

      // Filter by threshold and enrich with full data
      const filtered = results.filter(r => r.similarity >= threshold);
      this.logger.log(`After threshold (${threshold}): ${filtered.length} results`);

      if (contentType === 'question') {
        const questionIds = filtered.map(r => r.contentId);
        const questions = await this.prisma.question.findMany({
          where: { id: { in: questionIds } },
          include: {
            tags: true,
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
                reputation: true,
              },
            },
            _count: {
              select: {
                answers: true,
              },
            },
          },
        });

        // Map similarity scores to questions
        return questions.map(q => {
          const match = filtered.find(r => r.contentId === q.id);
          return {
            ...q,
            similarity: match?.similarity || 0,
          };
        }).sort((a, b) => b.similarity - a.similarity);
      }

      return filtered;
    } catch (error) {
      this.logger.error(`Vector search failed: ${error.message}`);
      // Fallback to empty results
      return [];
    }
  }

  /**
   * Batch create embeddings with progress tracking
   */
  async batchCreateEmbeddings(
    items: Array<{ type: string; id: string; content: string }>,
    batchSize: number = 10,
  ) {
    const results = [];
    const total = items.length;

    this.logger.log(`Starting batch embedding generation for ${total} items`);

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);

      const batchResults = await Promise.allSettled(
        batch.map(item => this.createEmbedding(item.type, item.id, item.content))
      );

      batchResults.forEach((result, idx) => {
        const item = batch[idx];
        if (result.status === 'fulfilled' && result.value.success) {
          results.push({ id: item.id, success: true });
        } else {
          const error = result.status === 'rejected'
            ? result.reason
            : result.value.error;
          results.push({ id: item.id, success: false, error });
        }
      });

      const progress = Math.min(i + batchSize, total);
      this.logger.log(`Progress: ${progress}/${total} (${((progress / total) * 100).toFixed(1)}%)`);

      // Rate limiting: wait 1 second between batches
      if (i + batchSize < items.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const successCount = results.filter(r => r.success).length;
    this.logger.log(`Completed: ${successCount}/${total} embeddings generated`);

    return results;
  }

  /**
   * Get embedding statistics
   */
  async getStats() {
    const stats = await this.prisma.aiEmbedding.groupBy({
      by: ['contentType'],
      _count: true,
    });

    return {
      total: stats.reduce((sum, s) => sum + s._count, 0),
      byType: stats.map(s => ({
        type: s.contentType,
        count: s._count,
      })),
    };
  }
}
