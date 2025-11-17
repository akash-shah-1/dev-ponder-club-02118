import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TagWatchesService } from './tag-watches.service';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CurrentUserId } from '../auth/decorators/current-user.decorator';

@ApiTags('tag-watches')
@Controller('tag-watches')
@UseGuards(ClerkAuthGuard)
@ApiBearerAuth()
export class TagWatchesController {
  constructor(
    private tagWatchesService: TagWatchesService,
  ) {}

  @Post('tags/:tagId')
  @ApiOperation({ summary: 'Watch a tag' })
  async watchTag(@Param('tagId') tagId: string, @CurrentUserId() userId: string) {
    return this.tagWatchesService.watchTag(userId, tagId);
  }

  @Delete('tags/:tagId')
  @ApiOperation({ summary: 'Unwatch a tag' })
  async unwatchTag(@Param('tagId') tagId: string, @CurrentUserId() userId: string) {
    return this.tagWatchesService.unwatchTag(userId, tagId);
  }

  @Get('my-tags')
  @ApiOperation({ summary: 'Get watched tags for current user' })
  async getWatchedTags(@CurrentUserId() userId: string) {
    return this.tagWatchesService.getWatchedTags(userId);
  }

  @Get('tags/:tagId/is-watching')
  @ApiOperation({ summary: 'Check if current user is watching a tag' })
  async isWatching(@Param('tagId') tagId: string, @CurrentUserId() userId: string) {
    return this.tagWatchesService.isWatching(userId, tagId);
  }
}
