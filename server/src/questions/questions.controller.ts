import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto, UpdateQuestionDto, QuestionFiltersDto } from './dto/question.dto';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CurrentUserId } from '../auth/decorators/current-user.decorator';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(
    private questionsService: QuestionsService,
  ) {}

  @Post()
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new question' })
  async create(
    @Body() createQuestionDto: CreateQuestionDto,
    @CurrentUserId() userId: string,
  ) {
    return this.questionsService.create(createQuestionDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all questions with filters' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['newest', 'oldest', 'votes', 'views'] })
  @ApiQuery({ name: 'tag', required: false })
  async findAll(@Query() filters: QuestionFiltersDto) {
    return this.questionsService.findAll(filters);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending questions' })
  async getTrending(@Query('limit') limit?: number) {
    return this.questionsService.getTrending(limit);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get questions by user' })
  async getByUser(@Param('userId') userId: string) {
    return this.questionsService.getByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get question by ID' })
  async findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update question' })
  async update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @CurrentUserId() userId: string,
  ) {
    return this.questionsService.update(id, updateQuestionDto, userId);
  }

  @Patch(':id/solve')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark question as solved' })
  async markAsSolved(@Param('id') id: string, @CurrentUserId() userId: string) {
    return this.questionsService.markAsSolved(id, userId);
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete question' })
  async remove(@Param('id') id: string, @CurrentUserId() userId: string) {
    return this.questionsService.remove(id, userId);
  }
}