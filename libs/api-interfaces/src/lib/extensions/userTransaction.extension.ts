// lib/api-interfaces/src/graphql/user.extension.ts
import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
import { Transaction } from '../graphql-types/transaction.graphql'; // Ensure this import points to the correct file

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class UserTransactionsExtension {
  @Field(() => ID)
  @Directive('@external')
  id!: string;

  @Field(() => [Transaction], { nullable: 'itemsAndList' }) // Assumes that transactions can be nullable
  transactions?: Transaction[];
}
