import { getErrorMessage } from '@/utils/error-handler';
import { createError } from '@/utils/error-handler';
/**
 * Project Service
 * Handles project management, file system operations, and project data
 */

import { EventBus } from '@/events/event-bus';
import { eventFactories } from '@/events/events';
import { Project, CreateProjectDto, UpdateProjectDto, ProjectRepository } from '@/types';
import { z } from 'zod';
import { logger } from '@/utils/logger';

// Validation schemas
const createProjectDtoSchema = z.object({
  name: z.string().min(1).max(100),
  path: z.string().min(1),
  description: z.string().max(500).optional(),
});

const updateProjectDtoSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  path: z.string(),
  fullPath: z.string(),
  description: z.string().optional(),
  lastModified: z.date(),
  files: z.array(z.any()).default([]),
  sessions: z.array(z.any()).default([]),
  cursorSessions: z.array(z.any()).default([]),
  sessionMeta: z.object({
    total: z.number().default(0),
    claude: z.number().default(0),
    cursor: z.number().default(0),
    codegen: z.number().default(0),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export class ProjectService {
  private readonly API_BASE = '/api/projects';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(
    private projectRepository?: ProjectRepository,
    private eventBus?: EventBus
  ) {}

  /**
   * Initialize the service
   */
  async initialize(): Promise<void> {
    // Emit system ready event
    if (this.eventBus) {
      await this.eventBus.emit('system.ready', { service: 'ProjectService' });
    }
  }

  /**
   * Get all projects
   */
  async getAll(): Promise<Project[]> {
    try {
      // Check cache first
      const cacheKey = 'all_projects';
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached as Project[];
      }

      // Use repository if available, otherwise fall back to API
      let projects: Project[];
      if (this.projectRepository) {
        projects = await this.projectRepository.findAll();
      } else {
        const response = await fetch(this.API_BASE);

        if (!response.ok) {
          throw createError('Failed to fetch projects');
        }

        const result = await response.json();
        projects = result.data || [];
      }

      // Validate and cache results
      const validatedProjects = projects.map(project => this.validateProject(project));
      this.setCache(cacheKey, validatedProjects);

      return validatedProjects;
    } catch (error) {
      // Emit error event
      if (this.eventBus) {
        await this.eventBus.emitAppEvent(
          eventFactories.errorOccurred(
            error instanceof Error ? error : new Error('Failed to fetch projects'),
            'ProjectService.getAll'
          )
        );
      }

      throw createError(
        `Failed to fetch projects: ${error instanceof Error ? getErrorMessage(error) : 'Unknown error'}`
      );
    }
  }

  /**
   * Get project by ID
   */
  async getById(id: string): Promise<Project | null> {
    try {
      const response = await fetch(`${this.API_BASE}/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw createError('Failed to fetch project');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      logger.error('Error fetching project', { error: getErrorMessage(error), projectId: id });
      throw createError(
        `Failed to fetch project: ${error instanceof Error ? getErrorMessage(error) : 'Unknown error'}`
      );
    }
  }

  /**
   * Get project by path
   */
  async getByPath(path: string): Promise<Project | null> {
    try {
      const response = await fetch(`${this.API_BASE}/by-path`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw createError('Failed to fetch project by path');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      logger.error('Error fetching project by path', { error: getErrorMessage(error), path });
      throw createError(
        `Failed to fetch project by path: ${error instanceof Error ? getErrorMessage(error) : 'Unknown error'}`
      );
    }
  }

  /**
   * Create new project
   */
  async create(projectData: CreateProjectDto): Promise<Project> {
    try {
      const response = await fetch(this.API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
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

  /**
   * Update project
   */
  async update(id: string, projectData: UpdateProjectDto): Promise<Project> {
    try {
      const response = await fetch(`${this.API_BASE}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw createError('Failed to update project');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      logger.error('Error updating project', {
        error: getErrorMessage(error),
        projectId: id,
        projectData,
      });
      throw createError(
        `Failed to update project: ${error instanceof Error ? getErrorMessage(error) : 'Unknown error'}`
      );
    }
  }

  /**
   * Delete project
   */
  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw createError('Failed to delete project');
      }
    } catch (error) {
      logger.error('Error deleting project', { error: getErrorMessage(error), projectId: id });
      throw createError(
        `Failed to delete project: ${error instanceof Error ? getErrorMessage(error) : 'Unknown error'}`
      );
    }
  }

  /**
   * Scan file system for projects
   */
  async scanFileSystem(): Promise<Project[]> {
    try {
      const response = await fetch(`${this.API_BASE}/scan`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw createError('Failed to scan file system');
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      logger.error('Error scanning file system', { error: getErrorMessage(error) });
      throw createError(
        `Failed to scan file system: ${error instanceof Error ? getErrorMessage(error) : 'Unknown error'}`
      );
    }
  }

  /**
   * Get project statistics
   */
  async getStatistics(projectId: string): Promise<{
    fileCount: number;
    sessionCount: number;
    lastActivity: string;
    size: number;
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/${projectId}/statistics`);

      if (!response.ok) {
        throw createError('Failed to fetch project statistics');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      logger.error('Error fetching project statistics', { error: getErrorMessage(error) });
      throw createError(
        `Failed to fetch project statistics: ${error instanceof Error ? getErrorMessage(error) : 'Unknown error'}`
      );
    }
  }

  /**
   * Validate project path
   */
  async validatePath(path: string): Promise<{
    isValid: boolean;
    exists: boolean;
    isDirectory: boolean;
    isWritable: boolean;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.API_BASE}/validate-path`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path }),
      });

      if (!response.ok) {
        throw createError('Failed to validate path');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      logger.error('Error validating path:', error);
      throw createError(
        `Failed to validate path: ${error instanceof Error ? getErrorMessage(error) : 'Unknown error'}`
      );
    }
  }

  /**
   * Get from cache
   */
  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  /**
   * Set cache
   */
  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Validate project data
   */
  private validateProject(project: any): Project {
    try {
      return projectSchema.parse(project);
    } catch (error) {
      throw createError(
        `Invalid project data: ${error instanceof Error ? getErrorMessage(error) : 'Unknown error'}`
      );
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    keys: string[];
    hitRate: number;
  } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      hitRate: 0, // Would need to track hits/misses for accurate rate
    };
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    this.clearCache();
  }
}

// Export singleton instance (for backward compatibility)
export const projectService = new ProjectService();
