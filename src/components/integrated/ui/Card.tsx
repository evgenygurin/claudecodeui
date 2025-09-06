// Card.tsx
// Карточки для контента
// Интегрированный компонент из v0.app

import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "outlined" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card: React.FC<CardProps> = ({ 
  className,
  children,
  variant,
  padding,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "card-base-styles",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
