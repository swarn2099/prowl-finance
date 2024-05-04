// apps/user-service/src/app/user.controller.ts

import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UserGRPCService } from './user-gRPC.service';

@Controller('user')
export class UserGRPCController {
  constructor(private userGRPCService: UserGRPCService) {}

  @Post('update-plaid-details')
  async updatePlaidDetails(
    @Body() body: { auth0ID: string; public_access_token: string }
  ) {
    console.log('From user-gRPC.controller.ts: ', body);
    try {
      const result = await this.userGRPCService.sendUserDetails(
        body.auth0ID,
        body.public_access_token
      );
      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to update Plaid details',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
