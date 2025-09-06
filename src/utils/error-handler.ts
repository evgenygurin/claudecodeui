/**
 * Error handling utilities
 */

/**
 * Creates a standardized error message from an unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as any).message);
  }
  return 'Unknown error';
}

/**
 * Creates a standardized error with a custom prefix
 */
export function createError(prefix: string, error?: unknown): Error {
  const message = getErrorMessage(error);
  return new Error(`${prefix}: ${message}`);
}

/**
 * Common error prefixes for different operations
 */
export const ERROR_PREFIXES = {
  LOGIN_FAILED: 'Login failed',
  TOKEN_REFRESH_FAILED: 'Token refresh failed',
  FETCH_SESSIONS_FAILED: 'Failed to fetch sessions',
  FETCH_SESSION_FAILED: 'Failed to fetch session',
  CREATE_SESSION_FAILED: 'Failed to create session',
  UPDATE_SESSION_FAILED: 'Failed to update session',
  DELETE_SESSION_FAILED: 'Failed to delete session',
  SEND_MESSAGE_FAILED: 'Failed to send message',
  FETCH_HISTORY_FAILED: 'Failed to fetch session history',
  FETCH_PROVIDERS_FAILED: 'Failed to fetch providers',
  FETCH_PROVIDER_STATUS_FAILED: 'Failed to fetch provider status',
  PARSE_STREAM_DATA_FAILED: 'Failed to parse stream data',
} as const;
