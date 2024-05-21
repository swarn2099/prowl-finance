// transaction-service/src/graphql/user.transactions.resolver.ts
import { Resolver, ResolveField, Parent, Args } from '@nestjs/graphql';
import { User as UserExtension } from '../extensions/user.extension';
import { Transaction, TransactionConnection } from '@prowl/api-interfaces';
import { UserTransactionService } from '../services/user-transaction.service';

@Resolver((of) => UserExtension)
export class UserTranscationsResolver {
  constructor(private transactionService: UserTransactionService) {}

  // @ResolveField('transactions', () => [Transaction])
  // async transactions(@Parent() user: UserExtension): Promise<Transaction[]> {
  //   const response = await this.transactionService.getTransactionsByUserId(
  //     user.uuid
  //   );
  //   return response;
  // }

  @ResolveField('transactions', () => TransactionConnection)
  async transactions(
    @Parent() user: UserExtension,
    @Args('after', { type: () => String, nullable: true }) after?: string,
    @Args('first', { type: () => Number, nullable: true }) first = 10
  ): Promise<TransactionConnection> {
    return this.transactionService.getTransactionsByUserIdPaginated(
      user.uuid,
      after,
      first
    );
  }
}
