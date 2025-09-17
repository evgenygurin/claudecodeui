/**
 * File System Service
 * Handles file system operations via API routes
 */

import { logger } from '@/utils/logger';
import { createError, getErrorMessage } from '@/utils/error-handler';
import { FileItem } from '@/types';

export interface FileSystemService {
  readDirectory(path: string): Promise<FileItem[]>;
  createFile(path: string, content?: string): Promise<void>;
  createDirectory(path: string): Promise<void>;
  deleteFile(path: string): Promise<void>;
  deleteDirectory(path: string): Promise<void>;
  moveFile(from: string, to: string): Promise<void>;
  copyFile(from: string, to: string): Promise<void>;
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  getFileStats(path: string): Promise<FileStats>;
}

export interface FileStats {
  size: number;
  modified: Date;
  created: Date;
  isDirectory: boolean;
  permissions: string;
}

export class FileSystemServiceImpl implements FileSystemService {
  private readonly apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = '/api/files';
  }

  async readDirectory(path: string): Promise<FileItem[]> {
    try {
      const response = await fetch(`${this.apiBaseUrl}?path=${encodeURIComponent(path)}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to read directory');
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      logger.error('Error reading directory', { error: getErrorMessage(error), path });
      throw createError(`Failed to read directory: ${getErrorMessage(error)}`);
    }
  }

  async createFile(path: string, content: string = ''): Promise<void> {
    try {
      const response = await fetch(this.apiBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'createFile',
          path,
          content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create file');
      }

      logger.info('File created', { path });
    } catch (error) {
      logger.error('Error creating file', { error: getErrorMessage(error), path });
      throw createError(`Failed to create file: ${getErrorMessage(error)}`);
    }
  }

  async createDirectory(path: string): Promise<void> {
    try {
      const response = await fetch(this.apiBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'createDirectory',
          path,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create directory');
      }

      logger.info('Directory created', { path });
    } catch (error) {
      logger.error('Error creating directory', { error: getErrorMessage(error), path });
      throw createError(`Failed to create directory: ${getErrorMessage(error)}`);
    }
  }

  async deleteFile(path: string): Promise<void> {
    try {
      const response = await fetch(this.apiBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'deleteFile',
          path,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete file');
      }

      logger.info('File deleted', { path });
    } catch (error) {
      logger.error('Error deleting file', { error: getErrorMessage(error), path });
      throw createError(`Failed to delete file: ${getErrorMessage(error)}`);
    }
  }

  async deleteDirectory(path: string): Promise<void> {
    try {
      const response = await fetch(this.apiBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'deleteDirectory',
          path,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete directory');
      }

      logger.info('Directory deleted', { path });
    } catch (error) {
      logger.error('Error deleting directory', { error: getErrorMessage(error), path });
      throw createError(`Failed to delete directory: ${getErrorMessage(error)}`);
    }
  }

  async moveFile(from: string, to: string): Promise<void> {
    try {
      const response = await fetch(this.apiBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'moveFile',
          path: from,
          destination: to,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to move file');
      }

      logger.info('File moved', { from, to });
    } catch (error) {
      logger.error('Error moving file', { error: getErrorMessage(error), from, to });
      throw createError(`Failed to move file: ${getErrorMessage(error)}`);
    }
  }

  async copyFile(from: string, to: string): Promise<void> {
    try {
      const response = await fetch(this.apiBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'copyFile',
          path: from,
          destination: to,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to copy file');
      }

      logger.info('File copied', { from, to });
    } catch (error) {
      logger.error('Error copying file', { error: getErrorMessage(error), from, to });
      throw createError(`Failed to copy file: ${getErrorMessage(error)}`);
    }
  }

  async readFile(path: string): Promise<string> {
    try {
      const response = await fetch(`${this.apiBaseUrl}?path=${encodeURIComponent(path)}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to read file');
      }

      const data = await response.json();
      logger.info('File read', { path, size: data.content?.length || 0 });
      return data.content || '';
    } catch (error) {
      logger.error('Error reading file', { error: getErrorMessage(error), path });
      throw createError(`Failed to read file: ${getErrorMessage(error)}`);
    }
  }

  async writeFile(path: string, content: string): Promise<void> {
    try {
      const response = await fetch(this.apiBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'writeFile',
          path,
          content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to write file');
      }

      logger.info('File written', { path, size: content.length });
    } catch (error) {
      logger.error('Error writing file', { error: getErrorMessage(error), path });
      throw createError(`Failed to write file: ${getErrorMessage(error)}`);
    }
  }

  async getFileStats(path: string): Promise<FileStats> {
    try {
      const response = await fetch(`${this.apiBaseUrl}?path=${encodeURIComponent(path)}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get file stats');
      }

      const data = await response.json();
      return {
        size: data.stats.size,
        modified: new Date(data.stats.modified),
        created: new Date(data.stats.created),
        isDirectory: data.stats.isDirectory,
        permissions: 'read', // Simplified for now
      };
    } catch (error) {
      logger.error('Error getting file stats', { error: getErrorMessage(error), path });
      throw createError(`Failed to get file stats: ${getErrorMessage(error)}`);
    }
  }
}

// Export singleton instance
export const fileSystemService = new FileSystemServiceImpl();
