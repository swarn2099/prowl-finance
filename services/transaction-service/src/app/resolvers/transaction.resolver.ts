// services/transaction-service/src/app/transaction/transaction.resolver.ts
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  ResolveReference,
  ID,
} from '@nestjs/graphql';
import { TransactionService } from '../services/transaction.service';
import { Transaction } from '@prowl/api-interfaces';

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
    return this.transactionService.create(amount, description, userId);
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

  @Query((returns) => [Transaction])
  @ResolveField('transactions', (returns) => [Transaction])
  async getTransactionsByUserId(
    @Args('userId', { type: () => ID }) userId: string
  ): Promise<Transaction[]> {
    return this.transactionService.getTransactionsByUserId(userId);
  }

  @ResolveReference()
  resolveReference(ref: {
    __typename: string;
    id: string;
  }): Promise<Transaction> {
    return this.transactionService.findById(ref.id);
  }
}
