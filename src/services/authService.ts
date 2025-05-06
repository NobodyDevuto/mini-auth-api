import { FastifyRequest, FastifyReply } from 'fastify';
import { createUser, findUser, saveSession, removeSession } from '../storage/userRepository';
import { hashPassword, verifyPassword, generateSessionToken } from '../utils/crypto';

export async function registerUser(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = request.body as { email: string, password: string };
  if (findUser(email)) return reply.status(400).send({ error: 'User already exists' });

  const hashedPassword = hashPassword(password);
  createUser(email, hashedPassword);
  return reply.status(201).send({ message: 'User registered successfully' });
}

export async function loginUser(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = request.body as { email: string, password: string };
  const user = findUser(email);
  if (!user || !verifyPassword(password, user.passwordHash)) return reply.status(401).send({ error: 'Invalid email or password' });

  const token = generateSessionToken();
  saveSession(email, token);
  return reply.status(200).send({ token });
}

export async function getUserProfile(request: FastifyRequest, reply: FastifyReply) {
  return reply.status(200).send({ email: request.user.email });
}

export async function logoutUser(request: FastifyRequest, reply: FastifyReply) {
  removeSession(request.user.email, request.sessionToken);
  return reply.status(200).send({ message: 'Logged out successfully' });
}
