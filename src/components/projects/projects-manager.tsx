'use client';

import * as React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Folder,
  GitBranch,
  Calendar,
  User,
  Settings,
  Trash2,
  Edit,
  Eye,
  Star,
  MoreHorizontal,
  Search,
  Filter,
  Grid3X3,
  List,
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived' | 'draft';
  lastModified: Date;
  owner: string;
  repository?: string;
  technologies: string[];
  isStarred: boolean;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Claude Code UI',
    description: 'Modern interface for AI-powered development',
    status: 'active',
    lastModified: new Date(Date.now() - 1000 * 60 * 30),
    owner: 'evgenygurin',
    repository: 'claudecodeui',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    isStarred: true,
  },
  {
    id: '2',
    name: 'TaskMaster AI',
    description: 'AI-powered task management system',
    status: 'active',
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 2),
    owner: 'evgenygurin',
    repository: 'taskmaster-ai',
    technologies: ['React', 'Node.js', 'MongoDB'],
    isStarred: false,
  },
  {
    id: '3',
    name: 'E-commerce Platform',
    description: 'Full-stack e-commerce solution',
    status: 'draft',
    lastModified: new Date(Date.now() - 1000 * 60 * 60 * 24),
    owner: 'evgenygurin',
    technologies: ['Vue.js', 'Express', 'PostgreSQL'],
    isStarred: false,
  },
];

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'archived' | 'draft'>('all');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const createNewProject = () => {
    const name = prompt('Enter project name:');
    if (name && name.trim()) {
      const newProject: Project = {
        id: Date.now().toString(),
        name: name.trim(),
        description: 'New project created',
        status: 'draft',
        lastModified: new Date(),
        owner: 'evgenygurin',
        technologies: [],
        isStarred: false,
      };
      setProjects(prev => [newProject, ...prev]);
      console.log('Created new project:', newProject);
    }
  };

  const toggleStar = (projectId: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, isStarred: !project.isStarred }
        : project
    ));
  };

  const deleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(prev => prev.filter(project => project.id !== projectId));
      console.log('Deleted project:', projectId);
    }
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Projects
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{projects.length} projects</Badge>
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
              placeholder="Search projects..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>

          <Button onClick={createNewProject} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'active', 'archived', 'draft'] as const).map(status => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {viewMode === 'grid' ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map(project => (
              <Card key={project.id} className="relative group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {project.name}
                        {project.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {project.description}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      onClick={() => toggleStar(project.id)}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      {project.repository && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <GitBranch className="h-3 w-3" />
                          {project.repository}
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map(tech => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {project.owner}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {project.lastModified.toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredProjects.map(project => (
              <Card key={project.id} className="group">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <Folder className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium flex items-center gap-2">
                            {project.name}
                            {project.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          </h3>
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                        {project.repository && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <GitBranch className="h-3 w-3" />
                            {project.repository}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map(tech => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        {project.lastModified.toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredProjects.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No projects found</p>
            <p className="text-sm">Try adjusting your search or create a new project</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
