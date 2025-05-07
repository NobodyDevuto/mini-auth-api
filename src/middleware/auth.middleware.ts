import { FastifyRequest, FastifyReply } from 'fastify';
import { findUser } from '../storage/userRepository';

export async function validateSession(request: FastifyRequest, reply: FastifyReply) {
  const token = request.headers.authorization?.split(' ')[1];
  if (!token) return reply.status(401).send({ error: 'Invalid or missing session token' });

  const users = await findUser(request.user?.email);
  if (!users || !users.sessions[token]) return reply.status(401).send({ error: 'Unauthorized' });

  users.sessions[token].lastSeen = Date.now();

  const sessionAge = Date.now() - users.sessions[token].createdAt;
  const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
  if (sessionAge > sevenDaysInMilliseconds) {
    delete users.sessions[token];
    return reply.status(401).send({ error: 'Session expired' });
  }

  return;
}