import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { EmbeddingService } from './services/embedding.service';
import { ContextService } from './services/context.service';
import { IngestionService } from './services/ingestion.service';
import { TtsService } from './services/tts.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule],
  controllers: [AiController],
  providers: [
    AiService,
    EmbeddingService,
    ContextService,
    IngestionService,
    TtsService,
  ],
  exports: [
    AiService,
    EmbeddingService,
    ContextService,
    IngestionService,
    TtsService,
  ],
})
export class AiModule { }
