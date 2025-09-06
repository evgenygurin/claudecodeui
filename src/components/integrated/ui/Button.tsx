// Button.tsx
// Кнопки с различными вариантами
// Интегрированный компонент из v0.app

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  className,
  children,
  variant,
  size,
  disabled,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "button-base-styles",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Button;
