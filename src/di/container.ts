import { createError } from '@/utils/error-handler';
/**
 * Dependency Injection Container
 * Manages service registration and resolution
 */

export type ServiceFactory<T = any> = () => T;
export type ServiceInstance<T = any> = T;

export interface ServiceRegistration<T = any> {
  factory: ServiceFactory<T>;
  singleton: boolean;
  instance?: ServiceInstance<T>;
}

/**
 * Dependency Injection Container
 */
export class Container {
  private services = new Map<string, ServiceRegistration>();
  private parent?: Container;

  constructor(parent?: Container) {
    this.parent = parent || undefined;
  }

  /**
   * Register a service factory
   */
  register<T>(token: string, factory: ServiceFactory<T>, singleton: boolean = true): void {
    this.services.set(token, {
      factory,
      singleton,
    });
  }

  /**
   * Register a singleton service
   */
  registerSingleton<T>(token: string, factory: ServiceFactory<T>): void {
    this.register(token, factory, true);
  }

  /**
   * Register a transient service
   */
  registerTransient<T>(token: string, factory: ServiceFactory<T>): void {
    this.register(token, factory, false);
  }

  /**
   * Register a service instance
   */
  registerInstance<T>(token: string, instance: T): void {
    this.services.set(token, {
      factory: () => instance,
      singleton: true,
      instance,
    });
  }

  /**
   * Resolve a service
   */
  resolve<T>(token: string): T {
    const registration = this.services.get(token);

    if (registration) {
      if (registration.singleton && registration.instance) {
        return registration.instance as T;
      }

      const instance = registration.factory();

      if (registration.singleton) {
        registration.instance = instance;
      }

      return instance as T;
    }

    // Try parent container
    if (this.parent) {
      return this.parent.resolve<T>(token);
    }

    throw createError(`Service '${token}' not found`);
  }

  /**
   * Check if a service is registered
   */
  isRegistered(token: string): boolean {
    return this.services.has(token) || (this.parent?.isRegistered(token) ?? false);
  }

  /**
   * Unregister a service
   */
  unregister(token: string): boolean {
    return this.services.delete(token);
  }

  /**
   * Clear all services
   */
  clear(): void {
    this.services.clear();
  }

  /**
   * Get all registered service tokens
   */
  getRegisteredTokens(): string[] {
    const tokens = Array.from(this.services.keys());
    if (this.parent) {
      return [...tokens, ...this.parent.getRegisteredTokens()];
    }
    return tokens;
  }

  /**
   * Create a child container
   */
  createChild(): Container {
    return new Container(this);
  }

  /**
   * Create a service with dependencies
   */
  create<T>(constructor: new (...args: any[]) => T, ...dependencies: string[]): T {
    const resolvedDependencies = dependencies.map(dep => this.resolve(dep));
    return new constructor(...resolvedDependencies);
  }

  /**
   * Create a factory function for a service
   */
  createFactory<T>(token: string): ServiceFactory<T> {
    return () => this.resolve<T>(token);
  }

  /**
   * Bind a service to an interface
   */
  bind<T>(interfaceToken: string, implementationToken: string): void {
    this.register(interfaceToken, () => this.resolve<T>(implementationToken));
  }

  /**
   * Decorate a service with additional functionality
   */
  decorate<T>(token: string, decorator: (service: T) => T): void {
    const originalRegistration = this.services.get(token);
    if (!originalRegistration) {
      throw createError(`Service '${token}' not found for decoration`);
    }

    this.register(
      token,
      () => {
        const service = originalRegistration.factory() as T;
        return decorator(service);
      },
      originalRegistration.singleton
    );
  }

  /**
   * Get service metadata
   */
  getServiceInfo(token: string): {
    isRegistered: boolean;
    isSingleton: boolean;
    hasInstance: boolean;
  } | null {
    const registration = this.services.get(token);
    if (!registration) {
      return null;
    }

    return {
      isRegistered: true,
      isSingleton: registration.singleton,
      hasInstance: !!registration.instance,
    };
  }
}

/**
 * Service tokens
 */
export const TOKENS = {
  // Repositories
  PROJECT_REPOSITORY: 'ProjectRepository',
  SESSION_REPOSITORY: 'SessionRepository',
  CURSOR_SESSION_REPOSITORY: 'CursorSessionRepository',

  // Services
  AUTH_SERVICE: 'AuthService',
  PROJECT_SERVICE: 'ProjectService',
  CHAT_SERVICE: 'ChatService',

  // Providers
  CLAUDE_PROVIDER: 'ClaudeProvider',
  CURSOR_PROVIDER: 'CursorProvider',

  // Infrastructure
  EVENT_BUS: 'EventBus',
  CONTAINER: 'Container',

  // Configuration
  CONFIG: 'Config',
  LOGGER: 'Logger',
} as const;

// Export singleton container instance
export const container = new Container();
