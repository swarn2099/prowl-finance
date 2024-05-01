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
import { GetToken } from '@prowl/common';

@Resolver((of) => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query((returns) => User)
  async getUserById(
    @Context('sub') context,
    @GetToken('sub') token,

    @Args('uuid') uuid: string
  ): Promise<User> {
    console.log('Token: ', token);
    // console.log(
    //   'Headers from user-service:',
    //   JSON.parse(context.req.headers.user).sub
    // );
    return this.userService.findById(uuid);
  }

  @Query((returns) => [User])
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Mutation((returns) => User)
  async createUser(
    @Args('email') email: string,
    @Args('name') name: string
  ): Promise<User> {
    return this.userService.create(email, name);
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

  // @ResolveReference()
  // resolveReference(reference: {
  //   __typename: string;
  //   id: string;
  // }): Promise<User> {
  //   return this.userService.findById(reference.id);
  // }
}
