// lib/api-interfaces/src/graphql/user.extension.ts
import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
import { Transaction } from '@prowl/api-interfaces'; // Ensure correct import

@ObjectType()
@Directive('@key(fields: "id")')
export class User {
  @Field(() => ID)
  id!: string;

  @Field(() => [Transaction])
  transactions?: Transaction[];
}
