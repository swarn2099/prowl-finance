// services/transaction-service/src/app/transaction/transaction.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoinbaseAccount } from '@prowl/db-entities';

@Injectable()
export class UserCoinbaseAccountService {
  constructor(
    @InjectRepository(CoinbaseAccount)
    private coinbaseAccountRepository: Repository<CoinbaseAccount>
  ) {}

  async getCoinbaseAccount(uuid: string): Promise<CoinbaseAccount> {
    return await this.coinbaseAccountRepository.findOne({ where: { uuid } });
  }
}
