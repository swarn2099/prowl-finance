import { Controller, Injectable } from '@nestjs/common';
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
  // @GrpcMethod('UserPlaidService', 'SendUserDetails')
  // async SendUserDetails({ uuid, auth0ID, publicAccessToken }): Promise<any> {
  //   console.log('Received user details:', uuid, auth0ID, publicAccessToken);
  //   return {
  //     status: 200,
  //     message: 'User details received',
  //   };

  //   // return await this.plaidItemService.create(
  //   //   uuid,
  //   //   auth0ID,
  //   //   public_access_token
  //   // );
  // }

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
