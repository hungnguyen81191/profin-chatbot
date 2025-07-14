import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DocumentChunk extends Document {
  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [Number], required: false, default: [] })
  embedding?: number[];
}

export const DocumentChunkSchema = SchemaFactory.createForClass(DocumentChunk);
