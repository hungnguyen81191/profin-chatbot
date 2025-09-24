import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ChatService } from './chatbot.service';
import { Message } from './schemas/message.schema';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  async addMessage(
    @Body() Body: { sessionId: string; message: Message },
  ) {
    return this.chatService.addMessage(Body.sessionId, Body.message);
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
