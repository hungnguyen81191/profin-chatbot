import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChunkController } from './features/chunk/chunk.controller';
import { ChatController } from './features/chat/chatbot.controller';
import { ChunkModule } from './features/chunk/chunk.module';
import { ChatbotModule } from './features/chat/chatbot.module';
import { ConfigModule } from '@nestjs/config';
// import { ChatBotLog } from './features/chat/entities/chatbot-log.entity';
import { DocumentChunk, DocumentChunkSchema } from './features/chunk/schemas/chunk.schema';
// import { SessionSchema, Session} from './features/chat/schemas/session.schema';
// import { ChatHistory, ChatHistorySchema } from './features/chat/schemas/chat-history.schema';
// import { Embedding, EmbeddingSchema } from './features/chat/schemas/embedding.schema';
// import { SemanticModule } from './features/chat/semantic-search/semantic-search.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // TypeOrmModule.forRoot({
    //   type: 'mssql',
    //   host: '10.14.116.10',
    //   port: 1433,
    //   username: 'erev_uat',
    //   password: '4dm1nd@12356890a!@#$',
    //   database: 'DDC_EREV_UAT',
    //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //   synchronize: false,
    //   options: {
    //     encrypt: false, // bật nếu dùng Azure hoặc cần SSL
    //   },
    // }),
    // TypeOrmModule.forFeature([ChatBotLog]),

    // Dùng cho Docker
    // MongooseModule.forRoot('mongodb://host.docker.internal:27017/ChatbotDB'),

    //Dùng test local
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/ChatbotDB'),
    // MongooseModule.forFeature([
    //   { name: DocumentChunk.name, schema: DocumentChunkSchema },
      // { name: ChatHistory.name, schema: ChatHistorySchema },
      // { name: Session.name, schema: SessionSchema },
      // { name: Embedding.name, schema: EmbeddingSchema },
    // ]),
    //  MongooseModule.forRoot('mongodb://localhost/ChatbotDB'),

    ChunkModule,
    ChatbotModule,
    // SemanticModule
  ],
  controllers: [AppController,
    ChunkController,
    ChatController,
  ],
  providers: [AppService],
})
export class AppModule {}
