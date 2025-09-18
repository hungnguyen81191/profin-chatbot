// chatbot.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { ChatBotLog } from './entities/chatbot-log.entity';
import { ChunkModule } from '../chunk/chunk.module';
import { SemanticService } from './semantic-search/semantic-search.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatHistory, ChatHistorySchema } from '../chat/schemas/chat-history.schema';
import { Session, SessionSchema } from '../chat/schemas/session.schema';
import { Embedding, EmbeddingSchema } from '../chat/schemas/embedding.schema';

@Module({
  imports: [MongooseModule.forFeature([
      { name: ChatHistory.name, schema: ChatHistorySchema },
      { name: Session.name, schema: SessionSchema },
      { name: Embedding.name, schema: EmbeddingSchema}
    ]),],
  controllers: [ChatbotController],
  providers: [ChatbotService, SemanticService],
  exports: [ChatbotService],
})
export class ChatbotModule {}