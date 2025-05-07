// Auth tests 
import { describe, it, expect } from 'vitest';
import { registerUser, loginUser } from '../src/services/authService';

describe('Authentication Service', () => {
  it('should register a new user successfully', async () => {
    const response = await registerUser({ body: { email: 'test@example.com', password: 'securePass' } }, {});
    expect(response.status).toBe(201);
  });

  it('should not allow duplicate registrations', async () => {
    await registerUser({ body: { email: 'test@example.com', password: 'securePass' } }, {});
    const response = await registerUser({ body: { email: 'test@example.com', password: 'newPass' } }, {});
    expect(response.status).toBe(400);
  });

  it('should login user with correct credentials', async () => {
    const response = await loginUser({ body: { email: 'test@example.com', password: 'securePass' } }, {});
    expect(response.status).toBe(200);
    expect(response.token).toBeDefined();
  });
});
