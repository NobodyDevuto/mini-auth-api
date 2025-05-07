import { FastifyRequest, FastifyReply } from 'fastify';
import { promises as fs } from 'fs';

const LOG_FILE_PATH = 'logs/app.log';

export async function requestLogger(request: FastifyRequest, reply: FastifyReply) {
  const logEntry = `[${new Date().toISOString()}] ${request.method} ${request.url}\n`;

  try {
    await fs.appendFile(LOG_FILE_PATH, logEntry);
  } catch (error) {
    console.error('Failed to write log:', error);
  }
}
