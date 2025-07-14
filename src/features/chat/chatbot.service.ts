// import { Injectable } from '@nestjs/common';
// import { ChatbotLog } from './entities/chatbot-log.entity';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { ChunkService } from '../chunk/chunk.service';
// import axios from 'axios';
// import { ChatRequestDto } from './dto/chat-request.dto';
// import { ChatbotLogDto } from './dto/chatbot-log.dto';
// import { ChatSessionGroupDto } from './dto/chat-session-group.dto';

// @Injectable()
// export class ChatbotService {
//   constructor(
//     @InjectRepository(ChatbotLog)
//     private readonly chatbotLogRepo: Repository<ChatbotLog>,
//     private readonly chunkService: ChunkService,
//   ) {}

//   async generateQuestionFromPromptAndImages(prompt: string, base64Images: string[], apiKey: string) {
//     const contentList = [
//       { type: 'text', text: 'Phân tích ảnh kết hợp với prompt bên dưới để tạo câu hỏi kỹ thuật súc tích.' },
//       ...base64Images.map((base64) => ({
//         type: 'image_url',
//         image_url: {
//           url: `data:image/png;base64,${base64}`,
//           detail: 'auto',
//         },
//       })),
//       { type: 'text', text: `Prompt người dùng: ${prompt}` },
//     ];

//     const payload = {
//       model: 'gpt-4o',
//       messages: [{ role: 'user', content: contentList }],
//       temperature: 0.2,
//     };

//     const res = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
//       headers: { Authorization: `Bearer ${apiKey}` },
//     });

//     return res.data.choices[0].message.content;
//   }

//   async getEmbedding(text: string, apiKey: string): Promise<number[]> {
//     const res = await axios.post(
//       'https://api.openai.com/v1/embeddings',
//       {
//         model: 'text-embedding-3-small',
//         input: text,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//         },
//       },
//     );

//     return res.data.data[0].embedding;
//   }

//   async getTopChunks(prompt: string, embedding: number[]) {
//     return this.chunkService.getTopChunksHybrid(prompt, embedding, 3, 0.2);
//   }

//   async askOpenAI(system: string, user: string, apiKey: string): Promise<string> {
//     const payload = {
//       model: 'gpt-4',
//       messages: [
//         { role: 'system', content: system },
//         { role: 'user', content: user },
//       ],
//     };

//     const res = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
//       headers: { Authorization: `Bearer ${apiKey}` },
//     });

//     return res.data.choices[0].message.content;
//   }

//   async saveChatLogs(user: string, sessionId: string, prompt: string, reply: string, imageUrls: string[]) {
//     const now = new Date();

//     await this.chatbotLogRepo.save([
//       {
//         user,
//         sessionId,
//         content: prompt,
//         sender: 'user',
//         imageUrl: JSON.stringify(imageUrls),
//         createdDate: now,
//       },
//       {
//         user,
//         sessionId,
//         content: reply,
//         sender: 'bot',
//         createdDate: now,
//       },
//     ]);
//   }

//   async selectAll(): Promise<any[]> {
//     // Giả sử bạn dùng Prisma, TypeORM, Mongoose... thì thay bằng real query
//     // return [
//       // Fake logs (replace with DB call)
//     //   { sessionId: 'abc', user: 'hungnv164', message: 'Hello', createdDate: new Date('2024-01-01') },
//     //   { sessionId: 'abc', user: 'hungnv164', message: 'How are you?', createdDate: new Date('2024-01-02') },
//     //   { sessionId: 'xyz', user: 'someone_else', message: 'Hi', createdDate: new Date('2024-01-03') },
//     // ];

//     return this.chatbotLogRepo.find({
//       order: { createdDate: 'DESC' },
//     });
//   }

//   async getChatHistories(currentUser = 'hungnv164'): Promise<ChatSessionGroupDto[]> {
//     const logs = await this.selectAll();

//     const filtered = logs
//       .filter((x) => x.user?.toLowerCase() === currentUser.toLowerCase())
//       .sort((a, b) => (b.createdDate || 0) - (a.createdDate || 0));

//     const transformed = filtered.map((x) => new ChatbotLogDto(x));

//     const groupedMap = new Map<string, ChatSessionGroupDto>();

//     for (const log of transformed) {
//       const group = groupedMap.get(log.sessionId) || {
//         sessionId: log.sessionId,
//         lastUpdated: new Date(0),
//         messages: [],
//       };

//       group.messages.push(log);
//       group.lastUpdated = log.createdDate > group.lastUpdated ? log.createdDate : group.lastUpdated;

//       groupedMap.set(log.sessionId, group);
//     }

//     return Array.from(groupedMap.values()).sort((a, b) => a.lastUpdated.getTime() - b.lastUpdated.getTime());
//   }
// }

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatBotLog } from './entities/chatbot-log.entity';
import { ChatbotLogDto } from './dto/chatbot-log.dto';
import { ChatSessionGroupDto } from './dto/chat-session-group.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ChatbotService {
  constructor(
    @InjectRepository(ChatBotLog)
    private chatRepository: Repository<ChatBotLog>,
  ) {}
  async getAllChats() {
    var currentUser = 'hungnv164';
    const logs = await this.chatRepository.find({
      where: { user: currentUser },
      order: { createdDate: 'asc' },
    });
    const dtos = logs
      .filter(
        (x) => x.user && x.user.toLowerCase() === currentUser.toLowerCase(),
      )
      .map((x) => {
        const dto = new ChatbotLogDto(x);
        dto.isMine = true;
        return dto;
      });

    // Nhóm theo sessionId
    const groupedMap = new Map<string, ChatbotLogDto[]>();
    for (const dto of dtos) {
      const sessionId = dto.sessionId;
      if (!groupedMap.has(sessionId)) {
        groupedMap.set(sessionId, []);
      }
      groupedMap.get(sessionId)!.push(dto);
    }

    const grouped: ChatSessionGroupDto[] = Array.from(groupedMap.entries()).map(
      ([sessionId, messages]) => {
        const sortedMessages = messages.sort((a, b) => {
          const aDate = a.createdDate ? new Date(a.createdDate).getTime() : 0;
          const bDate = b.createdDate ? new Date(b.createdDate).getTime() : 0;
          return aDate - bDate;
        });

        const lastUpdated = Math.max(
          ...sortedMessages.map((m) =>
            m.createdDate ? new Date(m.createdDate).getTime() : 0,
          ),
        );

        return {
          sessionId,
          lastUpdated: new Date(lastUpdated),
          messages: sortedMessages,
        };
      },
    );

    grouped.sort((a, b) => a.lastUpdated.getTime() - b.lastUpdated.getTime());

    return grouped;
  }

  async getLastestReply(req: any) {}

  async sendMessage(body: any, files: Express.Multer.File[]): Promise<any> {
    const savedPaths: string[] = [];
  
    for (const file of files) {
      const uploadDir = path.join(__dirname, '../../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
  
      const filePath = path.join(uploadDir, file.originalname);
      fs.writeFileSync(filePath, file.buffer);
  
      savedPaths.push(`/uploads/${file.originalname}`);
    }
  
    return {
      reply: 'Đã nhận ảnh và prompt',
      savedImages: savedPaths,
    };
  }
}
