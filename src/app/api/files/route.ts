import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { logger } from '@/utils/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path') || '.';
    
    const fullPath = path.resolve(process.cwd(), filePath);
    
    // Security check - ensure path is within project directory
    if (!fullPath.startsWith(process.cwd())) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    
    const stats = await fs.stat(fullPath);
    
    if (stats.isDirectory()) {
      const entries = await fs.readdir(fullPath, { withFileTypes: true });
      const items = [];
      
      for (const entry of entries) {
        const itemPath = path.join(fullPath, entry.name);
        const itemStats = await fs.stat(itemPath);
        
        items.push({
          id: Buffer.from(itemPath).toString('base64').replace(/[^a-zA-Z0-9]/g, ''),
          name: entry.name,
          path: itemPath,
          type: entry.isDirectory() ? 'directory' : 'file',
          lastModified: itemStats.mtime,
          size: entry.isFile() ? itemStats.size : undefined,
        });
      }
      
      // Sort directories first, then files
      items.sort((a, b) => {
        if (a.type === 'directory' && b.type === 'file') return -1;
        if (a.type === 'file' && b.type === 'directory') return 1;
        return a.name.localeCompare(b.name);
      });
      
      return NextResponse.json({ items });
    } else {
      // Return file content
      const content = await fs.readFile(fullPath, 'utf8');
      return NextResponse.json({ 
        content,
        stats: {
          size: stats.size,
          modified: stats.mtime,
          created: stats.birthtime,
          isDirectory: false,
        }
      });
    }
  } catch (error) {
    logger.error('Error reading file/directory', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return NextResponse.json(
      { error: 'Failed to read file/directory' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, path: filePath, content, destination } = body;
    
    const fullPath = path.resolve(process.cwd(), filePath);
    
    // Security check
    if (!fullPath.startsWith(process.cwd())) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    
    switch (action) {
      case 'createFile':
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, content || '', 'utf8');
        break;
        
      case 'createDirectory':
        await fs.mkdir(fullPath, { recursive: true });
        break;
        
      case 'deleteFile':
        await fs.unlink(fullPath);
        break;
        
      case 'deleteDirectory':
        await fs.rmdir(fullPath, { recursive: true });
        break;
        
      case 'moveFile':
        if (!destination) {
          return NextResponse.json(
            { error: 'Destination required for move operation' },
            { status: 400 }
          );
        }
        const destPath = path.resolve(process.cwd(), destination);
        if (!destPath.startsWith(process.cwd())) {
          return NextResponse.json(
            { error: 'Access denied' },
            { status: 403 }
          );
        }
        await fs.mkdir(path.dirname(destPath), { recursive: true });
        await fs.rename(fullPath, destPath);
        break;
        
      case 'copyFile':
        if (!destination) {
          return NextResponse.json(
            { error: 'Destination required for copy operation' },
            { status: 400 }
          );
        }
        const copyDestPath = path.resolve(process.cwd(), destination);
        if (!copyDestPath.startsWith(process.cwd())) {
          return NextResponse.json(
            { error: 'Access denied' },
            { status: 403 }
          );
        }
        await fs.mkdir(path.dirname(copyDestPath), { recursive: true });
        await fs.copyFile(fullPath, copyDestPath);
        break;
        
      case 'writeFile':
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, content, 'utf8');
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error performing file operation', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return NextResponse.json(
      { error: 'Failed to perform file operation' },
      { status: 500 }
    );
  }
}
