import { Module } from '@nestjs/common';
import { PlaidItemModule } from './plaid-item/plaid-item.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PlaidAccount,
  PlaidItem,
  Transaction,
  TransactionCategory,
} from '@prowl/db-entities';
import { TransactionsModule } from './transactions/transactions.module';
import { PlaidService } from './plaid.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule
      inject: [ConfigService], // Inject ConfigService
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // Assuming you are using PostgreSQL
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT', { infer: true }), // Parse port number from string to number
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('PLAID_DB_NAME'),
        entities: [PlaidItem], // Ensure User is listed here
        synchronize: true, // Typically false in production
      }),
    }),
    TypeOrmModule.forRootAsync({
      name: 'user-db-connection', // Name of the connection, 'default' is used if not specified
      imports: [ConfigModule], // Import ConfigModule
      inject: [ConfigService], // Inject ConfigService
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // Assuming you are using PostgreSQL
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT', { infer: true }), // Parse port number from string to number
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('USER_DB_NAME'),
        entities: [PlaidAccount], // Ensure User is listed here
        synchronize: true, // Typically false in production
      }),
    }),
    TypeOrmModule.forRootAsync({
      name: 'transaction-db-connection', // Name of the connection, 'default' is used if not specified
      imports: [ConfigModule], // Import ConfigModule
      inject: [ConfigService], // Inject ConfigService
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // Assuming you are using PostgreSQL
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT', { infer: true }), // Parse port number from string to number
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('TRANSACTION_DB_NAME'),
        entities: [Transaction, TransactionCategory], // Ensure User is listed here
        synchronize: true, // Typically false in production
      }),
    }),
    TypeOrmModule.forFeature([PlaidItem]),
    TypeOrmModule.forFeature([PlaidAccount]),
    TypeOrmModule.forFeature([Transaction]),
    TypeOrmModule.forFeature([TransactionCategory]),
    PlaidItemModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [PlaidService],
  exports: [],
})
export class AppModule {}
