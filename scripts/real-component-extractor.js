#!/usr/bin/env node

/**
 * Real Component Extractor
 * Извлечение реального кода компонентов с v0.app используя браузерную автоматизацию
 */

const fs = require('fs');
const path = require('path');

class RealComponentExtractor {
  constructor() {
    this.baseDir = path.join(__dirname, '..');
    this.metadataFile = path.join(this.baseDir, 'collected-components', 'components-metadata.json');
    this.outputDir = path.join(this.baseDir, 'src', 'components', 'integrated');
    this.loadMetadata();
  }

  /**
   * Загружает метаданные компонентов
   */
  loadMetadata() {
    if (fs.existsSync(this.metadataFile)) {
      this.components = JSON.parse(fs.readFileSync(this.metadataFile, 'utf8'));
    } else {
      console.error('❌ Файл метаданных не найден');
      this.components = [];
    }
  }

  /**
   * Создает инструкции для MCP Playwright
   */
  createPlaywrightInstructions() {
    const instructions = `
# Инструкции для извлечения компонентов с v0.app

## Шаг 1: Открыть браузер
Используйте MCP Playwright для открытия браузера.

## Шаг 2: Извлечь компоненты
Для каждого URL выполните следующие действия:

1. Перейдите на страницу компонента
2. Найдите кнопку "Open in" или "View Code"
3. Скопируйте код компонента
4. Сохраните в соответствующий файл

## Список URL для обработки:
${this.components.map(c => `- ${c.name}: ${c.url}`).join('\n')}

## Структура сохранения:
- UI компоненты: src/components/integrated/ui/
- Layout компоненты: src/components/integrated/layout/
- Feature компоненты: src/components/integrated/features/
- Advanced компоненты: src/components/integrated/advanced/

## Пример извлечения:
1. Откройте: https://v0.app/community/toast-fLjYRXrijvp
2. Найдите кнопку "Open in"
3. Скопируйте код
4. Сохраните как: src/components/integrated/ui/toast.tsx
`;

    const instructionsFile = path.join(
      this.baseDir,
      'scripts',
      'playwright-extraction-instructions.md'
    );
    fs.writeFileSync(instructionsFile, instructions);

    console.log('📋 Инструкции для MCP Playwright созданы:', instructionsFile);
    return instructionsFile;
  }

  /**
   * Создает шаблон для ручного извлечения
   */
  createManualExtractionTemplate() {
    const template = `
# Шаблон для ручного извлечения компонентов

## Структура файла компонента

\`\`\`tsx
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
\`\`\`

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
`;

    const templateFile = path.join(this.baseDir, 'scripts', 'manual-extraction-template.md');
    fs.writeFileSync(templateFile, template);

    console.log('📋 Шаблон для ручного извлечения создан:', templateFile);
    return templateFile;
  }

  /**
   * Создает базовые интегрированные компоненты
   */
  createBasicIntegratedComponents() {
    console.log('🔧 Создание базовых интегрированных компонентов...\n');

    const basicComponents = [
      {
        name: 'Toast',
        category: 'ui',
        description: 'Уведомления и сообщения',
        props: {
          title: 'string',
          description: 'string',
          variant: '"default" | "destructive" | "success"',
          duration: 'number',
        },
      },
      {
        name: 'Button',
        category: 'ui',
        description: 'Кнопки с различными вариантами',
        props: {
          variant: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
          size: '"default" | "sm" | "lg" | "icon"',
          disabled: 'boolean',
        },
      },
      {
        name: 'Card',
        category: 'ui',
        description: 'Карточки для контента',
        props: {
          variant: '"default" | "outlined" | "elevated"',
          padding: '"none" | "sm" | "md" | "lg"',
        },
      },
    ];

    basicComponents.forEach(component => {
      this.createComponentFile(component);
    });

    console.log('✅ Базовые компоненты созданы!');
  }

  /**
   * Создает файл компонента
   */
  createComponentFile(component) {
    const { name, category, description, props } = component;

    const componentCode = `// ${name}.tsx
// ${description}
// Интегрированный компонент из v0.app

import React from 'react';
import { cn } from '@/lib/utils';

interface ${name}Props {
  className?: string;
  children?: React.ReactNode;
${Object.entries(props)
  .map(([key, type]) => `  ${key}?: ${type};`)
  .join('\n')}
}

export const ${name}: React.FC<${name}Props> = ({ 
  className,
  children,
${Object.keys(props)
  .map(key => `  ${key},`)
  .join('\n')}
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "${name.toLowerCase()}-base-styles",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export default ${name};
`;

    const categoryDir = path.join(this.outputDir, category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }

    const filePath = path.join(categoryDir, `${name}.tsx`);
    fs.writeFileSync(filePath, componentCode);

    console.log(`✅ Создан компонент: ${category}/${name}.tsx`);
  }

  /**
   * Создает индексные файлы для экспорта
   */
  createIndexFiles() {
    console.log('\n📁 Создание индексных файлов...\n');

    const categories = ['ui', 'layout', 'features', 'advanced'];

    categories.forEach(category => {
      const categoryDir = path.join(this.outputDir, category);
      if (fs.existsSync(categoryDir)) {
        const files = fs
          .readdirSync(categoryDir)
          .filter(file => file.endsWith('.tsx'))
          .map(file => file.replace('.tsx', ''));

        if (files.length > 0) {
          const indexContent =
            files.map(file => `export { ${file} } from './${file}';`).join('\n') + '\n';

          const indexFile = path.join(categoryDir, 'index.ts');
          fs.writeFileSync(indexFile, indexContent);

          console.log(`✅ Создан индекс: ${category}/index.ts (${files.length} компонентов)`);
        }
      }
    });

    // Создаем главный индексный файл
    const mainIndexContent =
      categories.map(category => `export * from './${category}';`).join('\n') + '\n';

    const mainIndexFile = path.join(this.outputDir, 'index.ts');
    fs.writeFileSync(mainIndexFile, mainIndexContent);

    console.log('✅ Создан главный индекс: index.ts');
  }

  /**
   * Создает типы для интегрированных компонентов
   */
  createTypes() {
    console.log('\n📝 Создание типов...\n');

    const typesContent = `// integrated-components.ts
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
`;

    const typesFile = path.join(this.baseDir, 'src', 'types', 'integrated-components.ts');
    fs.writeFileSync(typesFile, typesContent);

    console.log('✅ Созданы типы: src/types/integrated-components.ts');
  }

  /**
   * Создает утилиты для работы с компонентами
   */
  createUtils() {
    console.log('\n🛠️ Создание утилит...\n');

    const utilsContent = `// component-utils.ts
// Утилиты для работы с интегрированными компонентами

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Объединяет классы Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Генерирует уникальный ID для компонентов
 */
export function generateId(prefix: string = 'component'): string {
  return \`\${prefix}-\${Math.random().toString(36).substr(2, 9)}\`;
}

/**
 * Форматирует размер файла
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Форматирует дату для отображения
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Валидирует email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Дебаунс функция
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Тротлинг функция
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Копирует текст в буфер обмена
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Ошибка копирования в буфер обмена:', err);
    return false;
  }
}

/**
 * Скачивает файл
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
`;

    const utilsFile = path.join(this.baseDir, 'src', 'utils', 'component-utils.ts');
    fs.writeFileSync(utilsFile, utilsContent);

    console.log('✅ Созданы утилиты: src/utils/component-utils.ts');
  }

  /**
   * Запускает создание базовой инфраструктуры
   */
  run() {
    console.log('🚀 Создание базовой инфраструктуры для интеграции компонентов...\n');
    console.log('='.repeat(60));

    this.createPlaywrightInstructions();
    this.createManualExtractionTemplate();
    this.createBasicIntegratedComponents();
    this.createIndexFiles();
    this.createTypes();
    this.createUtils();

    console.log('\n🎯 БАЗОВАЯ ИНФРАСТРУКТУРА СОЗДАНА!');
    console.log('='.repeat(60));
    console.log('📁 Структура создана:');
    console.log('  - src/components/integrated/ (категории компонентов)');
    console.log('  - src/types/integrated-components.ts (типы)');
    console.log('  - src/utils/component-utils.ts (утилиты)');
    console.log('  - scripts/playwright-extraction-instructions.md (инструкции)');
    console.log('  - scripts/manual-extraction-template.md (шаблон)');

    console.log('\n💡 Следующие шаги:');
    console.log('  1. Используйте MCP Playwright для извлечения реального кода');
    console.log('  2. Адаптируйте компоненты под архитектуру проекта');
    console.log('  3. Добавьте TypeScript типизацию');
    console.log('  4. Создайте тесты для компонентов');
    console.log('  5. Документируйте процесс интеграции');
  }
}

// Запуск
if (require.main === module) {
  const extractor = new RealComponentExtractor();
  extractor.run();
}

module.exports = RealComponentExtractor;
