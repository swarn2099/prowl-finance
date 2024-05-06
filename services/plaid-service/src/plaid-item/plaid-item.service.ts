import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaidItem } from '@prowl/db-entities';
import { PlaidService } from '../plaid.service';
import { access } from 'fs';

@Injectable()
export class PlaidItemService {
  constructor(
    @InjectRepository(PlaidItem)
    private plaidItemRepository: Repository<PlaidItem>,

    private readonly plaidService: PlaidService
  ) {}

  async create(
    uuid: string,
    auth0ID: string,
    publicAccessToken: string
  ): Promise<any> {
    const plaidClient = this.plaidService.getClient();

    // first exchange the public token for an access token
    const {
      data: { access_token, item_id },
    } = await plaidClient.itemPublicTokenExchange({
      public_token: publicAccessToken,
    });

    const newUser = this.plaidItemRepository.create({
      uuid,
      auth0ID,
      item_id,
      transactionPageKey: '',
      access_token,
    });

    try {
      await this.plaidItemRepository.save(newUser);
      const saveWebHookUrl = await plaidClient.itemWebhookUpdate({
        access_token,
        webhook: `https://2e72-68-251-49-18.ngrok-free.app/api/transactions/webhook`,
      });
      return {
        message: 'User credentials saved successfully.',
        status: 200,
      };
    } catch (error) {
      return {
        message: error.message,
        status: 500,
      };
    }
  }
}
