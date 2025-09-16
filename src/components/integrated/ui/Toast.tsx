// Toast.tsx
// Современный компонент уведомлений с анимациями
// Интегрированный компонент из v0.app

'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

interface ToastProps {
  className?: string;
  children?: React.ReactNode;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info' | 'loading';
  duration?: number;
  onClose?: () => void;
  showCloseButton?: boolean;
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center';
}

const variantStyles = {
  default: 'bg-background border-border text-foreground',
  destructive: 'bg-destructive border-destructive text-destructive-foreground',
  success: 'bg-green-500 border-green-500 text-white',
  warning: 'bg-yellow-500 border-yellow-500 text-white',
  info: 'bg-blue-500 border-blue-500 text-white',
  loading: 'bg-background border-border text-foreground',
};

const variantIcons = {
  default: Info,
  destructive: AlertCircle,
  success: CheckCircle,
  warning: AlertCircle,
  info: Info,
  loading: Loader2,
};

export const Toast: React.FC<ToastProps> = ({
  className,
  children,
  title,
  description,
  variant = 'default',
  duration = 5000,
  onClose,
  showCloseButton = true,
  position = 'top-right',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const Icon = variantIcons[variant];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  return (
    <div
      className={cn(
        'fixed z-50 max-w-sm w-full',
        positionStyles[position],
        'animate-in slide-in-from-right-full duration-300',
        isExiting && 'animate-out slide-out-to-right-full duration-300'
      )}
    >
      <div
        className={cn(
          'relative flex items-start gap-3 p-4 rounded-lg border shadow-lg',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <Icon className={cn('h-5 w-5', variant === 'loading' && 'animate-spin')} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && <div className="font-semibold text-sm mb-1">{title}</div>}
          {description && <div className="text-sm opacity-90">{description}</div>}
          {children && <div className="text-sm opacity-90">{children}</div>}
        </div>

        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Toast Provider для управления множественными уведомлениями
interface ToastContextType {
  addToast: (toast: Omit<ToastProps, 'onClose'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);

  const addToast = (toast: Omit<ToastProps, 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id, onClose: () => removeToast(id) }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default Toast;
