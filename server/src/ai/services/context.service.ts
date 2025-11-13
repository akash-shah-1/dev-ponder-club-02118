import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ContextService {
  constructor(private prisma: PrismaService) {}

  async buildContext(question: any, similarQuestions: any[]) {
    // Build rich context for AI
    const context = {
      currentQuestion: {
        title: question.title,
        description: question.description,
        tags: question.tags.map((t) => t.name),
        category: question.category,
      },
      similarQuestions: [],
      relevantAnswers: [],
    };

    // Get answers from similar questions
    if (similarQuestions.length > 0) {
      const similarIds = similarQuestions.map((sq) => sq.id);
      
      const answers = await this.prisma.answer.findMany({
        where: {
          questionId: { in: similarIds },
          isAccepted: true,
        },
        include: {
          question: {
            include: {
              tags: true,
            },
          },
        },
        take: 3,
      });

      context.similarQuestions = similarQuestions.map((sq) => ({
        id: sq.id,
        title: sq.title,
        similarity: sq.similarity,
        tags: sq.tags?.map((t) => t.name) || [],
      }));

      context.relevantAnswers = answers.map((a) => ({
        content: a.content.substring(0, 500), // Truncate for context
        questionTitle: a.question.title,
        wasAccepted: a.isAccepted,
      }));
    }

    return context;
  }

  async getUserHistory(userId: string, limit: number = 5) {
    const userQuestions = await this.prisma.question.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        tags: true,
      },
    });

    return userQuestions;
  }
}
