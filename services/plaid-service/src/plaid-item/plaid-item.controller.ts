import { Controller, Injectable, Post } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PlaidItemService } from './plaid-item.service';
import { TransactionService } from '../transactions/transactions.service';
import { LiabilitiesService } from '../liabilities/liabilities.service';

interface SendUserDetailsResponse {
  status: number;
  message: string;
}
@Injectable()
@Controller()
export class PlaidUserController {
  constructor(private plaidItemService: PlaidItemService) {}
  @GrpcMethod('UserPlaidService', 'SendUserDetails')
  async SendUserDetails({
    uuid,
    auth0ID,
    publicAccessToken,
  }: {
    uuid: string;
    auth0ID: string;
    publicAccessToken: string;
  }): Promise<SendUserDetailsResponse> {
    console.log('Received user details:', uuid, auth0ID, publicAccessToken);
    return await this.plaidItemService.create(uuid, auth0ID, publicAccessToken);
  }
}
