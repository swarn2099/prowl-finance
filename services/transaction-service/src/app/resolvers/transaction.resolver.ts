// services/transaction-service/src/app/transaction/transaction.resolver.ts
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveReference,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { TransactionService } from '../services/transaction.service';
import { Transaction } from '@prowl/api-interfaces';
import { User as UserExtension } from '../user.extension';

@Resolver((of) => Transaction)
export class TransactionResolver {
  constructor(private transactionService: TransactionService) {}

  @Query((returns) => Transaction)
  async getTransactionById(@Args('id') id: string): Promise<Transaction> {
    return this.transactionService.findById(id);
  }

  @Query((returns) => [Transaction])
  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionService.findAll();
  }

  @Mutation((returns) => Transaction)
  async createTransaction(
    @Args('amount') amount: number,
    @Args('description') description: string,
    @Args('userId') userId: string
  ): Promise<Transaction> {
    console.log('userId', userId, 'amount', amount, 'description', description);

    try {
      return this.transactionService.create(amount, description, userId);
    } catch (error) {
      console.log('error', error);
    }
  }

  @Mutation((returns) => Transaction)
  async updateTransaction(
    @Args('id') id: string,
    @Args('amount') amount: number,
    @Args('description') description: string
  ): Promise<Transaction> {
    return this.transactionService.update(id, { amount, description });
  }

  @Mutation((returns) => Transaction)
  async deleteTransaction(@Args('id') id: string): Promise<Transaction> {
    return this.transactionService.remove(id);
  }

  @ResolveField((of) => UserExtension)
  user(@Parent() transaction: Transaction): any {
    return { __typename: 'User', id: transaction.userId };
  }

  @ResolveReference()
  resolveReference(ref: {
    __typename: string;
    id: string;
  }): Promise<Transaction> {
    return this.transactionService.findById(ref.id);
  }
}
