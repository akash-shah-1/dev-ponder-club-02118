import { Controller, Post, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private usersService: UsersService) {}

  @Post('clerk')
  @ApiOperation({ summary: 'Handle Clerk webhooks' })
  async handleClerkWebhook(
    @Body() body: any,
    @Headers('svix-id') svixId: string,
    @Headers('svix-timestamp') svixTimestamp: string,
    @Headers('svix-signature') svixSignature: string,
  ) {
    const { type, data } = body;

    switch (type) {
      case 'user.created':
      case 'user.updated':
        await this.usersService.syncUserFromClerk(data);
        break;
      case 'user.deleted':
        const user = await this.usersService.findByClerkId(data.id);
        if (user) {
          // Handle user deletion - you might want to anonymize instead of delete
          console.log(`User ${data.id} deleted from Clerk`);
        }
        break;
    }

    return { success: true };
  }
}