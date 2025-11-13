import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { OpenAiService } from './services/openai.service';
import { EmbeddingService } from './services/embedding.service';
import { IngestionService } from './services/ingestion.service';
import { ContextService } from './services/context.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AiController],
  providers: [
    AiService,
    OpenAiService,
    EmbeddingService,
    IngestionService,
    ContextService,
  ],
  exports: [AiService],
})
export class AiModule {}
