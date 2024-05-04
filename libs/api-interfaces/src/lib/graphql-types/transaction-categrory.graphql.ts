import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
import { Transaction } from './transaction.graphql';

@ObjectType()
@Directive('@key(fields: "id")')
@Directive('@shareable')
export class TransactionCategory {
  @Field(() => ID)
  id!: number;

  @Field()
  category!: string;

  @Field()
  status!: string;

  @Field(() => Date)
  lastModified!: Date;
}
