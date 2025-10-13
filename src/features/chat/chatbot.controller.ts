import { Controller, Post, Get, Body, Param, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ChatService } from './chatbot.service';
import { Message } from './schemas/message.schema';
import { Image } from 'openai/resources/images';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  @UseInterceptors(FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads', // Thư mục lưu file
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async addMessage(
    @Body() Body: { sessionId: string; message: Message},
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const base64Images = images.map((file) =>
      file.buffer ? file.buffer.toString('base64') : '',
    );
    return this.chatService.addMessage(Body.sessionId, Body.message, base64Images);
  }

  @Get('session/:id')
  async getSession(@Param('id') id: string) {
    return this.chatService.getSession(id);
  }

  @Get('sessions')
  async listSessions() {
    return this.chatService.listSessions();
  }

  @Get('session-histories')
  async getAllSession(@Query('username') username: string) {
    return this.chatService.getAllSession(username)
  }
}
