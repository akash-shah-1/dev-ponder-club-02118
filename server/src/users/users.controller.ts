import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user.dto';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getCurrentUser(@CurrentUser() user: any) {
    return this.usersService.findOrCreateByClerkId(user.sub);
  }

  @Get('top')
  @ApiOperation({ summary: 'Get top users by reputation' })
  async getTopUsers() {
    return this.usersService.getTopUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  async getUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put('me')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  async updateCurrentUser(
    @CurrentUser() user: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const currentUser = await this.usersService.findOrCreateByClerkId(user.sub);
    return this.usersService.updateUser(currentUser.id, updateUserDto);
  }

  @Get('me/stats')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user statistics' })
  async getCurrentUserStats(@CurrentUser() user: any) {
    const currentUser = await this.usersService.findOrCreateByClerkId(user.sub);
    return this.usersService.getUserStats(currentUser.id);
  }

  @Get('me/activity')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user activity' })
  async getCurrentUserActivity(@CurrentUser() user: any) {
    const currentUser = await this.usersService.findOrCreateByClerkId(user.sub);
    return this.usersService.getUserActivity(currentUser.id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get user statistics by ID' })
  async getUserStats(@Param('id') id: string) {
    return this.usersService.getUserStats(id);
  }

  @Get(':id/activity')
  @ApiOperation({ summary: 'Get user activity by ID' })
  async getUserActivity(@Param('id') id: string) {
    return this.usersService.getUserActivity(id);
  }
}