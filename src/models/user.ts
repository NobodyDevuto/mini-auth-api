export class User {
    email: string;
    passwordHash: string;
    sessions: Record<string, { createdAt: number; lastSeen: number }>;
  
    constructor(email: string, passwordHash: string) {
      this.email = email;
      this.passwordHash = passwordHash;
      this.sessions = {};
    }
  
    addSession(token: string) {
      this.sessions[token] = { createdAt: Date.now(), lastSeen: Date.now() };
    }
  
    removeSession(token: string) {
      delete this.sessions[token];
    }
  
    updateLastSeen(token: string) {
      if (this.sessions[token]) {
        this.sessions[token].lastSeen = Date.now();
      }
    }
  }
  