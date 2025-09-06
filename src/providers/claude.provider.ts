import { getErrorMessage } from '@/utils/error-handler';
import { createError } from '@/utils/error-handler';
/**
 * Claude CLI Provider Implementation
 * Handles interaction with Claude Code CLI
 */

import {
  CLIProvider,
  CLIProcess,
  SpawnOptions,
  ProviderStatus,
  SessionInfo,
} from './base.provider';
import { logger } from '@/utils/logger';

export interface ClaudeProcess extends CLIProcess {
  readonly processId: string;
  readonly command: string;
  readonly options: SpawnOptions;
}

/**
 * Claude CLI Provider
 */
export class ClaudeProvider extends CLIProvider {
  private readonly claudePath: string;
  private readonly projectsPath: string;

  constructor(claudePath: string = 'claude', projectsPath: string = '~/.claude/projects/') {
    super('claude', claudePath);
    this.claudePath = claudePath;
    this.projectsPath = projectsPath;
  }

  async spawn(command: string, options: SpawnOptions): Promise<CLIProcess> {
    if (!this.validateCommand(command)) {
      throw createError('Invalid command');
    }

    if (!this.validateOptions(options)) {
      throw createError('Invalid options');
    }

    const processId = this.generateProcessId();
    const args = this.buildArgs(command, options);

    try {
      // In a browser environment, we would use WebSocket or API calls
      // For now, we'll simulate the process
      const process = new ClaudeProcessImpl(processId, command, options, args);
      this.addProcess(processId, process);

      return process;
    } catch (error) {
      throw createError(
        `Failed to spawn Claude process: ${error instanceof Error ? getErrorMessage(error) : 'Unknown error'}`
      );
    }
  }

  abort(sessionId: string): boolean {
    const process = this.getProcess(sessionId);
    if (process) {
      try {
        process.kill();
        this.removeProcess(sessionId);
        return true;
      } catch (error) {
        logger.error('Error aborting process', { error: getErrorMessage(error) });
        return false;
      }
    }
    return false;
  }

  async getStatus(): Promise<ProviderStatus> {
    try {
      const isAvailable = await this.isAvailable();
      const version = await this.getVersion();

      return {
        available: isAvailable,
        version: version || 'unknown',
        status: isAvailable ? 'online' : 'offline',
        message: isAvailable ? 'Claude CLI is available' : 'Claude CLI is not available',
        lastChecked: new Date(),
      };
    } catch (error) {
      return {
        available: false,
        status: 'error',
        message: `Error checking Claude CLI status: ${error instanceof Error ? getErrorMessage(error) : 'Unknown error'}`,
        lastChecked: new Date(),
      };
    }
  }

  async getSessions(projectPath: string): Promise<SessionInfo[]> {
    try {
      // In a real implementation, this would scan the project directory
      // for JSONL files and parse session information
      const response = await fetch(
        `/api/claude/sessions?projectPath=${encodeURIComponent(projectPath)}`
      );
      if (!response.ok) {
        throw createError('Failed to fetch Claude sessions');
      }
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      logger.error('Error fetching Claude sessions', { error: getErrorMessage(error) });
      return [];
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      // In a real implementation, this would check if the Claude CLI is installed
      // and accessible in the system PATH
      const response = await fetch('/api/claude/status');
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async getVersion(): Promise<string | null> {
    try {
      const response = await fetch('/api/claude/version');
      if (!response.ok) {
        return null;
      }
      const result = await response.json();
      return result.data?.version || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Build command line arguments
   */
  private buildArgs(command: string, options: SpawnOptions): string[] {
    const args: string[] = [];

    // Add project path
    args.push('--project', options.projectPath);

    // Add session ID if resuming
    if (options.resume && options.sessionId) {
      args.push('--resume', options.sessionId);
    }

    // Add model if specified
    if (options.model) {
      args.push('--model', options.model);
    }

    // Add output format if specified
    if (options.outputFormat) {
      args.push('--output-format', options.outputFormat);
    }

    // Add timeout if specified
    if (options.timeout) {
      args.push('--timeout', options.timeout.toString());
    }

    // Add the actual command
    if (command) {
      args.push(command);
    }

    return args;
  }

  /**
   * Get environment variables for Claude CLI
   */
  private getEnvironment(): Record<string, string> {
    return {
      ...process.env,
      CLAUDE_PROJECTS_PATH: this.projectsPath,
      CLAUDE_LOG_LEVEL: 'info',
    };
  }
}

/**
 * Claude Process Implementation
 * Simulates a Claude CLI process
 */
class ClaudeProcessImpl implements CLIProcess {
  public readonly id: string;
  public readonly processId: string;
  public readonly command: string;
  public readonly options: SpawnOptions;

  public readonly stdout: ReadableStream;
  public readonly stderr: ReadableStream;
  public readonly stdin: WritableStream;
  private readonly exitCallbacks: Array<(code: number) => void> = [];
  private readonly dataCallbacks: Array<(data: string) => void> = [];
  private readonly errorCallbacks: Array<(error: string) => void> = [];

  private isRunning: boolean = true;
  private exitCode: number | null = null;

  constructor(processId: string, command: string, options: SpawnOptions, args: string[]) {
    this.id = processId;
    this.processId = processId;
    this.command = command;
    this.options = options;

    // Create mock streams
    this.stdout = this.createMockReadableStream();
    this.stderr = this.createMockReadableStream();
    this.stdin = this.createMockWritableStream();

    // Simulate process execution
    this.simulateExecution();
  }

  kill(): void {
    if (this.isRunning) {
      this.isRunning = false;
      this.exitCode = 1;
      this.notifyExit(1);
    }
  }

  onExit(callback: (code: number) => void): void {
    this.exitCallbacks.push(callback);
  }

  onData(callback: (data: string) => void): void {
    this.dataCallbacks.push(callback);
  }

  onError(callback: (error: string) => void): void {
    this.errorCallbacks.push(callback);
  }

  private createMockReadableStream(): ReadableStream {
    return new ReadableStream({
      start(controller) {
        // Mock stream implementation
      },
    });
  }

  private createMockWritableStream(): WritableStream {
    return new WritableStream({
      write(chunk) {
        // Mock stream implementation
      },
    });
  }

  private async simulateExecution(): Promise<void> {
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 100));

      // Simulate output
      this.notifyData('Claude CLI process started\n');
      this.notifyData(`Command: ${this.command}\n`);
      this.notifyData(`Project: ${this.options.projectPath}\n`);

      // Simulate completion
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.isRunning = false;
      this.exitCode = 0;
      this.notifyExit(0);
    } catch (error) {
      this.isRunning = false;
      this.exitCode = 1;
      this.notifyError(error instanceof Error ? getErrorMessage(error) : 'Unknown error');
      this.notifyExit(1);
    }
  }

  private notifyExit(code: number): void {
    this.exitCallbacks.forEach(callback => {
      try {
        callback(code);
      } catch (error) {
        logger.error('Error in exit callback', { error: getErrorMessage(error) });
      }
    });
  }

  private notifyData(data: string): void {
    this.dataCallbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        logger.error('Error in data callback', { error: getErrorMessage(error) });
      }
    });
  }

  private notifyError(error: string): void {
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error);
      } catch (error) {
        logger.error('Error in error callback', { error: getErrorMessage(error) });
      }
    });
  }
}
