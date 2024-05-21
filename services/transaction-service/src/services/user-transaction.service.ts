// services/transaction-service/src/app/transaction/transaction.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionCategory } from '@prowl/db-entities';
import { TransactionConnection } from '@prowl/api-interfaces';

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

  async getTransactionsByUserIdPaginated(
    uuid: string,
    after?: string,
    first = 10
  ): Promise<TransactionConnection> {
    const qb = this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.uuid = :uuid', { uuid })
      .orderBy('transaction.transaction_id', 'ASC');

    if (after) {
      qb.andWhere('transaction.transaction_id > :after', { after });
    }

    const transactions = await qb.take(first + 1).getMany();

    const edges = transactions.slice(0, first).map((transaction) => ({
      cursor: transaction.transaction_id,
      node: transaction,
    }));

    const hasNextPage = transactions.length > first;

    return {
      edges,
      pageInfo: {
        endCursor: edges.length ? edges[edges.length - 1].cursor : null,
        hasNextPage,
      },
    };
  }
}
