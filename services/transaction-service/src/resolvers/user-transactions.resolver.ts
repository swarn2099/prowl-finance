// transaction-service/src/graphql/user.transactions.resolver.ts
import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { User as UserExtension } from '../extensions/user.extension';
import { Transaction } from '@prowl/api-interfaces';
import { UserTransactionService } from '../services/user-transaction.service';

@Resolver((of) => UserExtension)
export class UserTranscationsResolver {
  constructor(private transactionService: UserTransactionService) {}

  @ResolveField('transactions', () => [Transaction])
  async transactions(@Parent() user: UserExtension): Promise<Transaction[]> {
    const response = await this.transactionService.getTransactionsByUserId(
      user.uuid
    );
    return response;
  }
}
