import { ObjectType, Field, ID, Directive, Float } from '@nestjs/graphql';
import { TransactionCategory } from './transaction-categrory.graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
@Directive('@key(fields: "transaction_id")')
@Directive('@shareable')
export class Transaction {
  @Field(() => ID)
  transaction_id!: string;

  @Field(() => ID)
  @Directive('@shareable')
  account_id!: string;

  @Field({ nullable: true })
  @Directive('@shareable')
  account_owner!: string;

  @Field(() => Float)
  @Directive('@shareable')
  amount!: number;

  @Field({ nullable: true })
  @Directive('@shareable')
  authorized_date!: string;

  @Field({ nullable: true })
  @Directive('@shareable')
  category_id!: string;

  @Field(() => [TransactionCategory])
  @Directive('@shareable')
  categories!: TransactionCategory[];

  @Field(() => Date)
  @Directive('@shareable')
  date!: string;

  @Field()
  @Directive('@shareable')
  iso_currency_code!: string;

  @Field(() => GraphQLJSON)
  @Directive('@shareable')
  location!: object;

  @Field({ nullable: true })
  @Directive('@shareable')
  merchant_entity_id!: string;

  @Field({ nullable: true })
  @Directive('@shareable')
  merchant_name!: string;

  @Field()
  @Directive('@shareable')
  name!: string;

  @Field()
  @Directive('@shareable')
  payment_channel!: string;

  @Field(() => GraphQLJSON)
  @Directive('@shareable')
  payment_meta!: object;

  @Field()
  @Directive('@shareable')
  pending!: boolean;

  @Field({ nullable: true })
  @Directive('@shareable')
  pending_transaction_id!: string;

  @Field(() => GraphQLJSON)
  @Directive('@shareable')
  personal_finance_category!: object;

  @Field({ nullable: true })
  @Directive('@shareable')
  transaction_code!: string;

  @Field()
  @Directive('@shareable')
  transaction_type!: string;

  @Field({ nullable: true })
  @Directive('@shareable')
  unofficial_currency_code!: string;

  @Field()
  @Directive('@shareable')
  status!: string;

  @Field(() => Date)
  @Directive('@shareable')
  lastModified!: Date;
}
