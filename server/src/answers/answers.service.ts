import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnswerDto, UpdateAnswerDto } from './dto/answer.dto';
import { authorSelect } from '../prisma/prisma.includes';
import { REPUTATION_ANSWER_CREATED, REPUTATION_ANSWER_ACCEPTED } from '../common/constants';

@Injectable()
export class AnswersService {
  private readonly logger = new Logger(AnswersService.name);
  private embeddingService: any; // Lazy loaded

  constructor(private prisma: PrismaService) {}

  // Lazy load embedding service
  private async getEmbeddingService() {
    if (!this.embeddingService) {
      const { EmbeddingService } = await import('../ai/services/embedding.service');
      const { ConfigService } = await import('@nestjs/config');
      const configService = new ConfigService();
      this.embeddingService = new EmbeddingService(this.prisma, configService);
    }
    return this.embeddingService;
  }

  async create(createAnswerDto: CreateAnswerDto, authorId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id: createAnswerDto.questionId },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const answer = await this.prisma.answer.create({
      data: {
        content: createAnswerDto.content,
        questionId: createAnswerDto.questionId,
        authorId,
      },
      include: {
        author: authorSelect,
      },
    });

    await this.prisma.user.update({
      where: { id: authorId },
      data: { reputation: { increment: REPUTATION_ANSWER_CREATED } },
    });

    return answer;
  }

  async findByQuestion(questionId: string) {
    return this.prisma.answer.findMany({
      where: { questionId },
      include: {
        author: authorSelect,
      },
      orderBy: [
        { isAccepted: 'desc' },
        { upvotes: 'desc' },
        { createdAt: 'asc' },
      ],
    });
  }

  async findOne(id: string) {
    const answer = await this.prisma.answer.findUnique({
      where: { id },
      include: {
        author: authorSelect,
        question: {
          select: {
            id: true,
            title: true,
            authorId: true,
          },
        },
      },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    return answer;
  }

  async update(id: string, updateAnswerDto: UpdateAnswerDto, userId: string) {
    const answer = await this.prisma.answer.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    if (answer.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own answers');
    }

    return this.prisma.answer.update({
      where: { id },
      data: updateAnswerDto,
      include: {
        author: authorSelect,
      },
    });
  }

  async remove(id: string, userId: string) {
    const answer = await this.prisma.answer.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    if (answer.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own answers');
    }

    return this.prisma.answer.delete({
      where: { id },
    });
  }

  async acceptAnswer(id: string, userId: string) {
    const answer = await this.prisma.answer.findUnique({
      where: { id },
      include: {
        question: {
          select: { authorId: true },
        },
      },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    if (answer.question.authorId !== userId) {
      throw new ForbiddenException('Only the question author can accept answers');
    }

    const acceptedAnswer = await this.prisma.$transaction(async (tx) => {
      await tx.answer.updateMany({
        where: { questionId: answer.questionId },
        data: { isAccepted: false },
      });

      const updatedAnswer = await tx.answer.update({
        where: { id },
        data: { isAccepted: true },
        include: {
          author: authorSelect,
        },
      });

      await tx.user.update({
        where: { id: updatedAnswer.authorId },
        data: { reputation: { increment: REPUTATION_ANSWER_ACCEPTED } },
      });

      await tx.question.update({
        where: { id: answer.questionId },
        data: { solved: true },
      });
      return updatedAnswer;
    });

    // 🆕 Auto-generate embedding for accepted answer (non-blocking)
    this.generateEmbeddingAsync(acceptedAnswer).catch(err =>
      this.logger.warn(`Failed to generate embedding for answer ${acceptedAnswer.id}: ${err.message}`)
    );

    return acceptedAnswer;
  }

  private async generateEmbeddingAsync(answer: any) {
    try {
      const embeddingService = await this.getEmbeddingService();
      await embeddingService.createEmbedding('answer', answer.id, answer.content);
      this.logger.log(`✅ Generated embedding for accepted answer: ${answer.id}`);
    } catch (error) {
      this.logger.error(`❌ Embedding generation failed: ${error.message}`);
    }
  }

  async getByUser(userId: string) {
    return this.prisma.answer.findMany({
      where: { authorId: userId },
      include: {
        question: {
          select: {
            id: true,
            title: true,
          },
        },
        author: authorSelect,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
