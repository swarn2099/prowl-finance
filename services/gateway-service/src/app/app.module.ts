import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { authContext } from './auth/auth.context';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        // Apollo server options
        context: authContext,
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
        buildService({ url }) {
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }) {
              console.log('context:', context.user);
              if (context.user) {
                const user = { ...context.user, auth0ID: context.user.sub };
                request.http.headers.set('user', `${JSON.stringify(user)}`);
              }
            },
          });
        },
      },
    }),
  ],
})
export class AppModule {}
