'use client';

import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';
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
  Grid3X3,
  List,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  EyeOff,
} from 'lucide-react';
import { fileSystemService } from '@/services/file-system.service';
import { logger } from '@/utils/logger';

interface FileItem {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  lastModified: Date;
  icon?: string;
  children?: FileItem[];
  isStarred?: boolean;
  isShared?: boolean;
  permissions?: 'read' | 'write' | 'admin';
}

interface FileManagerProps {
  className?: string;
}

// Mock files removed - now using real file system service

const getFileIcon = (fileName: string, type: 'file' | 'directory') => {
  if (type === 'directory') return Folder;

  const extension = fileName.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'tsx':
    case 'ts':
    case 'jsx':
    case 'js':
      return Code;
    case 'md':
    case 'txt':
      return FileText;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return Image;
    case 'mp4':
    case 'avi':
    case 'mov':
      return Video;
    case 'mp3':
    case 'wav':
    case 'flac':
      return Music;
    case 'zip':
    case 'rar':
    case '7z':
      return Archive;
    case 'json':
    case 'sql':
      return Database;
    default:
      return File;
  }
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return '0 B';

  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

export function ModernFileManager({ className }: FileManagerProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'modified'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Load files from file system
  useEffect(() => {
    const loadFiles = async () => {
      try {
        setLoading(true);
        setError(null);
        const fileItems = await fileSystemService.readDirectory('.');
        setFiles(fileItems);
        logger.info('Files loaded successfully', { count: fileItems.length });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load files';
        setError(errorMessage);
        logger.error('Failed to load files', { error: errorMessage });
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, []);

  const toggleFolder = (directoryId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(directoryId)) {
      newExpanded.delete(directoryId);
    } else {
      newExpanded.add(directoryId);
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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  }, []);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, []);

  const handleFileUpload = useCallback(async (files: File[]) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        logger.info('Uploading file', { name: file.name, size: file.size });

        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          setUploadProgress(Math.round((i * 100 + progress) / files.length));
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        // Create new file item
        const newFile: FileItem = {
          id: `file-${Date.now()}-${i}`,
          name: file.name,
          path: `./${file.name}`,
          type: 'file',
          size: file.size,
          lastModified: new Date(),
        };

        setFiles(prev => [...prev, newFile]);
      }

      logger.info('Files uploaded successfully', { count: files.length });
    } catch (error) {
      logger.error('File upload failed', { error });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, []);

  const handleNewFolderClick = useCallback(() => {
    const folderName = prompt('Enter folder name:');
    if (folderName && folderName.trim()) {
      const newFolder: FileItem = {
        id: `folder-${Date.now()}`,
        name: folderName.trim(),
        path: `./${folderName.trim()}`,
        type: 'directory',
        lastModified: new Date(),
        children: [],
      };

      setFiles(prev => [...prev, newFolder]);
      logger.info('New folder created', { name: folderName });
    }
  }, []);

  const filteredFiles = React.useMemo(() => {
    const filterFiles = (items: FileItem[]): FileItem[] => {
      return items
        .filter(item => {
          const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
          if (item.type === 'directory' && item.children) {
            const filteredChildren = filterFiles(item.children);
            return matchesSearch || filteredChildren.length > 0;
          }
          return matchesSearch;
        })
        .map(item => ({
          ...item,
          children: item.children ? filterFiles(item.children) : undefined,
        }));
    };

    return filterFiles(files);
  }, [files, searchTerm]);

  const sortedFiles = React.useMemo(() => {
    const sortItems = (items: FileItem[]): FileItem[] => {
      return [...items]
        .sort((a, b) => {
          // Folders first
          if (a.type !== b.type) {
            return a.type === 'directory' ? -1 : 1;
          }

          let comparison = 0;
          switch (sortBy) {
            case 'name':
              comparison = a.name.localeCompare(b.name);
              break;
            case 'size':
              comparison = (a.size || 0) - (b.size || 0);
              break;
            case 'modified':
              comparison = new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime();
              break;
          }

          return sortOrder === 'asc' ? comparison : -comparison;
        })
        .map(item => ({
          ...item,
          children: item.children ? sortItems(item.children) : undefined,
        }));
    };

    return sortItems(filteredFiles);
  }, [filteredFiles, sortBy, sortOrder]);

  const renderFileItem = (item: FileItem, level: number = 0) => {
    const Icon = getFileIcon(item.name, item.type);
    const isExpanded = expandedFolders.has(item.id);
    const isSelected = selectedFiles.has(item.id);

    return (
      <div key={item.id} className="w-full">
        <div
          className={cn(
            'flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors hover:bg-muted/50',
            isSelected && 'bg-primary/10 border border-primary/20',
            level > 0 && 'ml-4'
          )}
          onClick={() =>
            item.type === 'directory' ? toggleFolder(item.id) : toggleFileSelection(item.id)
          }
        >
          {item.type === 'directory' && (
            <Button
              variant="ghost"
              size="sm"
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

          <span className="flex-1 text-sm font-medium truncate">{item.name}</span>

          <div className="flex items-center gap-1">
            {item.isStarred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
            {item.isShared && <Share className="h-3 w-3 text-blue-500" />}
            {item.permissions && (
              <Badge variant="secondary" className="text-xs">
                {item.permissions}
              </Badge>
            )}
            {item.size && (
              <span className="text-xs text-muted-foreground">{formatFileSize(item.size)}</span>
            )}
            <span className="text-xs text-muted-foreground">
              {item.lastModified instanceof Date
                ? item.lastModified.toLocaleDateString()
                : new Date(item.lastModified).toLocaleDateString()}
            </span>
          </div>
        </div>

        {item.type === 'directory' && isExpanded && item.children && (
          <div className="ml-2">{item.children.map(child => renderFileItem(child, level + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            File Manager
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{files.length} items</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-4 transition-colors',
            dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
            isUploading && 'border-primary bg-primary/5'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isUploading && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Uploading files...</span>
                <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          <div className="space-y-1">{sortedFiles.map(item => renderFileItem(item))}</div>

          {sortedFiles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No files found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleUploadClick}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button variant="outline" size="sm" onClick={handleNewFolderClick}>
              <Plus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {selectedFiles.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{selectedFiles.size} selected</span>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading files...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-red-500 mb-2">Error loading files</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {!loading && !error && files.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No files found</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
