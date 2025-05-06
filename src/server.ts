import Fastify from 'fastify';
import { authRoutes } from './routes/auth';

const fastify = Fastify({ logger: true });

fastify.register(authRoutes);

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server running at ${address}`);
});
