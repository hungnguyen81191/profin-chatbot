import { IsString, IsOptional } from 'class-validator';

export class ChatRequestDto {
  @IsString()
  prompt: string;

  @IsString()
  sessionId: string;
}