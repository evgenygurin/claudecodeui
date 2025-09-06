import { createError } from '@/utils/error-handler';
/**
 * HTTP client utilities
 */

import { logger } from './logger';

export interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

export class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = '', defaultHeaders: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
  }

  private async makeRequest<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const { timeout = 10000, retries = 3, headers = {}, ...fetchOptions } = options;

    const fullUrl = `${this.baseUrl}${url}`;
    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(fullUrl, {
          ...fetchOptions,
          headers: requestHeaders,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw createError(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error as Error;

        if (attempt < retries) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          logger.warn(`Request failed, retrying in ${delay}ms`, {
            context: 'HttpClient.makeRequest',
            attempt: attempt + 1,
            retries,
            error: lastError.message,
          });
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Request failed after all retries');
  }

  async get<T>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.makeRequest<T>(url, { ...options, method: 'GET' });
  }

  async post<T>(url: string, data?: unknown, options: RequestOptions = {}): Promise<T> {
    return this.makeRequest<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
    });
  }

  async put<T>(url: string, data?: unknown, options: RequestOptions = {}): Promise<T> {
    return this.makeRequest<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
    });
  }

  async delete<T>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.makeRequest<T>(url, { ...options, method: 'DELETE' });
  }

  setHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  removeHeader(key: string): void {
    delete this.defaultHeaders[key];
  }
}

// Default HTTP client instance
export const httpClient = new HttpClient();
