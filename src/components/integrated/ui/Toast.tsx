// Toast.tsx
// Уведомления и сообщения
// Интегрированный компонент из v0.app

import React from 'react';
import { cn } from '@/lib/utils';

interface ToastProps {
  className?: string;
  children?: React.ReactNode;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ 
  className,
  children,
  title,
  description,
  variant,
  duration,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "toast-base-styles",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Toast;
