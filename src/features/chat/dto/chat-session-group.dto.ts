import { ChatbotLogDto } from './chatbot-log.dto';

export class ChatSessionGroupDto {
  sessionId: string;
  lastUpdated: Date;
  messages: ChatbotLogDto[];
}
