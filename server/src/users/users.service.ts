import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClerkService } from '../auth/clerk.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

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
      include: {
        questions: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        answers: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        questions: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        answers: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    // Convert dateOfBirth string to DateTime if provided
    const data: any = { ...updateUserDto };
    if (data.dateOfBirth) {
      data.dateOfBirth = new Date(data.dateOfBirth);
    }
    
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async getTopUsers(limit: number = 10) {
    return this.prisma.user.findMany({
      take: limit,
      orderBy: { reputation: 'desc' },
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
    const existingUser = await this.findByClerkId(clerkUser.id);
    
    if (existingUser) {
      return this.updateUser(existingUser.id, {
        name: `${clerkUser.firstName} ${clerkUser.lastName}`.trim(),
        email: clerkUser.emailAddresses[0]?.emailAddress,
        avatar: clerkUser.imageUrl,
      });
    }

    return this.createUser({
      clerkId: clerkUser.id,
      name: `${clerkUser.firstName} ${clerkUser.lastName}`.trim(),
      email: clerkUser.emailAddresses[0]?.emailAddress,
      avatar: clerkUser.imageUrl,
    });
  }

  async findOrCreateByClerkId(clerkId: string) {
    let user = await this.findByClerkId(clerkId);
    
    if (!user) {
      // Fetch user from Clerk and create in database
      const clerkUser = await this.clerkService.getUser(clerkId);
      await this.syncUserFromClerk(clerkUser);
      // Fetch the newly created user with relations
      user = await this.findByClerkId(clerkId);
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
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      }),
      this.prisma.answer.findMany({
        where: { authorId: userId },
        take: limit,
        orderBy: { createdAt: 'desc' },
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