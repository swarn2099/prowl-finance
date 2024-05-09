import { Controller, Injectable, Post } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PlaidItemService } from './plaid-item.service';

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
    return await this.plaidItemService.create(uuid, auth0ID, publicAccessToken);
  }

  @GrpcMethod('UserPlaidService', 'GetLinkToken')
  async GenerateLinkToken({ auth0ID }: { auth0ID: string }): Promise<any> {
    return await this.plaidItemService.generateLinkToken(auth0ID);
  }
}
