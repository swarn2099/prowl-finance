// libs/db-entities/src/lib/transaction.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  amount!: number;

  @Column()
  description!: string;

  @CreateDateColumn()
  date!: Date;

  @Column()
  userUuid!: string; // Assuming transactions are linked to a user by userId
}
