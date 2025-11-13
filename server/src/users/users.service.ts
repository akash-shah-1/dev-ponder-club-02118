import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
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
}