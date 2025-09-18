import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatHistory } from './schemas/chat-history.schema';
import { Session } from './schemas/session.schema';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ChatbotService {
  constructor(
    @InjectModel(ChatHistory.name)
    private readonly chatModel: Model<ChatHistory>,
    @InjectModel(Session.name)
    private readonly sessionModel: Model<Session>,
     @InjectModel(ChatHistory.name)
    private readonly chatHistoryModel: Model<ChatHistory>,
  ) {}

  /**
   * Gửi message: user -> bot
   */
  async sendMessage(body: any, files: Express.Multer.File[]): Promise<any> {
    const { user, message, sessionId } = body;
    if (!user) throw new Error('User is required');

    // 1. Tạo session mới nếu chưa có
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      currentSessionId = uuidv4();
      await this.sessionModel.create({
        sessionId: currentSessionId,
        user,
        lastMessage: message,
      });
    }

    // 2. Xử lý file upload
    const savedPaths: string[] = [];
    if (files && files.length > 0) {
      const uploadDir = path.join(__dirname, '../../uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

      for (const file of files) {
        const filePath = path.join(uploadDir, file.originalname);
        fs.writeFileSync(filePath, file.buffer);
        savedPaths.push(`/uploads/${file.originalname}`);
      }
    }

    // 3. Lưu message user vào ChatHistory
    await this.chatModel.create({
      user,
      sessionId: currentSessionId,
      role: 'user',
      message,
      files: savedPaths,
    });

    // 4. TODO: gọi AI service hoặc semantic search ở đây
    const reply = `Bot trả lời cho: "${message}"`;

    // 5. Lưu message bot vào ChatHistory
    await this.chatModel.create({
      user,
      sessionId: currentSessionId,
      role: 'assistant',
      message: reply,
    });

    // 6. Update lastMessage trong Session
    await this.sessionModel.updateOne(
      { sessionId: currentSessionId },
      { $set: { lastMessage: reply, updatedAt: new Date() } },
    );

    return {
      sessionId: currentSessionId,
      reply,
      savedFiles: savedPaths,
    };
  }

  /**
   * Lấy danh sách session theo user
   */
  async getSessions(user: string) {
    return this.sessionModel.find({ user }).sort({ updatedAt: -1 }).exec();
  }

  /**
   * Lấy full chat history theo session
   */
  async getChatHistory(sessionId: string) {
    return this.chatModel.find({ sessionId }).sort({ createdAt: 1 }).exec();
  }

  async getAllChats(user: string) {
    const logs = await this.chatHistoryModel.find({ user }).exec();

    // nhóm theo sessionId
    const grouped: Record<string, ChatHistory[]> = {};
    logs.forEach((log) => {
      if (!grouped[log.sessionId]) {
        grouped[log.sessionId] = [];
      }
      grouped[log.sessionId].push(log);
    });

    return grouped;
  }

  // lấy tin nhắn cuối cùng trong session
  async getLastestReply(body: { sessionId: string; userId: string }) {
    const latest = await this.chatHistoryModel
      .findOne({ sessionId: body.sessionId, userId: body.userId })
      .sort({ createdAt: -1 })
      .exec();

    return latest ? { reply: latest.reply } : { reply: null };
  }
}
