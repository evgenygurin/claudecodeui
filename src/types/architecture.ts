/**
 * Architecture types for the refactored Claude Code UI
 * Based on the refactoring plan in docs/refactoring/
 */

import { Project, Session, Message, User, AIProvider } from './index';

// Additional types needed for architecture
export interface CreateProjectDto {
  name: string;
  path: string;
  description?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
}

export interface CreateSessionDto {
  title: string;
  provider: AIProvider;
  projectId: string;
}

export interface UpdateSessionDto {
  title?: string;
  status?: 'active' | 'archived' | 'deleted';
}

// ============================================================================
// Repository Pattern Types
// ============================================================================

export interface Repository<T, ID = string> {
  findAll(): Promise<T[]>;
  findById(id: ID): Promise<T | null>;
  create(entity: Omit<T, 'id'>): Promise<T>;
  update(id: ID, entity: Partial<T>): Promise<T>;
  delete(id: ID): Promise<void>;
}

export interface ProjectRepository extends Repository<Project> {
  findByPath(path: string): Promise<Project | null>;
  findByDisplayName(displayName: string): Promise<Project | null>;
  findRecent(limit?: number): Promise<Project[]>;
}

export interface SessionRepository extends Repository<Session> {
  findByProjectId(projectId: string): Promise<Session[]>;
  findByProvider(provider: AIProvider): Promise<Session[]>;
  findActive(): Promise<Session[]>;
  archive(id: string): Promise<void>;
}

// ============================================================================
// Service Layer Types
// ============================================================================

export interface Service<T, CreateDto, UpdateDto> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(data: CreateDto): Promise<T>;
  update(id: string, data: UpdateDto): Promise<T>;
  delete(id: string): Promise<void>;
}

export interface ProjectService extends Service<Project, CreateProjectDto, UpdateProjectDto> {
  scanProjects(): Promise<Project[]>;
  refreshProject(id: string): Promise<Project>;
  getProjectStats(id: string): Promise<ProjectStats>;
}

export interface ChatService extends Service<Session, CreateSessionDto, UpdateSessionDto> {
  sendMessage(sessionId: string, message: string, provider: AIProvider): Promise<Message>;
  getSessionHistory(sessionId: string): Promise<Message[]>;
  resumeSession(sessionId: string): Promise<Session>;
  abortSession(sessionId: string): Promise<void>;
}

export interface AuthService {
  login(credentials: LoginCredentials): Promise<AuthResult>;
  logout(token: string): Promise<void>;
  refreshToken(token: string): Promise<string>;
  validateToken(token: string): Promise<boolean>;
  getCurrentUser(): Promise<User | null>;
}

// ============================================================================
// Provider Pattern Types
// ============================================================================

export interface CLIProvider {
  spawn(command: string, options: SpawnOptions): Promise<CLIProcess>;
  abort(sessionId: string): boolean;
  getStatus(): ProviderStatus;
  getSessions(projectPath: string): Promise<Session[]>;
  isAvailable(): Promise<boolean>;
}

export interface SpawnOptions {
  projectPath: string;
  sessionId?: string;
  resume?: boolean;
  model?: string;
  outputFormat?: string;
  timeout?: number;
}

export interface CLIProcess {
  id: string;
  stdout: ReadableStream;
  stderr: ReadableStream;
  stdin: WritableStream;
  kill(): void;
  onExit(callback: (code: number) => void): void;
  isRunning(): boolean;
}

export interface ProviderStatus {
  available: boolean;
  version?: string;
  lastChecked: Date;
  error?: string;
}

// ============================================================================
// Event System Types
// ============================================================================

export interface EventBus {
  on(event: string, callback: EventCallback): void;
  off(event: string, callback: EventCallback): void;
  emit(event: string, data: any): void;
  once(event: string, callback: EventCallback): void;
}

export type EventCallback = (data: any) => void;

export interface BaseEvent {
  type: string;
  timestamp: Date;
  source: string;
}

export interface ProjectCreatedEvent extends BaseEvent {
  type: 'project.created';
  data: {
    project: Project;
  };
}

export interface SessionStartedEvent extends BaseEvent {
  type: 'session.started';
  data: {
    sessionId: string;
    projectId: string;
    provider: AIProvider;
  };
}

export interface MessageReceivedEvent extends BaseEvent {
  type: 'message.received';
  data: {
    sessionId: string;
    message: Message;
  };
}

export interface FileChangedEvent extends BaseEvent {
  type: 'file.changed';
  data: {
    projectId: string;
    filePath: string;
    changeType: 'created' | 'modified' | 'deleted';
  };
}

// ============================================================================
// Dependency Injection Types
// ============================================================================

export interface Container {
  register<T>(token: string, factory: () => T): void;
  registerSingleton<T>(token: string, factory: () => T): void;
  resolve<T>(token: string): T;
  isRegistered(token: string): boolean;
  clear(): void;
}

export interface ServiceFactory<T> {
  create(): T;
}

// ============================================================================
// DTOs (Data Transfer Objects)
// ============================================================================

export interface CreateProjectDto {
  name: string;
  path: string;
  displayName?: string;
  description?: string;
}

export interface UpdateProjectDto {
  name?: string;
  displayName?: string;
  description?: string;
}

export interface CreateSessionDto {
  title: string;
  provider: AIProvider;
  projectId: string;
}

export interface UpdateSessionDto {
  title?: string;
  status?: 'active' | 'archived' | 'deleted';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ============================================================================
// Additional Types
// ============================================================================

export interface ProjectStats {
  totalFiles: number;
  totalSessions: number;
  totalMessages: number;
  lastActivity: Date;
  size: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface CacheEntry<T> {
  data: T;
  timestamp: Date;
  ttl: number;
}

export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  websocket: {
    url: string;
    reconnectInterval: number;
    maxReconnectAttempts: number;
  };
  cache: {
    defaultTtl: number;
    maxSize: number;
  };
  security: {
    jwtSecret: string;
    tokenExpiry: number;
    refreshTokenExpiry: number;
  };
}

export interface FeatureFlags {
  enableMCP: boolean;
  enableCursor: boolean;
  enableCodegen: boolean;
  enableAnalytics: boolean;
  enableNotifications: boolean;
}

// ============================================================================
// Error Types
// ============================================================================

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 'FORBIDDEN', 403);
    this.name = 'ForbiddenError';
  }
}
