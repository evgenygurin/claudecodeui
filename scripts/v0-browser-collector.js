#!/usr/bin/env node

/**
 * V0.app Browser Component Collector
 * Использует браузерную автоматизацию для извлечения кода компонентов
 */

const fs = require('fs');
const path = require('path');

// Импортируем метаданные компонентов
const metadataPath = path.join(__dirname, '..', 'collected-components', 'components-metadata.json');
const componentsMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

/**
 * Создает скрипт для MCP Playwright
 */
function createPlaywrightScript() {
  const script = `
// MCP Playwright Script для сбора компонентов с v0.app
// Этот скрипт должен быть выполнен через MCP Playwright

const components = ${JSON.stringify(componentsMetadata, null, 2)};

async function collectComponentCode(component) {
  try {
    console.log(\`🔍 Собираем код для: \${component.name}\`);
    
    // Навигация на страницу компонента
    await page.goto(component.url, { waitUntil: 'networkidle' });
    
    // Ждем загрузки страницы
    await page.waitForTimeout(2000);
    
    // Ищем кнопку "Open in" или "View Code"
    const openButton = await page.$('button:has-text("Open in"), button:has-text("View Code"), [data-testid="open-in-button"]');
    
    if (openButton) {
      await openButton.click();
      await page.waitForTimeout(1000);
      
      // Ищем код компонента
      const codeElement = await page.$('pre, code, [data-testid="code-block"]');
      
      if (codeElement) {
        const code = await codeElement.textContent();
        return {
          ...component,
          code: code.trim(),
          status: 'collected',
          collectedAt: new Date().toISOString()
        };
      }
    }
    
    // Альтернативный способ - поиск в DOM
    const codeBlocks = await page.$$('pre code, .code-block, [class*="code"]');
    
    for (const block of codeBlocks) {
      const text = await block.textContent();
      if (text && text.length > 100 && text.includes('export') || text.includes('function')) {
        return {
          ...component,
          code: text.trim(),
          status: 'collected',
          collectedAt: new Date().toISOString()
        };
      }
    }
    
    return {
      ...component,
      status: 'not_found',
      error: 'Code not found on page'
    };
    
  } catch (error) {
    return {
      ...component,
      status: 'error',
      error: error.message
    };
  }
}

// Основная функция сбора
async function collectAllComponents() {
  const results = [];
  
  for (const component of components) {
    const result = await collectComponentCode(component);
    results.push(result);
    
    // Небольшая пауза между запросами
    await page.waitForTimeout(1000);
  }
  
  return results;
}

// Запуск сбора
collectAllComponents().then(results => {
  console.log('Сбор завершен:', results);
  return results;
});
`;

  return script;
}

/**
 * Создает инструкции для использования MCP Playwright
 */
function createPlaywrightInstructions() {
  const instructions = `
# Инструкции для сбора компонентов с v0.app

## Шаг 1: Подготовка
1. Убедитесь, что у вас есть доступ к MCP Playwright
2. Откройте браузер через MCP Playwright

## Шаг 2: Выполнение скрипта
Выполните следующий скрипт в MCP Playwright:

\`\`\`javascript
${createPlaywrightScript()}
\`\`\`

## Шаг 3: Обработка результатов
После выполнения скрипта:
1. Сохраните результаты в файл
2. Запустите скрипт обработки результатов

## Альтернативный подход - ручной сбор
Если автоматический сбор не работает, можно собирать компоненты вручную:

1. Откройте каждую страницу v0.app
2. Найдите кнопку "Open in" или "View Code"
3. Скопируйте код компонента
4. Сохраните в соответствующий файл

## Структура файлов
Каждый компонент должен быть сохранен в файл:
\`collected-components/{category}/{component-id}.tsx\`

## Метаданные
Дополните метаданные информацией о:
- Сложности компонента
- Зависимостях
- Тегах
- Описании
`;

  return instructions;
}

/**
 * Создает шаблон для ручного сбора компонентов
 */
function createManualCollectionTemplate() {
  const template = `
# Шаблон для ручного сбора компонентов

## Структура файла компонента
\`\`\`tsx
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
\`\`\`

## Метаданные компонента
\`\`\`json
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
\`\`\`
`;

  return template;
}

/**
 * Создает скрипт для обработки собранных компонентов
 */
function createComponentProcessor() {
  const processor = `
#!/usr/bin/env node

/**
 * Component Processor
 * Обрабатывает собранные компоненты и интегрирует их в проект
 */

const fs = require('fs');
const path = require('path');

class ComponentProcessor {
  constructor() {
    this.baseDir = path.join(__dirname, '..', 'collected-components');
    this.outputDir = path.join(__dirname, '..', 'src', 'components', 'collected');
  }

  /**
   * Обрабатывает все собранные компоненты
   */
  async processAllComponents() {
    console.log('🔄 Начинаем обработку компонентов...');
    
    const categories = fs.readdirSync(this.baseDir)
      .filter(item => fs.statSync(path.join(this.baseDir, item)).isDirectory());
    
    for (const category of categories) {
      await this.processCategory(category);
    }
    
    console.log('✅ Обработка завершена!');
  }

  /**
   * Обрабатывает категорию компонентов
   */
  async processCategory(category) {
    console.log(\`📁 Обрабатываем категорию: \${category}\`);
    
    const categoryDir = path.join(this.baseDir, category);
    const files = fs.readdirSync(categoryDir)
      .filter(file => file.endsWith('.tsx') || file.endsWith('.jsx'));
    
    for (const file of files) {
      await this.processComponent(category, file);
    }
  }

  /**
   * Обрабатывает отдельный компонент
   */
  async processComponent(category, filename) {
    const filePath = path.join(this.baseDir, category, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Адаптируем компонент под архитектуру проекта
    const adaptedContent = this.adaptComponent(content, category, filename);
    
    // Создаем выходную директорию
    const outputCategoryDir = path.join(this.outputDir, category);
    if (!fs.existsSync(outputCategoryDir)) {
      fs.mkdirSync(outputCategoryDir, { recursive: true });
    }
    
    // Сохраняем адаптированный компонент
    const outputPath = path.join(outputCategoryDir, filename);
    fs.writeFileSync(outputPath, adaptedContent);
    
    console.log(\`✅ Обработан: \${category}/\${filename}\`);
  }

  /**
   * Адаптирует компонент под архитектуру проекта
   */
  adaptComponent(content, category, filename) {
    // Добавляем импорты для UI компонентов
    const uiImports = \`
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
\`;

    // Заменяем относительные импорты на абсолютные
    let adaptedContent = content
      .replace(/from ['"]\\.\\.?\\//g, 'from "@/')
      .replace(/from ['"]\\.\\.?\\//g, 'from "@/');

    // Добавляем TypeScript типизацию если её нет
    if (!adaptedContent.includes('interface') && !adaptedContent.includes('type')) {
      adaptedContent = adaptedContent.replace(
        /export const (\\w+)/,
        \`interface \${category.charAt(0).toUpperCase() + category.slice(1)}Props {
  // Определите пропсы компонента
}

export const $1\`
      );
    }

    return adaptedContent;
  }
}

// Запуск обработки
if (require.main === module) {
  const processor = new ComponentProcessor();
  processor.processAllComponents().catch(console.error);
}

module.exports = ComponentProcessor;
`;

  return processor;
}

// Создаем все необходимые файлы
function createCollectionFiles() {
  const outputDir = path.join(__dirname, '..', 'scripts');
  
  // Создаем инструкции
  const instructions = createPlaywrightInstructions();
  fs.writeFileSync(path.join(outputDir, 'playwright-instructions.md'), instructions);
  
  // Создаем шаблон для ручного сбора
  const template = createManualCollectionTemplate();
  fs.writeFileSync(path.join(outputDir, 'manual-collection-template.md'), template);
  
  // Создаем процессор компонентов
  const processor = createComponentProcessor();
  fs.writeFileSync(path.join(outputDir, 'component-processor.js'), processor);
  
  console.log('📁 Созданы файлы для сбора компонентов:');
  console.log('  - playwright-instructions.md');
  console.log('  - manual-collection-template.md');
  console.log('  - component-processor.js');
}

// Запуск
if (require.main === module) {
  createCollectionFiles();
  console.log('🎯 Готово! Теперь можно начинать сбор компонентов.');
}

module.exports = {
  createPlaywrightScript,
  createPlaywrightInstructions,
  createManualCollectionTemplate,
  createComponentProcessor
};
