import { isTokenExpired } from '../utils/token';
import { findUser, saveUsers } from './userRepository';

export async function validateSessionToken(email: string, token: string): Promise<boolean> {
  const user = await findUser(email);
  if (!user || !user.sessions[token]) return false;

  if (isTokenExpired(user.sessions[token].createdAt)) {
    delete user.sessions[token]; // حذف نشست منقضی‌شده
    await saveUsers(user);
    return false;
  }

  user.sessions[token].lastSeen = Date.now();
  await saveUsers(user);
  return true;
}
