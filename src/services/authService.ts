import { FastifyRequest, FastifyReply } from 'fastify';
import { createUser, findUser } from '../storage/userRepository';
import { createSession, validateSession, endSession } from './sessionService';
import { hashPassword, verifyPassword, generateSessionToken } from '../utils/crypto';

class AuthService {
  async registerUser(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { email, password } = request.body as { email: string, password: string };
    const userExists = await findUser(email);
    if (userExists) {
      reply.status(400).send({ error: 'User already exists' });
      return;
    }

    const hashedPassword = hashPassword(password);
    await createUser(email, hashedPassword);
    reply.status(201).send({ message: 'User registered successfully' });
  }

  async loginUser(request: FastifyRequest, reply: FastifyReply): Promise<{ token?: string; error?: string }> {
    const { email, password } = request.body as { email: string, password: string };
    const user = await findUser(email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      reply.status(401).send({ error: 'Invalid email or password' });
      return { error: 'Invalid email or password' };
    }

    const token = generateSessionToken();
    const sessionCreated = await createSession(email, token);
    if (!sessionCreated) {
      return { error: 'Failed to create session' };
    }

    return { token };
  }

  async getUserProfile(request: FastifyRequest, reply: FastifyReply): Promise<{ email: string } | { error: string }> {
    const email = request.user?.email;
    const token = request.sessionToken;

    if (!email || !token) {
      return { error: 'Missing session data' };
    }

    const isValidSession = await validateSession(email, token);
    if (!isValidSession) {
      return { error: 'Session expired or invalid' };
    }

    return { email };
  }

  async logoutUser(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const email = request.user?.email;
    const token = request.sessionToken;

    if (!email || !token) {
      reply.status(400).send({ error: 'Invalid request data' });
      return;
    }

    const sessionEnded = await endSession(email, token);
    if (!sessionEnded) {
      reply.status(500).send({ error: 'Failed to end session' });
      return;
    }

    reply.status(200).send({ message: 'Logged out successfully' });
  }
}

export default new AuthService();
