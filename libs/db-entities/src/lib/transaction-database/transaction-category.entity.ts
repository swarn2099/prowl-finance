import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity('transaction_categories')
export class TransactionCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Transaction, (transaction) => transaction.categories)
  @JoinColumn({ name: 'transaction_id' }) // Specify the foreign key column name
  transaction!: Transaction;

  @Column()
  category!: string;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status!: string;

  @UpdateDateColumn({ name: 'last_modified' })
  lastModified!: Date;
}
