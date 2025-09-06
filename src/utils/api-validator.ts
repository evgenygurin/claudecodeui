import { createError } from '@/utils/error-handler';
/**
 * API response validation utilities
 */

import { z } from 'zod';

/**
 * Validates API response and throws error if invalid
 */
export function validateApiResponse<T>(
  response: Response,
  schema: z.ZodSchema<T>,
  context: string
): T {
  if (!response.ok) {
    throw createError(`API request failed: ${response.status} ${response.statusText}`);
  }

  try {
    return schema.parse(response);
  } catch (error) {
    throw createError(`Invalid API response in ${context}: ${error}`);
  }
}

/**
 * Common API response schemas
 */
export const apiSchemas = {
  success: z.object({
    success: z.boolean(),
    data: z.unknown(),
    message: z.string().optional(),
  }),

  error: z.object({
    success: z.literal(false),
    error: z.string(),
    message: z.string().optional(),
  }),

  paginated: z.object({
    data: z.array(z.unknown()),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
  }),
} as const;

/**
 * Safe JSON parsing with error handling
 */
export function safeJsonParse<T>(json: string, context: string): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    throw createError(`Failed to parse JSON in ${context}: ${error}`);
  }
}
