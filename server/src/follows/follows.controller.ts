import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FollowsService } from './follows.service';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from '../users/users.service';

@ApiTags('follows')
@Controller('follows')
export class FollowsController {
  constructor(
    private followsService: FollowsService,
    private usersService: UsersService,
  ) {}

  @Post('users/:userId')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Follow a user' })
  async followUser(
    @Param('userId') userId: string,
    @CurrentUser() user: any,
  ) {
    const dbUser = await this.usersService.findByClerkId(user.sub);
    return this.followsService.followUser(dbUser.id, userId);
  }

  @Delete('users/:userId')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unfollow a user' })
  async unfollowUser(
    @Param('userId') userId: string,
    @CurrentUser() user: any,
  ) {
    const dbUser = await this.usersService.findByClerkId(user.sub);
    return this.followsService.unfollowUser(dbUser.id, userId);
  }

  @Get('users/:userId/followers')
  @ApiOperation({ summary: 'Get user followers' })
  async getFollowers(@Param('userId') userId: string) {
    return this.followsService.getFollowers(userId);
  }

  @Get('users/:userId/following')
  @ApiOperation({ summary: 'Get users that user is following' })
  async getFollowing(@Param('userId') userId: string) {
    return this.followsService.getFollowing(userId);
  }

  @Get('users/:userId/is-following')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if current user is following another user' })
  async isFollowing(
    @Param('userId') userId: string,
    @CurrentUser() user: any,
  ) {
    const dbUser = await this.usersService.findByClerkId(user.sub);
    return this.followsService.isFollowing(dbUser.id, userId);
  }
}
