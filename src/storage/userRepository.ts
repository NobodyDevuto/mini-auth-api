import { promises as fs } from 'fs';
import { User } from '../models/user';

const FILE_PATH = 'src/storage/users.json';

async function loadUsers(): Promise<Record<string, User>> {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf-8');
    const rawUsers = JSON.parse(data) || {};
    const users: Record<string, User> = {};

    for (const email in rawUsers) {
      const { passwordHash, sessions } = rawUsers[email];
      users[email] = new User(email, passwordHash);
      users[email].sessions = sessions;
    }

    return users;
  } catch {
    return {};
  }
}

export async function saveUsers(users: Record<string, User>) {
  await fs.writeFile(FILE_PATH, JSON.stringify(users, null, 2));
}

export async function createUser(email: string, passwordHash: string) {
  const users = await loadUsers();
  users[email] = new User(email, passwordHash);
  await saveUsers(users);
}

export async function findUser(email: string): Promise<User | null> {
  const users = await loadUsers();
  return users[email] || null;
}
