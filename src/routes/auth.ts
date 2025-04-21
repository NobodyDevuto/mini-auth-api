import { FastifyInstance } from 'fastify'
import { hashPassword, users, createSession, verifyPassword, verifySession, getUserFromSession, logout } from '../logic/auth'

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string }

    if (users[email]) {
      return reply.status(400).send({ error: 'User already exists' })
    }

    const hashedPassword = await hashPassword(password)
    users[email] = { passwordHash: hashedPassword, sessions: {} }

    return reply.status(201).send({ message: 'User registered successfully' })
  })

  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string }

    if (!users[email] || !(await verifyPassword(password, users[email].passwordHash))) {
      return reply.status(401).send({ error: 'Invalid email or password' })
    }

    const token = await createSession(email)
    return reply.status(200).send({ token })
  })

  fastify.get('/me', async (request, reply) => {
    const token = request.headers.authorization?.split(' ')[1]
    if (!token || !verifySession(token)) {
      return reply.status(401).send({ error: 'Invalid or missing session token' })
    }

    const userEmail = getUserFromSession(token)
    return reply.status(200).send({ email: userEmail })
  })

  fastify.post('/logout', async (request, reply) => {
    const token = request.headers.authorization?.split(' ')[1]
    if (!token || !verifySession(token)) {
      return reply.status(401).send({ error: 'Invalid or missing session token' })
    }

    logout(token)
    return reply.status(200).send({ message: 'Logged out successfully' })
  })
}
