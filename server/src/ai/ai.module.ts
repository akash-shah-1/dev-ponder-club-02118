import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { EmbeddingService } from './services/embedding.service';
import { ContextService } from './services/context.service';
import { IngestionService } from './services/ingestion.service';
import { ElevenLabsTtsService } from './services/elevenlabs-tts.service';
import { TtsFactoryService } from './services/tts-factory.service';
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
    ElevenLabsTtsService,
    TtsFactoryService,
  ],
  exports: [
    AiService,
    EmbeddingService,
    ContextService,
    IngestionService,
    ElevenLabsTtsService,
    TtsFactoryService,
  ],
})
export class AiModule { }
