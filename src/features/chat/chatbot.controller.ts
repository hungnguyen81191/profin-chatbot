import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';

@Controller('chat')
export class ChatbotController {
  constructor(private readonly chatService: ChatbotService) {}

  @Get()
  async getChats() {
    try {
      const chats = await this.chatService.getAllChats();
      return chats;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  @Post('lastest-reply')
  async getLastestReply(@Body() req: any) {
    return this.chatService.getLastestReply(req);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async sendMessage(
    @UploadedFile() files: Express.Multer.File[],
    @Body() body: any,
  ): Promise<{ reply: string }> {
    return this.chatService.sendMessage(body, files);
  }
}
