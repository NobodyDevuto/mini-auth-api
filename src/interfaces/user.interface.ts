export interface User {
    email: string;
    passwordHash: string;
    sessions: Record<string, { createdAt: number; lastSeen: number }>;
  }
  