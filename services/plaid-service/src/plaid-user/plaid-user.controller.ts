import { Controller, Injectable } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PlaidUserService } from './plaid-user.service';

@Injectable()
@Controller()
export class PlaidUserController {
  constructor(private plaidUserService: PlaidUserService) {}
  @GrpcMethod('UserPlaidService', 'SendUserDetails')
  async sendUserDetails({
    uuid,
    auth0ID,
    plaidAccessToken,
  }): Promise<{ message: string }> {
    console.log('Received user details:', uuid, auth0ID, plaidAccessToken);
    await this.plaidUserService.create(uuid, auth0ID, plaidAccessToken);
    return { message: 'User details received and processed.' };
  }
}
