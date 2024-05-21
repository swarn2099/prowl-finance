import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoinbaseAccount, User } from '@prowl/db-entities';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { join } from 'path';
import { CoinbaseAccountResolver } from './resolvers/coinbase-account.resolver';
import { CoinbaseAccountService } from './services/coinbase-account.service';
import { UserCoinbaseAccountResolver } from './resolvers/user-coinbase-account.resolver';
import { UserCoinbaseAccountService } from './services/user-coinbase-account.service';
import { User as UserExtension } from './extensions/user.extension';

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
        entities: [CoinbaseAccount], // Ensure User is listed here
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
        entities: [User], // Ensure User is listed here
        synchronize: true, // Typically false in production
      }),
    }),
    TypeOrmModule.forFeature([User], 'user-db-connection'),
    TypeOrmModule.forFeature([CoinbaseAccount]),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
        path: join(process.cwd(), 'gql/coinbase-service-schema.gql'),
      },
      buildSchemaOptions: {
        orphanedTypes: [UserExtension],
      },
      context: ({ req, res }) => ({ req, res }),
    }),
  ],
  controllers: [],
  providers: [
    CoinbaseAccountResolver,
    CoinbaseAccountService,
    UserCoinbaseAccountResolver,
    UserCoinbaseAccountService,
  ],
})
export class AppModule {}
