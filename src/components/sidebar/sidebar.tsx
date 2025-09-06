'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Search,
  Home,
  MessageSquare,
  FolderOpen,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  FileText,
  Code,
  Database,
  Zap,
  Users,
  BarChart3,
  Bell,
  HelpCircle,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
  onTabChange?: (tab: string) => void;
  activeTab?: string;
}

const navigationItems = [
  { icon: Home, label: 'Dashboard', tab: 'dashboard' },
  { icon: MessageSquare, label: 'Chat', tab: 'chat' },
  { icon: FolderOpen, label: 'Projects', tab: 'projects' },
  { icon: FileText, label: 'Files', tab: 'files' },
  { icon: Code, label: 'Code Editor', tab: 'ai-tools' },
  { icon: Database, label: 'Database', tab: 'projects' },
  { icon: Zap, label: 'Integrations', tab: 'integrations' },
  { icon: Users, label: 'Team', tab: 'projects' },
  { icon: BarChart3, label: 'Analytics', tab: 'projects' },
];

const quickActions = [
  { icon: Plus, label: 'New Project', tab: 'deploy' },
  { icon: FileText, label: 'New File', tab: 'files' },
  { icon: MessageSquare, label: 'New Chat', tab: 'chat' },
];

export function Sidebar({
  className,
  isCollapsed = false,
  onToggle,
  onTabChange,
  activeTab,
}: SidebarProps) {
  return (
    <div
      className={cn(
        'flex h-full flex-col bg-card border-r border-border transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">Claude Code</span>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-10" />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navigationItems.map(item => (
          <Button
            key={item.label}
            variant={activeTab === item.tab ? 'secondary' : 'ghost'}
            className={cn('w-full justify-start', isCollapsed && 'px-2')}
            onClick={() => onTabChange?.(item.tab)}
          >
            <item.icon className={cn('h-4 w-4', !isCollapsed && 'mr-3')} />
            {!isCollapsed && item.label}
          </Button>
        ))}
      </nav>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map(action => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => onTabChange?.(action.tab)}
                >
                  <action.icon className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
