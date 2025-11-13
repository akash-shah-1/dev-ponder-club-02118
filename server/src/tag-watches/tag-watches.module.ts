import { Module } from '@nestjs/common';
import { TagWatchesController } from './tag-watches.controller';
import { TagWatchesService } from './tag-watches.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule],
  controllers: [TagWatchesController],
  providers: [TagWatchesService],
  exports: [TagWatchesService],
})
export class TagWatchesModule {}
