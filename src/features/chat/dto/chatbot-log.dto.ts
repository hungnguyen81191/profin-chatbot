import { Expose } from 'class-transformer';

export class ChatbotLogDto {
    constructor(log: any) {
      this.id = log.id;
      this.sessionId = log.sessionId;
      this.user = log.user;
      this.content = log.content;
      this.createdDate = log.createdDate;
      this.sender = log.sender;
      this.imageUrl = log.imageUrl;
      this.isMine = true;
    }

    @Expose()
    id: string;

    @Expose()
    sessionId: string;

    @Expose()
    user: string;

    @Expose()
    content: string;

    @Expose()
    createdDate: Date;

    @Expose()
    sender: string; // 'user' | 'bot'

    @Expose()
    imageUrl?: string;

    @Expose()
    isMine: boolean;
  }
  