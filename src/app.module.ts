import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChunkController } from './features/chunk/chunk.controller';
import { ChatbotController } from './features/chat/chatbot.controller';
import { ChunkModule } from './features/chunk/chunk.module';
import { ChatbotModule } from './features/chat/chatbot.module';
import { ConfigModule } from '@nestjs/config';
import { ChatBotLog } from './features/chat/entities/chatbot-log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      // host: process.env.SQL_HOST,
      // port: process.env.PORT_SQL ? parseInt(process.env.PORT_SQL, 10) : 1433,
      // username: process.env.SQL_USERNAME,
      // password: process.env.SQL_PASSWORD,
      // database: process.env.SQL_DATABASE,
      host: '10.14.116.10',
      port: 1433,
      username: 'erev_uat',
      password: '4dm1nd@12356890a!@#$',
      database: 'DDC_EREV_UAT',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      options: {
        encrypt: false, // bật nếu dùng Azure hoặc cần SSL
      },
    }),
    TypeOrmModule.forFeature([ChatBotLog]),

    // Dùng cho Docker
    MongooseModule.forRoot('mongodb://host.docker.internal:27017/ChatbotDB'),

    //Dùng test local
    // MongooseModule.forRoot('mongodb://127.0.0.1:27017/ChatbotDB'),

    //  MongooseModule.forRoot('mongodb://localhost/ChatbotDB'),

    ChunkModule,
    ChatbotModule,
  ],
  controllers: [AppController,
    ChunkController,
    ChatbotController
  ],
  providers: [AppService],
})
export class AppModule {}
