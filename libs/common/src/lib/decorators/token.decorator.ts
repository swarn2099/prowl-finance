// src/common/decorators/user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const GetToken = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    // Convert ExecutionContext to GqlExecutionContext for GraphQL
    const gqlContext = GqlExecutionContext.create(ctx);
    const request = gqlContext.getContext().req; // Get the request from the GraphQL context

    if (!request) {
      console.log('Request object not available in GraphQL context');
      return null;
    }

    // console.log('from decorator Request:', request); // Should now log the correct request object
    const user = request.headers['user']
      ? JSON.parse(request.headers['user'])
      : null;

    return data ? user?.[data] : user;
  }
);
