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
import { User } from '@prowl/api-interfaces';
import { GetToken, encrypt } from '@prowl/common';

@Resolver((of) => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query((returns) => User)
  async getUserById(
    @GetToken('auth0ID') auth0ID,
    @Context() context
  ): Promise<User> {
    const response: any = await this.userService.findById(auth0ID);
    return response;
  }

  @Query((returns) => [User])
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Mutation((returns) => User)
  async createUser(@GetToken() token): Promise<User> {
    const { email, name, auth0ID } = token;
    return this.userService.create(auth0ID, email, name);
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
}
