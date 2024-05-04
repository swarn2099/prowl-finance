// src/auth.context.ts
import { UnauthorizedException } from '@nestjs/common';
import { validateToken } from './validateToken';

export const authContext = async ({ req }) => {
  console.log('Request headers:', typeof req.headers?.authorization);
  if (req.headers) {
    console.log('Authorization header:', req.headers.authorization);
    try {
      const token = req.headers.authorization.split(' ')[1]; // Assuming 'Bearer TOKEN'
      const decoded = await validateToken(token);
      return {
        user: decoded,
      };
    } catch (error) {
      console.error('Token validation error:', error);
      throw new UnauthorizedException('Unauthorized');
    }
  }
  throw new UnauthorizedException('No authentication token provided');
};
