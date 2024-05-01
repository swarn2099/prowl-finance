// services/transaction-service/src/app/transaction/transaction.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '@prowl/db-entities';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>
  ) {}

  async findAll(): Promise<Transaction[]> {
    return await this.transactionRepository.find();
  }

  async findById(id: string): Promise<Transaction | undefined> {
    return await this.transactionRepository.findOneBy({ id });
  }

  async create(
    amount: number,
    description: string,
    userId: string
  ): Promise<Transaction> {
    const newTransaction = this.transactionRepository.create({
      amount,
      description,
      userId,
    });
    await this.transactionRepository.save(newTransaction);
    return newTransaction;
  }

  async update(id: string, attrs: Partial<Transaction>): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    Object.assign(transaction, attrs);
    await this.transactionRepository.save(transaction);
    return transaction;
  }

  async remove(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    await this.transactionRepository.remove(transaction);
    return transaction;
  }

  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    return await this.transactionRepository.find({ where: { userId } });
  }
}
