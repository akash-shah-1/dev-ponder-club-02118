import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagWatchesService {
  constructor(private prisma: PrismaService) {}

  async watchTag(userId: string, tagId: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { id: tagId },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    const existingWatch = await this.prisma.tagWatch.findUnique({
      where: {
        userId_tagId: {
          userId,
          tagId,
        },
      },
    });

    if (existingWatch) {
      throw new BadRequestException('Already watching this tag');
    }

    return this.prisma.tagWatch.create({
      data: {
        userId,
        tagId,
      },
      include: {
        tag: true,
      },
    });
  }

  async unwatchTag(userId: string, tagId: string) {
    const watch = await this.prisma.tagWatch.findUnique({
      where: {
        userId_tagId: {
          userId,
          tagId,
        },
      },
    });

    if (!watch) {
      throw new NotFoundException('Tag watch not found');
    }

    return this.prisma.tagWatch.delete({
      where: {
        userId_tagId: {
          userId,
          tagId,
        },
      },
    });
  }

  async getWatchedTags(userId: string) {
    const watches = await this.prisma.tagWatch.findMany({
      where: { userId },
      include: {
        tag: true,
      },
    });

    return watches.map((watch) => watch.tag);
  }

  async isWatching(userId: string, tagId: string) {
    const watch = await this.prisma.tagWatch.findUnique({
      where: {
        userId_tagId: {
          userId,
          tagId,
        },
      },
    });

    return { isWatching: !!watch };
  }
}
