import { expect, describe, it, beforeAll } from 'vitest'
import fastify from 'fastify'
import app from '../src/app'

const server = fastify()

beforeAll(async () => {
  await server.register(app)
})

describe('Authentication routes', () => {
  it('should register a user successfully', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/register',
      payload: { email: 'user@example.com', password: 'securePassword123' },
    })
    expect(response.statusCode).toBe(201)
    expect(JSON.parse(response.body)).toEqual(
      expect.objectContaining({ message: 'User registered successfully' })
    )
  })

  it('should login successfully', async () => {
    await server.inject({
      method: 'POST',
      url: '/register',
      payload: { email: 'user@example.com', password: 'securePassword123' },
    })

    const response = await server.inject({
      method: 'POST',
      url: '/login',
      payload: { email: 'user@example.com', password: 'securePassword123' },
    })
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toHaveProperty('token')
  })

  it('should return 401 for invalid login', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/login',
      payload: { email: 'wronguser@example.com', password: 'wrongPassword' },
    })
    expect(response.statusCode).toBe(401)
  })

  it('should get user info', async () => {
    await server.inject({
      method: 'POST',
      url: '/register',
      payload: { email: 'user@example.com', password: 'securePassword123' },
    })

    const loginResponse = await server.inject({
      method: 'POST',
      url: '/login',
      payload: { email: 'user@example.com', password: 'securePassword123' },
    })

    const token = JSON.parse(loginResponse.body).token

    const response = await server.inject({
      method: 'GET',
      url: '/me',
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual(
      expect.objectContaining({ email: 'user@example.com' })
    )
  })
})
