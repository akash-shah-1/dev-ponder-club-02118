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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DiscussionsService } from './discussions.service';
import { CreateDiscussionDto, UpdateDiscussionDto, CreateDiscussionReplyDto } from './dto/discussion.dto';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CurrentUserId } from '../auth/decorators/current-user.decorator';

@ApiTags('discussions')
@Controller('discussions')
export class DiscussionsController {
  constructor(
    private discussionsService: DiscussionsService,
  ) {}

  @Post()
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new discussion' })
  async create(
    @Body() createDiscussionDto: CreateDiscussionDto,
    @CurrentUserId() userId: string,
  ) {
    return this.discussionsService.create(createDiscussionDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all discussions' })
  async findAll(@Query() filters: any) {
    return this.discussionsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get discussion by ID' })
  async findOne(@Param('id') id: string) {
    return this.discussionsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update discussion' })
  async update(
    @Param('id') id: string,
    @Body() updateDiscussionDto: UpdateDiscussionDto,
    @CurrentUserId() userId: string,
  ) {
    return this.discussionsService.update(id, updateDiscussionDto, userId);
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete discussion' })
  async remove(@Param('id') id: string, @CurrentUserId() userId: string) {
    return this.discussionsService.remove(id, userId);
  }

  @Post(':id/replies')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add reply to discussion' })
  async addReply(
    @Param('id') discussionId: string,
    @Body() createReplyDto: CreateDiscussionReplyDto,
    @CurrentUserId() userId: string,
  ) {
    return this.discussionsService.addReply(discussionId, createReplyDto, userId);
  }

  @Get(':id/replies')
  @ApiOperation({ summary: 'Get discussion replies' })
  async getReplies(@Param('id') discussionId: string) {
    return this.discussionsService.getReplies(discussionId);
  }
}