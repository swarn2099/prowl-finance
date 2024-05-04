// services/transaction-service/src/app/transaction/transaction.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionCategory } from '@prowl/db-entities';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionCategory)
    private transactionCategoryRepository: Repository<TransactionCategory>
  ) {}

  async findAll(): Promise<Transaction[]> {
    return await this.transactionRepository.find();
  }

  async findById(transaction_id: string): Promise<Transaction | undefined> {
    return await this.transactionRepository.findOneBy({ transaction_id });
  }

  async getTransactionsByUserId(uuid: string): Promise<Transaction[]> {
    return await this.transactionRepository.find({ where: { uuid } });
  }

  async getCategoriesByTransactionId(
    transaction_id: string
  ): Promise<TransactionCategory[]> {
    return await this.transactionCategoryRepository.find({
      where: { transaction: { transaction_id } },
    });
  }
}
