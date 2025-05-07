import { findUser, saveUsers } from '../storage/userRepository';

export async function createSession(email: string, token: string): Promise<boolean> {
  const user = await findUser(email);
  if (!user) return false;

  user.addSession(token);
  await saveUsers({ [email]: user });

  return user.sessions[token] ? true : false; 
}

export async function validateSession(email: string, token: string): Promise<boolean> {
  const user = await findUser(email);
  if (!user || !user.sessions[token]) return false;

  user.updateLastSeen(token);
  await saveUsers({ [email]: user });

  return true;
}

export async function endSession(email: string, token: string): Promise<boolean> {
  const user = await findUser(email);
  if (!user) return false;

  user.removeSession(token);
  await saveUsers({ [email]: user });

  return !user.sessions[token]; // بررسی موفقیت حذف نشست
}
