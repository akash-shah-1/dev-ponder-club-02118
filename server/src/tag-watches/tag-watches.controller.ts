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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from '../users/users.service';

@ApiTags('tag-watches')
@Controller('tag-watches')
@UseGuards(ClerkAuthGuard)
@ApiBearerAuth()
export class TagWatchesController {
  constructor(
    private tagWatchesService: TagWatchesService,
    private usersService: UsersService,
  ) {}

  @Post('tags/:tagId')
  @ApiOperation({ summary: 'Watch a tag' })
  async watchTag(@Param('tagId') tagId: string, @CurrentUser() user: any) {
    const dbUser = await this.usersService.findByClerkId(user.sub);
    return this.tagWatchesService.watchTag(dbUser.id, tagId);
  }

  @Delete('tags/:tagId')
  @ApiOperation({ summary: 'Unwatch a tag' })
  async unwatchTag(@Param('tagId') tagId: string, @CurrentUser() user: any) {
    const dbUser = await this.usersService.findByClerkId(user.sub);
    return this.tagWatchesService.unwatchTag(dbUser.id, tagId);
  }

  @Get('my-tags')
  @ApiOperation({ summary: 'Get watched tags for current user' })
  async getWatchedTags(@CurrentUser() user: any) {
    const dbUser = await this.usersService.findByClerkId(user.sub);
    return this.tagWatchesService.getWatchedTags(dbUser.id);
  }

  @Get('tags/:tagId/is-watching')
  @ApiOperation({ summary: 'Check if current user is watching a tag' })
  async isWatching(@Param('tagId') tagId: string, @CurrentUser() user: any) {
    const dbUser = await this.usersService.findByClerkId(user.sub);
    return this.tagWatchesService.isWatching(dbUser.id, tagId);
  }
}
