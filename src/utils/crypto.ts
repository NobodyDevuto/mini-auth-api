import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hashed = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hashed}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':');
  const hashedAttempt = scryptSync(password, salt, 64);
  return timingSafeEqual(Buffer.from(hashedAttempt.toString('hex')), Buffer.from(hash));
}


