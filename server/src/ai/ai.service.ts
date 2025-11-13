import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OpenAiService } from './services/openai.service';
import { EmbeddingService } from './services/embedding.service';
import { ContextService } from './services/context.service';

@Injectable()
export class AiService {
  constructor(
    private prisma: PrismaService,
    private openAiService: OpenAiService,
    private embeddingService: EmbeddingService,
    private contextService: ContextService,
  ) {}

  async generateAnswer(questionId: string, userId: string) {
    // Check if question exists
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: {
        author: true,
        tags: true,
        answers: {
          where: { isAiGenerated: true },
        },
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    // Check if AI answer already exists
    if (question.answers.length > 0) {
      throw new BadRequestException('AI answer already exists for this question');
    }

    // Find similar questions
    const similarQuestions = await this.embeddingService.findSimilar(
      question.title + ' ' + question.description,
      'question',
      5,
    );

    // Get context from similar questions
    const context = await this.contextService.buildContext(
      question,
      similarQuestions,
    );

    // Generate AI response
    const aiResponse = await this.openAiService.generateAnswer(
      question,
      context,
    );

    // Create AI answer
    const answer = await this.prisma.answer.create({
      data: {
        content: aiResponse.content,
        questionId: question.id,
        authorId: userId,
        isAiGenerated: true,
        aiModel: aiResponse.model,
        aiConfidence: aiResponse.confidence,
      },
      include: {
        author: true,
      },
    });

    // Log AI query
    await this.prisma.aiQuery.create({
      data: {
        questionId: question.id,
        userId,
        prompt: JSON.stringify(context),
        response: aiResponse.content,
        model: aiResponse.model,
        tokensUsed: aiResponse.tokensUsed,
        confidence: aiResponse.confidence,
      },
    });

    // Create embedding for the new answer
    await this.embeddingService.createEmbedding(
      'answer',
      answer.id,
      aiResponse.content,
    );

    return {
      answer,
      similarQuestions: similarQuestions.map((sq) => ({
        id: sq.id,
        title: sq.title,
        similarity: sq.similarity,
      })),
    };
  }

  async findSimilarQuestions(questionId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const similar = await this.embeddingService.findSimilar(
      question.title + ' ' + question.description,
      'question',
      5,
    );

    return similar;
  }

  async checkExistingAiAnswer(questionId: string) {
    const aiAnswer = await this.prisma.answer.findFirst({
      where: {
        questionId,
        isAiGenerated: true,
      },
    });

    return {
      exists: !!aiAnswer,
      answerId: aiAnswer?.id,
    };
  }

  async getAiStats() {
    const totalQueries = await this.prisma.aiQuery.count();
    const totalAiAnswers = await this.prisma.answer.count({
      where: { isAiGenerated: true },
    });
    const acceptedAiAnswers = await this.prisma.answer.count({
      where: { isAiGenerated: true, isAccepted: true },
    });

    return {
      totalQueries,
      totalAiAnswers,
      acceptedAiAnswers,
      acceptanceRate:
        totalAiAnswers > 0
          ? ((acceptedAiAnswers / totalAiAnswers) * 100).toFixed(2)
          : 0,
    };
  }
}
