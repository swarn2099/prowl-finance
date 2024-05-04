// libs/db-entities/src/lib/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class PlaidUser {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string;

  @Column()
  auth0ID!: string;

  @Column()
  plaidAccessToken!: string;

  @Column({ nullable: true })
  transactionPageKey!: string;
}
