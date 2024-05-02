// transaction-service/src/graphql/user.transactions.resolver.ts
import {
  Resolver,
  ResolveField,
  Parent,
  ResolveReference,
} from '@nestjs/graphql';
import { User as UserExtension } from '../user.extension';
import { Transaction } from '@prowl/api-interfaces';
import { UserTransactionService } from '../services/user-transaction.service';
import { decrypt, key } from '@prowl/common';

@Resolver((of) => UserExtension)
export class UserTranscationsResolver {
  constructor(private transactionService: UserTransactionService) {}

  // @ResolveField((of) => UserExtension)
  // user(@Parent() transaction: Transaction): any {
  //   return { __typename: 'User', id: transaction.userUuid };
  // }

  @ResolveField('transactions', () => [Transaction])
  async transactions(@Parent() user: UserExtension): Promise<Transaction[]> {
    const response = await this.transactionService.getTransactionsByUserId(
      user.uuid
    );
    return response.map((item) => ({ ...item, userUuid: 'this is masked :)' }));
  }
}
