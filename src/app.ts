import { FastifyInstance } from 'fastify'
import authRoutes from './routes/auth'


export default async function (fastify: FastifyInstance) {
  fastify.register(authRoutes)
}
