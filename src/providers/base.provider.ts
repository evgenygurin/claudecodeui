import { logger } from '@/utils/logger';
/**
 * Base CLI Provider Interface
 * Defines the contract for all CLI providers (Claude, Cursor, Codegen)
 */

export interface SpawnOptions {
  projectPath: string;
  sessionId?: string;
  resume?: boolean;
  model?: string;
  outputFormat?: string;
  timeout?: number;
  env?: Record<string, string>;
}

export interface CLIProcess {
  id: string;
  stdout: ReadableStream;
  stderr: ReadableStream;
  stdin: WritableStream;
  kill(): void;
  onExit(callback: (code: number) => void): void;
  onData(callback: (data: string) => void): void;
  onError(callback: (error: string) => void): void;
}

export interface ProviderStatus {
  available: boolean;
  version?: string;
  status: 'online' | 'offline' | 'error';
  message?: string;
  lastChecked: Date;
}

export interface SessionInfo {
  id: string;
  title: string;
  projectPath: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  provider: string;
}

/**
 * Abstract base class for CLI providers
 */
export abstract class CLIProvider {
  protected readonly providerName: string;
  protected readonly commandName: string;
  protected readonly processes: Map<string, CLIProcess> = new Map();

  constructor(providerName: string, commandName: string) {
    this.providerName = providerName;
    this.commandName = commandName;
  }

  /**
   * Spawn a new CLI process
   */
  abstract spawn(command: string, options: SpawnOptions): Promise<CLIProcess>;

  /**
   * Abort a running process
   */
  abstract abort(sessionId: string): boolean;

  /**
   * Get provider status
   */
  abstract getStatus(): Promise<ProviderStatus>;

  /**
   * Get available sessions for a project
   */
  abstract getSessions(projectPath: string): Promise<SessionInfo[]>;

  /**
   * Check if provider is available
   */
  abstract isAvailable(): Promise<boolean>;

  /**
   * Get provider version
   */
  abstract getVersion(): Promise<string | null>;

  /**
   * Validate command before execution
   */
  protected validateCommand(command: string): boolean {
    // Basic validation - can be overridden by subclasses
    return typeof command === 'string' && command.trim().length > 0;
  }

  /**
   * Validate spawn options
   */
  protected validateOptions(options: SpawnOptions): boolean {
    return typeof options.projectPath === 'string' && options.projectPath.trim().length > 0;
  }

  /**
   * Generate unique process ID
   */
  protected generateProcessId(): string {
    return `${this.providerName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get all running processes
   */
  getRunningProcesses(): CLIProcess[] {
    return Array.from(this.processes.values());
  }

  /**
   * Kill all running processes
   */
  killAllProcesses(): void {
    for (const process of this.processes.values()) {
      try {
        process.kill();
      } catch (error) {
        logger.error(`Error killing process:`, error);
      }
    }
    this.processes.clear();
  }

  /**
   * Get process by ID
   */
  getProcess(id: string): CLIProcess | undefined {
    return this.processes.get(id);
  }

  /**
   * Remove process from tracking
   */
  protected removeProcess(id: string): void {
    this.processes.delete(id);
  }

  /**
   * Add process to tracking
   */
  protected addProcess(id: string, process: CLIProcess): void {
    this.processes.set(id, process);

    // Set up cleanup on exit
    process.onExit(() => {
      this.removeProcess(id);
    });
  }

  /**
   * Get provider name
   */
  getProviderName(): string {
    return this.providerName;
  }

  /**
   * Get command name
   */
  getCommandName(): string {
    return this.commandName;
  }
}

/**
 * Error classes for CLI providers
 */
export class CLIProviderError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'CLIProviderError';
  }
}

export class CLIProcessError extends Error {
  constructor(
    message: string,
    public readonly processId: string,
    public readonly exitCode?: number
  ) {
    super(message);
    this.name = 'CLIProcessError';
  }
}

export class CLICommandError extends Error {
  constructor(
    message: string,
    public readonly command: string,
    public readonly provider: string
  ) {
    super(message);
    this.name = 'CLICommandError';
  }
}
