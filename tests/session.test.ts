import { describe, it, expect } from 'vitest';
import { generateSessionToken, isTokenExpired } from '../src/utils/token';

describe('Session Token Management', () => {
  it('should generate a valid session token', () => {
    const token = generateSessionToken();
    expect(token).toBeDefined();
    expect(token.length).toBeGreaterThan(10); // حداقل مقدار مناسب
  });

  it('should correctly detect expired sessions', () => {
    const createdAt = Date.now() - (8 * 24 * 60 * 60 * 1000); // ۸ روز پیش
    expect(isTokenExpired(createdAt, 7)).toBe(true);
  });

  it('should correctly validate active sessions', () => {
    const createdAt = Date.now() - (5 * 24 * 60 * 60 * 1000); // ۵ روز پیش
    expect(isTokenExpired(createdAt, 7)).toBe(false);
  });
});
