/**
 * File System Service Tests
 */

import { fileSystemService, FileStats } from '@/services/file-system.service';
import { jest } from '@jest/globals';

// Mock fetch for API calls
global.fetch = jest.fn();

describe('FileSystemService', () => {
  let mockFetch: jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockClear();
  });

  describe('readDirectory', () => {
    it('should read directory and return file items', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          items: [
            { name: 'file1.txt', type: 'file', size: 1024 },
            { name: 'folder1', type: 'folder' },
          ],
        }),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await fileSystemService.readDirectory('.');

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        name: 'file1.txt',
        type: 'file',
        size: 1024,
      });
      expect(result[1]).toMatchObject({
        name: 'folder1',
        type: 'folder',
      });
      expect(mockFetch).toHaveBeenCalledWith('/api/files?path=.');
    });

    it('should handle directory read errors', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ error: 'Permission denied' }),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(fileSystemService.readDirectory('/invalid')).rejects.toThrow(
        'Failed to read directory'
      );
    });
  });

  describe('createFile', () => {
    it('should create a file with content', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await fileSystemService.createFile('test.txt', 'Hello World');

      expect(mockFetch).toHaveBeenCalledWith('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createFile',
          path: 'test.txt',
          content: 'Hello World',
        }),
      });
    });

    it('should create a file without content', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await fileSystemService.createFile('empty.txt');

      expect(mockFetch).toHaveBeenCalledWith('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createFile',
          path: 'empty.txt',
          content: '',
        }),
      });
    });

    it('should handle file creation errors', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ error: 'Permission denied' }),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(fileSystemService.createFile('test.txt')).rejects.toThrow(
        'Failed to create file'
      );
    });
  });

  describe('createDirectory', () => {
    it('should create a directory', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await fileSystemService.createDirectory('new-folder');

      expect(mockFetch).toHaveBeenCalledWith('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createDirectory',
          path: 'new-folder',
        }),
      });
    });

    it('should handle directory creation errors', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ error: 'Permission denied' }),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(fileSystemService.createDirectory('invalid')).rejects.toThrow(
        'Failed to create directory'
      );
    });
  });

  describe('deleteFile', () => {
    it('should delete a file', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await fileSystemService.deleteFile('test.txt');

      expect(mockFetch).toHaveBeenCalledWith('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteFile',
          path: 'test.txt',
        }),
      });
    });

    it('should handle file deletion errors', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ error: 'File not found' }),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(fileSystemService.deleteFile('nonexistent.txt')).rejects.toThrow(
        'Failed to delete file'
      );
    });
  });

  describe('deleteDirectory', () => {
    it('should delete a directory', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await fileSystemService.deleteDirectory('test-folder');

      expect(mockFetch).toHaveBeenCalledWith('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteDirectory',
          path: 'test-folder',
        }),
      });
    });

    it('should handle directory deletion errors', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ error: 'Directory not empty' }),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(fileSystemService.deleteDirectory('nonempty')).rejects.toThrow(
        'Failed to delete directory'
      );
    });
  });

  describe('moveFile', () => {
    it('should move a file', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await fileSystemService.moveFile('source.txt', 'dest.txt');

      expect(mockFetch).toHaveBeenCalledWith('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'moveFile',
          path: 'source.txt',
          destination: 'dest.txt',
        }),
      });
    });

    it('should handle file move errors', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ error: 'Permission denied' }),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(fileSystemService.moveFile('source.txt', 'dest.txt')).rejects.toThrow(
        'Failed to move file'
      );
    });
  });

  describe('copyFile', () => {
    it('should copy a file', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await fileSystemService.copyFile('source.txt', 'dest.txt');

      expect(mockFetch).toHaveBeenCalledWith('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'copyFile',
          path: 'source.txt',
          destination: 'dest.txt',
        }),
      });
    });

    it('should handle file copy errors', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ error: 'Permission denied' }),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(fileSystemService.copyFile('source.txt', 'dest.txt')).rejects.toThrow(
        'Failed to copy file'
      );
    });
  });

  describe('readFile', () => {
    it('should read a file', async () => {
      const content = 'File content';
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ content }),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await fileSystemService.readFile('test.txt');

      expect(result).toBe(content);
      expect(mockFetch).toHaveBeenCalledWith('/api/files?path=test.txt');
    });

    it('should handle file read errors', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ error: 'File not found' }),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(fileSystemService.readFile('nonexistent.txt')).rejects.toThrow(
        'Failed to read file'
      );
    });
  });

  describe('writeFile', () => {
    it('should write to a file', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await fileSystemService.writeFile('test.txt', 'New content');

      expect(mockFetch).toHaveBeenCalledWith('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'writeFile',
          path: 'test.txt',
          content: 'New content',
        }),
      });
    });

    it('should handle file write errors', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ error: 'Permission denied' }),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(fileSystemService.writeFile('test.txt', 'content')).rejects.toThrow(
        'Failed to write file'
      );
    });
  });

  describe('getFileStats', () => {
    it('should get file statistics', async () => {
      const mockStats = {
        size: 2048,
        modified: '2024-01-01T00:00:00.000Z',
        created: '2023-12-01T00:00:00.000Z',
        isDirectory: false,
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ stats: mockStats }),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await fileSystemService.getFileStats('test.txt');

      expect(result).toMatchObject({
        size: 2048,
        modified: new Date('2024-01-01T00:00:00.000Z'),
        created: new Date('2023-12-01T00:00:00.000Z'),
        isDirectory: false,
        permissions: 'read',
      });
      expect(mockFetch).toHaveBeenCalledWith('/api/files?path=test.txt');
    });

    it('should handle file stats errors', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ error: 'File not found' }),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(fileSystemService.getFileStats('nonexistent.txt')).rejects.toThrow(
        'Failed to get file stats'
      );
    });
  });
});
