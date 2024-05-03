import { Module } from '@nestjs/common';
import { PlaidUserController } from './plaid-user.controller';
import { PlaidUserService } from './plaid-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaidUser } from '@prowl/db-entities';

@Module({
  imports: [TypeOrmModule.forFeature([PlaidUser])],
  controllers: [PlaidUserController],
  providers: [PlaidUserService],
  exports: [],
})
export class PlaidUserModule {}
