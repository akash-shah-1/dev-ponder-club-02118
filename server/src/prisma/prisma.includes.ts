import { Prisma } from '@prisma/client';

export const authorSelect = {
  select: {
    id: true,
    name: true,
    avatar: true,
    reputation: true,
  },
};

export const authorWithEmailSelect = {
  select: {
    id: true,
    name: true,
    email: true,
    avatar: true,
    reputation: true,
  },
};

export const userWithRecentActivity = {
  include: {
    questions: {
      take: 5,
      orderBy: { createdAt: Prisma.SortOrder.desc },
    },
    answers: {
      take: 5,
      orderBy: { createdAt: Prisma.SortOrder.desc },
    },
  },
};

