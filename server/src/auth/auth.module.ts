import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClerkAuthGuard } from './guards/clerk-auth.guard';
import { ClerkService } from './clerk.service';

@Module({
  imports: [ConfigModule],
  providers: [ClerkService, ClerkAuthGuard],
  exports: [ClerkService, ClerkAuthGuard],
})
export class AuthModule {}