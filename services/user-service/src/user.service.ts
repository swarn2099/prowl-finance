// services/user-service/src/app/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaidAccount, User } from '@prowl/db-entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(PlaidAccount)
    private plaidAccountRepository: Repository<PlaidAccount>
  ) {}

  maskUUID = (user: User) => {
    return {
      ...user,
      uuid: 'this field will not be visible to the client',
    };
  };

  async findAll(): Promise<User[]> {
    const response = await this.userRepository.find();
    return response.map(this.maskUUID);
  }

  async getUserAccountInfo(auth0ID: string): Promise<any | undefined> {
    const { uuid } = await this.userRepository.findOneBy({ auth0ID });
    console.log('Found UUID: ', uuid);

    // search Plaid Account table for all accounts associated with the user
    const response = await this.plaidAccountRepository.find({
      where: { uuid },
    });

    console.log('List of accounts: ', response);

    return response ? response : undefined;
  }

  async findById(auth0ID: string): Promise<User | undefined> {
    const response = await this.userRepository.findOneBy({ auth0ID });
    return response ? response : undefined;
  }

  async create(
    auth0ID: string,
    email: string,
    name: string,
    firstName: string,
    lastName: string,
    username: string
  ): Promise<User> {
    // first check if user exists, if so return user with message saying user already exists
    const user = await this.userRepository.findOneBy({ auth0ID });
    if (user) {
      return this.maskUUID(user);
    }

    const newUser = this.userRepository.create({
      auth0ID,
      email,
      name,
      firstName,
      lastName,
      username,
    });
    await this.userRepository.save(newUser);
    return this.maskUUID(newUser);
  }

  async update(uuid: string, attrs: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOneBy({ uuid });
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, attrs);
    await this.userRepository.save(user);
    return this.maskUUID(user);
  }

  async remove(uuid: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ uuid });
    if (!user) {
      throw new Error('User not found');
    }
    await this.userRepository.remove(user);
    return this.maskUUID(user);
  }
}
