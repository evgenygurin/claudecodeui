import { getErrorMessage } from '@/utils/error-handler';
import { createError } from '@/utils/error-handler';
import { logger } from '@/utils/logger';
/**
 * Project Repository Interface and Implementation
 * Handles data persistence and retrieval for projects
 */

import { Project, CreateProjectDto, UpdateProjectDto } from '@/types';

export interface ProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  findByPath(path: string): Promise<Project | null>;
  create(project: CreateProjectDto): Promise<Project>;
  update(id: string, project: UpdateProjectDto): Promise<Project>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  count(): Promise<number>;
}

/**
 * File System Project Repository Implementation
 * Reads and writes project data to the file system
 */
export class FileSystemProjectRepository implements ProjectRepository {
  private readonly projectsPath: string;
  private readonly projectsFile: string;

  constructor(projectsPath: string = '~/.claude/projects/') {
    this.projectsPath = projectsPath;
    this.projectsFile = `${projectsPath}/projects.json`;
  }

  async findAll(): Promise<Project[]> {
    try {
      // In a real implementation, this would read from the file system
      // For now, we'll return mock data
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw createError('Failed to fetch projects');
      }
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      logger.error('Error reading projects from file system', { error: getErrorMessage(error) });
      return [];
    }
  }

  async findById(id: string): Promise<Project | null> {
    try {
      const projects = await this.findAll();
      return projects.find(project => project.id === id) || null;
    } catch (error) {
      logger.error('Error finding project by ID', { error: getErrorMessage(error), id });
      return null;
    }
  }

  async findByPath(path: string): Promise<Project | null> {
    try {
      const projects = await this.findAll();
      return projects.find(project => project.path === path || project.fullPath === path) || null;
    } catch (error) {
      logger.error('Error finding project by path', { error: getErrorMessage(error), path });
      return null;
    }
  }

  async create(projectData: CreateProjectDto): Promise<Project> {
    try {
      const newProject: Project = {
        id: this.generateId(),
        name: projectData.name,
        path: projectData.path,
        fullPath: projectData.path,
        description: projectData.description || '',
        lastModified: new Date(),
        files: [],
        sessions: [],
        cursorSessions: [],
        sessionMeta: { total: 0, claude: 0, cursor: 0, codegen: 0 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // In a real implementation, this would write to the file system
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        throw createError('Failed to create project');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      logger.error('Error creating project', { error: getErrorMessage(error), projectData });
      throw createError(
        `Failed to create project: ${error instanceof Error ? getErrorMessage(error) : 'Unknown error'}`
      );
    }
  }

  async update(id: string, projectData: UpdateProjectDto): Promise<Project> {
    try {
      const existingProject = await this.findById(id);
      if (!existingProject) {
        throw createError('Project not found');
      }

      const updatedProject: Project = {
        ...existingProject,
        ...projectData,
        updatedAt: new Date().toISOString(),
      };

      // In a real implementation, this would update the file system
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProject),
      });

      if (!response.ok) {
        throw createError('Failed to update project');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      logger.error('Error updating project', { error: getErrorMessage(error), id, projectData });
      throw createError(
        `Failed to update project: ${error instanceof Error ? getErrorMessage(error) : 'Unknown error'}`
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw createError('Failed to delete project');
      }
    } catch (error) {
      logger.error('Error deleting project:', error);
      throw createError(
        `Failed to delete project: ${error instanceof Error ? getErrorMessage(error) : 'Unknown error'}`
      );
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const project = await this.findById(id);
      return project !== null;
    } catch (error) {
      logger.error('Error checking project existence:', error);
      return false;
    }
  }

  async count(): Promise<number> {
    try {
      const projects = await this.findAll();
      return projects.length;
    } catch (error) {
      logger.error('Error counting projects:', error);
      return 0;
    }
  }

  /**
   * Scan file system for Claude projects
   */
  async scanFileSystem(): Promise<Project[]> {
    try {
      // In a real implementation, this would scan the file system
      // for .claude directories and parse project metadata
      const response = await fetch('/api/projects/scan', {
        method: 'POST',
      });

      if (!response.ok) {
        throw createError('Failed to scan file system');
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      logger.error('Error scanning file system:', error);
      return [];
    }
  }

  /**
   * Parse JSONL files for project sessions
   */
  private async parseProjectSessions(projectPath: string): Promise<any[]> {
    try {
      // In a real implementation, this would read and parse JSONL files
      // from the project directory
      return [];
    } catch (error) {
      logger.error('Error parsing project sessions:', error);
      return [];
    }
  }

  /**
   * Generate unique project ID
   */
  private generateId(): string {
    return `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * In-Memory Project Repository Implementation
 * For testing and development purposes
 */
export class InMemoryProjectRepository implements ProjectRepository {
  private projects: Map<string, Project> = new Map();

  async findAll(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async findById(id: string): Promise<Project | null> {
    return this.projects.get(id) || null;
  }

  async findByPath(path: string): Promise<Project | null> {
    for (const project of this.projects.values()) {
      if (project.path === path || project.fullPath === path) {
        return project;
      }
    }
    return null;
  }

  async create(projectData: CreateProjectDto): Promise<Project> {
    const newProject: Project = {
      id: this.generateId(),
      name: projectData.name,
      path: projectData.path,
      fullPath: projectData.path,
      description: projectData.description || '',
      lastModified: new Date(),
      files: [],
      sessions: [],
      cursorSessions: [],
      sessionMeta: { total: 0, claude: 0, cursor: 0, codegen: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.projects.set(newProject.id, newProject);
    return newProject;
  }

  async update(id: string, projectData: UpdateProjectDto): Promise<Project> {
    const existingProject = this.projects.get(id);
    if (!existingProject) {
      throw createError('Project not found');
    }

    const updatedProject: Project = {
      ...existingProject,
      ...projectData,
      updatedAt: new Date().toISOString(),
    };

    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async delete(id: string): Promise<void> {
    this.projects.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.projects.has(id);
  }

  async count(): Promise<number> {
    return this.projects.size;
  }

  private generateId(): string {
    return `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
