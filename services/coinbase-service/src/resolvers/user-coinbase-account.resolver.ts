// transaction-service/src/graphql/user.transactions.resolver.ts
import { Resolver, ResolveField, Parent, Args } from '@nestjs/graphql';
import { User as UserExtension } from '../extensions/user.extension';
import { CoinbaseAccount } from '@prowl/api-interfaces';
import { UserCoinbaseAccountService } from '../services/user-coinbase-account.service';

@Resolver((of) => UserExtension)
export class UserCoinbaseAccountResolver {
  constructor(private userCoinbaseAccountService: UserCoinbaseAccountService) {}

  @ResolveField('coinbaseAccount', () => CoinbaseAccount)
  async coinbaseAccount(
    @Parent() user: UserExtension
  ): Promise<CoinbaseAccount> {
    const response = await this.userCoinbaseAccountService.getCoinbaseAccount(
      user.uuid
    );
    return response;
  }
}
