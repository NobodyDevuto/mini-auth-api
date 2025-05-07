import { FastifyReply } from 'fastify';
import { validateSession } from '../services/sessionService';
import { AuthenticatedRequest } from '../interfaces/auth.interface';

export async function validateSessionMiddleware(request: AuthenticatedRequest, reply: FastifyReply) {
  const authorizationHeader = request.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith('Token ')) {
    return reply.status(401).send({ error: 'Invalid or missing session token' });
  }

  const token = authorizationHeader.split(' ')[1];

  request.sessionToken = token; 

  const email = request.user?.email;
  const isValidSession = await validateSession(email, token);

  if (!isValidSession) {
    return reply.status(401).send({ error: 'Unauthorized session' });
  }
}
