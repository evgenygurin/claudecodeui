export interface Project {
  id: string;
  name: string;
  path: string;
  displayName?: string;
  fullPath: string;
  description?: string;
  lastModified: Date;
  files: FileItem[];
  sessions: Session[];
  cursorSessions: CursorSession[];
  sessionMeta: SessionMeta;
  createdAt: string;
  updatedAt: string;
}

export interface FileItem {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  lastModified: Date;
  children?: FileItem[];
  content?: string;
  language?: string;
}

export interface Session {
  id: string;
  title: string;
  provider: AIProvider;
  projectId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessageAt?: string;
  status: 'active' | 'archived' | 'deleted';
}

export interface CursorSession {
  id: string;
  title: string;
  projectPath: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export type AIProvider = 'claude' | 'cursor' | 'codegen';

export interface SessionMeta {
  total: number;
  claude: number;
  cursor: number;
  codegen: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  sessionId?: string;
  provider?: string;
  metadata?: {
    tokens?: number;
    model?: string;
    tools?: string[];
    isComplete?: boolean;
  };
  isTyping?: boolean;
  isStreaming?: boolean;
  attachments?: File[];
  isBookmarked?: boolean;
  isEdited?: boolean;
  reactions?: {
    thumbsUp: number;
    thumbsDown: number;
  };
}

export interface SendMessageDto {
  content: string;
  role: 'user' | 'assistant' | 'system';
  metadata?: {
    tokens?: number;
    model?: string;
    tools?: string[];
  };
}

export interface ChatResponse {
  message: Message;
  session: Session;
  metadata?: {
    tokens?: number;
    model?: string;
    processingTime?: number;
    isComplete?: boolean;
  };
}

export interface JwtPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
  iss?: string;
  aud?: string;
}

export interface ChatState {
  currentSession: Session | null;
  sessions: Session[];
  isLoading: boolean;
  error: string | null;
}

export interface FileManagerState {
  currentProject: Project | null;
  projects: Project[];
  selectedFiles: string[];
  expandedFolders: string[];
  isLoading: boolean;
  error: string | null;
}

export interface SidebarState {
  isCollapsed: boolean;
  activeTab: 'projects' | 'chat' | 'files' | 'settings';
  searchQuery: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  fontSize: number;
  autoSave: boolean;
  notifications: boolean;
}

export interface MCPTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  enabled: boolean;
}

export interface MCPConnection {
  id: string;
  name: string;
  url: string;
  status: 'connected' | 'disconnected' | 'error';
  tools: MCPTool[];
  lastConnected?: Date;
}

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export interface ChatMessage extends WebSocketMessage {
  type: 'chat.message';
  data: {
    sessionId: string;
    message: Message;
  };
}

export interface ProjectUpdateMessage extends WebSocketMessage {
  type: 'projects.updated';
  data: {
    projects: Project[];
    changeType: 'add' | 'update' | 'delete';
    changedFile?: string;
  };
}

export interface SearchResult {
  id: string;
  type: 'file' | 'message' | 'project';
  title: string;
  content: string;
  path?: string;
  score: number;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'default' | 'destructive';
}

// Re-export all types from other modules
export * from './architecture';
export * from './ui';
// export * from './api'; // Commented out to avoid conflicts
