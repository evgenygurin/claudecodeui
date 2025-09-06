/**
 * Authentication Service
 * Handles user authentication, JWT tokens, and session management
 */

import { EventBus } from '@/events/event-bus';
import { eventFactories } from '@/events/events';
import { LoginCredentials, AuthResult, JwtPayload, User } from '@/types';
import { createError, ERROR_PREFIXES } from '@/utils/error-handler';
import { logger } from '@/utils/logger';
import { z } from 'zod';

// Validation schemas
const loginCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const authResultSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    preferences: z.object({
      theme: z.enum(['light', 'dark', 'system']),
      language: z.string(),
      fontSize: z.number(),
      autoSave: z.boolean(),
      notifications: z.boolean(),
    }),
  }),
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
});

const jwtPayloadSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  type: z.enum(['access', 'refresh']),
  iat: z.number(),
  exp: z.number(),
  iss: z.string().optional(),
  aud: z.string().optional(),
});

export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes
  private refreshPromise: Promise<string> | null = null;

  constructor(private eventBus?: EventBus) {}

  /**
   * Initialize the service
   */
  async initialize(): Promise<void> {
    // Set up automatic token refresh
    this.setupTokenRefresh();

    // Emit system ready event
    if (this.eventBus) {
      await this.eventBus.emit('system.ready', { service: 'AuthService' });
    }
  }

  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      // Validate input
      const validatedCredentials = loginCredentialsSchema.parse(credentials);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedCredentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw createError(errorData.message || 'Authentication failed');
      }

      const result = await response.json();
      const validatedResult = authResultSchema.parse(result);

      // Store tokens securely
      this.storeTokens(validatedResult.accessToken, validatedResult.refreshToken);

      // Emit login event
      if (this.eventBus) {
        await this.eventBus.emitAppEvent(
          eventFactories.userLoggedIn(validatedResult.user.id, validatedResult.user.email)
        );
      }

      return validatedResult;
    } catch (error) {
      // Emit error event
      if (this.eventBus) {
        await this.eventBus.emitAppEvent(
          eventFactories.errorOccurred(
            error instanceof Error ? error : new Error('Login failed'),
            'AuthService.login'
          )
        );
      }

      throw createError(ERROR_PREFIXES.LOGIN_FAILED, error);
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(token?: string): Promise<string> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = token || this.getRefreshToken();
    if (!refreshToken) {
      throw createError('No refresh token available');
    }

    this.refreshPromise = this.performTokenRefresh(refreshToken);

    try {
      const newAccessToken = await this.refreshPromise;
      return newAccessToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Perform the actual token refresh
   */
  private async performTokenRefresh(refreshToken: string): Promise<string> {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (!response.ok) {
        throw createError('Token refresh failed');
      }

      const result = await response.json();
      const { accessToken } = z.object({ accessToken: z.string() }).parse(result);

      this.storeAccessToken(accessToken);

      // Emit token refreshed event
      if (this.eventBus) {
        const user = this.getCurrentUser();
        if (user) {
          await this.eventBus.emitAppEvent(eventFactories.tokenRefreshed(user.id));
        }
      }

      return accessToken;
    } catch (error) {
      // Emit error event
      if (this.eventBus) {
        await this.eventBus.emitAppEvent(
          eventFactories.errorOccurred(
            error instanceof Error ? error : new Error('Token refresh failed'),
            'AuthService.refreshToken'
          )
        );
      }

      throw createError(ERROR_PREFIXES.TOKEN_REFRESH_FAILED, error);
    }
  }

  /**
   * Logout user and invalidate tokens
   */
  async logout(token?: string): Promise<void> {
    const accessToken = token || this.getAccessToken();
    const user = this.getCurrentUser();

    try {
      if (accessToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
    } catch (error) {
      // Emit error event but don't throw - logout should always succeed locally
      if (this.eventBus) {
        await this.eventBus.emitAppEvent(
          eventFactories.errorOccurred(
            error instanceof Error ? error : new Error('Logout error'),
            'AuthService.logout'
          )
        );
      }
    } finally {
      this.clearTokens();

      // Emit logout event
      if (this.eventBus && user) {
        await this.eventBus.emitAppEvent(eventFactories.userLoggedOut(user.id));
      }
    }
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Get current refresh token
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const payload = this.parseJwt(token);
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  /**
   * Get current user from token
   */
  getCurrentUser(): { id: string; email: string; name: string } | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const payload = this.parseJwt(token);
      return {
        id: payload.userId,
        email: payload.email,
        name: payload.email,
      };
    } catch {
      return null;
    }
  }

  /**
   * Store tokens securely
   */
  private storeTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  /**
   * Store access token
   */
  private storeAccessToken(accessToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
  }

  /**
   * Clear all tokens
   */
  private clearTokens(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Parse JWT token
   */
  private parseJwt(token: string): JwtPayload {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join('')
      );

      const payload = JSON.parse(jsonPayload);
      return jwtPayloadSchema.parse(payload);
    } catch (error) {
      throw createError('Invalid JWT token');
    }
  }

  /**
   * Check if token needs refresh
   */
  private needsRefresh(token: string): boolean {
    try {
      const payload = this.parseJwt(token);
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();

      return expirationTime - currentTime < this.TOKEN_REFRESH_THRESHOLD;
    } catch {
      return true; // If we can't parse the token, assume it needs refresh
    }
  }

  /**
   * Setup automatic token refresh
   */
  private setupTokenRefresh(): void {
    if (typeof window === 'undefined') return;

    // Check token every minute
    setInterval(async () => {
      const token = this.getAccessToken();
      if (token && this.needsRefresh(token)) {
        try {
          await this.refreshToken();
        } catch (error) {
          // If refresh fails, logout user
          await this.logout();
        }
      }
    }, 60 * 1000);
  }

  /**
   * Get token expiration time
   */
  getTokenExpiration(): Date | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const payload = this.parseJwt(token);
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const expiration = this.getTokenExpiration();
    return expiration ? expiration <= new Date() : true;
  }

  /**
   * Get time until token expires
   */
  getTimeUntilExpiration(): number | null {
    const expiration = this.getTokenExpiration();
    if (!expiration) return null;

    return Math.max(0, expiration.getTime() - Date.now());
  }

  /**
   * Validate token format
   */
  isValidTokenFormat(token: string): boolean {
    try {
      const parts = token.split('.');
      return parts.length === 3 && parts.every(part => part.length > 0);
    } catch {
      return false;
    }
  }

  /**
   * Get authentication status with details
   */
  getAuthStatus(): {
    isAuthenticated: boolean;
    isTokenExpired: boolean;
    timeUntilExpiration: number | null;
    user: User | null;
  } {
    const isAuthenticated = this.isAuthenticated();
    const isTokenExpired = this.isTokenExpired();
    const timeUntilExpiration = this.getTimeUntilExpiration();
    const user = this.getCurrentUser();

    return {
      isAuthenticated,
      isTokenExpired,
      timeUntilExpiration,
      user: user
        ? {
            ...user,
            preferences: {
              theme: 'system' as const,
              language: 'en',
              fontSize: 14,
              autoSave: true,
              notifications: true,
            },
          }
        : null,
    };
  }

  /**
   * Force token refresh
   */
  async forceRefresh(): Promise<string> {
    this.refreshPromise = null; // Clear any existing refresh promise
    return this.refreshToken();
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    this.refreshPromise = null;
    // Additional cleanup if needed
  }
}

// Export singleton instance (for backward compatibility)
export const authService = new AuthService();
