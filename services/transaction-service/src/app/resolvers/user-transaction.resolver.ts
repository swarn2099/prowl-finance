// transaction-service/src/graphql/user.transactions.resolver.ts
import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { UserTransactionsExtension } from '@prowl/api-interfaces';
import { Transaction } from '@prowl/api-interfaces';
import { UserTransactionService } from '../services/user-transaction.service';

@Resolver((of) => UserTransactionsExtension)
export class UserTransactionsResolver {
  constructor(private userTransactionService: UserTransactionService) {}

  @ResolveField(() => [Transaction], { name: 'transactions' })
  async getTransactions(
    @Parent() user: UserTransactionsExtension
  ): Promise<Transaction[]> {
    return this.userTransactionService.getTransactionsByUserId(user.id);
  }
}
