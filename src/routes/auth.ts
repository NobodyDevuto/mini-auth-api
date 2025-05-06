import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { registerUser, loginUser, getUserProfile, logoutUser } from '../services/authService';
import { validateSession } from '../middleware/auth.middleware';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => registerUser(request, reply));
  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => loginUser(request, reply));
  fastify.get('/me', { preHandler: validateSession }, async (request: FastifyRequest, reply: FastifyReply) => getUserProfile(request, reply));
  fastify.post('/logout', { preHandler: validateSession }, async (request: FastifyRequest, reply: FastifyReply) => logoutUser(request, reply));
}
