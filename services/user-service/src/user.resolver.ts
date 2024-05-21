/* eslint-disable @typescript-eslint/no-unused-vars */
// services/user-service/src/app/user/user.resolver.ts
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveReference,
  Context,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { User, PlaidAccount } from '@prowl/api-interfaces';
import { GetToken, encrypt } from '@prowl/common';
import { UserGRPCService } from './gRPC/user-gRPC.service';
import { GraphQLJSONObject } from 'graphql-type-json';
import { first } from 'rxjs';

@Resolver((of) => User)
export class UserResolver {
  constructor(
    private userService: UserService,
    private usergRPCService: UserGRPCService
  ) {}

  @Query((returns) => User)
  async getUserById(@GetToken('auth0ID') auth0ID): Promise<User> {
    const response: any = await this.userService.findById(auth0ID);
    return response;
  }

  @Query((returns) => [PlaidAccount])
  async getUserAccountsInfo(@GetToken('auth0ID') auth0ID): Promise<any> {
    return this.userService.getUserAccountInfo(auth0ID);
  }

  @Mutation((returns) => User)
  async createUser(
    @GetToken() token,
    @Args('username') username: string,
    @Args('email') email: string,
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string
  ): Promise<User> {
    const { auth0ID } = token;
    const name = `${firstName} ${lastName}`;
    return this.userService.create(
      auth0ID,
      email,
      name,
      firstName,
      lastName,
      username
    );
  }

  @Mutation((returns) => User)
  async updateUser(
    @Args('uuid') uuid: string,
    @Args('email') email: string,
    @Args('name') name: string
  ): Promise<User> {
    return this.userService.update(uuid, { email, name });
  }

  @Mutation((returns) => User)
  async deleteUser(@Args('uuid') uuid: string): Promise<User> {
    return this.userService.remove(uuid);
  }

  // gRPC to Plaid Service
  @Query((returns) => GraphQLJSONObject)
  async getLinkToken(@GetToken('auth0ID') auth0ID): Promise<any> {
    return this.usergRPCService.getLinkToken(auth0ID);
  }

  @Mutation((returns) => GraphQLJSONObject)
  async sendPlaidDetails(
    @GetToken('auth0ID') auth0ID: string,
    @Args('public_access_token') public_access_token: string
  ): Promise<any> {
    return this.usergRPCService.sendUserDetails(auth0ID, public_access_token);
  }
}
