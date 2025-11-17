import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SavesService } from './saves.service';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CurrentUserId } from '../auth/decorators/current-user.decorator';

@ApiTags('saves')
@Controller('saves')
@UseGuards(ClerkAuthGuard)
@ApiBearerAuth()
export class SavesController {
  constructor(
    private savesService: SavesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get saved questions' })
  async getSavedQuestions(@CurrentUserId() userId: string) {
    return this.savesService.getSavedQuestions(userId);
  }

  @Post('questions/:questionId')
  @ApiOperation({ summary: 'Save a question' })
  async saveQuestion(
    @Param('questionId') questionId: string,
    @CurrentUserId() userId: string,
  ) {
    return this.savesService.saveQuestion(userId, questionId);
  }

  @Delete('questions/:questionId')
  @ApiOperation({ summary: 'Unsave a question' })
  async unsaveQuestion(
    @Param('questionId') questionId: string,
    @CurrentUserId() userId: string,
  ) {
    return this.savesService.unsaveQuestion(userId, questionId);
  }

  @Get('questions/:questionId/status')
  @ApiOperation({ summary: 'Check if question is saved' })
  async isSaved(
    @Param('questionId') questionId: string,
    @CurrentUserId() userId: string,
  ) {
    return this.savesService.isSaved(userId, questionId);
  }
}