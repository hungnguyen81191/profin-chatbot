import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Message, MessageSchema } from './message.schema';

@Schema({ timestamps: true })
export class Session {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  user?: string;

  @Prop({ required: true })
  createAt: Date;

  @Prop({ required: true })
  lastUpdated: Date;
}

export type SessionDocument = Document & Session;
export const SessionSchema = SchemaFactory.createForClass(Session);