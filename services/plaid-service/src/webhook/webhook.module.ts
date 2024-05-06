import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { LiabilitiesService } from '../liabilities/liabilities.service';
import { TransactionService } from '../transactions/transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PlaidAccount,
  PlaidItem,
  Transaction,
  TransactionCategory,
} from '@prowl/db-entities';
import { ConfigModule } from '@nestjs/config';
import { PlaidService } from '../plaid.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forFeature([PlaidItem]),
    TypeOrmModule.forFeature([PlaidAccount], 'user-db-connection'),
    TypeOrmModule.forFeature([Transaction], 'transaction-db-connection'),
    TypeOrmModule.forFeature(
      [TransactionCategory],
      'transaction-db-connection'
    ),
  ],
  controllers: [WebhookController],
  providers: [TransactionService, LiabilitiesService, PlaidService],
  exports: [],
})
export class WebhookModule {}
