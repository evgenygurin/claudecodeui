
# Шаблон для ручного извлечения компонентов

## Структура файла компонента

```tsx
// {component-name}.tsx
// Источник: {source-url}
// Категория: {category}
// Сложность: {complexity}

import React from 'react';
import { cn } from '@/lib/utils';

interface {ComponentName}Props {
  // Определите пропсы компонента
  className?: string;
  children?: React.ReactNode;
}

export const {ComponentName}: React.FC<{ComponentName}Props> = ({ 
  className,
  children,
  ...props 
}) => {
  return (
    <div className={cn("component-base-styles", className)} {...props}>
      {children}
    </div>
  );
};

export default {ComponentName};
```

## Адаптация под архитектуру проекта

1. **Импорты**: Используйте абсолютные пути (@/...)
2. **Стили**: Используйте cn() для объединения классов
3. **Типизация**: Добавьте TypeScript интерфейсы
4. **Пропсы**: Стандартизируйте пропсы (className, children)
5. **Экспорт**: Используйте именованный и default экспорт

## Категории компонентов

### UI Components (src/components/integrated/ui/)
- Button, Input, Card, Badge, Toast, Tabs
- Простые, переиспользуемые компоненты

### Layout Components (src/components/integrated/layout/)
- Sidebar, Navigation, Header, Footer
- Компоненты макета страницы

### Feature Components (src/components/integrated/features/)
- Chat, FileManager, Dashboard
- Функциональные компоненты

### Advanced Components (src/components/integrated/advanced/)
- Complex UI, Animations, Integrations
- Сложные компоненты с множественными зависимостями
