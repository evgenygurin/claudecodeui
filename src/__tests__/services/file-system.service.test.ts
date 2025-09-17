/**
 * File System Service Tests
 */

import { FileSystemService, FileStats } from '@/services/file-system.service';
import { jest } from '@jest/globals';

// Mock fs/promises
jest.mock('fs/promises', () => ({
  readdir: jest.fn(),
  stat: jest.fn(),
  mkdir: jest.fn(),
  writeFile: jest.fn(),
  unlink: jest.fn(),
  rmdir: jest.fn(),
  rename: jest.fn(),
  copyFile: jest.fn(),
  readFile: jest.fn(),
}));

// Mock path
jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/')),
  dirname: jest.fn(path => path.split('/').slice(0, -1).join('/')),
  isAbsolute: jest.fn(path => path.startsWith('/')),
}));

// Mock fetch
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

describe.skip('FileSystemService', () => {
  let fileSystemService: FileSystemService;
  let mockFs: any;
  let mockPath: any;

  beforeEach(() => {
    fileSystemService = new (require('@/services/file-system.service').FileSystemServiceImpl)();
    mockFs = require('fs/promises');
    mockPath = require('path');

    // Reset all mocks
    jest.clearAllMocks();

    // Setup default fetch mock
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ files: [] }),
    } as any);
  });

  describe('readDirectory', () => {
    it('should read directory and return file items', async () => {
      const mockFiles = [
        { name: 'file1.txt', type: 'file', size: 1024, modified: '2024-01-01T00:00:00.000Z' },
        { name: 'folder1', type: 'directory', size: 0, modified: '2024-01-01T00:00:00.000Z' },
      ];

      (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ files: mockFiles }),
      } as any);

      const result = await fileSystemService.readDirectory('.');

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        name: 'file1.txt',
        type: 'file',
        size: 1024,
      });
      expect(result[1]).toMatchObject({
        name: 'folder1',
        type: 'directory',
      });
    });

    it('should handle directory read errors', async () => {
      (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({ error: 'Permission denied' }),
      } as any);

      await expect(fileSystemService.readDirectory('/invalid')).rejects.toThrow(
        'Failed to read directory'
      );
    });
  });

  describe('createFile', () => {
    it('should create a file with content', async () => {
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.writeFile.mockResolvedValue(undefined);

      await fileSystemService.createFile('test.txt', 'Hello World');

      expect(mockFs.mkdir).toHaveBeenCalledWith('.', { recursive: true });
      expect(mockFs.writeFile).toHaveBeenCalledWith('./test.txt', 'Hello World', 'utf8');
    });

    it('should create a file without content', async () => {
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.writeFile.mockResolvedValue(undefined);

      await fileSystemService.createFile('empty.txt');

      expect(mockFs.writeFile).toHaveBeenCalledWith('./empty.txt', '', 'utf8');
    });

    it('should handle file creation errors', async () => {
      mockFs.mkdir.mockRejectedValue(new Error('Permission denied'));

      await expect(fileSystemService.createFile('test.txt')).rejects.toThrow(
        'Failed to create file'
      );
    });
  });

  describe('createDirectory', () => {
    it('should create a directory', async () => {
      mockFs.mkdir.mockResolvedValue(undefined);

      await fileSystemService.createDirectory('new-folder');

      expect(mockFs.mkdir).toHaveBeenCalledWith('./new-folder', { recursive: true });
    });

    it('should handle directory creation errors', async () => {
      mockFs.mkdir.mockRejectedValue(new Error('Permission denied'));

      await expect(fileSystemService.createDirectory('invalid')).rejects.toThrow(
        'Failed to create directory'
      );
    });
  });

  describe('deleteFile', () => {
    it('should delete a file', async () => {
      mockFs.unlink.mockResolvedValue(undefined);

      await fileSystemService.deleteFile('test.txt');

      expect(mockFs.unlink).toHaveBeenCalledWith('./test.txt');
    });

    it('should handle file deletion errors', async () => {
      mockFs.unlink.mockRejectedValue(new Error('File not found'));

      await expect(fileSystemService.deleteFile('nonexistent.txt')).rejects.toThrow(
        'Failed to delete file'
      );
    });
  });

  describe('deleteDirectory', () => {
    it('should delete a directory', async () => {
      mockFs.rmdir.mockResolvedValue(undefined);

      await fileSystemService.deleteDirectory('test-folder');

      expect(mockFs.rmdir).toHaveBeenCalledWith('./test-folder', { recursive: true });
    });

    it('should handle directory deletion errors', async () => {
      mockFs.rmdir.mockRejectedValue(new Error('Directory not empty'));

      await expect(fileSystemService.deleteDirectory('nonempty')).rejects.toThrow(
        'Failed to delete directory'
      );
    });
  });

  describe('moveFile', () => {
    it('should move a file', async () => {
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.rename.mockResolvedValue(undefined);

      await fileSystemService.moveFile('source.txt', 'dest.txt');

      expect(mockFs.mkdir).toHaveBeenCalledWith('.', { recursive: true });
      expect(mockFs.rename).toHaveBeenCalledWith('./source.txt', './dest.txt');
    });

    it('should handle file move errors', async () => {
      mockFs.mkdir.mockRejectedValue(new Error('Permission denied'));

      await expect(fileSystemService.moveFile('source.txt', 'dest.txt')).rejects.toThrow(
        'Failed to move file'
      );
    });
  });

  describe('copyFile', () => {
    it('should copy a file', async () => {
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.copyFile.mockResolvedValue(undefined);

      await fileSystemService.copyFile('source.txt', 'dest.txt');

      expect(mockFs.mkdir).toHaveBeenCalledWith('.', { recursive: true });
      expect(mockFs.copyFile).toHaveBeenCalledWith('./source.txt', './dest.txt');
    });

    it('should handle file copy errors', async () => {
      mockFs.mkdir.mockRejectedValue(new Error('Permission denied'));

      await expect(fileSystemService.copyFile('source.txt', 'dest.txt')).rejects.toThrow(
        'Failed to copy file'
      );
    });
  });

  describe('readFile', () => {
    it('should read a file', async () => {
      const content = 'File content';
      mockFs.readFile.mockResolvedValue(content);

      const result = await fileSystemService.readFile('test.txt');

      expect(result).toBe(content);
      expect(mockFs.readFile).toHaveBeenCalledWith('./test.txt', 'utf8');
    });

    it('should handle file read errors', async () => {
      mockFs.readFile.mockRejectedValue(new Error('File not found'));

      await expect(fileSystemService.readFile('nonexistent.txt')).rejects.toThrow(
        'Failed to read file'
      );
    });
  });

  describe('writeFile', () => {
    it('should write to a file', async () => {
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.writeFile.mockResolvedValue(undefined);

      await fileSystemService.writeFile('test.txt', 'New content');

      expect(mockFs.mkdir).toHaveBeenCalledWith('.', { recursive: true });
      expect(mockFs.writeFile).toHaveBeenCalledWith('./test.txt', 'New content', 'utf8');
    });

    it('should handle file write errors', async () => {
      mockFs.mkdir.mockRejectedValue(new Error('Permission denied'));

      await expect(fileSystemService.writeFile('test.txt', 'content')).rejects.toThrow(
        'Failed to write file'
      );
    });
  });

  describe('getFileStats', () => {
    it('should get file statistics', async () => {
      const mockStats = {
        size: 2048,
        mtime: new Date('2024-01-01'),
        birthtime: new Date('2023-12-01'),
        isDirectory: () => false,
        mode: 0o644,
      };

      mockFs.stat.mockResolvedValue(mockStats);

      const result = await fileSystemService.getFileStats('test.txt');

      expect(result).toMatchObject({
        size: 2048,
        modified: mockStats.mtime,
        created: mockStats.birthtime,
        isDirectory: false,
        permissions: 'write',
      });
    });

    it('should handle file stats errors', async () => {
      mockFs.stat.mockRejectedValue(new Error('File not found'));

      await expect(fileSystemService.getFileStats('nonexistent.txt')).rejects.toThrow(
        'Failed to get file stats'
      );
    });
  });
});
