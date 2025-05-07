import { describe, it, expect } from 'vitest';
import { createSession, validateSession, endSession } from '../src/services/sessionService';

describe('Session Service', () => {
  it('should create a session', async () => {
    const email = 'test@example.com';
    const token = 'randomToken123';

    const created = await createSession(email, token);
    expect(created).toBe(true);
  });

  it('should validate an active session', async () => {
    const email = 'test@example.com';
    const token = 'randomToken123';

    await createSession(email, token);
    const isValid = await validateSession(email, token);
    expect(isValid).toBe(true);
  });

  it('should end a session', async () => {
    const email = 'test@example.com';
    const token = 'randomToken123';

    await createSession(email, token);
    const ended = await endSession(email, token);
    expect(ended).toBe(true);

    const isValidAfterEnd = await validateSession(email, token);
    expect(isValidAfterEnd).toBe(false);
  });
});
