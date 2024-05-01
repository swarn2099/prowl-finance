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

  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    return await this.transactionRepository.find({ where: { userId } });
  }
}
