import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVoteDto, VoteType, TargetType } from './dto/vote.dto';

@Injectable()
export class VotesService {
  constructor(private prisma: PrismaService) {}

  async vote(createVoteDto: CreateVoteDto, userId: string) {
    const { type, targetId, targetType } = createVoteDto;

    const existingVote = await this.prisma.vote.findUnique({
      where: {
        userId_targetId_targetType: {
          userId,
          targetId,
          targetType,
        },
      },
    });

    if (existingVote) {
      if (existingVote.type === type) {
        await this.removeVote(targetId, targetType, userId);
        return { action: 'removed', type };
      } else {
        await this.prisma.vote.update({
          where: { id: existingVote.id },
          data: { type },
        });
        await this.updateVoteCounts(targetId, targetType);
        return { action: 'changed', type };
      }
    }

    await this.prisma.vote.create({
      data: {
        type,
        userId,
        targetId,
        targetType,
      },
    });

    await this.updateVoteCounts(targetId, targetType);
    await this.updateUserReputation(targetId, targetType, type, 'add');

    return { action: 'added', type };
  }

  async removeVote(targetId: string, targetType: TargetType, userId: string) {
    const vote = await this.prisma.vote.findUnique({
      where: {
        userId_targetId_targetType: {
          userId,
          targetId,
          targetType,
        },
      },
    });

    if (vote) {
      await this.prisma.vote.delete({
        where: { id: vote.id },
      });
      await this.updateVoteCounts(targetId, targetType);
      await this.updateUserReputation(targetId, targetType, vote.type as any, 'remove');
    }
  }

  async getVoteStatus(targetId: string, targetType: TargetType, userId?: string) {
    const votes = await this.prisma.vote.findMany({
      where: { targetId, targetType },
    });

    const upvotes = votes.filter(v => v.type === 'UPVOTE').length;
    const downvotes = votes.filter(v => v.type === 'DOWNVOTE').length;
    
    let userVote = null;
    if (userId) {
      const userVoteRecord = votes.find(v => v.userId === userId);
      userVote = userVoteRecord ? userVoteRecord.type : null;
    }

    return {
      upvotes,
      downvotes,
      score: upvotes - downvotes,
      userVote,
    };
  }

  private async updateVoteCounts(targetId: string, targetType: TargetType) {
    const votes = await this.prisma.vote.findMany({
      where: { targetId, targetType },
    });

    const upvotes = votes.filter(v => v.type === 'UPVOTE').length;
    const downvotes = votes.filter(v => v.type === 'DOWNVOTE').length;

    if (targetType === TargetType.QUESTION) {
      await this.prisma.question.update({
        where: { id: targetId },
        data: { upvotes, downvotes },
      });
    } else if (targetType === TargetType.ANSWER) {
      await this.prisma.answer.update({
        where: { id: targetId },
        data: { upvotes, downvotes },
      });
    }
  }

  private async updateUserReputation(
    targetId: string,
    targetType: TargetType,
    voteType: VoteType,
    action: 'add' | 'remove'
  ) {
    let authorId: string;
    
    if (targetType === TargetType.QUESTION) {
      const question = await this.prisma.question.findUnique({
        where: { id: targetId },
        select: { authorId: true },
      });
      authorId = question?.authorId;
    } else {
      const answer = await this.prisma.answer.findUnique({
        where: { id: targetId },
        select: { authorId: true },
      });
      authorId = answer?.authorId;
    }

    if (!authorId) return;

    const reputationChange = this.getReputationChange(voteType, targetType);
    const increment = action === 'add' ? reputationChange : -reputationChange;

    await this.prisma.user.update({
      where: { id: authorId },
      data: { reputation: { increment } },
    });
  }

  private getReputationChange(voteType: VoteType, targetType: TargetType): number {
    if (voteType === VoteType.UPVOTE) {
      return targetType === TargetType.QUESTION ? 5 : 10;
    } else {
      return targetType === TargetType.QUESTION ? -2 : -2;
    }
  }
}