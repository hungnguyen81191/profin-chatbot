import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Message {
//   @Prop({ required: true })
//   id: string;

  @Prop({ required: true })
  user?: string;

  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  sender: string;

  @Prop({})
  createdAt: Date;

  @Prop({})
  imageUrl?: string;
}

export type MessageDocument = Document & Message;
export const MessageSchema  = SchemaFactory.createForClass(Message);