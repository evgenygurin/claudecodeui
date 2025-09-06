import { getErrorMessage } from '@/utils/error-handler';
/**
 * Claude CLI Service
 * Real integration with Claude CLI instead of mock streams
 */

import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import { logger } from '@/utils/logger';
import { createError } from '@/utils/error-handler';

export interface ClaudeCLIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ClaudeCLISession {
  id: string;
  name: string;
  messages: ClaudeCLIMessage[];
  createdAt: Date;
  updatedAt: Date;
  projectPath?: string;
}

export interface ClaudeCLIResponse {
  content: string;
  isComplete: boolean;
  error?: string;
}

export class ClaudeCLIService extends EventEmitter {
  private process: ChildProcess | null = null;
  private isRunning = false;
  private currentSession: ClaudeCLISession | null = null;
  private messageBuffer = '';

  constructor() {
    super();
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.on('error', error => {
      logger.error('Claude CLI service error', { error: getErrorMessage(error) });
    });

    this.on('data', data => {
      logger.debug('Claude CLI data received', { data: data.toString() });
    });
  }

  async startSession(projectPath?: string): Promise<ClaudeCLISession> {
    if (this.isRunning) {
      throw createError('Claude CLI session is already running');
    }

    try {
      const sessionId = this.generateSessionId();
      const session: ClaudeCLISession = {
        id: sessionId,
        name: `Session ${new Date().toLocaleString()}`,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        projectPath,
      };

      this.currentSession = session;
      await this.startClaudeProcess(projectPath);

      logger.info('Claude CLI session started', { sessionId, projectPath });
      this.emit('sessionStarted', session);

      return session;
    } catch (error) {
      logger.error('Failed to start Claude CLI session', { error: getErrorMessage(error) });
      throw createError(`Failed to start Claude CLI session: ${getErrorMessage(error)}`);
    }
  }

  async stopSession(): Promise<void> {
    if (!this.isRunning || !this.process) {
      return;
    }

    try {
      this.process.kill('SIGTERM');
      await this.waitForProcessExit();

      this.isRunning = false;
      this.process = null;
      this.currentSession = null;
      this.messageBuffer = '';

      logger.info('Claude CLI session stopped');
      this.emit('sessionStopped');
    } catch (error) {
      logger.error('Error stopping Claude CLI session', { error: getErrorMessage(error) });
      throw createError(`Failed to stop Claude CLI session: ${getErrorMessage(error)}`);
    }
  }

  async sendMessage(content: string): Promise<ClaudeCLIResponse> {
    if (!this.isRunning || !this.process || !this.currentSession) {
      throw createError('No active Claude CLI session');
    }

    try {
      const userMessage: ClaudeCLIMessage = {
        role: 'user',
        content,
        timestamp: new Date(),
      };

      this.currentSession.messages.push(userMessage);
      this.currentSession.updatedAt = new Date();

      // Send message to Claude CLI process
      this.process.stdin?.write(`${content}\n`);

      logger.info('Message sent to Claude CLI', {
        sessionId: this.currentSession.id,
        contentLength: content.length,
      });

      // Wait for response
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(createError('Claude CLI response timeout'));
        }, 30000); // 30 second timeout

        const onData = (data: Buffer) => {
          this.messageBuffer += data.toString();

          // Check if response is complete (look for end markers)
          if (this.isResponseComplete(this.messageBuffer)) {
            clearTimeout(timeout);
            this.process?.removeListener('data', onData);

            const response = this.parseResponse(this.messageBuffer);
            this.messageBuffer = '';

            if (response.error) {
              reject(createError(response.error));
            } else {
              const assistantMessage: ClaudeCLIMessage = {
                role: 'assistant',
                content: response.content,
                timestamp: new Date(),
              };

              this.currentSession!.messages.push(assistantMessage);
              this.currentSession!.updatedAt = new Date();

              resolve(response);
            }
          }
        };

        this.process?.on('data', onData);
      });
    } catch (error) {
      logger.error('Error sending message to Claude CLI', { error: getErrorMessage(error) });
      throw createError(`Failed to send message: ${getErrorMessage(error)}`);
    }
  }

  async getSessions(): Promise<ClaudeCLISession[]> {
    try {
      // In a real implementation, this would read from Claude CLI's session storage
      // For now, return current session if exists
      if (this.currentSession) {
        return [this.currentSession];
      }
      return [];
    } catch (error) {
      logger.error('Error getting Claude CLI sessions', { error: getErrorMessage(error) });
      throw createError(`Failed to get sessions: ${getErrorMessage(error)}`);
    }
  }

  async getSession(sessionId: string): Promise<ClaudeCLISession | null> {
    try {
      if (this.currentSession && this.currentSession.id === sessionId) {
        return this.currentSession;
      }
      return null;
    } catch (error) {
      logger.error('Error getting Claude CLI session', {
        error: getErrorMessage(error),
        sessionId,
      });
      throw createError(`Failed to get session: ${getErrorMessage(error)}`);
    }
  }

  getStatus(): { isRunning: boolean; sessionId?: string } {
    return {
      isRunning: this.isRunning,
      sessionId: this.currentSession?.id,
    };
  }

  private async startClaudeProcess(projectPath?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const args = ['claude'];

        if (projectPath) {
          args.push('--project', projectPath);
        }

        this.process = spawn('claude', args, {
          stdio: ['pipe', 'pipe', 'pipe'],
          cwd: projectPath || process.cwd(),
        });

        this.process.on('spawn', () => {
          this.isRunning = true;
          logger.info('Claude CLI process spawned', { pid: this.process?.pid });
          resolve();
        });

        this.process.on('error', error => {
          logger.error('Claude CLI process error', { error: getErrorMessage(error) });
          this.isRunning = false;
          reject(error);
        });

        this.process.on('exit', (code, signal) => {
          logger.info('Claude CLI process exited', { code, signal });
          this.isRunning = false;
          this.emit('processExit', { code, signal });
        });

        this.process.stdout?.on('data', data => {
          this.emit('data', data);
        });

        this.process.stderr?.on('data', data => {
          const errorMessage = data.toString();
          logger.warn('Claude CLI stderr', { error: errorMessage });
          this.emit('error', new Error(errorMessage));
        });

        // Set up stdin
        this.process.stdin?.setDefaultEncoding('utf8');
      } catch (error) {
        logger.error('Failed to spawn Claude CLI process', { error: getErrorMessage(error) });
        reject(error);
      }
    });
  }

  private async waitForProcessExit(): Promise<void> {
    return new Promise(resolve => {
      if (!this.process) {
        resolve();
        return;
      }

      const timeout = setTimeout(() => {
        if (this.process) {
          this.process.kill('SIGKILL');
        }
        resolve();
      }, 5000); // 5 second timeout

      this.process.on('exit', () => {
        clearTimeout(timeout);
        resolve();
      });
    });
  }

  private generateSessionId(): string {
    return `claude_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private isResponseComplete(buffer: string): boolean {
    // Look for common end markers in Claude CLI responses
    const endMarkers = ['\n\n---\n', '\n\n[END]\n', '\n\n[DONE]\n', '\n\n---END---\n'];

    return endMarkers.some(marker => buffer.includes(marker));
  }

  private parseResponse(buffer: string): ClaudeCLIResponse {
    try {
      // Remove end markers
      const cleanBuffer = buffer
        .replace(/\n\n---\n$/, '')
        .replace(/\n\n\[END\]\n$/, '')
        .replace(/\n\n\[DONE\]\n$/, '')
        .replace(/\n\n---END---\n$/, '')
        .trim();

      // Check for error indicators
      if (cleanBuffer.includes('ERROR:') || cleanBuffer.includes('Error:')) {
        return {
          content: '',
          isComplete: true,
          error: cleanBuffer,
        };
      }

      return {
        content: cleanBuffer,
        isComplete: true,
      };
    } catch (error) {
      logger.error('Error parsing Claude CLI response', { error: getErrorMessage(error) });
      return {
        content: '',
        isComplete: true,
        error: 'Failed to parse response',
      };
    }
  }
}

// Export singleton instance
export const claudeCLIService = new ClaudeCLIService();
