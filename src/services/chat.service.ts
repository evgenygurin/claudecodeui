/**
 * Chat Service
 * Handles chat sessions, message management, and AI provider integration
 */

import { EventBus } from '@/events/event-bus';
import { eventFactories } from '@/events/events';
import {
  Session,
  Message,
  AIProvider,
  CreateSessionDto,
  UpdateSessionDto,
  ChatResponse,
  SendMessageDto,
  SessionRepository,
} from '@/types';
import { createError, ERROR_PREFIXES, getErrorMessage } from '@/utils/error-handler';
import { logger } from '@/utils/logger';
import { z } from 'zod';
import { claudeCLIService } from './claude-cli.service';

// Validation schemas
const createSessionDtoSchema = z.object({
  title: z.string().min(1).max(200),
  provider: z.enum(['claude', 'cursor', 'codegen']),
  projectId: z.string().min(1),
});

const updateSessionDtoSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  status: z.enum(['active', 'archived', 'deleted']).optional(),
});

const sendMessageDtoSchema = z.object({
  content: z.string().min(1).max(10000),
  role: z.enum(['user', 'assistant', 'system']),
  sessionId: z.string().min(1),
  provider: z.enum(['claude', 'cursor', 'codegen']),
});

const chatResponseSchema = z.object({
  message: z.object({
    id: z.string(),
    content: z.string(),
    role: z.enum(['user', 'assistant', 'system']),
    timestamp: z.date(),
    sessionId: z.string(),
  }),
  session: z.object({
    id: z.string(),
    title: z.string(),
    projectId: z.string(),
    provider: z.string(),
    status: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
  metadata: z
    .object({
      tokens: z.number().optional(),
      model: z.string().optional(),
      tools: z.array(z.string()).optional(),
      processingTime: z.number().optional(),
    })
    .optional(),
});

export class ChatService {
  private readonly API_BASE = '/api/chat';
  private activeStreams = new Map<string, ReadableStreamDefaultReader>();
  private messageQueue: Array<{ sessionId: string; message: SendMessageDto }> = [];
  private isProcessingQueue = false;

  constructor(
    private sessionRepository?: SessionRepository,
    private eventBus?: EventBus
  ) {}

  /**
   * Initialize the service
   */
  async initialize(): Promise<void> {
    // Start processing message queue
    this.startQueueProcessor();

    // Emit system ready event
    if (this.eventBus) {
      await this.eventBus.emit('system.ready', { service: 'ChatService' });
    }
  }

  /**
   * Get all sessions for a project
   */
  async getSessionsByProject(projectId: string): Promise<Session[]> {
    try {
      const response = await fetch(`${this.API_BASE}/sessions?projectId=${projectId}`);

      if (!response.ok) {
        throw createError('Failed to fetch sessions');
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      logger.error('Error fetching sessions', { context: 'ChatService.fetchSessions', error });
      throw createError(ERROR_PREFIXES.FETCH_SESSIONS_FAILED, error);
    }
  }

  /**
   * Get session by ID
   */
  async getSessionById(id: string): Promise<Session | null> {
    try {
      const response = await fetch(`${this.API_BASE}/sessions/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw createError('Failed to fetch session');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      logger.error('Error fetching session', { context: 'ChatService.fetchSession', error });
      throw createError(ERROR_PREFIXES.FETCH_SESSION_FAILED, error);
    }
  }

  /**
   * Create new session
   */
  async createSession(sessionData: CreateSessionDto): Promise<Session> {
    try {
      const response = await fetch(`${this.API_BASE}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        throw createError('Failed to create session');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      logger.error('Error creating session', { context: 'ChatService.createSession', error });
      throw createError(ERROR_PREFIXES.CREATE_SESSION_FAILED, error);
    }
  }

  /**
   * Update session
   */
  async updateSession(id: string, sessionData: UpdateSessionDto): Promise<Session> {
    try {
      const response = await fetch(`${this.API_BASE}/sessions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        throw createError('Failed to update session');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      logger.error('Error updating session', { context: 'ChatService.updateSession', error });
      throw createError(ERROR_PREFIXES.UPDATE_SESSION_FAILED, error);
    }
  }

  /**
   * Delete session
   */
  async deleteSession(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/sessions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw createError('Failed to delete session');
      }
    } catch (error) {
      logger.error('Error deleting session', { context: 'ChatService.deleteSession', error });
      throw createError(ERROR_PREFIXES.DELETE_SESSION_FAILED, error);
    }
  }

  /**
   * Send message to AI provider
   */
  async sendMessage(messageData: SendMessageDto): Promise<ChatResponse> {
    try {
      // Validate input
      const validatedData = sendMessageDtoSchema.parse(messageData);

      // Use real Claude CLI service instead of mock API
      if (validatedData.provider === 'claude') {
        const claudeResponse = await claudeCLIService.sendMessage(validatedData.content);
        const session = await this.getSessionById(validatedData.sessionId);

        if (!session) {
          throw createError('Session not found');
        }

        const message: Message = {
          id: this.generateMessageId(),
          content: claudeResponse.content,
          role: 'assistant',
          timestamp: new Date().toISOString(),
          sessionId: validatedData.sessionId,
          provider: 'claude',
          metadata: {
            isComplete: claudeResponse.isComplete,
            // error: claudeResponse.error, // Removed as it's not in the interface
          },
        };

        return {
          message,
          session,
        };
      }

      // Fallback to API for other providers
      const response = await fetch(`${this.API_BASE}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        throw createError('Failed to send message');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      logger.error('Error sending message', { error: getErrorMessage(error), messageData });
      throw createError(ERROR_PREFIXES.SEND_MESSAGE_FAILED, error);
    }
  }

  /**
   * Get session history with pagination
   */
  async getSessionHistory(
    sessionId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{
    messages: Message[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const response = await fetch(
        `${this.API_BASE}/sessions/${sessionId}/messages?page=${page}&limit=${limit}`
      );

      if (!response.ok) {
        throw createError('Failed to fetch session history');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      logger.error('Error fetching session history', {
        context: 'ChatService.fetchSessionHistory',
        error,
      });
      throw createError(ERROR_PREFIXES.FETCH_HISTORY_FAILED, error);
    }
  }

  /**
   * Stream message response (for real-time chat)
   */
  async streamMessage(
    messageData: SendMessageDto,
    onChunk: (chunk: string) => void,
    onComplete: (response: ChatResponse) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/messages/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw createError('Failed to start message stream');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw createError('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            if (data === '[DONE]') {
              return;
            }

            try {
              const parsed = JSON.parse(data);

              if (parsed.type === 'chunk') {
                onChunk(parsed.content);
              } else if (parsed.type === 'complete') {
                onComplete(parsed.response);
                return;
              } else if (parsed.type === 'error') {
                onError(new Error(parsed.error));
                return;
              }
            } catch (parseError) {
              logger.error('Error parsing stream data', {
                context: 'ChatService.streamMessage',
                error: parseError,
              });
            }
          }
        }
      }
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  /**
   * Get available AI providers
   */
  async getAvailableProviders(): Promise<AIProvider[]> {
    try {
      const response = await fetch(`${this.API_BASE}/providers`);

      if (!response.ok) {
        throw createError('Failed to fetch providers');
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      logger.error('Error fetching providers', { context: 'ChatService.fetchProviders', error });
      throw createError(ERROR_PREFIXES.FETCH_PROVIDERS_FAILED, error);
    }
  }

  /**
   * Get provider status
   */
  async getProviderStatus(provider: AIProvider): Promise<{
    available: boolean;
    status: 'online' | 'offline' | 'error';
    message?: string;
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/providers/${provider}/status`);

      if (!response.ok) {
        throw createError('Failed to fetch provider status');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      logger.error('Error fetching provider status', {
        context: 'ChatService.fetchProviderStatus',
        error,
      });
      throw createError(ERROR_PREFIXES.FETCH_PROVIDER_STATUS_FAILED, error);
    }
  }

  /**
   * Queue message for processing
   */
  queueMessage(sessionId: string, message: SendMessageDto): void {
    this.messageQueue.push({ sessionId, message });
  }

  /**
   * Start processing message queue
   */
  private startQueueProcessor(): void {
    if (this.isProcessingQueue) return;

    this.isProcessingQueue = true;
    this.processQueue();
  }

  /**
   * Process message queue
   */
  private async processQueue(): Promise<void> {
    while (this.isProcessingQueue) {
      if (this.messageQueue.length > 0) {
        const { sessionId, message } = this.messageQueue.shift()!;

        try {
          await this.sendMessage(message);
        } catch (error) {
          // Emit error event
          if (this.eventBus) {
            await this.eventBus.emitAppEvent(
              eventFactories.errorOccurred(
                error instanceof Error ? error : new Error('Failed to process queued message'),
                'ChatService.processQueue'
              )
            );
          }
        }
      } else {
        // Wait a bit before checking again
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  /**
   * Stop processing message queue
   */
  stopQueueProcessor(): void {
    this.isProcessingQueue = false;
  }

  /**
   * Cancel active stream
   */
  cancelStream(sessionId: string): void {
    const reader = this.activeStreams.get(sessionId);
    if (reader) {
      reader.cancel();
      this.activeStreams.delete(sessionId);
    }
  }

  /**
   * Get active streams
   */
  getActiveStreams(): string[] {
    return Array.from(this.activeStreams.keys());
  }

  /**
   * Get queue status
   */
  getQueueStatus(): {
    length: number;
    isProcessing: boolean;
  } {
    return {
      length: this.messageQueue.length,
      isProcessing: this.isProcessingQueue,
    };
  }

  /**
   * Clear message queue
   */
  clearQueue(): void {
    this.messageQueue = [];
  }

  /**
   * Validate message data
   */
  private validateMessage(message: any): SendMessageDto {
    try {
      return sendMessageDtoSchema.parse(message);
    } catch (error) {
      throw createError(
        `Invalid message data: ${error instanceof Error ? getErrorMessage(error) : 'Unknown error'}`
      );
    }
  }

  /**
   * Validate session data
   */
  private validateSession(session: any): Session {
    // Add session validation schema if needed
    return session;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    // Cancel all active streams
    for (const [sessionId, reader] of this.activeStreams) {
      reader.cancel();
    }
    this.activeStreams.clear();

    // Stop queue processor
    this.stopQueueProcessor();

    // Clear queue
    this.clearQueue();
  }
}

// Export singleton instance (for backward compatibility)
export const chatService = new ChatService();
