import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { TransactionService } from '../transactions/transactions.service';
import { LiabilitiesService } from '../liabilities/liabilities.service';

@Injectable()
@Controller('webhook')
export class WebhookController {
  constructor(
    private transactionService: TransactionService,
    private liabilitiesService: LiabilitiesService
  ) {}

  @Post()
  async handlePlaidWebhook(@Body() payload: any) {
    console.log('Received webhook payload:', payload);
    // Handle different webhook types accordingly
    if (payload.webhook_type === 'TRANSACTIONS') {
      await this.transactionService.getTransactions(payload);
    } else if (payload.webhook_type === 'LIABILITIES') {
      await this.liabilitiesService.getLiabilities(payload);
    }

    // Return a response indicating that the webhook was handled
    return { success: true };
  }
}
