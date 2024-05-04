// libs/db-entities/src/lib/user.entity.ts
import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { PlaidItem } from '../plaid-database/plaid-item.entity';

@Entity('plaid_account')
export class PlaidAccount {
  @PrimaryColumn()
  account_id!: string;

  @Column()
  uuid!: string;

  @Column({ nullable: true })
  available!: number;

  @Column({ nullable: true })
  current!: number;

  @Column({ nullable: true })
  iso_currency_code!: string;

  @Column({ nullable: true })
  limit!: number;

  @Column({ nullable: true })
  unofficial_currency_code!: string;

  @Column()
  mask!: string;

  @Column()
  name!: string;

  @Column()
  official_name!: string;

  @Column({ nullable: true })
  persistent_account_id!: string;

  @Column()
  subtype!: string;

  @Column()
  type!: string;

  // @ManyToOne(() => PlaidItem)
  // @JoinColumn({ name: 'item_id'})
  // item!: PlaidItem;
}
