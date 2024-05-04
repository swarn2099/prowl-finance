// services/transaction-service/src/app/transaction/transaction.resolver.ts
import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { TransactionService } from '../services/transaction.service';
import { Transaction, TransactionCategory } from '@prowl/api-interfaces';

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

  // @ResolveField(() => [TransactionCategory])
  // async categories(
  //   @Parent() transaction: Transaction
  // ): Promise<TransactionCategory[]> {
  //   return await this.transactionService.getCategoriesByTransactionId(
  //     transaction.transaction_id
  //   );
  // }

  @ResolveField(() => [TransactionCategory])
  async categories(
    @Parent() transaction: Transaction
  ): Promise<TransactionCategory[]> {
    return this.transactionService.getCategoriesByTransactionId(
      transaction.transaction_id
    );
  }
}
