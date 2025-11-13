import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tag.findMany({
      orderBy: { usageCount: 'desc' },
      include: {
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });
  }

  async findPopular(limit: number = 20) {
    return this.prisma.tag.findMany({
      take: limit,
      orderBy: { usageCount: 'desc' },
      include: {
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });
  }

  async search(query: string) {
    return this.prisma.tag.findMany({
      where: {
        name: {
          contains: query.toLowerCase(),
          mode: 'insensitive',
        },
      },
      orderBy: { usageCount: 'desc' },
      take: 10,
    });
  }

  async findByName(name: string) {
    return this.prisma.tag.findUnique({
      where: { name: name.toLowerCase() },
      include: {
        questions: {
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
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }
}