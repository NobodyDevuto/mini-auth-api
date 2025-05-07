import Fastify from 'fastify';
import { authRoutes } from './routes/auth';
import { requestLogger } from './middleware/logging.middleware';

export function createApp() {
  const fastify = Fastify({ logger: true });

  // ثبت میدلور برای لاگ‌گیری درخواست‌ها
  fastify.addHook('onRequest', requestLogger);

  // ثبت مسیرهای احراز هویت
  fastify.register(authRoutes);

  return fastify;
}
