import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaidUser } from '@prowl/db-entities';

@Injectable()
export class PlaidUserService {
  constructor(
    @InjectRepository(PlaidUser)
    private plaidUserRepository: Repository<PlaidUser>
  ) {}

  async create(
    uuid: string,
    auth0ID: string,
    plaidAccessToken: string
  ): Promise<any> {
    // first check if user exists, if so return user with message saying user already exists
    const user = await this.plaidUserRepository.findOneBy({ auth0ID });
    if (user) {
      return user;
    }

    const newUser = this.plaidUserRepository.create({
      uuid,
      auth0ID,
      plaidAccessToken,
    });
    await this.plaidUserRepository.save(newUser);

    return {
      message: 'User credentials saved successfully.',
      status: 200,
    };
  }
}
