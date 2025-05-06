import { promises as fs } from 'fs';

const FILE_PATH = 'src/storage/users.json';

async function loadUsers(): Promise<Record<string, any>> {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf-8');
    return JSON.parse(data) || {};
  } catch {
    return {};
  }
}

async function saveUsers(users: Record<string, any>) {
  await fs.writeFile(FILE_PATH, JSON.stringify(users, null, 2));
}

export async function createUser(email: string, passwordHash: string) {
  const users = await loadUsers();
  users[email] = { passwordHash, sessions: {} };
  await saveUsers(users);
}

export async function findUser(email: string) {
  const users = await loadUsers();
  return users[email] || null;
}

export async function saveSession(email: string, token: string) {
  const users = await loadUsers();
  if (!users[email]) return;
  users[email].sessions[token] = { createdAt: Date.now(), lastSeen: Date.now() };
  await saveUsers(users);
}

export async function removeSession(email: string, token: string) {
  const users = await loadUsers();
  if (users[email]?.sessions[token]) {
    delete users[email].sessions[token];
    await saveUsers(users);
  }
}
