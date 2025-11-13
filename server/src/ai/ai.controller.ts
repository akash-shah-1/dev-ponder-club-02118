import { Controller, Post, Get, Param, UseGuards, Req } from '@nestjs/common';
import { AiService } from './ai.service';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-answer/:questionId')
  @UseGuards(ClerkAuthGuard)
  async generateAnswer(
    @Param('questionId') questionId: string,
    @Req() req: any,
  ) {
    return this.aiService.generateAnswer(questionId, req.user.id);
  }

  @Get('similar-questions/:questionId')
  async findSimilarQuestions(@Param('questionId') questionId: string) {
    return this.aiService.findSimilarQuestions(questionId);
  }

  @Get('check-existing/:questionId')
  async checkExistingAiAnswer(@Param('questionId') questionId: string) {
    return this.aiService.checkExistingAiAnswer(questionId);
  }

  @Get('stats')
  @UseGuards(ClerkAuthGuard)
  async getAiStats() {
    return this.aiService.getAiStats();
  }
}
