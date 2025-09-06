/**
 * Structured logging utility
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private level: LogLevel;

  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level;
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  info(message: string, meta?: Record<string, any>): void {
    if (this.level <= LogLevel.INFO) {
      console.log(`[INFO] ${message}`, meta || {});
    }
  }

  warn(message: string, meta?: Record<string, any>): void {
    if (this.level <= LogLevel.WARN) {
      console.warn(`[WARN] ${message}`, meta || {});
    }
  }

  error(message: string, meta?: Record<string, any> | unknown): void {
    if (this.level <= LogLevel.ERROR) {
      if (meta && typeof meta === 'object' && meta !== null) {
        console.error(`[ERROR] ${message}`, meta);
      } else if (meta !== undefined) {
        console.error(`[ERROR] ${message}`, meta);
      } else {
        console.error(`[ERROR] ${message}`);
      }
    }
  }

  debug(message: string, meta?: Record<string, any>): void {
    if (this.level <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] ${message}`, meta || {});
    }
  }
}

// Export singleton instance
export const logger = new Logger();
