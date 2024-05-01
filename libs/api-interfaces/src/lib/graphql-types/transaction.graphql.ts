// lib/api-interfaces/src/graphql/transaction.type.ts
import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")') // Primary key for federation
export class Transaction {
  @Field(() => ID)
  @Directive('@shareable')
  id!: string;

  @Field()
  @Directive('@shareable')
  amount!: number;

  @Field()
  @Directive('@shareable')
  date!: Date;

  @Field()
  @Directive('@shareable')
  description!: string;

  @Field(() => ID)
  @Directive('@shareable')
  userId!: string;
}
