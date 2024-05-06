// lib/api-interfaces/src/graphql/user.type.ts
import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "uuid")')
@Directive('@shareable')
export class PlaidAccount {
  @Field(() => ID)
  account_id!: string;

  @Field()
  uuid!: string;

  @Field({ nullable: true })
  available!: number;

  @Field({ nullable: true })
  current!: number;

  @Field({ nullable: true })
  iso_currency_code!: string;

  @Field({ nullable: true })
  limit!: number;

  @Field({ nullable: true })
  unofficial_currency_code!: string;

  @Field()
  mask!: string;

  @Field()
  name!: string;

  @Field()
  official_name!: string;

  @Field({ nullable: true })
  persistent_account_id!: string;

  @Field()
  subtype!: string;

  @Field()
  type!: string;

  @Field()
  institution_id!: string;

  @Field()
  institution_name!: string;

  @Field({ nullable: true })
  last_payment_amount!: number;

  @Field({ nullable: true })
  last_payment_date!: string;

  @Field({ nullable: true })
  last_statement_balance!: number;

  @Field({ nullable: true })
  last_statement_issue_date!: string;

  @Field({ nullable: true })
  minimum_payment_amount!: number;

  @Field({ nullable: true })
  next_payment_due_date!: string;
}
