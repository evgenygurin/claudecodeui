// integrated-components.ts
// Типы для интегрированных компонентов из v0.app

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ToastProps extends BaseComponentProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  onClick?: () => void;
}

export interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export interface ChatProps extends BaseComponentProps {
  messages?: Array<{
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
  }>;
  onSendMessage?: (message: string) => void;
}

export interface FileManagerProps extends BaseComponentProps {
  files?: Array<{
    id: string;
    name: string;
    type: 'file' | 'folder';
    size?: number;
    modified: Date;
  }>;
  onFileSelect?: (file: any) => void;
  onFileUpload?: (file: File) => void;
}

export interface SidebarProps extends BaseComponentProps {
  items?: Array<{
    id: string;
    label: string;
    icon?: string;
    href?: string;
    onClick?: () => void;
  }>;
  collapsed?: boolean;
  onToggle?: () => void;
}

export interface DashboardProps extends BaseComponentProps {
  widgets?: Array<{
    id: string;
    title: string;
    type: 'chart' | 'metric' | 'table' | 'list';
    data?: any;
  }>;
  layout?: 'grid' | 'flex';
}

export interface AuthProps extends BaseComponentProps {
  mode?: 'login' | 'register' | 'forgot-password';
  onSubmit?: (data: any) => void;
  onModeChange?: (mode: string) => void;
}

export interface ElevenLabsProps extends BaseComponentProps {
  apiKey?: string;
  voiceId?: string;
  onAudioGenerated?: (audio: Blob) => void;
  onError?: (error: Error) => void;
}
