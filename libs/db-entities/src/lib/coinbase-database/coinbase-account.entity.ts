// coinbase-account.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from 'typeorm';

@Entity('coinbase_account')
export class CoinbaseAccount {
  @PrimaryColumn('uuid')
  uuid!: string; // Store reference to the User

  @Column()
  accessToken!: string;

  @Column()
  refreshToken!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt!: Date;
}
