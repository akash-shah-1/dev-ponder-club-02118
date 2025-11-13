import { Module } from '@nestjs/common';
import { SavesController } from './saves.controller';
import { SavesService } from './saves.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [SavesController],
  providers: [SavesService],
  exports: [SavesService],
})
export class SavesModule {}