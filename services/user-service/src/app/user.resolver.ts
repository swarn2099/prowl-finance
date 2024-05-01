// services/user-service/src/app/user/user.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from '@prowl/api-interfaces';

@Resolver((of) => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query((returns) => User)
  async getUserById(@Args('id') id: string): Promise<User> {
    return this.userService.findById(id);
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
    @Args('id') id: string,
    @Args('email') email: string,
    @Args('name') name: string
  ): Promise<User> {
    return this.userService.update(id, { email, name });
  }

  @Mutation((returns) => User)
  async deleteUser(@Args('id') id: string): Promise<User> {
    return this.userService.remove(id);
  }
}
