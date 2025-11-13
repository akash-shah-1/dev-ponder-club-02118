import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClerkClient } from '@clerk/backend';

@Injectable()
export class ClerkService {
  private clerkClient;

  constructor(private configService: ConfigService) {
    this.clerkClient = createClerkClient({
      secretKey: this.configService.get('CLERK_SECRET_KEY'),
    });
  }

  async verifyToken(token: string) {
    try {
      return await this.clerkClient.verifyToken(token);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async getUser(userId: string) {
    return await this.clerkClient.users.getUser(userId);
  }

  getClerkClient() {
    return this.clerkClient;
  }
}