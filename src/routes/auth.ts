import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { registerUser, loginUser, getUserProfile, logoutUser } from '../services/authService';
import { validateSession } from '../middleware/auth.middleware';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', async (request, reply) => registerUser(request, reply));
  fastify.post('/login', async (request, reply) => loginUser(request, reply));
  fastify.get('/me', { preHandler: validateSession }, async (request, reply) => getUserProfile(request, reply));
  fastify.post('/logout', { preHandler: validateSession }, async (request, reply) => logoutUser(request, reply));
}
