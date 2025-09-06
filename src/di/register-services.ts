import { logger } from '@/utils/logger';
/**
 * Service Registration
 * Registers all services with the dependency injection container
 */

import { Container, TOKENS } from './container';
import { EventBus, eventBus } from '@/events/event-bus';
import { AuthService, authService } from '@/services/auth.service';
import { ProjectService, projectService } from '@/services/project.service';
import { ChatService, chatService } from '@/services/chat.service';
import {
  FileSystemProjectRepository,
  InMemoryProjectRepository,
  ProjectRepository,
} from '@/repositories/project.repository';
import {
  ClaudeSessionRepository,
  InMemorySessionRepository,
  SessionRepository,
} from '@/repositories/session.repository';
import { ClaudeProvider } from '@/providers/claude.provider';
import { CursorProvider } from '@/providers/cursor.provider';

/**
 * Register all services with the container
 */
export function registerServices(container: Container): void {
  // Infrastructure services
  container.registerInstance(TOKENS.EVENT_BUS, eventBus);
  container.registerInstance(TOKENS.CONTAINER, container);

  // Repositories
  container.registerSingleton<ProjectRepository>(
    TOKENS.PROJECT_REPOSITORY,
    () => new FileSystemProjectRepository()
  );

  container.registerSingleton<SessionRepository>(
    TOKENS.SESSION_REPOSITORY,
    () => new ClaudeSessionRepository()
  );

  // Services
  container.registerInstance(TOKENS.AUTH_SERVICE, authService);
  container.registerInstance(TOKENS.PROJECT_SERVICE, projectService);
  container.registerInstance(TOKENS.CHAT_SERVICE, chatService);

  // Providers
  container.registerSingleton(TOKENS.CLAUDE_PROVIDER, () => new ClaudeProvider());

  container.registerSingleton(TOKENS.CURSOR_PROVIDER, () => new CursorProvider());
}

/**
 * Register services for testing
 */
export function registerTestServices(container: Container): void {
  // Infrastructure services
  container.registerInstance(TOKENS.EVENT_BUS, eventBus);
  container.registerInstance(TOKENS.CONTAINER, container);

  // Repositories (in-memory for testing)
  container.registerSingleton<ProjectRepository>(
    TOKENS.PROJECT_REPOSITORY,
    () => new InMemoryProjectRepository()
  );

  container.registerSingleton<SessionRepository>(
    TOKENS.SESSION_REPOSITORY,
    () => new InMemorySessionRepository()
  );

  // Services
  container.registerInstance(TOKENS.AUTH_SERVICE, authService);
  container.registerInstance(TOKENS.PROJECT_SERVICE, projectService);
  container.registerInstance(TOKENS.CHAT_SERVICE, chatService);

  // Providers
  container.registerSingleton(TOKENS.CLAUDE_PROVIDER, () => new ClaudeProvider());

  container.registerSingleton(TOKENS.CURSOR_PROVIDER, () => new CursorProvider());
}

/**
 * Register services for development
 */
export function registerDevelopmentServices(container: Container): void {
  // Use in-memory repositories for development
  registerTestServices(container);
}

/**
 * Register services for production
 */
export function registerProductionServices(container: Container): void {
  // Use file system repositories for production
  registerServices(container);
}

/**
 * Auto-register services based on environment
 */
export function autoRegisterServices(container: Container): void {
  const environment = process.env.NODE_ENV || 'development';

  switch (environment) {
    case 'test':
      registerTestServices(container);
      break;
    case 'production':
      registerProductionServices(container);
      break;
    default:
      registerDevelopmentServices(container);
      break;
  }
}

/**
 * Service factory functions
 */
export const serviceFactories = {
  createProjectService: (container: Container) => {
    const projectRepository = container.resolve<ProjectRepository>(TOKENS.PROJECT_REPOSITORY);
    const eventBus = container.resolve<EventBus>(TOKENS.EVENT_BUS);

    return new ProjectService();
  },

  createChatService: (container: Container) => {
    const sessionRepository = container.resolve<SessionRepository>(TOKENS.SESSION_REPOSITORY);
    const eventBus = container.resolve<EventBus>(TOKENS.EVENT_BUS);

    return new ChatService();
  },

  createAuthService: (container: Container) => {
    const eventBus = container.resolve<EventBus>(TOKENS.EVENT_BUS);

    return new AuthService();
  },
};

/**
 * Service decorators
 */
export const serviceDecorators = {
  withLogging: <T extends object>(service: T, name: string): T => {
    // Add logging functionality to service
    return new Proxy(service, {
      get(target, prop) {
        const originalMethod = target[prop as keyof T];
        if (typeof originalMethod === 'function') {
          return function (...args: any[]) {
            logger.info(`[${name}] Calling method: ${String(prop)}`);
            const result = originalMethod.apply(target, args);
            logger.info(`[${name}] Method ${String(prop)} completed`);
            return result;
          };
        }
        return originalMethod;
      },
    });
  },

  withErrorHandling: <T extends object>(service: T, name: string): T => {
    // Add error handling to service
    return new Proxy(service, {
      get(target, prop) {
        const originalMethod = target[prop as keyof T];
        if (typeof originalMethod === 'function') {
          return function (...args: any[]) {
            try {
              return originalMethod.apply(target, args);
            } catch (error) {
              logger.error(`[${name}] Error in method ${String(prop)}:`, error);
              throw error;
            }
          };
        }
        return originalMethod;
      },
    });
  },

  withCaching: <T extends object>(service: T, cacheKey: string): T => {
    // Add caching functionality to service
    const cache = new Map();

    return new Proxy(service, {
      get(target, prop) {
        const originalMethod = target[prop as keyof T];
        if (typeof originalMethod === 'function') {
          return function (...args: any[]) {
            const key = `${cacheKey}:${String(prop)}:${JSON.stringify(args)}`;

            if (cache.has(key)) {
              return cache.get(key);
            }

            const result = originalMethod.apply(target, args);
            cache.set(key, result);

            return result;
          };
        }
        return originalMethod;
      },
    });
  },
};
