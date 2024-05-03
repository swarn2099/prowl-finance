import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@prowl/db-entities';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserGRPCController } from './gRPC/user-gRPC.controller';
import { UserGRPCService } from './gRPC/user-gRPC.service';

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
        entities: [User], // Ensure User is listed here
        synchronize: true, // Typically false in production
      }),
    }),
    TypeOrmModule.forFeature([User]),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
        path: join(process.cwd(), 'gql/user-service-schema.gql'),
      },
      context: ({ req, res }) => ({ req, res }),
    }),
    ClientsModule.register([
      {
        name: 'USER_PLAID_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'userplaid',
          protoPath: join(__dirname, './protos/user_plaid_service.proto'),
          url: 'localhost:5554',
        },
      },
    ]),
  ],
  controllers: [UserGRPCController],
  providers: [UserGRPCController, UserGRPCService, UserResolver, UserService],
})
export class UserModule {}
