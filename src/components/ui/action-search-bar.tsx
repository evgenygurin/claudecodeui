'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { logger } from '@/utils/logger';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Command,
  ArrowRight,
  FileText,
  MessageSquare,
  Settings,
  GitBranch,
  CheckSquare,
  Folder,
  Home,
  Zap,
  Sparkles,
} from 'lucide-react';

interface Action {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  shortcut?: string;
  action: () => void;
}

interface ActionSearchBarProps {
  className?: string;
  onActionSelect?: (action: Action) => void;
}

export function ActionSearchBar({ className, onActionSelect }: ActionSearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions: Action[] = [
    {
      id: 'new-chat',
      title: 'New Chat',
      description: 'Start a new conversation with Claude',
      icon: MessageSquare,
      category: 'Chat',
      shortcut: '⌘N',
      action: () => logger.info('New chat action triggered', {}),
    },
    {
      id: 'open-files',
      title: 'Open Files',
      description: 'Browse and open project files',
      icon: Folder,
      category: 'Files',
      shortcut: '⌘O',
      action: () => logger.info('Open files action triggered', {}),
    },
    {
      id: 'git-status',
      title: 'Git Status',
      description: 'Check repository status and changes',
      icon: GitBranch,
      category: 'Git',
      shortcut: '⌘G',
      action: () => logger.info('Git status action triggered', {}),
    },
    {
      id: 'create-task',
      title: 'Create Task',
      description: 'Add a new task to your project',
      icon: CheckSquare,
      category: 'Tasks',
      shortcut: '⌘T',
      action: () => logger.info('Create task action triggered', {}),
    },
    {
      id: 'project-settings',
      title: 'Project Settings',
      description: 'Configure project preferences',
      icon: Settings,
      category: 'Settings',
      shortcut: '⌘,',
      action: () => logger.info('Project settings action triggered', {}),
    },
    {
      id: 'deploy-project',
      title: 'Deploy Project',
      description: 'Deploy to Vercel',
      icon: Zap,
      category: 'Deploy',
      shortcut: '⌘D',
      action: () => logger.info('Deploy project action triggered', {}),
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      description: 'Get help from Claude AI',
      icon: Sparkles,
      category: 'AI',
      shortcut: '⌘A',
      action: () => logger.info('AI assistant action triggered', {}),
    },
  ];

  const filteredActions = actions.filter(
    action =>
      action.title.toLowerCase().includes(query.toLowerCase()) ||
      action.description.toLowerCase().includes(query.toLowerCase()) ||
      action.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }

      if (isOpen) {
        if (e.key === 'Escape') {
          setIsOpen(false);
          setQuery('');
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev < filteredActions.length - 1 ? prev + 1 : 0));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredActions.length - 1));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (filteredActions[selectedIndex]) {
            handleActionSelect(filteredActions[selectedIndex]);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredActions]);

  const handleActionSelect = (action: Action) => {
    action.action();
    onActionSelect?.(action);
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        className={cn(
          'relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64',
          className
        )}
        onClick={() => setIsOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search actions...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80" onClick={() => setIsOpen(false)}>
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search actions..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            autoFocus
          />
        </div>

        <div className="max-h-64 overflow-y-auto">
          {filteredActions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No actions found</div>
          ) : (
            <div className="space-y-1">
              {filteredActions.map((action, index) => (
                <div
                  key={action.id}
                  className={cn(
                    'flex items-center space-x-3 rounded-md p-2 cursor-pointer transition-colors',
                    index === selectedIndex
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent/50'
                  )}
                  onClick={() => handleActionSelect(action)}
                >
                  <action.icon className="h-4 w-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{action.title}</span>
                      <Badge variant="secondary" className="text-xs">
                        {action.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{action.description}</p>
                  </div>
                  {action.shortcut && (
                    <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                      {action.shortcut}
                    </kbd>
                  )}
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span>⌘K to open</span>
        </div>
      </div>
    </div>
  );
}
