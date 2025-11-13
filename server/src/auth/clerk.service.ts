import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClerkClient, verifyToken } from '@clerk/backend';

@Injectable()
export class ClerkService {
  private clerkClient: ReturnType<typeof createClerkClient>;
  private publishableKey: string;
  private secretKey: string;

  constructor(private configService: ConfigService) {
    this.publishableKey = this.configService.get('CLERK_PUBLISHABLE_KEY');
    this.secretKey = this.configService.get('CLERK_SECRET_KEY');
    this.clerkClient = createClerkClient({
      secretKey: this.secretKey,
      publishableKey: this.publishableKey,
    });
  }

  async verifyToken(token: string) {
    try {
      // Use the standalone verifyToken function with proper configuration
      const payload = await verifyToken(token, {
        secretKey: this.secretKey,
        authorizedParties: ['http://localhost:3002'],
      });
      console.log('Token verified successfully for user:', payload.sub);
      return payload;
    } catch (error) {
      console.error('Token verification failed:', error);
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