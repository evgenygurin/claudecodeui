import { logger } from '@/utils/logger';
/**
 * Architecture Usage Examples
 * Demonstrates how to use the new architecture with DI, events, and services
 */

import { container, TOKENS } from '@/di/container';
import { registerServices, autoRegisterServices } from '@/di/register-services';
import { eventBus } from '@/events/event-bus';
import { eventFactories, EVENT_CATEGORIES } from '@/events/events';
import { AuthService } from '@/services/auth.service';
import { ProjectService } from '@/services/project.service';
import { ChatService } from '@/services/chat.service';

/**
 * Example 1: Basic Service Registration and Usage
 */
export async function basicServiceUsage() {
  // Register all services
  autoRegisterServices(container);

  // Get services from container
  const authService = container.resolve<AuthService>(TOKENS.AUTH_SERVICE);
  const projectService = container.resolve<ProjectService>(TOKENS.PROJECT_SERVICE);
  const chatService = container.resolve<ChatService>(TOKENS.CHAT_SERVICE);

  // Initialize services
  await authService.initialize();
  await projectService.initialize();
  await chatService.initialize();

  // Use services
  try {
    const projects = await projectService.getAll();
    logger.info('Projects:', projects);
  } catch (error) {
    logger.error('Error fetching projects:', error);
  }
}

/**
 * Example 2: Event-Driven Architecture
 */
export async function eventDrivenExample() {
  // Set up event listeners
  eventBus.on('project.created', event => {
    logger.info('Project created:', event.data.project);
  });

  eventBus.on('session.started', event => {
    logger.info('Session started:', event.data.sessionId);
  });

  eventBus.on('error.occurred', event => {
    logger.error('Error occurred:', event.data.error);
  });

  // Emit events
  await eventBus.emitAppEvent(
    eventFactories.projectCreated({
      id: '1',
      name: 'Test Project',
      path: '/test/path',
      fullPath: '/test/path',
      description: 'Test project',
      lastModified: new Date(),
      files: [],
      sessions: [],
      cursorSessions: [],
      sessionMeta: { total: 0, claude: 0, cursor: 0, codegen: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  );

  await eventBus.emitAppEvent(eventFactories.sessionStarted('session-1', 'project-1', 'claude'));
}

/**
 * Example 3: Service with Event Integration
 */
export async function serviceWithEventsExample() {
  // Register services with event bus
  const authService = new AuthService(eventBus);
  const projectService = new ProjectService(undefined, eventBus);
  const chatService = new ChatService(undefined, eventBus);

  // Initialize services
  await authService.initialize();
  await projectService.initialize();
  await chatService.initialize();

  // Services will now emit events automatically
  try {
    await authService.login({
      email: 'test@example.com',
      password: 'password123',
    });
  } catch (error) {
    // Error events will be emitted automatically
    logger.error('Login failed:', error);
  }
}

/**
 * Example 4: Advanced Event Handling
 */
export async function advancedEventHandling() {
  // Set up event filtering
  const projectEvents = eventBus.createFilter('project.*', event =>
    event.type.startsWith('project.')
  );

  // Set up event middleware
  const loggingMiddleware = eventBus.createMiddleware('*', (data, next) => {
    logger.info('Event received:', data);
    next();
  });

  // Wait for specific events
  const projectCreatedPromise = eventBus.waitFor('project.created', 5000);
  const sessionStartedPromise = eventBus.waitFor('session.started', 5000);

  // Emit events
  await eventBus.emitAppEvent(
    eventFactories.projectCreated({
      id: '2',
      name: 'Another Project',
      path: '/another/path',
      fullPath: '/another/path',
      description: 'Another test project',
      lastModified: new Date(),
      files: [],
      sessions: [],
      cursorSessions: [],
      sessionMeta: { total: 0, claude: 0, cursor: 0, codegen: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  );

  // Wait for events
  try {
    const [projectEvent, sessionEvent] = await Promise.all([
      projectCreatedPromise,
      sessionStartedPromise,
    ]);
    logger.info('Events received:', { projectEvent, sessionEvent });
  } catch (error) {
    logger.error('Timeout waiting for events:', error);
  }

  // Cleanup
  projectEvents.unsubscribe();
  loggingMiddleware.unsubscribe();
}

/**
 * Example 5: Service Decorators
 */
export async function serviceDecoratorsExample() {
  // Get services from container
  const authService = container.resolve<AuthService>(TOKENS.AUTH_SERVICE);
  const projectService = container.resolve<ProjectService>(TOKENS.PROJECT_SERVICE);

  // Apply decorators
  container.decorate(TOKENS.AUTH_SERVICE, service => {
    return new Proxy(service, {
      get(target, prop) {
        const originalMethod = target[prop as keyof AuthService];
        if (typeof originalMethod === 'function') {
          return function (...args: any[]) {
            logger.info(`[AUTH] Calling method: ${String(prop, {})}`);
            const result = originalMethod.apply(target, args);
            logger.info(`[AUTH] Method ${String(prop, {})} completed`);
            return result;
          };
        }
        return originalMethod;
      },
    });
  });

  // Use decorated service
  const decoratedAuthService = container.resolve<AuthService>(TOKENS.AUTH_SERVICE);
  await decoratedAuthService.initialize();
}

/**
 * Example 6: Event Metrics and Monitoring
 */
export async function eventMetricsExample() {
  // Get event metrics
  const metrics = eventBus.getMetrics();
  logger.info('Event metrics:', metrics);

  // Get event information
  const eventInfo = eventBus.getEventInfo('project.created');
  logger.info('Event info:', eventInfo);

  // Monitor event frequency
  setInterval(() => {
    const currentMetrics = eventBus.getMetrics();
    logger.info('Current metrics:', {
      totalEvents: currentMetrics.totalEvents,
      eventsByType: currentMetrics.eventsByType,
      averageListenersPerEvent: currentMetrics.averageListenersPerEvent,
    });
  }, 10000);
}

/**
 * Example 7: Error Handling and Recovery
 */
export async function errorHandlingExample() {
  // Set up error handling
  eventBus.on('error.occurred', async event => {
    logger.error('Error occurred:', event.data.error);

    // Implement error recovery logic
    if (event.data.context === 'AuthService.login') {
      // Handle login errors
      logger.info('Handling login error...', {});
    } else if (event.data.context === 'ProjectService.getAll') {
      // Handle project fetch errors
      logger.info('Handling project fetch error...', {});
    }
  });

  // Set up warning handling
  eventBus.on('warning.occurred', event => {
    logger.warn('Warning:', event.data.message);
  });

  // Services will automatically emit error events
  const authService = container.resolve<AuthService>(TOKENS.AUTH_SERVICE);
  try {
    await authService.login({
      email: 'invalid-email',
      password: 'short',
    });
  } catch (error) {
    // Error events are emitted automatically
    logger.info('Login failed as expected', {});
  }
}

/**
 * Example 8: Service Lifecycle Management
 */
export async function serviceLifecycleExample() {
  // Initialize services
  const authService = container.resolve<AuthService>(TOKENS.AUTH_SERVICE);
  const projectService = container.resolve<ProjectService>(TOKENS.PROJECT_SERVICE);
  const chatService = container.resolve<ChatService>(TOKENS.CHAT_SERVICE);

  await authService.initialize();
  await projectService.initialize();
  await chatService.initialize();

  // Use services
  logger.info('Services initialized and ready', {});

  // Cleanup when done
  await authService.cleanup();
  await projectService.cleanup();
  await chatService.cleanup();

  logger.info('Services cleaned up', {});
}

/**
 * Example 9: Custom Service Registration
 */
export async function customServiceRegistration() {
  // Create custom container
  const customContainer = container.createChild();

  // Register custom services
  customContainer.registerSingleton('CustomService', () => ({
    name: 'Custom Service',
    doSomething: () => logger.info('Custom service doing something', {}),
  }));

  // Use custom service
  const customService = customContainer.resolve('CustomService');
  customService.doSomething();

  // Register with factory
  customContainer.registerTransient('TransientService', () => ({
    id: Math.random().toString(36),
    createdAt: new Date(),
  }));

  // Each resolution creates a new instance
  const service1 = customContainer.resolve('TransientService');
  const service2 = customContainer.resolve('TransientService');
  logger.info('Different instances:', service1.id !== service2.id);
}

/**
 * Example 10: Event-Driven UI Updates
 */
export async function eventDrivenUIExample() {
  // Set up UI event listeners
  eventBus.on('ui.theme.changed', event => {
    // Update UI theme
    document.documentElement.setAttribute('data-theme', event.data.theme);
  });

  eventBus.on('ui.sidebar.toggled', event => {
    // Toggle sidebar
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.toggle('collapsed', event.data.isCollapsed);
    }
  });

  eventBus.on('ui.notification.show', event => {
    // Show notification
    logger.info('Notification:', event.data.message);
  });

  // Emit UI events
  await eventBus.emitAppEvent(eventFactories.themeChanged('dark'));
  await eventBus.emitAppEvent(eventFactories.sidebarToggled(false));
}

// Export all examples
export const examples = {
  basicServiceUsage,
  eventDrivenExample,
  serviceWithEventsExample,
  advancedEventHandling,
  serviceDecoratorsExample,
  eventMetricsExample,
  errorHandlingExample,
  serviceLifecycleExample,
  customServiceRegistration,
  eventDrivenUIExample,
};
