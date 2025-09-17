# Шаблон для ручного сбора компонентов

## Структура файла компонента

```tsx
// {component-name}.tsx
// Источник: {component-url}
// Категория: {component-category}
// Сложность: {low|medium|high}
// Зависимости: {dependency-list}

import React from 'react';
// Добавьте необходимые импорты

interface {ComponentName}Props {
  // Определите пропсы компонента
}

export const {ComponentName}: React.FC<{ComponentName}Props> = ({
  // Деструктурируйте пропсы
}) => {
  // Реализация компонента

  return (
    <div>
      {/* JSX компонента */}
    </div>
  );
};

export default {ComponentName};
```

## Метаданные компонента

```json
{
  "id": "{component-id}",
  "name": "{component-name}",
  "category": "{category}",
  "url": "{source-url}",
  "complexity": "{low|medium|high}",
  "dependencies": ["dependency1", "dependency2"],
  "tags": ["tag1", "tag2"],
  "description": "Описание компонента",
  "usage": "Пример использования",
  "status": "collected"
}
```
