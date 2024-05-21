// services/user-service/src/app/coinbase-account/coinbase-account.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoinbaseAccount, User } from '@prowl/db-entities';

@Injectable()
export class CoinbaseAccountService {
  constructor(
    @InjectRepository(CoinbaseAccount)
    private coinbaseAccountRepository: Repository<CoinbaseAccount>,
    @InjectRepository(User, 'user-db-connection')
    private userRepository: Repository<User>
  ) {}

  async createCoinbaseAccount(
    auth0ID,
    accessToken,
    refreshToken
  ): Promise<CoinbaseAccount> {
    // get user by auth0ID
    const user = await this.userRepository.findOne({
      where: { auth0ID: auth0ID },
    }); // if user not found, throw error
    if (!user) {
      throw new Error('User not found');
    }
    // create new coinbase account
    const newAccount = this.coinbaseAccountRepository.create({
      uuid: user.uuid,
      accessToken,
      refreshToken,
    });
    return await this.coinbaseAccountRepository.save(newAccount);
  }

  async getCoinbaseAccount(
    auth0ID: string
  ): Promise<CoinbaseAccount | undefined> {
    // get user by auth0ID
    const user = await this.userRepository.findOne({
      where: { auth0ID: auth0ID },
    }); // if user not found, throw error
    if (!user) {
      throw new Error('User not found');
    }
    return await this.coinbaseAccountRepository.findOne({
      where: { uuid: user.uuid },
    });
  }

  async getCoinbaseAccountByUUID(
    uuid: string
  ): Promise<CoinbaseAccount | undefined> {
    return await this.coinbaseAccountRepository.findOne({ where: { uuid } });
  }

  async updateCoinbaseAccount(
    auth0ID,
    accessToken,
    refreshToken
  ): Promise<CoinbaseAccount> {
    const user = await this.userRepository.findOne({
      where: { auth0ID: auth0ID },
    }); // if user not found, throw error
    if (!user) {
      throw new Error('User not found');
    }

    const updatedAccountData = {
      uuid: user.uuid,
      accessToken,
      refreshToken,
      updatedAt: new Date(),
    };
    await this.coinbaseAccountRepository.update(user.uuid, updatedAccountData);
    return await this.getCoinbaseAccount(auth0ID);
  }

  async deleteCoinbaseAccount(id: string): Promise<boolean> {
    const result = await this.coinbaseAccountRepository.delete(id);
    return result.affected > 0;
  }
}
