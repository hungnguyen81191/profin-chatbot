import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { HydratedDocument } from 'mongoose';

// @Schema({ timestamps: true })
// export class DocumentChunk {
//   @Prop({ required: true })
//   documentId: string;

//   @Prop({ required: true })
//   content: string;

//   @Prop({ type: [Number], index: false })
//   embedding: number[];

//   @Prop({ type: Object })
//   metadata?: Record<string, any>;

//   @Prop()
//   source?: string;
// }

// export type DocumentChunkDocument = HydratedDocument<DocumentChunk>;

// // export type DocumentChunkDocument = Document & DocumentChunk;

// export const DocumentChunkSchema = SchemaFactory.createForClass(DocumentChunk);

// DocumentChunkSchema.index({ content: 'text' });

@Schema({ timestamps: true })
export class DocumentChunk {
  @Prop({ required: true })
  fileName: string; // tên file gốc

  @Prop({ required: true })
  content: string; // nội dung chunk

  @Prop({ type: [Number], index: false })
  embedding: number[]; // vector embedding

  @Prop({ type: Object })
  metadata?: Record<string, any>; // page, sheet, heading...

  @Prop()
  source?: string;
}

export type DocumentChunkDocument = HydratedDocument<DocumentChunk>;
export const DocumentChunkSchema = SchemaFactory.createForClass(DocumentChunk);
DocumentChunkSchema.index({ content: 'text' });
