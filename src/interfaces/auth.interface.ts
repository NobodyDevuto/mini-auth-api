import { FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user?: { email: string };
    sessionToken?: string;
  }
}
export interface AuthenticatedRequest extends FastifyRequest {
    user: { email: string };
    sessionToken: string;
  }
  