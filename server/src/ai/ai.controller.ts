import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { EmbeddingService } from './services/embedding.service';
import { IngestionService } from './services/ingestion.service';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';

@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly embeddingService: EmbeddingService,
    private readonly ingestionService: IngestionService,
  ) {}

  @Post('chat')
  @ApiOperation({ summary: 'Chat with AI assistant' })
  async chat(@Body() body: { question: string }) {
    return this.aiService.chat(body.question);
  }

  @Post('answer-question')
  @ApiOperation({ summary: 'Generate AI answer for a specific question with examples and diagrams' })
  async answerQuestion(@Body() body: { questionId: string; questionTitle: string; questionDescription: string }) {
    return this.aiService.generateDetailedAnswer(body.questionId, body.questionTitle, body.questionDescription);
  }

  @Post('ingest/questions')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ingest questions into vector database' })
  async ingestQuestions(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 100;
    return this.ingestionService.ingestQuestions(limitNum);
  }

  @Post('ingest/answers')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ingest answers into vector database' })
  async ingestAnswers(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 100;
    return this.ingestionService.ingestAnswers(limitNum);
  }

  @Post('ingest/all')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ingest all content into vector database' })
  async ingestAll() {
    return this.ingestionService.ingestAll();
  }

  @Get('embeddings/stats')
  @ApiOperation({ summary: 'Get embedding statistics' })
  async getEmbeddingStats() {
    return this.embeddingService.getStats();
  }
}
