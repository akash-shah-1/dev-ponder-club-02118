import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VotesService } from './votes.service';
import { CreateVoteDto, TargetType } from './dto/vote.dto';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from '../users/users.service';

@ApiTags('votes')
@Controller('votes')
export class VotesController {
  constructor(
    private votesService: VotesService,
    private usersService: UsersService,
  ) {}

  @Post()
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Vote on question or answer' })
  async vote(@Body() createVoteDto: CreateVoteDto, @CurrentUser() user: any) {
    const dbUser = await this.usersService.findByClerkId(user.sub);
    return this.votesService.vote(createVoteDto, dbUser.id);
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