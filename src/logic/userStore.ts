export const users: { [email: string]: { passwordHash: string; sessions: { [token: string]: { createdAt: number } } } } = {}
