import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('chat')
export class ChatbotController {
  constructor(private readonly chatService: ChatbotService) {}

  // Lấy toàn bộ lịch sử chat (theo user hiện tại)
  @Get()
  async getChats(@Body() user: string) {
    return this.chatService.getAllChats(user);
  }

  // Lấy câu trả lời cuối cùng (ví dụ hiển thị realtime trên FE)
  @Post('latest-reply')
  async getLastestReply(@Body() body: any) {
    return this.chatService.getLastestReply(body);
  }

  // Gửi message mới + có thể kèm file
  @Post()
  @UseInterceptors(FilesInterceptor('files')) // form-data field name: "files"
  async sendMessage(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
  ) {
    return this.chatService.sendMessage(body, files);
  }
}
