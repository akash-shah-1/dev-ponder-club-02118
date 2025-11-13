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
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from '../users/users.service';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(
    private commentsService: CommentsService,
    private usersService: UsersService,
  ) {}

  @Post()
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a comment' })
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: any,
  ) {
    const dbUser = await this.usersService.findByClerkId(user.sub);
    return this.commentsService.create(createCommentDto, dbUser.id);
  }

  @Get('answer/:answerId')
  @ApiOperation({ summary: 'Get comments for an answer' })
  async findByAnswer(@Param('answerId') answerId: string) {
    return this.commentsService.findByAnswer(answerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comment by ID' })
  async findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update comment' })
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: any,
  ) {
    const dbUser = await this.usersService.findByClerkId(user.sub);
    return this.commentsService.update(id, updateCommentDto, dbUser.id);
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete comment' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    const dbUser = await this.usersService.findByClerkId(user.sub);
    return this.commentsService.remove(id, dbUser.id);
  }
}
