import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { authorWithEmailSelect } from '../prisma/prisma.includes';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto, userId: string) {
    const answer = await this.prisma.answer.findUnique({
      where: { id: createCommentDto.answerId },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    return this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        answerId: createCommentDto.answerId,
        authorId: userId,
      },
      include: {
        author: authorWithEmailSelect,
      },
    });
  }

  async findByAnswer(answerId: string) {
    return this.prisma.comment.findMany({
      where: { answerId },
      include: {
        author: authorWithEmailSelect,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        author: authorWithEmailSelect,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
      include: {
        author: authorWithEmailSelect,
      },
    });
  }

  async remove(id: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    return this.prisma.comment.delete({
      where: { id },
    });
  }
}