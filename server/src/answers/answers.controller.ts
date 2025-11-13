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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from '../users/users.service';

@ApiTags('answers')
@Controller('answers')
export class AnswersController {
  constructor(
    private answersService: AnswersService,
    private usersService: UsersService,
  ) {}

  @Post()
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new answer' })
  async create(
    @Body() createAnswerDto: CreateAnswerDto,
    @CurrentUser() user: any,
  ) {
    const dbUser = await this.usersService.findByClerkId(user.sub);
    return this.answersService.create(createAnswerDto, dbUser.id);
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
    @CurrentUser() user: any,
  ) {
    const dbUser = await this.usersService.findByClerkId(user.sub);
    return this.answersService.update(id, updateAnswerDto, dbUser.id);
  }

  @Patch(':id/accept')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept answer' })
  async acceptAnswer(@Param('id') id: string, @CurrentUser() user: any) {
    const dbUser = await this.usersService.findByClerkId(user.sub);
    return this.answersService.acceptAnswer(id, dbUser.id);
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete answer' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    const dbUser = await this.usersService.findByClerkId(user.sub);
    return this.answersService.remove(id, dbUser.id);
  }
}