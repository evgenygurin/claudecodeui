import { getErrorMessage } from '@/utils/error-handler';
import { createError } from '@/utils/error-handler';
import { logger } from '@/utils/logger';
/**
 * Session Repository Interface and Implementation
 * Handles data persistence and retrieval for chat sessions
 */

import { Session, CursorSession, CreateSessionDto, UpdateSessionDto } from '@/types';

export interface SessionRepository {
  findByProjectId(projectId: string): Promise<Session[]>;
  findById(id: string): Promise<Session | null>;
  create(session: CreateSessionDto): Promise<Session>;
  update(id: string, session: UpdateSessionDto): Promise<Session>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  count(): Promise<number>;
}

export interface CursorSessionRepository {
  findByProjectPath(projectPath: string): Promise<CursorSession[]>;
  findById(id: string): Promise<CursorSession | null>;
  exists(id: string): Promise<boolean>;
  count(): Promise<number>;
}

/**
 * Claude Session Repository Implementation
 * Reads and writes Claude chat sessions from JSONL files
 */
export class ClaudeSessionRepository implements SessionRepository {
  private readonly sessionsPath: string;

  constructor(sessionsPath: string = '~/.claude/projects/') {
    this.sessionsPath = sessionsPath;
  }

  async findByProjectId(projectId: string): Promise<Session[]> {
    try {
      // In a real implementation, this would read JSONL files
      // from the project directory and parse session data
      const response = await fetch(`/api/sessions?projectId=${projectId}`);
      if (!response.ok) {
        throw createError('Failed to fetch sessions');
      }
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      logger.error('Error reading sessions from file system:', error);
      return [];
    }
  }

  async findById(id: string): Promise<Session | null> {
    try {
      const response = await fetch(`/api/sessions/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw createError('Failed to fetch session');
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      logger.error('Error finding session by ID:', error);
      return null;
    }
  }

  async create(sessionData: CreateSessionDto): Promise<Session> {
    try {
      const newSession: Session = {
        id: this.generateId(),
        title: sessionData.title,
        provider: sessionData.provider,
        projectId: sessionData.projectId,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 0,
        status: 'active',
      };

      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSession),
      });

      if (!response.ok) {
        throw createError('Failed to create session');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      logger.error('Error creating session:', error);
      throw createError(
        `Failed to create session: ${error instanceof Error ? getErrorMessage(error) : 'Unknown error'}`
      );
    }
  }

  async update(id: string, sessionData: UpdateSessionDto): Promise<Session> {
    try {
      const existingSession = await this.findById(id);
      if (!existingSession) {
        throw createError('Session not found');
      }

      const updatedSession: Session = {
        ...existingSession,
        ...sessionData,
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch(`/api/sessions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSession),
      });

      if (!response.ok) {
        throw createError('Failed to update session');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      logger.error('Error updating session:', error);
      throw createError(
        `Failed to update session: ${error instanceof Error ? getErrorMessage(error) : 'Unknown error'}`
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/sessions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw createError('Failed to delete session');
      }
    } catch (error) {
      logger.error('Error deleting session:', error);
      throw createError(
        `Failed to delete session: ${error instanceof Error ? getErrorMessage(error) : 'Unknown error'}`
      );
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const session = await this.findById(id);
      return session !== null;
    } catch (error) {
      logger.error('Error checking session existence:', error);
      return false;
    }
  }

  async count(): Promise<number> {
    try {
      const response = await fetch('/api/sessions/count');
      if (!response.ok) {
        throw createError('Failed to fetch session count');
      }
      const result = await response.json();
      return result.data || 0;
    } catch (error) {
      logger.error('Error counting sessions:', error);
      return 0;
    }
  }

  /**
   * Parse JSONL file for session messages
   */
  private async parseSessionMessages(sessionPath: string): Promise<any[]> {
    try {
      // In a real implementation, this would read and parse JSONL files
      // containing the session messages
      return [];
    } catch (error) {
      logger.error('Error parsing session messages:', error);
      return [];
    }
  }

  /**
   * Generate unique session ID
   */
  private generateId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Cursor Session Repository Implementation
 * Reads Cursor chat sessions from SQLite databases
 */
export class CursorSessionRepositoryImpl implements CursorSessionRepository {
  private readonly cursorPath: string;

  constructor(cursorPath: string = '~/.cursor/chats/') {
    this.cursorPath = cursorPath;
  }

  async findByProjectPath(projectPath: string): Promise<CursorSession[]> {
    try {
      // In a real implementation, this would read SQLite databases
      // from the Cursor chats directory and parse session data
      const response = await fetch(
        `/api/cursor-sessions?projectPath=${encodeURIComponent(projectPath)}`
      );
      if (!response.ok) {
        throw createError('Failed to fetch cursor sessions');
      }
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      logger.error('Error reading cursor sessions from database:', error);
      return [];
    }
  }

  async findById(id: string): Promise<CursorSession | null> {
    try {
      const response = await fetch(`/api/cursor-sessions/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw createError('Failed to fetch cursor session');
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      logger.error('Error finding cursor session by ID:', error);
      return null;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const session = await this.findById(id);
      return session !== null;
    } catch (error) {
      logger.error('Error checking cursor session existence:', error);
      return false;
    }
  }

  async count(): Promise<number> {
    try {
      const response = await fetch('/api/cursor-sessions/count');
      if (!response.ok) {
        throw createError('Failed to fetch cursor session count');
      }
      const result = await response.json();
      return result.data || 0;
    } catch (error) {
      logger.error('Error counting cursor sessions:', error);
      return 0;
    }
  }

  /**
   * Parse SQLite database for cursor sessions
   */
  private async parseCursorDatabase(dbPath: string): Promise<CursorSession[]> {
    try {
      // In a real implementation, this would read SQLite databases
      // and parse cursor session data
      return [];
    } catch (error) {
      logger.error('Error parsing cursor database:', error);
      return [];
    }
  }
}

/**
 * In-Memory Session Repository Implementation
 * For testing and development purposes
 */
export class InMemorySessionRepository implements SessionRepository {
  private sessions: Map<string, Session> = new Map();

  async findByProjectId(projectId: string): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(session => session.projectId === projectId);
  }

  async findById(id: string): Promise<Session | null> {
    return this.sessions.get(id) || null;
  }

  async create(sessionData: CreateSessionDto): Promise<Session> {
    const newSession: Session = {
      id: this.generateId(),
      title: sessionData.title,
      provider: sessionData.provider,
      projectId: sessionData.projectId,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
      status: 'active',
    };

    this.sessions.set(newSession.id, newSession);
    return newSession;
  }

  async update(id: string, sessionData: UpdateSessionDto): Promise<Session> {
    const existingSession = this.sessions.get(id);
    if (!existingSession) {
      throw createError('Session not found');
    }

    const updatedSession: Session = {
      ...existingSession,
      ...sessionData,
      updatedAt: new Date().toISOString(),
    };

    this.sessions.set(id, updatedSession);
    return updatedSession;
  }

  async delete(id: string): Promise<void> {
    this.sessions.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.sessions.has(id);
  }

  async count(): Promise<number> {
    return this.sessions.size;
  }

  private generateId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
