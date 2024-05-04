import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionCategory, Transaction } from '@prowl/db-entities';

@Resolver(() => TransactionCategory)
export class TransactionCategoryResolver {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>
  ) {}

  @ResolveField(() => Transaction, { nullable: true })
  async transaction(
    @Parent() category: TransactionCategory
  ): Promise<Transaction | null> {
    // Fetch the transaction with a controlled depth to avoid excessive nesting
    return this.transactionRepository.findOne({
      where: { transaction_id: category.transaction.transaction_id },
      relations: ['categories'], // Adjust relations as needed
    });
  }
}
