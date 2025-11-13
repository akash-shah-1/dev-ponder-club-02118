import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDiscussionDto, UpdateDiscussionDto, CreateDiscussionReplyDto } from './dto/discussion.dto';

@Injectable()
export class DiscussionsService {
  constructor(private prisma: PrismaService) {}

  async create(createDiscussionDto: CreateDiscussionDto, authorId: string) {
    return this.prisma.discussion.create({
      data: {
        ...createDiscussionDto,
        tags: createDiscussionDto.tags || [],
        authorId,
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
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });
  }

  async findAll(filters?: any) {
    const where: any = {};
    
    if (filters?.category) {
      where.category = filters.category;
    }
    
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.discussion.findMany({
      where,
      include: {
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
            replies: true,
          },
        },
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findOne(id: string) {
    const discussion = await this.prisma.discussion.findUnique({
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
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
                reputation: true,
              },
            },
            childReplies: {
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
            },
          },
          where: { parentReplyId: null },
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    if (!discussion) {
      throw new NotFoundException('Discussion not found');
    }

    await this.prisma.discussion.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return discussion;
  }

  async update(id: string, updateDiscussionDto: UpdateDiscussionDto, userId: string) {
    const discussion = await this.prisma.discussion.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!discussion) {
      throw new NotFoundException('Discussion not found');
    }

    if (discussion.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own discussions');
    }

    return this.prisma.discussion.update({
      where: { id },
      data: updateDiscussionDto,
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
    });
  }

  async remove(id: string, userId: string) {
    const discussion = await this.prisma.discussion.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!discussion) {
      throw new NotFoundException('Discussion not found');
    }

    if (discussion.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own discussions');
    }

    return this.prisma.discussion.delete({
      where: { id },
    });
  }

  async addReply(discussionId: string, createReplyDto: CreateDiscussionReplyDto, authorId: string) {
    const discussion = await this.prisma.discussion.findUnique({
      where: { id: discussionId },
    });

    if (!discussion) {
      throw new NotFoundException('Discussion not found');
    }

    return this.prisma.discussionReply.create({
      data: {
        content: createReplyDto.content,
        discussionId,
        authorId,
        parentReplyId: createReplyDto.parentReplyId,
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
      },
    });
  }

  async getReplies(discussionId: string) {
    return this.prisma.discussionReply.findMany({
      where: { discussionId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            reputation: true,
          },
        },
        childReplies: {
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
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}