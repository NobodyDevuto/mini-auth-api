import { FastifyInstance } from 'fastify';
import AuthService from '../services/authService';
import { validateSessionMiddleware } from '../middleware/auth.middleware';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', async (request, reply) => AuthService.registerUser(request, reply));
  fastify.post('/login', async (request, reply) => AuthService.loginUser(request, reply));
  fastify.get('/me', { preHandler: validateSessionMiddleware }, async (request, reply) => AuthService.getUserProfile(request, reply));
  fastify.post('/logout', { preHandler: validateSessionMiddleware }, async (request, reply) => AuthService.logoutUser(request, reply));
}
