// src/plaid/plaid.service.ts
import { Injectable } from '@nestjs/common';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PlaidService {
  private readonly plaidClient: PlaidApi;

  constructor(private configService: ConfigService) {
    const configuration = new Configuration({
      basePath: PlaidEnvironments.sandbox, // or choose the appropriate environment
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': configService.get('PLAID_CLIENT_ID'),
          'PLAID-SECRET': configService.get('PLAID_SECRET'),
        },
      },
    });
    this.plaidClient = new PlaidApi(configuration);
  }

  // Example method to retrieve the client, you can add more methods as needed
  getClient() {
    return this.plaidClient;
  }
}
