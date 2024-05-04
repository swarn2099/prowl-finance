// lib/api-interfaces/src/graphql/user.extension.ts
import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
import { Transaction } from '@prowl/api-interfaces'; // Ensure correct import

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "uuid")')
export class User {
  @Field(() => ID)
  @Directive('@external')
  uuid!: string; // Ensure this is only marked external and used to fetch transactions

  @Field((type) => [Transaction])
  transactions?: Transaction[];
}
