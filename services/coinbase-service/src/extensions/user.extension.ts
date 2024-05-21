// lib/api-interfaces/src/graphql/user.extension.ts
import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
import { CoinbaseAccount } from '@prowl/api-interfaces'; // Ensure correct import

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "uuid")')
export class User {
  @Field(() => ID)
  @Directive('@external')
  uuid!: string;

  @Field(() => CoinbaseAccount, { nullable: true })
  coinbaseAccount?: CoinbaseAccount;
}
