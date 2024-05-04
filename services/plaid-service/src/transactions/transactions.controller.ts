import { Body, Controller, Get, Injectable, Post } from '@nestjs/common';
import { TransactionService } from './transactions.service';

@Injectable()
@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  // Add methods here
  // @Get()
  // async getTransactions() {
  //   return await this.transactionService.getTransactions();
  // }

  @Post('webhook')
  async handlePlaidWebhook(@Body() payload: any) {
    // Add verification logic here if needed
    console.log('Received webhook from Plaid:', payload);

    // Handle different webhook types accordingly
    if (payload.webhook_type === 'TRANSACTIONS') {
      await this.transactionService.getTransactions(payload);
    }

    // Return a response indicating that the webhook was handled
    return { success: true };
  }
}
