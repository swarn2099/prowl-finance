import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '@prowl/db-entities';
import { join } from 'path';
import { TransactionResolver, UserTranscationsResolver } from './resolvers';
import { TransactionService, UserTransactionService } from './services';

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
        database: configService.get('DB_NAME'),
        entities: [Transaction],
        synchronize: true, // Typically false in production
      }),
    }),
    TypeOrmModule.forFeature([Transaction]),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
        path: join(process.cwd(), 'gql/transaction-service-schema.gql'),
      },
      context: ({ req, res }) => ({ req, res }),
    }),
  ],
  controllers: [],
  providers: [
    TransactionResolver,
    TransactionService,
    UserTranscationsResolver,
    UserTransactionService,
  ],
})
export class AppModule {}
