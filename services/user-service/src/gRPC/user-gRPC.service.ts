// apps/user-service/src/app/user.service.ts

import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, Client } from '@nestjs/microservices';
import { join } from 'path';
import { UserService } from '../user.service';

@Injectable()
export class UserGRPCService implements OnModuleInit {
  private plaidService;

  constructor(
    @Inject('USER_PLAID_SERVICE') private client: ClientGrpc,
    private userService: UserService
  ) {}

  onModuleInit() {
    this.plaidService = this.client.getService<any>('UserPlaidService');
  }
  async sendUserDetails(
    auth0ID: string,
    public_access_token: string
  ): Promise<{ message: string }> {
    // first get the user details from the user service
    const { uuid } = await this.userService.findById(auth0ID);
    console.log('Sending this data: ', uuid, auth0ID, public_access_token);

    return new Promise((resolve, reject) => {
      const response = this.plaidService.SendUserDetails({
        uuid,
        auth0ID,
        publicAccessToken: public_access_token,
      });
      response.subscribe({
        next: (data) => {
          console.log('Response from Plaid service:', data);
          resolve(data);
        },
        error: (error) => {
          console.error('Error from Plaid service:', error);
          reject(error);
        },
      });
    });
  }

  async getLinkToken(auth0ID: string): Promise<{ message: string }> {
    return new Promise((resolve, reject) => {
      const response = this.plaidService.GetLinkToken({
        auth0ID,
      });
      response.subscribe({
        next: (data) => {
          console.log('Response from Plaid service:', data);
          resolve(data);
        },
        error: (error) => {
          console.error('Error from Plaid service:', error);
          reject(error);
        },
      });
    });
  }
}
