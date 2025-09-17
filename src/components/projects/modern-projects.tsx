'use client';

import * as React from 'react';
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FolderOpen,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Star,
  GitBranch,
  Calendar,
  Users,
  Code,
  Activity,
  ExternalLink,
} from 'lucide-react';
import { logger } from '@/utils/logger';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'paused' | 'archived';
  progress: number;
  createdAt: Date;
  updatedAt: Date;
  technologies: string[];
  collaborators: number;
  isStarred: boolean;
  repository?: string;
}

interface ModernProjectsProps {
  className?: string;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Claude Code UI',
    description: 'Modern web interface for Claude Code with AI integration',
    status: 'active',
    progress: 75,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    technologies: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
    collaborators: 3,
    isStarred: true,
    repository: 'https://github.com/user/claude-code-ui',
  },
  {
    id: '2',
    name: 'AI Chat Interface',
    description: 'Advanced chat interface with multiple AI providers',
    status: 'active',
    progress: 60,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
    technologies: ['React', 'AI SDK', 'Vercel'],
    collaborators: 2,
    isStarred: false,
  },
  {
    id: '3',
    name: 'File Manager Pro',
    description: 'Professional file management system with cloud sync',
    status: 'completed',
    progress: 100,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-30'),
    technologies: ['Vue.js', 'Node.js', 'AWS'],
    collaborators: 5,
    isStarred: true,
  },
];

const getStatusColor = (status: Project['status']) => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'completed':
      return 'bg-blue-500';
    case 'paused':
      return 'bg-yellow-500';
    case 'archived':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusText = (status: Project['status']) => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'completed':
      return 'Completed';
    case 'paused':
      return 'Paused';
    case 'archived':
      return 'Archived';
    default:
      return 'Unknown';
  }
};

export function ModernProjects({ className }: ModernProjectsProps) {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    technologies: '',
  });

  const filteredProjects = React.useMemo(() => {
    return projects.filter(
      project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [projects, searchTerm]);

  const handleCreateProject = useCallback(() => {
    if (!newProject.name.trim()) return;

    const project: Project = {
      id: `project-${Date.now()}`,
      name: newProject.name.trim(),
      description: newProject.description.trim(),
      status: 'active',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      technologies: newProject.technologies
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0),
      collaborators: 1,
      isStarred: false,
    };

    setProjects(prev => [project, ...prev]);
    setNewProject({ name: '', description: '', technologies: '' });
    setIsCreateDialogOpen(false);

    logger.info('Project created', { name: project.name });
  }, [newProject]);

  const handleToggleStar = useCallback((projectId: string) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId ? { ...project, isStarred: !project.isStarred } : project
      )
    );
  }, []);

  const handleDeleteProject = useCallback((projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(prev => prev.filter(project => project.id !== projectId));
      logger.info('Project deleted', { projectId });
    }
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage your development projects and track progress
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Add a new project to your workspace</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Project Name</label>
                <Input
                  placeholder="Enter project name"
                  value={newProject.name}
                  onChange={e => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Enter project description"
                  value={newProject.description}
                  onChange={e => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Technologies</label>
                <Input
                  placeholder="React, TypeScript, Next.js (comma separated)"
                  value={newProject.technologies}
                  onChange={e => setNewProject(prev => ({ ...prev, technologies: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject}>Create Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{projects.length}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">
                  {projects.filter(p => p.status === 'active').length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">
                  {projects.filter(p => p.status === 'completed').length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Starred</p>
                <p className="text-2xl font-bold">{projects.filter(p => p.isStarred).length}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn('w-3 h-3 rounded-full', getStatusColor(project.status))} />
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  {project.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleToggleStar(project.id)}>
                      <Star className="h-4 w-4 mr-2" />
                      {project.isStarred ? 'Unstar' : 'Star'}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    {project.repository && (
                      <DropdownMenuItem asChild>
                        <a href={project.repository} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Repository
                        </a>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1">
                {project.technologies.slice(0, 3).map(tech => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {project.technologies.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{project.technologies.length - 3}
                  </Badge>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {project.collaborators}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(project.updatedAt)}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {getStatusText(project.status)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Create your first project to get started'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
