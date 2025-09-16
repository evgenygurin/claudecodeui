# Claude Code UI - Architecture Documentation

## Overview

This document describes the new architecture implemented in the Claude Code UI project. The architecture follows modern software engineering principles including Dependency Injection, Event-Driven Architecture, Repository Pattern, and Service-Oriented Design.

## Architecture Components

### 1. Dependency Injection (DI)

The project uses a custom Dependency Injection container located in `src/di/container.ts`.

#### Key Features

- **Service Registration**: Register services as singletons, transients, or instances
- **Service Resolution**: Resolve services with automatic dependency injection
- **Hierarchical Containers**: Create child containers for scoped services
- **Service Decorators**: Add cross-cutting concerns like logging, caching, and error handling
- **Service Factories**: Create services with complex initialization logic

#### Usage Example

```typescript
import { container, TOKENS } from '@/di/container';

// Register services
container.registerSingleton(TOKENS.AUTH_SERVICE, () => new AuthService());

// Resolve services
const authService = container.resolve<AuthService>(TOKENS.AUTH_SERVICE);
```

### 2. Event-Driven Architecture

The event system is implemented in `src/events/event-bus.ts` and `src/events/events.ts`.

#### Key Features

- **Typed Events**: All events are strongly typed with TypeScript
- **Event Priorities**: Events can have different priority levels
- **Event Categories**: Events are organized by categories (project, session, chat, etc.)
- **Event Metrics**: Track event frequency and performance
- **Event Filtering**: Filter events by type, category, or custom conditions
- **Event Middleware**: Add middleware for logging, validation, or transformation
- **Async Event Handling**: Support for both sync and async event handlers

#### Usage Example

```typescript
import { eventBus, eventFactories } from '@/events/events';

// Listen to events
eventBus.on('project.created', event => {
  console.log('Project created:', event.data.project);
});

// Emit events
await eventBus.emitAppEvent(eventFactories.projectCreated(project));
```

### 3. Repository Pattern

Repositories abstract data access and provide a consistent interface for data operations.

#### Key Features

- **Interface-Based**: All repositories implement common interfaces
- **Environment-Specific**: Different implementations for development, test, and production
- **Caching**: Built-in caching support for improved performance
- **Error Handling**: Consistent error handling across all repositories

#### Usage Example

```typescript
import { ProjectRepository } from '@/repositories/project.repository';

const projectRepository = container.resolve<ProjectRepository>(TOKENS.PROJECT_REPOSITORY);
const projects = await projectRepository.findAll();
```

### 4. Service Layer

Services contain business logic and coordinate between repositories and external APIs.

#### Key Features

- **Dependency Injection**: Services receive their dependencies through constructor injection
- **Event Integration**: Services automatically emit events for important operations
- **Validation**: Input validation using Zod schemas
- **Error Handling**: Comprehensive error handling with event emission
- **Caching**: Built-in caching for improved performance
- **Lifecycle Management**: Proper initialization and cleanup

#### Usage Example

```typescript
import { AuthService } from '@/services/auth.service';

const authService = container.resolve<AuthService>(TOKENS.AUTH_SERVICE);
await authService.initialize();

try {
  const result = await authService.login(credentials);
  // Success - events are emitted automatically
} catch (error) {
  // Error events are emitted automatically
}
```

## Service Details

### AuthService

Handles user authentication, JWT tokens, and session management.

#### Features

- **JWT Token Management**: Automatic token refresh and validation
- **Secure Storage**: Tokens stored securely in localStorage
- **Event Integration**: Emits login, logout, and error events
- **Input Validation**: Validates credentials using Zod schemas
- **Token Expiration**: Automatic token expiration checking

#### Key Methods

- `login(credentials)`: Authenticate user
- `logout()`: Logout user and clear tokens
- `refreshToken()`: Refresh access token
- `isAuthenticated()`: Check authentication status
- `getCurrentUser()`: Get current user information

### ProjectService

Manages projects, file system operations, and project data.

#### Features

- **Repository Integration**: Uses ProjectRepository for data access
- **Caching**: Built-in caching for improved performance
- **Event Integration**: Emits project-related events
- **Input Validation**: Validates project data using Zod schemas
- **File System Operations**: Handles file system scanning and validation

#### Key Methods

- `getAll()`: Get all projects
- `getById(id)`: Get project by ID
- `create(projectData)`: Create new project
- `update(id, projectData)`: Update project
- `delete(id)`: Delete project
- `scanFileSystem()`: Scan file system for projects

### ChatService

Handles chat sessions, message management, and AI provider integration.

#### Features

- **Session Management**: Create, update, and delete chat sessions
- **Message Queuing**: Queue messages for processing
- **Streaming Support**: Real-time message streaming
- **Provider Integration**: Support for multiple AI providers
- **Event Integration**: Emits chat-related events

#### Key Methods

- `createSession(sessionData)`: Create new chat session
- `sendMessage(messageData)`: Send message to AI provider
- `streamMessage()`: Stream message response
- `getSessionsByProject(projectId)`: Get sessions for project
- `queueMessage()`: Queue message for processing

## Event System

### Event Types

The system supports various event types organized by categories:

#### Project Events

- `project.created`: Project created
- `project.updated`: Project updated
- `project.deleted`: Project deleted
- `project.scanned`: File system scanned

#### Session Events

- `session.started`: Chat session started
- `session.ended`: Chat session ended
- `session.updated`: Session updated
- `session.deleted`: Session deleted

#### Chat Events

- `message.sent`: Message sent
- `message.received`: Message received
- `message.streaming`: Message streaming

#### UI Events

- `ui.theme.changed`: Theme changed
- `ui.sidebar.toggled`: Sidebar toggled
- `ui.notification.show`: Notification shown

#### Error Events

- `error.occurred`: Error occurred
- `warning.occurred`: Warning occurred

### Event Priorities

Events have different priority levels:

- **CRITICAL (100)**: Error and security events
- **HIGH (75)**: System and WebSocket events
- **NORMAL (50)**: Project, session, and chat events
- **LOW (25)**: UI and file events
- **BACKGROUND (0)**: Performance events

### Event Utilities

The system provides various utilities for working with events:

- **Event Factories**: Create typed events easily
- **Event Filtering**: Filter events by category, priority, or time range
- **Event Aggregation**: Group events by category or get frequency statistics
- **Event Validation**: Validate event data structure

## Configuration

### Service Registration

Services are registered in `src/di/register-services.ts`:

```typescript
export function registerServices(container: Container): void {
  // Infrastructure services
  container.registerInstance(TOKENS.EVENT_BUS, eventBus);

  // Repositories
  container.registerSingleton<ProjectRepository>(
    TOKENS.PROJECT_REPOSITORY,
    () => new FileSystemProjectRepository()
  );

  // Services
  container.registerInstance(TOKENS.AUTH_SERVICE, authService);
  container.registerInstance(TOKENS.PROJECT_SERVICE, projectService);
  container.registerInstance(TOKENS.CHAT_SERVICE, chatService);
}
```

### Environment-Specific Registration

Different service implementations can be registered based on the environment:

```typescript
// Development: Use in-memory repositories
export function registerDevelopmentServices(container: Container): void {
  registerTestServices(container);
}

// Production: Use file system repositories
export function registerProductionServices(container: Container): void {
  registerServices(container);
}
```

## Best Practices

### 1. Service Design

- Use constructor injection for dependencies
- Emit events for important operations
- Validate input data using Zod schemas
- Handle errors gracefully and emit error events
- Implement proper lifecycle management

### 2. Event Handling

- Use typed events for better type safety
- Emit events for important state changes
- Handle errors in event listeners gracefully
- Use event priorities appropriately
- Clean up event listeners when no longer needed

### 3. Repository Pattern

- Implement common interfaces
- Use environment-specific implementations
- Add caching where appropriate
- Handle errors consistently
- Provide comprehensive data validation

### 4. Dependency Injection

- Register services with appropriate lifetimes
- Use interfaces for better testability
- Apply decorators for cross-cutting concerns
- Create child containers for scoped services
- Clean up resources properly

## Testing

The architecture supports comprehensive testing:

### Unit Testing

- Services can be tested in isolation
- Dependencies can be mocked easily
- Event emission can be verified
- Input validation can be tested

### Integration Testing

- Services can be tested together
- Event flow can be verified
- Repository implementations can be tested
- End-to-end scenarios can be tested

### Example Test

```typescript
describe('AuthService', () => {
  let authService: AuthService;
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = new EventBus();
    authService = new AuthService(eventBus);
  });

  it('should emit login event on successful login', async () => {
    const eventSpy = jest.fn();
    eventBus.on('auth.logged_in', eventSpy);

    await authService.login(validCredentials);

    expect(eventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'auth.logged_in',
        data: expect.objectContaining({
          userId: expect.any(String),
          email: expect.any(String),
        }),
      })
    );
  });
});
```

## Migration Guide

### From Old Architecture

1. **Replace Direct Service Usage**: Use DI container instead of direct imports
2. **Add Event Handling**: Emit events for important operations
3. **Implement Validation**: Add Zod schemas for input validation
4. **Update Error Handling**: Use event-based error handling
5. **Add Lifecycle Management**: Implement proper initialization and cleanup

### Example Migration

```typescript
// Old way
import { authService } from '@/services/auth.service';
const result = await authService.login(credentials);

// New way
import { container, TOKENS } from '@/di/container';
const authService = container.resolve<AuthService>(TOKENS.AUTH_SERVICE);
await authService.initialize();
const result = await authService.login(credentials);
```

## Performance Considerations

### Caching

- Services implement built-in caching
- Cache TTL can be configured
- Cache can be cleared when needed
- Cache statistics are available

### Event Performance

- Events are processed asynchronously
- Event listeners are prioritized
- Event metrics help identify performance issues
- Event filtering reduces unnecessary processing

### Memory Management

- Services implement proper cleanup
- Event listeners are cleaned up
- Caches are cleared when appropriate
- Resources are released properly

## Security Considerations

### Input Validation

- All inputs are validated using Zod schemas
- Malicious input is rejected early
- Validation errors are handled gracefully

### Error Handling

- Sensitive information is not exposed in errors
- Error events are logged appropriately
- Error recovery mechanisms are in place

### Token Management

- JWT tokens are validated properly
- Token expiration is checked automatically
- Tokens are refreshed when needed
- Tokens are cleared on logout

## Conclusion

The new architecture provides a solid foundation for the Claude Code UI project. It follows modern software engineering principles and provides:

- **Maintainability**: Clear separation of concerns and dependency injection
- **Testability**: Easy to test with mocked dependencies
- **Scalability**: Event-driven architecture supports growth
- **Reliability**: Comprehensive error handling and validation
- **Performance**: Built-in caching and optimization
- **Security**: Input validation and secure token management

The architecture is designed to be flexible and extensible, allowing for future enhancements and modifications as the project evolves.
