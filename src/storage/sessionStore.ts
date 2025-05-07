import { findUser, saveUsers } from './userRepository';

export async function validateSessionToken(email: string, token: string): Promise<boolean> {
  const user = await findUser(email);
  if (!user || !user.sessions[token]) return false;

  user.updateLastSeen(token);
  await saveUsers({ [email]: user });

  return true;
}
