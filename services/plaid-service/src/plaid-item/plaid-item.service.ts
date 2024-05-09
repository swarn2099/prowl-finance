import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaidItem } from '@prowl/db-entities';
import { PlaidService } from '../plaid.service';
import { access } from 'fs';
import { CountryCode, Products } from 'plaid';

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
    console.log('Received user details:', uuid, auth0ID, publicAccessToken);
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

    console.log('New user:', newUser);
    try {
      await this.plaidItemRepository.save(newUser);
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

  async generateLinkToken(auth0ID: string): Promise<any> {
    console.log('Received user details:', auth0ID);
    try {
      const plaidClient = this.plaidService.getClient();
      const response = await plaidClient.linkTokenCreate({
        user: {
          client_user_id: auth0ID,
        },
        client_name: 'Prowl Finance',
        products: [Products.Transactions, Products.Liabilities],
        country_codes: [CountryCode.Us],
        language: 'en',
        webhook: 'https://250269dd73ab.ngrok.app/api/webhook',
        redirect_uri: 'https://ed1b3cf31c9e.ngrok.app/src/plaid-redirect.html',
      });

      const linkResponse = {
        expiration: response.data.expiration,
        linkToken: response.data.link_token,
        requestId: response.data.request_id,
      };

      console.log('Link response:', linkResponse);

      return linkResponse;
    } catch (error) {
      return error;
    }
  }

  async generateUpdateLinkToken(auth0ID: string): Promise<any> {
    console.log('Received user details:', auth0ID);
    try {
      const plaidClient = this.plaidService.getClient();
      const response = await plaidClient.linkTokenCreate({
        user: {
          client_user_id: auth0ID,
        },
        client_name: 'Prowl Finance',
        products: [Products.Transactions, Products.Liabilities],
        country_codes: [CountryCode.Us],
        language: 'en',
        redirect_uri: 'https://ed1b3cf31c9e.ngrok.app/src/plaid-redirect.html',
        access_token: '',
      });

      const linkResponse = {
        expiration: response.data.expiration,
        linkToken: response.data.link_token,
        requestId: response.data.request_id,
      };

      console.log('Link response:', linkResponse);

      return linkResponse;
    } catch (error) {
      return error;
    }
  }
}
