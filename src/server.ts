import fastify from 'fastify'
import app from './app'

const server = fastify()

server.register(app)

server.listen({ port: 3000, host: '0.0.0.0' })
  .then((address) => {
    console.log(`Server listening at ${address}`)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
