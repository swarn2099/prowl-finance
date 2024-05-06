// services/transaction-service/src/app/transaction/transaction.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionCategory } from '@prowl/db-entities';

@Injectable()
export class UserTransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>
  ) {}

  async getTransactionsByUserId(uuid: string): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: { uuid },
      order: {
        date: 'DESC', // Descending order by date
        indexoftransaction: 'DESC', // Descending order by indexofTransaction within each date
      },
    });
  }

  async findById(transaction_id: string): Promise<Transaction | undefined> {
    return await this.transactionRepository.findOneBy({ transaction_id });
  }
}
