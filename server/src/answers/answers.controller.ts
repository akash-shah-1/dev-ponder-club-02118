import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnswersService } from './answers.service';
import { CreateAnswerDto, UpdateAnswerDto } from './dto/answer.dto';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CurrentUserId } from '../auth/decorators/current-user.decorator';

@ApiTags('answers')
@Controller('answers')
export class AnswersController {
  constructor(
    private answersService: AnswersService,
  ) {}

  @Post()
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new answer' })
  async create(
    @Body() createAnswerDto: CreateAnswerDto,
    @CurrentUserId() userId: string,
  ) {
    return this.answersService.create(createAnswerDto, userId);
  }

  @Get('question/:questionId')
  @ApiOperation({ summary: 'Get answers for a question' })
  async findByQuestion(@Param('questionId') questionId: string) {
    return this.answersService.findByQuestion(questionId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get answers by user' })
  async getByUser(@Param('userId') userId: string) {
    return this.answersService.getByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get answer by ID' })
  async findOne(@Param('id') id: string) {
    return this.answersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update answer' })
  async update(
    @Param('id') id: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
    @CurrentUserId() userId: string,
  ) {
    return this.answersService.update(id, updateAnswerDto, userId);
  }

  @Patch(':id/accept')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept answer' })
  async acceptAnswer(@Param('id') id: string, @CurrentUserId() userId: string) {
    return this.answersService.acceptAnswer(id, userId);
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete answer' })
  async remove(@Param('id') id: string, @CurrentUserId() userId: string) {
    return this.answersService.remove(id, userId);
  }
}