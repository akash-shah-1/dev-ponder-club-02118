import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VotesService } from './votes.service';
import { CreateVoteDto, TargetType } from './dto/vote.dto';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CurrentUserId } from '../auth/decorators/current-user.decorator';

@ApiTags('votes')
@Controller('votes')
export class VotesController {
  constructor(
    private votesService: VotesService,
  ) {}

  @Post()
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Vote on question or answer' })
  async vote(@Body() createVoteDto: CreateVoteDto, @CurrentUserId() userId: string) {
    return this.votesService.vote(createVoteDto, userId);
  }

  @Get(':targetId/status')
  @ApiOperation({ summary: 'Get vote status for target' })
  async getVoteStatus(
    @Param('targetId') targetId: string,
    @Query('targetType') targetType: TargetType,
    @Query('userId') userId?: string,
  ) {
    return this.votesService.getVoteStatus(targetId, targetType, userId);
  }
}