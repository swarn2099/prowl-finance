import { Body, Controller, Get, Injectable, Post } from '@nestjs/common';
import { LiabilitiesService } from './liabilities.service';

@Injectable()
@Controller('liabilities')
export class LiabilitiesController {
  constructor(private liabilitiesService: LiabilitiesService) {}

  @Post('webhook')
  async handlePlaidWebhook(@Body() payload: any) {
    // Handle different webhook types accordingly
    if (payload.webhook_type === 'LIABILITIES') {
      await this.liabilitiesService.getLiabilities(payload);
    }

    // Return a response indicating that the webhook was handled
    return { success: true };
  }
}
