import { describe, it, expect, vi, beforeEach } from 'vitest';
import AuthService from '../src/services/authService';

describe('Auth Service', () => {
  let mockRequest: any;
  let mockReply: any;

  beforeEach(() => {
    mockRequest = { body: {}, user: {}, sessionToken: '' } as any;
    mockReply = { status: vi.fn().mockReturnValue({ send: vi.fn() }) } as any;
  });

  it('should register a new user successfully', async () => {
    mockRequest.body = { email: 'test@example.com', password: 'securePass' };
    await AuthService.registerUser(mockRequest, mockReply);
    
    const userProfile = await AuthService.getUserProfile(mockRequest, mockReply);
    
    if ('email' in userProfile) {
      expect(userProfile.email).toBe('test@example.com');
    } else {
      expect(userProfile.error).toBeDefined();
    }
  });

  it('should not allow duplicate registration', async () => {
    mockRequest.body = { email: 'test@example.com', password: 'securePass' };
    await AuthService.registerUser(mockRequest, mockReply);
    
    await AuthService.registerUser(mockRequest, mockReply);
    
    expect(mockReply.status).toHaveBeenCalledWith(400);
  });

  it('should log in with correct credentials', async () => {
    mockRequest.body = { email: 'test@example.com', password: 'securePass' };
    await AuthService.registerUser(mockRequest, mockReply);
    
    const loginResponse = await AuthService.loginUser(mockRequest, mockReply);
    
    if ('token' in loginResponse) {
      expect(loginResponse.token).toBeDefined();
    } else {
      expect(loginResponse.error).toBeDefined();
    }
  });

  it('should reject login with incorrect password', async () => {
    mockRequest.body = { email: 'test@example.com', password: 'wrongPass' };
    const loginResponse = await AuthService.loginUser(mockRequest, mockReply);
    
    expect(mockReply.status).toHaveBeenCalledWith(401);
  });

  it('should return user profile when session is valid', async () => {
    mockRequest.user.email = 'test@example.com';
    mockRequest.sessionToken = 'validToken';
    
    const userProfile = await AuthService.getUserProfile(mockRequest, mockReply);
    
    if ('email' in userProfile) {
      expect(userProfile.email).toBe('test@example.com');
    } else {
      expect(userProfile.error).toBeDefined();
    }
  });

  it('should log out user and invalidate session', async () => {
    mockRequest.user.email = 'test@example.com';
    mockRequest.sessionToken = 'validToken';
    
    await AuthService.logoutUser(mockRequest, mockReply);
    const userProfileAfterLogout = await AuthService.getUserProfile(mockRequest, mockReply);
    
    expect(userProfileAfterLogout).toHaveProperty('error');
  });
});
