import { Injectable, NotFoundException, ForbiddenException, Logger, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto, UpdateQuestionDto, QuestionFiltersDto } from './dto/question.dto';
import { authorSelect } from '../prisma/prisma.includes';
import { EmbeddingService } from '../ai/services/embedding.service';

@Injectable()
export class QuestionsService {
  private readonly logger = new Logger(QuestionsService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => EmbeddingService))
    private embeddingService: EmbeddingService,
  ) { }

  async create(createQuestionDto: CreateQuestionDto, authorId: string) {
    const { tags: rawTags, ...questionData } = createQuestionDto;
    const tags = rawTags.map(tag => tag.toLowerCase());

    let tagConnections: { id: string }[] = [];

    if (tags && tags.length > 0) {
      // Find existing tags
      const existingTags = await this.prisma.tag.findMany({
        where: { name: { in: tags } },
      });
      const existingTagNames = new Set(existingTags.map(tag => tag.name));

      // Identify new tags
      const newTagNames = tags.filter(tagName => !existingTagNames.has(tagName));

      // Create new tags (batch)
      if (newTagNames.length > 0) {
        await this.prisma.tag.createMany({
          data: newTagNames.map(name => ({
            name: name,
            usageCount: 1,
          })),
          skipDuplicates: true, 
        });
      }

      // Update usage count for existing tags (batch)
      if (existingTags.length > 0) {
        await this.prisma.tag.updateMany({
          where: { name: { in: Array.from(existingTagNames) } },
          data: { usageCount: { increment: 1 } },
        });
      }

      // Get all tag IDs (existing and newly created) for connection
      const allTags = await this.prisma.tag.findMany({
        where: { name: { in: tags } },
        select: { id: true },
      });
      tagConnections = allTags.map(tag => ({ id: tag.id }));
    }

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
        author: authorSelect,
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
      const tagNames = question.tags?.map(t => (typeof t === 'string' ? t : t.name)).join(', ') || '';
      const content = `${question.title}\n\n${question.description}\n\nTags: ${tagNames}`;

      await this.embeddingService.createEmbedding('question', question.id, content);
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

    const questions = await this.prisma.question.findMany({
      where,
      orderBy,
      include: {
        author: authorSelect,
        tags: true,
        aiAnswer: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            answers: true,
            saves: true,
          },
        },
      },
    });

    // Transform _count.answers to answerCount for frontend compatibility
    return questions.map(q => ({
      ...q,
      answerCount: q._count.answers,
      savesCount: q._count.saves,
      hasAiAnswer: !!q.aiAnswer,
    }));
  }

  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        author: authorSelect,
        tags: true,
        answers: {
          include: {
            author: authorSelect,
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

    // Transform _count.answers to answerCount for frontend compatibility
    return {
      ...question,
      answerCount: question._count.answers,
      savesCount: question._count.saves,
    };
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

    const { tags: rawTags, ...questionData } = updateQuestionDto;
    let tagConnections: { id: string }[] | undefined;

    if (rawTags && rawTags.length > 0) {
      const tags = rawTags.map(tag => tag.toLowerCase());

      // Find existing tags
      const existingTags = await this.prisma.tag.findMany({
        where: { name: { in: tags } },
      });
      const existingTagNames = new Set(existingTags.map(tag => tag.name));

      // Identify new tags
      const newTagNames = tags.filter(tagName => !existingTagNames.has(tagName));

      // Create new tags (batch)
      if (newTagNames.length > 0) {
        await this.prisma.tag.createMany({
          data: newTagNames.map(name => ({
            name: name,
            usageCount: 1,
          })),
          skipDuplicates: true,
        });
      }

      // Update usage count for existing tags (batch)
      // Only increment for tags that were already existing and are being re-used
      if (existingTags.length > 0) {
        await this.prisma.tag.updateMany({
          where: { name: { in: Array.from(existingTagNames) } },
          data: { usageCount: { increment: 1 } },
        });
      }

      // Get all tag IDs (existing and newly created) for connection
      const allTags = await this.prisma.tag.findMany({
        where: { name: { in: tags } },
        select: { id: true },
      });
      tagConnections = allTags.map(tag => ({ id: tag.id }));
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
        author: authorSelect,
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
        author: authorSelect,
        tags: true,
      },
    });
  }

  async getByUser(userId: string) {
    return this.prisma.question.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: authorSelect,
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