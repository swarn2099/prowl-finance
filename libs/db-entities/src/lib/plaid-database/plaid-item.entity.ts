// libs/db-entities/src/lib/user.entity.ts
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class PlaidItem {
  @PrimaryColumn('uuid')
  uuid!: string;

  @Column()
  auth0ID!: string;

  @Column()
  item_id!: string;

  @Column()
  access_token!: string;

  @Column({ nullable: true })
  transactionPageKey!: string;
}
