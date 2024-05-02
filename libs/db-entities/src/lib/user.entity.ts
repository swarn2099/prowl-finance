// libs/db-entities/src/lib/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid!: string;

  @Column()
  auth0ID!: string;

  @Column()
  email!: string;

  @Column()
  name!: string;
}
