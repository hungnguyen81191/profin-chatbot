import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ChatBotLog')
export class ChatBotLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user: string;

  @Column()
  sessionId: string;

  @Column()
  content: string;

  @Column()
  sender: string; // 'user' | 'bot'

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ type: 'datetime', nullable: true })
  createdDate?: Date;
}
