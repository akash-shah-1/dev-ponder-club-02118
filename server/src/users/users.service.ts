import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClerkService } from '../auth/clerk.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { userWithRecentActivity } from '../prisma/prisma.includes';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private clerkService: ClerkService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findByClerkId(clerkId: string) {
    return this.prisma.user.findUnique({
      where: { clerkId },
      ...userWithRecentActivity,
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      ...userWithRecentActivity,
    });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    // Assuming dateOfBirth is already a Date object or undefined,
    // handled by a validation pipe before reaching the service.
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async getTopUsers(limit: number = 10) {
    return this.prisma.user.findMany({
      take: limit,
      orderBy: { reputation: Prisma.SortOrder.desc },
      select: {
        id: true,
        name: true,
        avatar: true,
        reputation: true,
        _count: {
          select: {
            questions: true,
            answers: true,
          },
        },
      },
    });
  }

  async syncUserFromClerk(clerkUser: any) {
    const existingUser = await this.prisma.user.findUnique({ // Use prisma directly to avoid recursive findByClerkId call
        where: { clerkId: clerkUser.id },
    });
    
    if (existingUser) {
      return this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
            name: `${clerkUser.firstName} ${clerkUser.lastName}`.trim(),
            email: clerkUser.emailAddresses[0]?.emailAddress,
            avatar: clerkUser.imageUrl,
        },
      });
    }

    return this.prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        name: `${clerkUser.firstName} ${clerkUser.lastName}`.trim(),
        email: clerkUser.emailAddresses[0]?.emailAddress,
        avatar: clerkUser.imageUrl,
      },
    });
  }

  async findOrCreateByClerkId(clerkId: string) {
    let user = await this.prisma.user.findUnique({
        where: { clerkId },
        ...userWithRecentActivity,
    });
    
    if (!user) {
      const clerkUser = await this.clerkService.getUser(clerkId);
      await this.syncUserFromClerk(clerkUser); // Use the returned user directly
      // No need for a second fetch, syncUserFromClerk returns the user with relations if needed
      // If syncUserFromClerk doesn't return with relations, you might need to add `...userWithRecentActivity` to it
      // For now, assuming it returns enough to proceed or a subsequent fetch is handled elsewhere if full relations are critical immediately after creation.
      user = await this.findByClerkId(clerkId); // Re-fetch to ensure relations are included
    }
    
    return user;
  }

  async getUserStats(userId: string) {
    const [questionCount, answerCount, totalViews, acceptedAnswers] = await Promise.all([
      // Total questions
      this.prisma.question.count({
        where: { authorId: userId },
      }),
      // Total answers
      this.prisma.answer.count({
        where: { authorId: userId },
      }),
      // Total views on user's questions
      this.prisma.question.aggregate({
        where: { authorId: userId },
        _sum: { views: true },
      }),
      // Accepted answers count
      this.prisma.answer.count({
        where: { 
          authorId: userId,
          isAccepted: true,
        },
      }),
    ]);

    return {
      questions: questionCount,
      answers: answerCount,
      reach: totalViews._sum.views || 0,
      acceptedAnswers,
    };
  }

  async getUserActivity(userId: string, limit: number = 10) {
    const [recentQuestions, recentAnswers] = await Promise.all([
      this.prisma.question.findMany({
        where: { authorId: userId },
        take: limit,
        orderBy: { createdAt: Prisma.SortOrder.desc },
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      }),
      this.prisma.answer.findMany({
        where: { authorId: userId },
        take: limit,
        orderBy: { createdAt: Prisma.SortOrder.desc },
        include: {
          question: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),
    ]);

    // Combine and sort by date
    const activities = [
      ...recentQuestions.map(q => ({
        type: 'question' as const,
        id: q.id,
        title: q.title,
        createdAt: q.createdAt,
      })),
      ...recentAnswers.map(a => ({
        type: 'answer' as const,
        id: a.id,
        title: a.question.title,
        questionId: a.question.id,
        createdAt: a.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    return activities;
  }
}