import { Module } from '@nestjs/common';
import { PlaidUserController } from './plaid-item.controller';
import { PlaidItemService } from './plaid-item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaidItem } from '@prowl/db-entities';
import { PlaidService } from '../plaid.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forFeature([PlaidItem]),
  ],
  controllers: [PlaidUserController],
  providers: [PlaidItemService, PlaidService],
  exports: [],
})
export class PlaidItemModule {}
