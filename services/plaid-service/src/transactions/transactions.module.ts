import { Module } from '@nestjs/common';
import { TransactionController } from './transactions.controller';
import { TransactionService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaidAccount, PlaidUser } from '@prowl/db-entities';
import { PlaidService } from '../plaid.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forFeature([PlaidUser]),
    TypeOrmModule.forFeature([PlaidAccount], 'user-db-connection'),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, PlaidService],
  exports: [],
})
export class TransactionsModule {}
