// src/chunk/chunk.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentChunk, DocumentChunkDocument } from './schemas/chunk.schema';
import { Model } from 'mongoose';

@Injectable()
export class ChunkService {
  constructor(
    @InjectModel(DocumentChunk.name)
    private readonly chunkModel: Model<DocumentChunkDocument>,
  ) {}

  async addChunk(chunk: Partial<DocumentChunk>) {
    return this.chunkModel.create(chunk);
  }

  async insertMany(chunks: Partial<DocumentChunk>[]) {
    return this.chunkModel.insertMany(chunks);
  }

  async checkMongoConnection(): Promise<boolean> {
    try {
      await this.chunkModel.findOne().limit(1);
      return true;
    } catch {
      return false;
    }
  }

  async getTopChunks(vector: number[], topN = 3, threshold = 0.6): Promise<DocumentChunk[]> {
    const all = await this.chunkModel.find().exec();

    // Tính cosine similarity
    const scored = all
      .map((doc) => ({
        doc,
        score: doc.embedding ? cosineSimilarity(vector, doc.embedding) : 0,
      }))
      .filter((x) => x.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, topN);

    return scored.map((x) => x.doc);
  }

  // async getTopChunksHybrid(query: string, vector: number[], topN = 3, threshold = 0.6): Promise<DocumentChunk[]> {
  //   return this.getTopChunks(vector, topN, threshold);
  // }
  async getTopChunksHybrid(query: string, vector: number[], topN = 3, threshold = 0.6) {
  const textMatches = await this.chunkModel
    .find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .limit(topN * 2)
    .exec();

  const hybrid = textMatches
    .map((doc) => ({
      doc,
      score: cosineSimilarity(vector, doc.embedding ?? []),
    }))
    .filter((x) => x.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  return hybrid.map((x) => x.doc);
}

}

// function cosineSimilarity(a: number[], b: number[]): number {
//   const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
//   const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
//   const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
//   return dot / (magA * magB);
// }

function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length !== b.length) return 0;
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return magA && magB ? dot / (magA * magB) : 0;
}



