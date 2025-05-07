import { FastifyRequest, FastifyReply } from 'fastify';
import { validateSessionToken } from '../storage/sessionStore';

export async function validateSession(request: FastifyRequest, reply: FastifyReply) {
  const authorizationHeader = request.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith('Token ')) {
    return reply.status(401).send({ error: 'Invalid or missing session token' });
  }

  const token = authorizationHeader.split(' ')[1];
  const email = request.user?.email;

  const isValid = await validateSessionToken(email, token);
  if (!isValid) {
    return reply.status(401).send({ error: 'Unauthorized session' });
  }

  request.sessionToken = token;
}
