// chatbot.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { ChatBotLog } from './entities/chatbot-log.entity';
import { ChunkModule } from '../chunk/chunk.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatBotLog]), ChunkModule],
  controllers: [ChatbotController],
  providers: [ChatbotService],
  exports: [ChatbotService],
})
export class ChatbotModule {}