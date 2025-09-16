'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { ModernFileManager } from '@/components/file-manager';
import { ModernChatInterface } from '@/components/chat';
import { IntegrationsPage } from '@/components/integrations';
import { ModernProjects } from '@/components/projects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DeployButton } from '@/components/ui/deploy-button';
import { ActionSearchBar } from '@/components/ui/action-search-bar';
import { AICardGeneration } from '@/components/ai';
import { VercelTabs } from '@/components/ui/vercel-tabs';
import { ImageToASCII } from '@/components/ui/image-to-ascii';

import {
  MessageSquare,
  FolderOpen,
  Code,
  Settings,
  Zap,
  BarChart3,
  Users,
  Database,
  BookOpen,
  Wand2,
  Image as ImageIcon,
  FileText,
  Sparkles,
  Search,
} from 'lucide-react';

export default function HomePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const dashboardStats = [
    { title: 'Active Projects', value: '12', icon: FolderOpen, change: '+2 this week' },
    { title: 'Chat Sessions', value: '48', icon: MessageSquare, change: '+5 today' },
    { title: 'Code Files', value: '1,234', icon: Code, change: '+23 today' },
    { title: 'Integrations', value: '8', icon: Zap, change: '2 new' },
  ];

  const recentActivity = [
    { action: 'Created new project', project: 'claude-code-ui', time: '2 hours ago' },
    { action: 'Updated file', project: 'src/components/Button.tsx', time: '4 hours ago' },
    { action: 'Started chat session', project: 'API Integration', time: '6 hours ago' },
    { action: 'Deployed to Vercel', project: 'claude-code-ui', time: '1 day ago' },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        onTabChange={setActiveTab}
        activeTab={activeTab}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Claude Code UI</h1>
              <p className="text-muted-foreground">Modern interface for AI-powered development</p>
            </div>
            <div className="flex items-center gap-2">
              <ActionSearchBar
                className="w-64"
                onActionSelect={action => {
                  if (action.id === 'new-chat') setActiveTab('chat');
                  else if (action.id === 'open-files') setActiveTab('files');
                  else if (action.id === 'deploy-project') setActiveTab('deploy');
                  else if (action.id === 'project-settings') setActiveTab('projects');
                  else if (action.id === 'ai-assistant') setActiveTab('ai-tools');
                }}
              />
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <DeployButton />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="mx-6 mt-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
              <TabsTrigger value="docs">Documentation</TabsTrigger>
              <TabsTrigger value="deploy">Deploy</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="dashboard" className="h-full m-0 p-6">
                <div className="h-full overflow-y-auto">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {dashboardStats.map(stat => (
                      <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                          <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <p className="text-xs text-muted-foreground">{stat.change}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center space-x-4">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                              <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium leading-none">
                                  {activity.action}
                                </p>
                                <p className="text-sm text-muted-foreground">{activity.project}</p>
                              </div>
                              <div className="text-sm text-muted-foreground">{activity.time}</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <Button
                            variant="outline"
                            className="h-20 flex flex-col items-center justify-center"
                            onClick={() => setActiveTab('deploy')}
                          >
                            <FolderOpen className="h-6 w-6 mb-2" />
                            New Project
                          </Button>
                          <Button
                            variant="outline"
                            className="h-20 flex flex-col items-center justify-center"
                            onClick={() => setActiveTab('chat')}
                          >
                            <MessageSquare className="h-6 w-6 mb-2" />
                            New Chat
                          </Button>
                          <Button
                            variant="outline"
                            className="h-20 flex flex-col items-center justify-center"
                            onClick={() => setActiveTab('files')}
                          >
                            <Code className="h-6 w-6 mb-2" />
                            New File
                          </Button>
                          <Button
                            variant="outline"
                            className="h-20 flex flex-col items-center justify-center"
                            onClick={() => setActiveTab('projects')}
                          >
                            <Database className="h-6 w-6 mb-2" />
                            Database
                          </Button>
                          <Button
                            variant="outline"
                            className="h-20 flex flex-col items-center justify-center"
                            onClick={() => window.open('/components-demo', '_blank')}
                          >
                            <Sparkles className="h-6 w-6 mb-2" />
                            Components Demo
                          </Button>
                          <Button
                            variant="outline"
                            className="h-20 flex flex-col items-center justify-center"
                            onClick={() => setActiveTab('ai-tools')}
                          >
                            <Wand2 className="h-6 w-6 mb-2" />
                            AI Tools
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="chat" className="h-full m-0">
                <ModernChatInterface />
              </TabsContent>

              <TabsContent value="files" className="h-full m-0">
                <ModernFileManager />
              </TabsContent>

              <TabsContent value="integrations" className="h-full m-0">
                <IntegrationsPage />
              </TabsContent>

              <TabsContent value="projects" className="h-full m-0 p-6">
                <div className="h-full overflow-y-auto">
                  <ModernProjects />
                </div>
              </TabsContent>

              <TabsContent value="ai-tools" className="h-full m-0 p-6">
                <div className="h-full overflow-y-auto space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <AICardGeneration />
                    <ImageToASCII />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="docs" className="h-full m-0 p-6">
                <div className="h-full overflow-y-auto">
                  {/* <DocumentationStarter /> */}
                  <div className="text-center text-muted-foreground">
                    Documentation component temporarily disabled for deployment
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="deploy" className="h-full m-0 p-6">
                <div className="h-full overflow-y-auto">
                  <VercelTabs />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
