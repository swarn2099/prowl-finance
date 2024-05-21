// resolvers/coinbase-account.resolver.ts
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveReference,
  Context,
} from '@nestjs/graphql';
import { CoinbaseAccountService } from '../services/coinbase-account.service';
import { CoinbaseAccount } from '@prowl/api-interfaces';
import { GetToken } from '@prowl/common';

@Resolver((of) => CoinbaseAccount)
export class CoinbaseAccountResolver {
  constructor(private coinbaseAccountService: CoinbaseAccountService) {}

  // @Query(() => CoinbaseAccount, { name: 'coinbaseAccount' })
  // async getCoinbaseAccount(@Args('id') id: string): Promise<CoinbaseAccount> {
  //   return this.coinbaseAccountService.getCoinbaseAccountById(id);
  // }

  // @Query(() => CoinbaseAccount, { name: 'coinbaseAccountByUUID' })
  // async getCoinbaseAccountByUUID(
  //   @Args('uuid') uuid: string
  // ): Promise<CoinbaseAccount> {
  //   return this.coinbaseAccountService.getCoinbaseAccountByUUID(uuid);
  // }

  @Mutation(() => CoinbaseAccount)
  async createCoinbaseAccount(
    @GetToken('auth0ID') auth0ID: string,
    @Args('accessToken') accessToken: string,
    @Args('refreshToken') refreshToken: string
  ): Promise<CoinbaseAccount> {
    return this.coinbaseAccountService.createCoinbaseAccount(
      auth0ID,
      accessToken,
      refreshToken
    );
  }

  @Mutation(() => CoinbaseAccount)
  async updateCoinbaseAccount(
    @GetToken('auth0ID') auth0ID: string,
    @Args('accessToken', { nullable: true }) accessToken?: string,
    @Args('refreshToken', { nullable: true }) refreshToken?: string
  ): Promise<CoinbaseAccount> {
    return this.coinbaseAccountService.updateCoinbaseAccount(
      auth0ID,
      accessToken,
      refreshToken
    );
  }

  // @Mutation(() => Boolean)
  // async deleteCoinbaseAccount(@Args('id') id: string): Promise<boolean> {
  //   return this.coinbaseAccountService.deleteCoinbaseAccount(id);
  // }

  @ResolveReference()
  resolveReference(reference: {
    __typename: string;
    auth0ID: string;
  }): Promise<CoinbaseAccount> {
    return this.coinbaseAccountService.getCoinbaseAccount(reference.auth0ID);
  }
}
