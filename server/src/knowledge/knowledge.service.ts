import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKnowledgeDto, UpdateKnowledgeDto, KnowledgeFiltersDto } from './dto/knowledge.dto';
import { authorWithEmailSelect } from '../prisma/prisma.includes';

@Injectable()
export class KnowledgeService {
  constructor(private prisma: PrismaService) {}

  async create(createKnowledgeDto: CreateKnowledgeDto, authorId: string) {
    const wordCount = createKnowledgeDto.content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);
    
    const { tags, ...articleData } = createKnowledgeDto;

    return this.prisma.knowledgeArticle.create({
      data: {
        ...articleData,
        authorId,
        readTime,
        views: 0,
        upvotes: 0,
        tags: tags?.length ? {
          connect: tags.map(tagId => ({ id: tagId }))
        } : undefined,
      },
      include: {
        author: authorWithEmailSelect,
        tags: true,
      },
    });
  }

  async findAll(filters: KnowledgeFiltersDto) {
    const where: any = {};

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.knowledgeArticle.findMany({
      where,
      include: {
        author: authorWithEmailSelect,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const article = await this.prisma.knowledgeArticle.findUnique({
      where: { id },
      include: {
        author: authorWithEmailSelect,
      },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    // Increment views
    await this.prisma.knowledgeArticle.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return article;
  }

  async update(id: string, updateKnowledgeDto: UpdateKnowledgeDto, userId: string) {
    const article = await this.prisma.knowledgeArticle.findUnique({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (article.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own articles');
    }

    let readTime = article.readTime;
    if (updateKnowledgeDto.content) {
      const wordCount = updateKnowledgeDto.content.split(/\s+/).length;
      readTime = Math.ceil(wordCount / 200);
    }

    const { tags, ...articleData } = updateKnowledgeDto;

    return this.prisma.knowledgeArticle.update({
      where: { id },
      data: {
        ...articleData,
        readTime,
        tags: tags ? {
          set: tags.map(tagId => ({ id: tagId }))
        } : undefined,
      },
      include: {
        author: authorWithEmailSelect,
        tags: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    const article = await this.prisma.knowledgeArticle.findUnique({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    if (article.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own articles');
    }

    return this.prisma.knowledgeArticle.delete({
      where: { id },
    });
  }

  async getMostViewed(limit: number = 10) {
    return this.prisma.knowledgeArticle.findMany({
      where: { status: 'published' },
      include: {
        author: authorWithEmailSelect,
      },
      orderBy: { views: 'desc' },
      take: limit,
    });
  }

  async getByCategory(category: string) {
    return this.prisma.knowledgeArticle.findMany({
      where: {
        category,
        status: 'published',
      },
      include: {
        author: authorWithEmailSelect,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}