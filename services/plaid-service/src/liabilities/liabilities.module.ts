import { Module } from '@nestjs/common';
import { LiabilitiesController } from './liabilities.controller';
import { LiabilitiesService } from './liabilities.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaidAccount, PlaidItem } from '@prowl/db-entities';
import { PlaidService } from '../plaid.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forFeature([PlaidItem]),
    TypeOrmModule.forFeature([PlaidAccount], 'user-db-connection'),
  ],
  controllers: [LiabilitiesController],
  providers: [LiabilitiesService, PlaidService],
  exports: [],
})
export class LiabilitiesModule {}
