// Card.tsx
// Современный компонент карточек с различными вариантами
// Интегрированный компонент из v0.app

"use client";

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "elevated" | "glass" | "gradient";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  hover?: boolean;
  interactive?: boolean;
  asChild?: boolean;
}

const variantStyles = {
  default: "bg-card text-card-foreground border border-border",
  outlined: "bg-transparent text-foreground border-2 border-border",
  elevated: "bg-card text-card-foreground shadow-lg border-0",
  glass: "bg-card/80 backdrop-blur-sm text-card-foreground border border-border/50",
  gradient: "bg-gradient-to-br from-card to-card/50 text-card-foreground border border-border"
};

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
  xl: "p-8"
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className,
    variant = "default",
    padding = "md",
    hover = false,
    interactive = false,
    children,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg transition-all duration-200",
          variantStyles[variant],
          paddingStyles[padding],
          hover && "hover:shadow-md hover:scale-[1.02]",
          interactive && "cursor-pointer hover:shadow-md active:scale-[0.98]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

// Специализированные компоненты карточек
export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 pb-4", className)}
      {...props}
    />
  )
);

CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);

CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
);

CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("pt-0", className)}
      {...props}
    />
  )
);

CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center pt-4", className)}
      {...props}
    />
  )
);

CardFooter.displayName = "CardFooter";

// Композитный компонент для быстрого создания карточек
interface QuickCardProps extends CardProps {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
}

export const QuickCard = forwardRef<HTMLDivElement, QuickCardProps>(
  ({ title, description, footer, children, ...props }, ref) => (
    <Card ref={ref} {...props}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      {children && <CardContent>{children}</CardContent>}
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  )
);

QuickCard.displayName = "QuickCard";

export default Card;
