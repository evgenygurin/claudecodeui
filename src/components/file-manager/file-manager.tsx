'use client';

import * as React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Search,
  Folder,
  File,
  FileText,
  Image,
  Code,
  Database,
  Archive,
  Video,
  Music,
  Download,
  Upload,
  Plus,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  Star,
  Share,
  Trash2,
  Edit,
  Copy,
  Move,
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modified: string;
  icon?: string;
  children?: FileItem[];
}

interface FileManagerProps {
  className?: string;
}

const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    modified: '2024-01-15',
    children: [
      {
        id: '2',
        name: 'components',
        type: 'folder',
        modified: '2024-01-15',
        children: [
          {
            id: '3',
            name: 'Button.tsx',
            type: 'file',
            size: 2048,
            modified: '2024-01-15',
            icon: 'code',
          },
          {
            id: '4',
            name: 'Card.tsx',
            type: 'file',
            size: 1536,
            modified: '2024-01-15',
            icon: 'code',
          },
        ],
      },
      {
        id: '5',
        name: 'App.tsx',
        type: 'file',
        size: 4096,
        modified: '2024-01-15',
        icon: 'code',
      },
    ],
  },
  {
    id: '6',
    name: 'public',
    type: 'folder',
    modified: '2024-01-15',
    children: [
      {
        id: '7',
        name: 'logo.svg',
        type: 'file',
        size: 1024,
        modified: '2024-01-15',
        icon: 'image',
      },
    ],
  },
  {
    id: '8',
    name: 'package.json',
    type: 'file',
    size: 512,
    modified: '2024-01-15',
    icon: 'file',
  },
  {
    id: '9',
    name: 'README.md',
    type: 'file',
    size: 256,
    modified: '2024-01-15',
    icon: 'file',
  },
];

const getFileIcon = (type: string, fileType: 'file' | 'folder') => {
  if (fileType === 'folder') return Folder;

  switch (type) {
    case 'code':
      return Code;
    case 'image':
      return Image;
    case 'video':
      return Video;
    case 'music':
      return Music;
    case 'archive':
      return Archive;
    case 'database':
      return Database;
    default:
      return FileText;
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export function FileManager({ className }: FileManagerProps) {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['1', '2', '6']));
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const toggleFileSelection = (fileId: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const renderFileItem = (item: FileItem, depth = 0) => {
    const Icon = getFileIcon(item.icon || '', item.type);
    const isExpanded = expandedFolders.has(item.id);
    const isSelected = selectedFiles.has(item.id);

    return (
      <div key={item.id}>
        <div
          className={cn(
            'flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-accent transition-colors',
            isSelected && 'bg-accent',
            depth > 0 && 'ml-4'
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (item.type === 'folder') {
              toggleFolder(item.id);
            } else {
              toggleFileSelection(item.id);
            }
          }}
        >
          {item.type === 'folder' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0"
              onClick={e => {
                e.stopPropagation();
                toggleFolder(item.id);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="flex-1 text-sm truncate">{item.name}</span>
          {item.type === 'file' && item.size && (
            <span className="text-xs text-muted-foreground">{formatFileSize(item.size)}</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100"
            onClick={e => e.stopPropagation()}
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>

        {item.type === 'folder' && isExpanded && item.children && (
          <div>{item.children.map(child => renderFileItem(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">File Manager</h2>
          <span className="text-sm text-muted-foreground">{files.length} items</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.multiple = true;
              input.onchange = e => {
                const files = (e.target as HTMLInputElement).files;
                if (files && files.length > 0) {
                  console.log('Files selected for upload', files.length);
                  alert(`${files.length} files selected for upload!`);
                }
              };
              input.click();
            }}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const folderName = prompt('Enter folder name:');
              if (folderName && folderName.trim()) {
                console.log('Creating new folder:', folderName);
                alert(`Folder "${folderName}" would be created!`);
              }
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">{files.map(item => renderFileItem(item))}</div>
      </div>

      {/* Actions */}
      {selectedFiles.size > 0 && (
        <div className="p-4 border-t border-border bg-accent/50">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{selectedFiles.size} selected</span>
            <div className="flex items-center gap-1 ml-auto">
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Move className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
