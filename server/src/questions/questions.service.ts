import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto, UpdateQuestionDto, QuestionFiltersDto } from './dto/question.dto';

@Injectable()
export class QuestionsService {
  private readonly logger = new Logger(QuestionsService.name);
  private embeddingService: any; // Lazy loaded to avoid circular dependency

  constructor(private prisma: PrismaService) { }

  // Lazy load embedding service to avoid circular dependency
  private async getEmbeddingService() {
    if (!this.embeddingService) {
      const { EmbeddingService } = await import('../ai/services/embedding.service');
      const { ConfigService } = await import('@nestjs/config');
      const configService = new ConfigService();
      this.embeddingService = new EmbeddingService(this.prisma, configService);
    }
    return this.embeddingService;
  }

  async create(createQuestionDto: CreateQuestionDto, authorId: string) {
    const { tags, ...questionData } = createQuestionDto;

    const tagConnections = await Promise.all(
      tags.map(async (tagName) => {
        const tag = await this.prisma.tag.upsert({
          where: { name: tagName.toLowerCase() },
          update: { usageCount: { increment: 1 } },
          create: {
            name: tagName.toLowerCase(),
            usageCount: 1
          },
        });
        return { id: tag.id };
      })
    );

    const question = await this.prisma.question.create({
      data: {
        ...questionData,
        excerpt: questionData.description.substring(0, 150),
        authorId,
        tags: {
          connect: tagConnections,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            reputation: true,
          },
        },
        tags: true,
        _count: {
          select: {
            answers: true,
            saves: true,
          },
        },
      },
    });

    // 🆕 Auto-generate embedding (non-blocking)
    this.generateEmbeddingAsync(question).catch(err =>
      this.logger.warn(`Failed to generate embedding for question ${question.id}: ${err.message}`)
    );

    return question;
  }

  private async generateEmbeddingAsync(question: any) {
    try {
      const embeddingService = await this.getEmbeddingService();
      const tagNames = question.tags?.map(t => (typeof t === 'string' ? t : t.name)).join(', ') || '';
      const content = `${question.title}\n\n${question.description}\n\nTags: ${tagNames}`;

      await embeddingService.createEmbedding('question', question.id, content);
      this.logger.log(`✅ Generated embedding for question: ${question.id}`);
    } catch (error) {
      this.logger.error(`❌ Embedding generation failed: ${error.message}`);
    }
  }

  async findAll(filters: QuestionFiltersDto) {
    const { category, search, sortBy = 'newest', tag } = filters;

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tag) {
      where.tags = {
        some: {
          name: tag.toLowerCase(),
        },
      };
    }

    const orderBy = this.getOrderBy(sortBy);

    return this.prisma.question.findMany({
      where,
      orderBy,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            reputation: true,
          },
        },
        tags: true,
        _count: {
          select: {
            answers: true,
            saves: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            reputation: true,
          },
        },
        tags: true,
        answers: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
                reputation: true,
              },
            },
          },
          orderBy: [
            { isAccepted: 'desc' },
            { upvotes: 'desc' },
            { createdAt: 'asc' },
          ],
        },
        _count: {
          select: {
            answers: true,
            saves: true,
          },
        },
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    await this.prisma.question.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return question;
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto, userId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (question.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own questions');
    }

    const { tags, ...questionData } = updateQuestionDto;

    let tagConnections;
    if (tags) {
      tagConnections = await Promise.all(
        tags.map(async (tagName) => {
          const tag = await this.prisma.tag.upsert({
            where: { name: tagName.toLowerCase() },
            update: { usageCount: { increment: 1 } },
            create: {
              name: tagName.toLowerCase(),
              usageCount: 1
            },
          });
          return { id: tag.id };
        })
      );
    }

    return this.prisma.question.update({
      where: { id },
      data: {
        ...questionData,
        ...(questionData.description && {
          excerpt: questionData.description.substring(0, 150)
        }),
        ...(tagConnections && {
          tags: {
            set: tagConnections,
          },
        }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            reputation: true,
          },
        },
        tags: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (question.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own questions');
    }

    return this.prisma.question.delete({
      where: { id },
    });
  }

  async markAsSolved(id: string, userId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (question.authorId !== userId) {
      throw new ForbiddenException('You can only mark your own questions as solved');
    }

    return this.prisma.question.update({
      where: { id },
      data: { solved: true },
    });
  }

  async getTrending(limit: number = 10) {
    return this.prisma.question.findMany({
      take: limit,
      orderBy: [
        { views: 'desc' },
        { upvotes: 'desc' },
      ],
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            reputation: true,
          },
        },
        tags: true,
      },
    });
  }

  async getByUser(userId: string) {
    return this.prisma.question.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            reputation: true,
          },
        },
        tags: true,
      },
    });
  }

  private getOrderBy(sortBy: string) {
    switch (sortBy) {
      case 'oldest':
        return { createdAt: 'asc' as const };
      case 'votes':
        return { upvotes: 'desc' as const };
      case 'views':
        return { views: 'desc' as const };
      case 'newest':
      default:
        return { createdAt: 'desc' as const };
    }
  }
}