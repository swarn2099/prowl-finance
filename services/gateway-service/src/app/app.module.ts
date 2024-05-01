import { IntrospectAndCompose } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        // Apollo server options
        introspection: true, // Enables GraphQL Playground in production, disable if not needed
        playground: true, // Enables GraphQL Playground in production, disable if not needed
      },
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'users', url: 'http://localhost:8000/graphql' },
            { name: 'transactions', url: 'http://localhost:8001/graphql' },
          ],
        }),
      },
    }),
  ],
})
export class AppModule {}
