import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SavesService {
    constructor(private prisma: PrismaService) { }

    async saveQuestion(userId: string, questionId: string) {
        const question = await this.prisma.question.findUnique({
            where: { id: questionId },
        });

        if (!question) {
            throw new NotFoundException('Question not found');
        }

        const existingSave = await this.prisma.save.findUnique({
            where: {
                userId_questionId: {
                    userId,
                    questionId,
                },
            },
        });

        if (existingSave) {
            return { message: 'Question already saved' };
        }

        return this.prisma.save.create({
            data: {
                userId,
                questionId,
            },
            include: {
                question: {
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
                },
            },
        });
    }

    async unsaveQuestion(userId: string, questionId: string) {
        const save = await this.prisma.save.findUnique({
            where: {
                userId_questionId: {
                    userId,
                    questionId,
                },
            },
        });

        if (!save) {
            throw new NotFoundException('Save not found');
        }

        return this.prisma.save.delete({
            where: { id: save.id },
        });
    }

    async getSavedQuestions(userId: string) {
        return this.prisma.save.findMany({
            where: { userId },
            include: {
                question: {
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
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async isSaved(userId: string, questionId: string) {
        const save = await this.prisma.save.findUnique({
            where: {
                userId_questionId: {
                    userId,
                    questionId,
                },
            },
        });

        return { isSaved: !!save };
    }
}