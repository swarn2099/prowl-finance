// libs/db-entities/src/lib/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string;

  @Column()
  email!: string;

  @Column()
  name!: string;

  // Add other necessary columns
}
