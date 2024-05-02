// services/transaction-service/src/app/transaction/transaction.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '@prowl/db-entities';

@Injectable()
export class UserTransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>
  ) {}

  async getTransactionsByUserId(userUuid: string): Promise<Transaction[]> {
    console.log('in the service: ', userUuid);
    return await this.transactionRepository.find({ where: { userUuid } });
  }
  async findById(id: string): Promise<Transaction | undefined> {
    return await this.transactionRepository.findOneBy({ id });
  }
}
