import { Controller, Get, Injectable } from '@nestjs/common';
import { TransactionService } from './transactions.service';

@Injectable()
@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  // Add methods here
  @Get()
  async getTransactions() {
    return await this.transactionService.getTransactions();
  }
}
