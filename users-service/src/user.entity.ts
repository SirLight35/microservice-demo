import { json } from 'stream/consumers';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('outbox')
export class Outbox {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column()
  payload: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isProcessed: boolean;

  @Column({nullable:true})
  ProcessedAt: Date;
}
