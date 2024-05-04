// // libs/db-entities/src/lib/transaction.entity.ts
// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
// } from 'typeorm';

// @Entity()
// export class Transaction {
//   @PrimaryGeneratedColumn()
//   id!: string;

//   @Column()
//   amount!: number;

//   @Column()
//   description!: string;

//   @CreateDateColumn()
//   date!: Date;

//   @Column()
//   userUuid!: string; // Assuming transactions are linked to a user by userId
// }

import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionCategory } from './transaction-category.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryColumn()
  transaction_id!: string;

  @Column('uuid')
  uuid!: string;

  @Column()
  account_id!: string;

  @Column({ nullable: true })
  account_owner!: string;

  @Column('float')
  amount!: number;

  @Column({ nullable: true, type: 'date' })
  authorized_date!: string;

  @Column({ nullable: true })
  category_id!: string;

  @Column('jsonb')
  counterparties!: object[];

  @Column('date')
  date!: string;

  @Column()
  iso_currency_code!: string;

  @Column('jsonb')
  location!: object;

  @Column({ nullable: true })
  merchant_entity_id!: string;

  @Column({ nullable: true })
  merchant_name!: string;

  @Column()
  name!: string;

  @Column()
  payment_channel!: string;

  @Column('jsonb')
  payment_meta!: object;

  @Column()
  pending!: boolean;

  @Column({ nullable: true })
  pending_transaction_id!: string;

  @Column('jsonb')
  personal_finance_category!: object;

  @Column({ nullable: true })
  transaction_code!: string;

  @Column()
  transaction_type!: string;

  @Column({ nullable: true })
  unofficial_currency_code!: string;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status!: string;

  @UpdateDateColumn({ name: 'last_modified' })
  lastModified!: Date;

  @OneToMany((type) => TransactionCategory, (category) => category.transaction)
  categories!: TransactionCategory[];
}
