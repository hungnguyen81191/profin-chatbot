import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from './schemas/session.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { getQuestionFromImagesAndPrompt } from '../../common/images.helper';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async createSession(sessionId: string): Promise<Session> {
    return this.sessionModel.create({
      id: sessionId,
      lastUpdated: new Date(),
      messages: [],
    });
  }

  async addMessage(sessionId: string, message: Message, base64Images: string[]): Promise<Message> {
   let session = await this.sessionModel.findOne({ sessionId });

    if (!session) {
      session = new this.sessionModel({
        sessionId,
        user: message.user,
        createdAt: new Date(),
        lastUpdated: new Date(),
      });
      await session.save();
    } else {
      session.lastUpdated = new Date();
      await session.save();
      // this.replyMessage();
    }

    const msg = new this.messageModel({
      sessionId,
      user: message.user,
      content: message.content,
      sender: message.sender,
      imageUrl: message.imageUrl,
      createdAt: new Date(),
    });
    await msg.save();

    return msg;
  }

  async replyMessage(message: Message) {
    var promptTxt = message.content;
    var base64Images = [];
    const apiKey = process.env.OPENAI_API_KEY || '';
    getQuestionFromImagesAndPrompt(promptTxt, base64Images, apiKey)
  }

  async getSession(sessionId: string): Promise<Session | null> {
    return this.sessionModel.findById(sessionId).exec();
  }

  async listSessions(): Promise<Session[] | null> {
    return this.sessionModel.find().sort({ lastUpdated: -1 }).exec();
  }

  async getAllSession(req: any): Promise<Session[]> {
    return this.sessionModel.find({'messages.user': req}).sort({ lastUpdated: -1 }).exec();
  }
}
