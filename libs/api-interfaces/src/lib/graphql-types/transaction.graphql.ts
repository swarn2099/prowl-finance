// lib/api-interfaces/src/graphql/transaction.type.ts
import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class Transaction {
  @Field(() => ID)
  id!: string;

  @Field()
  amount!: number;

  @Field()
  date!: Date;

  @Field()
  description!: string;

  @Field()
  userUuid!: string;
}
