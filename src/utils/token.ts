import {randomBytes } from 'crypto';

export function isTokenExpired(createdAt: number, expirationDays: number = 7): boolean {
    const expirationTime = expirationDays * 24 * 60 * 60 * 1000; 
    return Date.now() - createdAt > expirationTime;
  }
  export function generateSessionToken(): string {
    return randomBytes(32).toString('hex');
  }
  