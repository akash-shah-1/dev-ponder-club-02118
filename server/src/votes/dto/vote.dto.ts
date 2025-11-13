import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum VoteType {
  UPVOTE = 'UPVOTE',
  DOWNVOTE = 'DOWNVOTE',
}

export enum TargetType {
  QUESTION = 'QUESTION',
  ANSWER = 'ANSWER',
}

export class CreateVoteDto {
  @ApiProperty({ enum: VoteType })
  @IsEnum(VoteType)
  type: VoteType;

  @ApiProperty()
  @IsString()
  targetId: string;

  @ApiProperty({ enum: TargetType })
  @IsEnum(TargetType)
  targetType: TargetType;
}