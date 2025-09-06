/**
 * API and WebSocket Types for the refactored Claude Code UI
 * Based on the architecture plan in docs/refactoring/
 */

import { Project, Session, Message, User, AIProvider } from './index';

// Additional types needed for API
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

export interface FileTreeItem {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  lastModified: Date;
  children?: FileTreeItem[];
}

export interface MCPConnection {
  id: string;
  name: string;
  url: string;
  status: 'connected' | 'disconnected' | 'error';
  lastConnected?: Date;
}

export interface MCPTool {
  id: string;
  name: string;
  description: string;
  connectionId: string;
  parameters?: any;
}

export interface NotificationAction {
  id: string;
  label: string;
  action: () => void;
}

export interface ProjectStats {
  totalFiles: number;
  totalSessions: number;
  totalMessages: number;
  lastActivity: Date;
  size: number;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  timestamp: string;
  requestId?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  success: boolean;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  code: string;
  details?: any;
  timestamp: string;
  requestId?: string;
}

// ============================================================================
// Request Types
// ============================================================================

export interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
  timeout?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

// ============================================================================
// WebSocket Types
// ============================================================================

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
  id?: string;
  source?: string;
}

export interface WebSocketConnection {
  url: string;
  protocols?: string[];
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
}

export interface WebSocketClient {
  connect(): Promise<void>;
  disconnect(): void;
  send(message: WebSocketMessage): void;
  isConnected(): boolean;
  on(event: string, callback: (data: any) => void): void;
  off(event: string, callback: (data: any) => void): void;
}

// ============================================================================
// Chat WebSocket Messages
// ============================================================================

export interface ChatMessageEvent extends WebSocketMessage {
  type: 'chat.message';
  data: {
    sessionId: string;
    message: Message;
    isStreaming?: boolean;
  };
}

export interface ChatTypingEvent extends WebSocketMessage {
  type: 'chat.typing';
  data: {
    sessionId: string;
    userId: string;
    isTyping: boolean;
  };
}

export interface ChatSessionEvent extends WebSocketMessage {
  type: 'chat.session';
  data: {
    sessionId: string;
    action: 'created' | 'updated' | 'deleted' | 'archived';
    session: Session;
  };
}

// ============================================================================
// Project WebSocket Messages
// ============================================================================

export interface ProjectUpdateEvent extends WebSocketMessage {
  type: 'project.updated';
  data: {
    projectId: string;
    action: 'created' | 'updated' | 'deleted';
    project: Project;
    changedFiles?: string[];
  };
}

export interface FileChangeEvent extends WebSocketMessage {
  type: 'file.changed';
  data: {
    projectId: string;
    filePath: string;
    action: 'created' | 'modified' | 'deleted' | 'renamed';
    oldPath?: string;
    content?: string;
    size?: number;
  };
}

export interface ProjectScanEvent extends WebSocketMessage {
  type: 'project.scan';
  data: {
    projectId: string;
    status: 'started' | 'progress' | 'completed' | 'error';
    progress?: number;
    filesFound?: number;
    error?: string;
  };
}

// ============================================================================
// System WebSocket Messages
// ============================================================================

export interface SystemStatusEvent extends WebSocketMessage {
  type: 'system.status';
  data: {
    status: 'healthy' | 'degraded' | 'down';
    services: {
      api: 'up' | 'down';
      websocket: 'up' | 'down';
      database: 'up' | 'down';
      cache: 'up' | 'down';
    };
    uptime: number;
    memory: {
      used: number;
      total: number;
    };
    cpu: {
      usage: number;
    };
  };
}

export interface NotificationEvent extends WebSocketMessage {
  type: 'notification';
  data: {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    actions?: NotificationAction[];
    persistent?: boolean;
  };
}

// ============================================================================
// API Endpoint Types
// ============================================================================

export interface ProjectsApi {
  getAll(params?: PaginationParams): Promise<PaginatedResponse<Project>>;
  getById(id: string): Promise<ApiResponse<Project>>;
  create(data: CreateProjectDto): Promise<ApiResponse<Project>>;
  update(id: string, data: UpdateProjectDto): Promise<ApiResponse<Project>>;
  delete(id: string): Promise<ApiResponse<void>>;
  scan(): Promise<ApiResponse<Project[]>>;
  refresh(id: string): Promise<ApiResponse<Project>>;
  getStats(id: string): Promise<ApiResponse<ProjectStats>>;
}

export interface SessionsApi {
  getAll(params?: PaginationParams): Promise<PaginatedResponse<Session>>;
  getById(id: string): Promise<ApiResponse<Session>>;
  create(data: CreateSessionDto): Promise<ApiResponse<Session>>;
  update(id: string, data: UpdateSessionDto): Promise<ApiResponse<Session>>;
  delete(id: string): Promise<ApiResponse<void>>;
  getByProject(projectId: string): Promise<ApiResponse<Session[]>>;
  getHistory(sessionId: string): Promise<ApiResponse<Message[]>>;
  sendMessage(sessionId: string, message: string): Promise<ApiResponse<Message>>;
  abort(sessionId: string): Promise<ApiResponse<void>>;
}

export interface AuthApi {
  login(credentials: LoginCredentials): Promise<ApiResponse<AuthResult>>;
  logout(): Promise<ApiResponse<void>>;
  refreshToken(token: string): Promise<ApiResponse<{ accessToken: string }>>;
  getCurrentUser(): Promise<ApiResponse<User>>;
  updateProfile(data: Partial<User>): Promise<ApiResponse<User>>;
  changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<void>>;
}

export interface FilesApi {
  getTree(projectId: string, path?: string): Promise<ApiResponse<FileTreeItem[]>>;
  getContent(
    projectId: string,
    filePath: string
  ): Promise<ApiResponse<{ content: string; language: string }>>;
  saveContent(projectId: string, filePath: string, content: string): Promise<ApiResponse<void>>;
  createFile(projectId: string, filePath: string, content?: string): Promise<ApiResponse<void>>;
  createDirectory(projectId: string, dirPath: string): Promise<ApiResponse<void>>;
  deleteFile(projectId: string, filePath: string): Promise<ApiResponse<void>>;
  renameFile(projectId: string, oldPath: string, newPath: string): Promise<ApiResponse<void>>;
  uploadFile(
    projectId: string,
    file: File,
    path?: string
  ): Promise<ApiResponse<{ path: string; size: number }>>;
}

export interface MCPApi {
  getConnections(): Promise<ApiResponse<MCPConnection[]>>;
  createConnection(data: { name: string; url: string }): Promise<ApiResponse<MCPConnection>>;
  updateConnection(id: string, data: Partial<MCPConnection>): Promise<ApiResponse<MCPConnection>>;
  deleteConnection(id: string): Promise<ApiResponse<void>>;
  testConnection(id: string): Promise<ApiResponse<{ status: string; latency: number }>>;
  getTools(connectionId: string): Promise<ApiResponse<MCPTool[]>>;
  executeTool(connectionId: string, toolName: string, parameters: any): Promise<ApiResponse<any>>;
}

// ============================================================================
// HTTP Client Types
// ============================================================================

export interface HttpClient {
  get<T>(url: string, params?: any): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: any): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: any): Promise<ApiResponse<T>>;
  patch<T>(url: string, data?: any): Promise<ApiResponse<T>>;
  delete<T>(url: string): Promise<ApiResponse<T>>;
  upload<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>>;
}

export interface HttpClientConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  interceptors?: {
    request?: (config: any) => any;
    response?: (response: any) => any;
    error?: (error: any) => any;
  };
}

// ============================================================================
// Cache Types
// ============================================================================

export interface CacheConfig {
  defaultTtl: number;
  maxSize: number;
  storage: 'memory' | 'localStorage' | 'sessionStorage';
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
  keys(): Promise<string[]>;
  size(): Promise<number>;
}

// ============================================================================
// Search Types
// ============================================================================

export interface SearchParams {
  query: string;
  type?: 'all' | 'files' | 'messages' | 'projects';
  projectId?: string;
  sessionId?: string;
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  id: string;
  type: 'file' | 'message' | 'project' | 'session';
  title: string;
  content: string;
  path?: string;
  score: number;
  highlights: {
    field: string;
    fragments: string[];
  }[];
  metadata?: Record<string, any>;
}

export interface SearchApi {
  search(params: SearchParams): Promise<ApiResponse<SearchResult[]>>;
  suggest(query: string, type?: string): Promise<ApiResponse<string[]>>;
  index(projectId: string): Promise<ApiResponse<void>>;
  reindex(projectId: string): Promise<ApiResponse<void>>;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

export interface AnalyticsApi {
  track(event: AnalyticsEvent): Promise<void>;
  identify(userId: string, traits: Record<string, any>): Promise<void>;
  page(name: string, properties?: Record<string, any>): Promise<void>;
  group(groupId: string, traits: Record<string, any>): Promise<void>;
}

// ============================================================================
// Health Check Types
// ============================================================================

export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  services: {
    [key: string]: {
      status: 'up' | 'down';
      responseTime?: number;
      error?: string;
    };
  };
  version: string;
  uptime: number;
}

export interface HealthApi {
  check(): Promise<ApiResponse<HealthCheck>>;
  ready(): Promise<ApiResponse<{ ready: boolean }>>;
  live(): Promise<ApiResponse<{ alive: boolean }>>;
}
