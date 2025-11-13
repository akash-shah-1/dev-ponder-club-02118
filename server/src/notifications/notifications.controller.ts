import { Controller, Get, Patch, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from '../users/users.service';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(ClerkAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(
    private notificationsService: NotificationsService,
    private usersService: UsersService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  async findByUser(@CurrentUser() user: any) {
    const dbUser = await this.usersService.findOrCreateByClerkId(user.sub);
    return this.notificationsService.findByUser(dbUser.id);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notifications count' })
  async getUnreadCount(@CurrentUser() user: any) {
    const dbUser = await this.usersService.findOrCreateByClerkId(user.sub);
    const count = await this.notificationsService.getUnreadCount(dbUser.id);
    return { count };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markAsRead(@Param('id') id: string, @CurrentUser() user: any) {
    const dbUser = await this.usersService.findOrCreateByClerkId(user.sub);
    return this.notificationsService.markAsRead(id, dbUser.id);
  }

  @Patch('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@CurrentUser() user: any) {
    const dbUser = await this.usersService.findOrCreateByClerkId(user.sub);
    return this.notificationsService.markAllAsRead(dbUser.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete notification' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    const dbUser = await this.usersService.findOrCreateByClerkId(user.sub);
    return this.notificationsService.delete(id, dbUser.id);
  }
}