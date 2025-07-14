import { Module } from '@nestjs/common';
import { ChunkController } from './chunk.controller';
import { ChunkService } from './chunk.service';
import { DocumentChunk, DocumentChunkSchema } from './schemas/chunk.schema';

import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocumentChunk.name, schema: DocumentChunkSchema },
    ]),
  ],
  controllers: [ChunkController],
  providers: [ChunkService],
  exports: [ChunkService],
})
export class ChunkModule {}
