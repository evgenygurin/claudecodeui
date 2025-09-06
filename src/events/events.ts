/**
 * Event Definitions
 * Defines all events used in the application
 */

import { Project, Session, Message } from '@/types';

/**
 * Project Events
 */
export interface ProjectCreatedEvent {
  type: 'project.created';
  data: {
    project: Project;
    timestamp: Date;
  };
}

export interface ProjectUpdatedEvent {
  type: 'project.updated';
  data: {
    project: Project;
    changes: Partial<Project>;
    timestamp: Date;
  };
}

export interface ProjectDeletedEvent {
  type: 'project.deleted';
  data: {
    projectId: string;
    project: Project;
    timestamp: Date;
  };
}

export interface ProjectScannedEvent {
  type: 'project.scanned';
  data: {
    projects: Project[];
    newProjects: Project[];
    timestamp: Date;
  };
}

/**
 * Session Events
 */
export interface SessionStartedEvent {
  type: 'session.started';
  data: {
    sessionId: string;
    projectId: string;
    provider: string;
    timestamp: Date;
  };
}

export interface SessionEndedEvent {
  type: 'session.ended';
  data: {
    sessionId: string;
    projectId: string;
    provider: string;
    duration: number;
    timestamp: Date;
  };
}

export interface SessionUpdatedEvent {
  type: 'session.updated';
  data: {
    session: Session;
    changes: Partial<Session>;
    timestamp: Date;
  };
}

export interface SessionDeletedEvent {
  type: 'session.deleted';
  data: {
    sessionId: string;
    projectId: string;
    timestamp: Date;
  };
}

/**
 * Message Events
 */
export interface MessageReceivedEvent {
  type: 'message.received';
  data: {
    sessionId: string;
    message: Message;
    timestamp: Date;
  };
}

export interface MessageSentEvent {
  type: 'message.sent';
  data: {
    sessionId: string;
    message: Message;
    timestamp: Date;
  };
}

export interface MessageStreamingEvent {
  type: 'message.streaming';
  data: {
    sessionId: string;
    chunk: string;
    isComplete: boolean;
    timestamp: Date;
  };
}

/**
 * File Events
 */
export interface FileCreatedEvent {
  type: 'file.created';
  data: {
    projectId: string;
    filePath: string;
    content?: string;
    timestamp: Date;
  };
}

export interface FileUpdatedEvent {
  type: 'file.updated';
  data: {
    projectId: string;
    filePath: string;
    content: string;
    previousContent?: string;
    timestamp: Date;
  };
}

export interface FileDeletedEvent {
  type: 'file.deleted';
  data: {
    projectId: string;
    filePath: string;
    timestamp: Date;
  };
}

export interface FileMovedEvent {
  type: 'file.moved';
  data: {
    projectId: string;
    oldPath: string;
    newPath: string;
    timestamp: Date;
  };
}

/**
 * Provider Events
 */
export interface ProviderConnectedEvent {
  type: 'provider.connected';
  data: {
    provider: string;
    version?: string;
    timestamp: Date;
  };
}

export interface ProviderDisconnectedEvent {
  type: 'provider.disconnected';
  data: {
    provider: string;
    reason?: string;
    timestamp: Date;
  };
}

export interface ProviderErrorEvent {
  type: 'provider.error';
  data: {
    provider: string;
    error: string;
    timestamp: Date;
  };
}

/**
 * UI Events
 */
export interface TabChangedEvent {
  type: 'ui.tab.changed';
  data: {
    from: string;
    to: string;
    timestamp: Date;
  };
}

export interface ThemeChangedEvent {
  type: 'ui.theme.changed';
  data: {
    theme: 'light' | 'dark' | 'system';
    timestamp: Date;
  };
}

export interface UserLoggedInEvent {
  type: 'user.logged_in';
  data: {
    userId: string;
    email: string;
    timestamp: Date;
  };
}

export interface UserLoggedOutEvent {
  type: 'user.logged_out';
  data: {
    userId: string;
    timestamp: Date;
  };
}

export interface TokenRefreshedEvent {
  type: 'auth.token_refreshed';
  data: {
    userId: string;
    timestamp: Date;
  };
}

export interface SidebarToggledEvent {
  type: 'ui.sidebar.toggled';
  data: {
    isOpen: boolean;
    timestamp: Date;
  };
}

export interface SearchPerformedEvent {
  type: 'ui.search.performed';
  data: {
    query: string;
    results: number;
    timestamp: Date;
  };
}

/**
 * Error Events
 */
export interface ErrorOccurredEvent {
  type: 'error.occurred';
  data: {
    error: Error;
    context?: string;
    timestamp: Date;
  };
}

export interface WarningOccurredEvent {
  type: 'warning.occurred';
  data: {
    message: string;
    context?: string;
    timestamp: Date;
  };
}

/**
 * Performance Events
 */
export interface PerformanceMetricEvent {
  type: 'performance.metric';
  data: {
    metric: string;
    value: number;
    unit: string;
    timestamp: Date;
  };
}

export interface SlowOperationEvent {
  type: 'performance.slow_operation';
  data: {
    operation: string;
    duration: number;
    threshold: number;
    timestamp: Date;
  };
}

/**
 * WebSocket Events
 */
export interface WebSocketConnectedEvent {
  type: 'websocket.connected';
  data: {
    url: string;
    timestamp: Date;
  };
}

export interface WebSocketDisconnectedEvent {
  type: 'websocket.disconnected';
  data: {
    url: string;
    reason?: string;
    timestamp: Date;
  };
}

export interface WebSocketErrorEvent {
  type: 'websocket.error';
  data: {
    url: string;
    error: string;
    timestamp: Date;
  };
}

export interface TokenRefreshedEvent {
  type: 'auth.token_refreshed';
  data: {
    userId: string;
    timestamp: Date;
  };
}

/**
 * Union type for all events
 */
export type AppEvent =
  | ProjectCreatedEvent
  | ProjectUpdatedEvent
  | ProjectDeletedEvent
  | ProjectScannedEvent
  | SessionStartedEvent
  | SessionEndedEvent
  | SessionUpdatedEvent
  | SessionDeletedEvent
  | MessageReceivedEvent
  | MessageSentEvent
  | MessageStreamingEvent
  | FileCreatedEvent
  | FileUpdatedEvent
  | FileDeletedEvent
  | FileMovedEvent
  | ProviderConnectedEvent
  | ProviderDisconnectedEvent
  | ProviderErrorEvent
  | TabChangedEvent
  | ThemeChangedEvent
  | UserLoggedInEvent
  | UserLoggedOutEvent
  | TokenRefreshedEvent
  | SidebarToggledEvent
  | SearchPerformedEvent
  | ErrorOccurredEvent
  | WarningOccurredEvent
  | PerformanceMetricEvent
  | SlowOperationEvent
  | WebSocketConnectedEvent
  | WebSocketDisconnectedEvent
  | WebSocketErrorEvent
  | UserLoggedInEvent
  | UserLoggedOutEvent
  | TokenRefreshedEvent;

/**
 * Event type mapping for type safety
 */
export type EventTypeMap = {
  'project.created': ProjectCreatedEvent;
  'project.updated': ProjectUpdatedEvent;
  'project.deleted': ProjectDeletedEvent;
  'project.scanned': ProjectScannedEvent;
  'session.started': SessionStartedEvent;
  'session.ended': SessionEndedEvent;
  'session.updated': SessionUpdatedEvent;
  'session.deleted': SessionDeletedEvent;
  'message.received': MessageReceivedEvent;
  'message.sent': MessageSentEvent;
  'message.streaming': MessageStreamingEvent;
  'file.created': FileCreatedEvent;
  'file.updated': FileUpdatedEvent;
  'file.deleted': FileDeletedEvent;
  'file.moved': FileMovedEvent;
  'provider.connected': ProviderConnectedEvent;
  'provider.disconnected': ProviderDisconnectedEvent;
  'provider.error': ProviderErrorEvent;
  'ui.tab.changed': TabChangedEvent;
  'ui.theme.changed': ThemeChangedEvent;
  'ui.sidebar.toggled': SidebarToggledEvent;
  'ui.search.performed': SearchPerformedEvent;
  'error.occurred': ErrorOccurredEvent;
  'warning.occurred': WarningOccurredEvent;
  'performance.metric': PerformanceMetricEvent;
  'performance.slow_operation': SlowOperationEvent;
  'websocket.connected': WebSocketConnectedEvent;
  'websocket.disconnected': WebSocketDisconnectedEvent;
  'websocket.error': WebSocketErrorEvent;
  'auth.logged_in': UserLoggedInEvent;
  'auth.logged_out': UserLoggedOutEvent;
  'auth.token_refreshed': TokenRefreshedEvent;
};

/**
 * Event priority levels
 */
export const EVENT_PRIORITIES = {
  CRITICAL: 100,
  HIGH: 75,
  NORMAL: 50,
  LOW: 25,
  BACKGROUND: 0,
} as const;

export type EventPriority = (typeof EVENT_PRIORITIES)[keyof typeof EVENT_PRIORITIES];

/**
 * Event categories
 */
export const EVENT_CATEGORIES = {
  PROJECT: 'project',
  SESSION: 'session',
  CHAT: 'message',
  PROVIDER: 'provider',
  UI: 'ui',
  FILE: 'file',
  ERROR: 'error',
  SYSTEM: 'system',
  PERFORMANCE: 'performance',
  WEBSOCKET: 'websocket',
  AUTH: 'auth',
} as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[keyof typeof EVENT_CATEGORIES];

/**
 * Get event category from event type
 */
export function getEventCategory(eventType: string): EventCategory | null {
  const parts = eventType.split('.');
  if (parts.length > 0) {
    const category = parts[0] as EventCategory;
    if (Object.values(EVENT_CATEGORIES).includes(category)) {
      return category;
    }
  }
  return null;
}

/**
 * Get event priority from event type
 */
export function getEventPriority(eventType: string): EventPriority {
  const category = getEventCategory(eventType);

  switch (category) {
    case EVENT_CATEGORIES.ERROR:
    case EVENT_CATEGORIES.AUTH:
      return EVENT_PRIORITIES.CRITICAL;
    case EVENT_CATEGORIES.SYSTEM:
    case EVENT_CATEGORIES.WEBSOCKET:
      return EVENT_PRIORITIES.HIGH;
    case EVENT_CATEGORIES.PROJECT:
    case EVENT_CATEGORIES.SESSION:
    case EVENT_CATEGORIES.CHAT:
      return EVENT_PRIORITIES.NORMAL;
    case EVENT_CATEGORIES.UI:
    case EVENT_CATEGORIES.FILE:
      return EVENT_PRIORITIES.LOW;
    case EVENT_CATEGORIES.PERFORMANCE:
      return EVENT_PRIORITIES.BACKGROUND;
    default:
      return EVENT_PRIORITIES.NORMAL;
  }
}

/**
 * Event factory functions
 */
export const eventFactories = {
  projectCreated: (project: Project): ProjectCreatedEvent => ({
    type: 'project.created',
    data: { project, timestamp: new Date() },
  }),

  projectUpdated: (project: Project, changes: Partial<Project>): ProjectUpdatedEvent => ({
    type: 'project.updated',
    data: { project, changes, timestamp: new Date() },
  }),

  projectDeleted: (projectId: string, project: Project): ProjectDeletedEvent => ({
    type: 'project.deleted',
    data: { projectId, project, timestamp: new Date() },
  }),

  sessionStarted: (
    sessionId: string,
    projectId: string,
    provider: string
  ): SessionStartedEvent => ({
    type: 'session.started',
    data: { sessionId, projectId, provider, timestamp: new Date() },
  }),

  sessionEnded: (
    sessionId: string,
    projectId: string,
    provider: string,
    duration: number
  ): SessionEndedEvent => ({
    type: 'session.ended',
    data: { sessionId, projectId, provider, duration, timestamp: new Date() },
  }),

  messageReceived: (sessionId: string, message: Message): MessageReceivedEvent => ({
    type: 'message.received',
    data: { sessionId, message, timestamp: new Date() },
  }),

  messageSent: (sessionId: string, message: Message): MessageSentEvent => ({
    type: 'message.sent',
    data: { sessionId, message, timestamp: new Date() },
  }),

  errorOccurred: (error: Error, context?: string): ErrorOccurredEvent => ({
    type: 'error.occurred',
    data: { error, context: context || undefined, timestamp: new Date() },
  }),

  themeChanged: (theme: 'light' | 'dark' | 'system'): ThemeChangedEvent => ({
    type: 'ui.theme.changed',
    data: { theme, timestamp: new Date() },
  }),

  performanceMetric: (metric: string, value: number, unit: string): PerformanceMetricEvent => ({
    type: 'performance.metric',
    data: { metric, value, unit, timestamp: new Date() },
  }),

  userLoggedIn: (userId: string, email: string): UserLoggedInEvent => ({
    type: 'user.logged_in',
    data: { userId, email, timestamp: new Date() },
  }),

  userLoggedOut: (userId: string): UserLoggedOutEvent => ({
    type: 'user.logged_out',
    data: { userId, timestamp: new Date() },
  }),

  tokenRefreshed: (userId: string): TokenRefreshedEvent => ({
    type: 'auth.token_refreshed',
    data: { userId, timestamp: new Date() },
  }),

  sidebarToggled: (isOpen: boolean): SidebarToggledEvent => ({
    type: 'ui.sidebar.toggled',
    data: { isOpen, timestamp: new Date() },
  }),
};

/**
 * Event validation
 */
export function isValidEvent(event: any): event is AppEvent {
  return (
    event &&
    typeof event === 'object' &&
    typeof event.type === 'string' &&
    event.data &&
    event.data.timestamp instanceof Date
  );
}

/**
 * Event filtering utilities
 */
export function filterEventsByCategory<T extends AppEvent>(
  events: T[],
  category: EventCategory
): T[] {
  return events.filter(event => getEventCategory(event.type) === category);
}

export function filterEventsByPriority<T extends AppEvent>(
  events: T[],
  minPriority: EventPriority
): T[] {
  return events.filter(event => getEventPriority(event.type) >= minPriority);
}

export function filterEventsByTimeRange<T extends AppEvent>(
  events: T[],
  startTime: Date,
  endTime: Date
): T[] {
  return events.filter(event => {
    const eventTime = event.data.timestamp;
    return eventTime >= startTime && eventTime <= endTime;
  });
}

/**
 * Event aggregation utilities
 */
export function groupEventsByCategory<T extends AppEvent>(events: T[]): Record<EventCategory, T[]> {
  const grouped: Record<string, T[]> = {};

  events.forEach(event => {
    const category = getEventCategory(event.type);
    if (category) {
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(event);
    }
  });

  return grouped as Record<EventCategory, T[]>;
}

export function getEventFrequency<T extends AppEvent>(events: T[]): Record<string, number> {
  const frequency: Record<string, number> = {};

  events.forEach(event => {
    frequency[event.type] = (frequency[event.type] || 0) + 1;
  });

  return frequency;
}
