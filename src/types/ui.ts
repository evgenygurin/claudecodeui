/**
 * UI Component Types for the refactored Claude Code UI
 * Based on the design system in docs/refactoring/04-ui-ux.md
 */

import { ReactNode } from 'react';
import { Message } from './index';

// ============================================================================
// Design System Types
// ============================================================================

export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ThemeVariant = 'light' | 'dark' | 'system';

// ============================================================================
// Base Component Props
// ============================================================================

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
}

export interface VariantProps {
  variant?: ColorVariant;
  size?: SizeVariant;
}

export interface DisabledProps {
  disabled?: boolean;
}

export interface LoadingProps {
  loading?: boolean;
}

// ============================================================================
// Button Component Types
// ============================================================================

export interface ButtonProps extends BaseComponentProps, VariantProps, DisabledProps, LoadingProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  href?: string;
  target?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';

// ============================================================================
// Input Component Types
// ============================================================================

export interface InputProps extends BaseComponentProps, DisabledProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: string;
  label?: string;
  helperText?: string;
  required?: boolean;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

// ============================================================================
// Card Component Types
// ============================================================================

export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  padding?: SizeVariant;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  hover?: boolean;
}

// ============================================================================
// Modal Component Types
// ============================================================================

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  maskClosable?: boolean;
  footer?: ReactNode;
}

// ============================================================================
// Tabs Component Types
// ============================================================================

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

export interface TabsProps extends BaseComponentProps {
  items: TabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: SizeVariant;
}

// ============================================================================
// Navigation Types
// ============================================================================

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
  children?: NavItem[];
}

export interface NavigationProps extends BaseComponentProps {
  items: NavItem[];
  activeItem?: string;
  onItemClick?: (item: NavItem) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'minimal' | 'pills';
}

// ============================================================================
// Sidebar Types
// ============================================================================

export interface SidebarProps extends BaseComponentProps {
  isCollapsed: boolean;
  onToggle: () => void;
  items: NavItem[];
  activeItem?: string;
  onItemClick?: (item: NavItem) => void;
  footer?: ReactNode;
  header?: ReactNode;
}

// ============================================================================
// File Manager Types
// ============================================================================

export interface FileTreeItem {
  id: string;
  name: string;
  type: 'file' | 'directory';
  path: string;
  children?: FileTreeItem[];
  size?: number;
  lastModified: Date;
  isExpanded?: boolean;
  isSelected?: boolean;
}

export interface FileManagerProps extends BaseComponentProps {
  items: FileTreeItem[];
  selectedItems: string[];
  onItemSelect: (item: FileTreeItem) => void;
  onItemExpand: (item: FileTreeItem) => void;
  onItemDoubleClick: (item: FileTreeItem) => void;
  contextMenu?: (item: FileTreeItem) => ReactNode;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

// ============================================================================
// Chat Interface Types
// ============================================================================

export interface ChatMessageProps extends BaseComponentProps {
  message: Message;
  isOwn?: boolean;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  onEdit?: (message: Message) => void;
  onDelete?: (message: Message) => void;
  onReact?: (message: Message, reaction: string) => void;
}

export interface ChatInputProps extends BaseComponentProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  showAttachments?: boolean;
  onAttachmentClick?: () => void;
}

export interface ChatInterfaceProps extends BaseComponentProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  error?: string;
  placeholder?: string;
  showTyping?: boolean;
  typingUsers?: string[];
}

// ============================================================================
// Animation Types
// ============================================================================

export interface AnimationProps {
  duration?: number;
  delay?: number;
  easing?: string;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  iterationCount?: number | 'infinite';
}

export interface TransitionProps extends AnimationProps {
  in?: boolean;
  appear?: boolean;
  unmountOnExit?: boolean;
  mountOnEnter?: boolean;
}

// ============================================================================
// Layout Types
// ============================================================================

export interface LayoutProps extends BaseComponentProps {
  header?: ReactNode;
  sidebar?: ReactNode;
  footer?: ReactNode;
  content: ReactNode;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

export interface GridProps extends BaseComponentProps {
  columns?: number;
  gap?: SizeVariant;
  responsive?: boolean;
}

export interface FlexProps extends BaseComponentProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: SizeVariant;
}

// ============================================================================
// Form Types
// ============================================================================

export interface FormFieldProps extends BaseComponentProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface FormProps extends BaseComponentProps {
  onSubmit: (data: any) => void;
  onReset?: () => void;
  initialValues?: any;
  validationSchema?: any;
  loading?: boolean;
}

// ============================================================================
// Loading States
// ============================================================================

export interface SkeletonProps extends BaseComponentProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave' | 'none';
}

export interface SpinnerProps extends BaseComponentProps {
  size?: SizeVariant;
  variant?: ColorVariant;
  label?: string;
}

export interface ProgressProps extends BaseComponentProps {
  value: number;
  max?: number;
  size?: SizeVariant;
  variant?: ColorVariant;
  showLabel?: boolean;
  indeterminate?: boolean;
}

// ============================================================================
// Notification Types
// ============================================================================

export interface ToastProps extends BaseComponentProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  closable?: boolean;
  onClose?: () => void;
  actions?: ToastAction[];
}

export interface ToastAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive';
}

// ============================================================================
// Theme Types
// ============================================================================

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  toggleTheme: () => void;
}
