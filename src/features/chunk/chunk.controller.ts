import {
    Controller,
    Post,
    Res,
  } from '@nestjs/common';
  import { Response } from 'express';
  import { ChunkService } from './chunk.service';
  import * as fs from 'fs';
  import * as path from 'path';
  import { getEmbedding } from '../../untils/embedding-helper';
  import { DocumentChunk } from './schemas/chunk.schema';
  import { readPdfText, readDocxText, readExcelText } from '../../untils/file-reader';
  import { splitIntoChunks } from '../../common/text.helper';
  
  @Controller('chunk')
  export class ChunkController {
    constructor(private readonly chunkService: ChunkService) {}
  
    @Post('load-documents')
    async loadFiles(@Res() res: Response) {
      const folder = 'F:/Workspace/TaiLieu';
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OPENAI_API_KEY is not defined in the environment variables.');
      }
  
      const allFiles = fs
        .readdirSync(folder)
        .filter(f => ['.pdf', '.docx', '.xlsx'].includes(path.extname(f).toLowerCase()));
  
      const chunkDocs: Partial<DocumentChunk>[] = [];
  
      for (const file of allFiles) {
        const fullPath = path.join(folder, file);
        let content = '';
  
        try {
          const ext = path.extname(fullPath).toLowerCase();
          if (ext == '.pdf') content = await readPdfText(fullPath);
          else if (ext == '.docx') content = await readDocxText(fullPath);
          else if (ext == '.xlsx') content = readExcelText(fullPath);
        } catch (e) {
          continue;
        }
  
        const chunks = splitIntoChunks(content, 500);
        for (const chunk of chunks) {
          try {
            const embedding = await getEmbedding(chunk, apiKey);
            chunkDocs.push({
              fileName: file,
              content: chunk,
              embedding,
            });
  
            await new Promise(r => setTimeout(r, 1000));
          } catch (e) {
            continue;
          }
        }
      }
  
      try {
        await this.chunkService.insertMany(chunkDocs);
        return res.json({ message: 'Thành công!' });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }
  }
  