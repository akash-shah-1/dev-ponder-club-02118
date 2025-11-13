import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SavesService } from './saves.service';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from '../users/users.service';

@ApiTags('saves')
@Controller('saves')
@UseGuards(ClerkAuthGuard)
@ApiBearerAuth()
export class SavesController {
  constructor(
    private savesService: SavesService,
    private usersService: UsersService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get saved questions' })
  async getSavedQuestions(@CurrentUser() user: any) {
    const dbUser = await this.usersService.findByClerkId(user.sub);
    return this.savesService.getSavedQuestions(dbUser.id);
  }

  @Post('questions/:questionId')
  @ApiOperation({ summary: 'Save a question' })
  async saveQuestion(
    @Param('questionId') questionId: string,
    @CurrentUser() user: any,
  ) {
    const dbUser = await this.usersService.findByClerkId(user.sub);
    return this.savesService.saveQuestion(dbUser.id, questionId);
  }

  @Delete('questions/:questionId')
  @ApiOperation({ summary: 'Unsave a question' })
  async unsaveQuestion(
    @Param('questionId') questionId: string,
    @CurrentUser() user: any,
  ) {
    const dbUser = await this.usersService.findByClerkId(user.sub);
    return this.savesService.unsaveQuestion(dbUser.id, questionId);
  }

  @Get('questions/:questionId/status')
  @ApiOperation({ summary: 'Check if question is saved' })
  async isSaved(
    @Param('questionId') questionId: string,
    @CurrentUser() user: any,
  ) {
    const dbUser = await this.usersService.findByClerkId(user.sub);
    return this.savesService.isSaved(dbUser.id, questionId);
  }
}