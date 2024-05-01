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
    console.log(
      '------------- UserTransactionService.getTransactionsByUserId -------------'
    );
    console.log('UserTransactionService.getTransactionsByUserId', userId);
    return await this.transactionRepository.find({ where: { userId } });
  }
  async findById(id: string): Promise<Transaction | undefined> {
    return await this.transactionRepository.findOneBy({ id });
  }
}
