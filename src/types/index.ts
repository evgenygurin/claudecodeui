export interface Project {
  id: string
  name: string
  path: string
  description?: string
  lastModified: Date
  files: FileItem[]
  sessions: Session[]
}

export interface FileItem {
  id: string
  name: string
  path: string
  type: 'file' | 'directory'
  size?: number
  lastModified: Date
  children?: FileItem[]
  content?: string
  language?: string
}

export interface Session {
  id: string
  name: string
  projectId: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  status: 'active' | 'archived' | 'deleted'
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    tokens?: number
    model?: string
    tools?: string[]
  }
}

export interface ChatState {
  currentSession: Session | null
  sessions: Session[]
  isLoading: boolean
  error: string | null
}

export interface FileManagerState {
  currentProject: Project | null
  projects: Project[]
  selectedFiles: string[]
  expandedFolders: string[]
  isLoading: boolean
  error: string | null
}

export interface SidebarState {
  isCollapsed: boolean
  activeTab: 'projects' | 'chat' | 'files' | 'settings'
  searchQuery: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  fontSize: number
  autoSave: boolean
  notifications: boolean
}

export interface MCPTool {
  name: string
  description: string
  parameters: Record<string, any>
  enabled: boolean
}

export interface MCPConnection {
  id: string
  name: string
  url: string
  status: 'connected' | 'disconnected' | 'error'
  tools: MCPTool[]
  lastConnected?: Date
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface WebSocketMessage {
  type: 'message' | 'error' | 'status' | 'file_update' | 'project_update'
  payload: any
  timestamp: Date
}

export interface SearchResult {
  id: string
  type: 'file' | 'message' | 'project'
  title: string
  content: string
  path?: string
  score: number
}

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actions?: NotificationAction[]
}

export interface NotificationAction {
  label: string
  action: () => void
  variant?: 'default' | 'destructive'
}
