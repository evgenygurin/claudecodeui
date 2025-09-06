#!/usr/bin/env node

/**
 * v0.app Component Collector
 * 
 * Этот скрипт автоматически собирает компоненты v0.app в единый проект
 * Использует MCP Vercel для поиска GitHub ссылок и браузер для извлечения кода
 * 
 * Использование: node v0-component-collector.js
 */

const fs = require('fs');
const path = require('path');

// Загружаем информацию о компонентах
const componentsInfo = JSON.parse(fs.readFileSync('v0-unified-project/components-info.json', 'utf8'));

// Создаем план сбора компонентов
function createCollectionPlan() {
  const plan = {
    phases: [
      {
        name: "Phase 1: GitHub Integration",
        description: "Поиск GitHub репозиториев через MCP Vercel",
        components: componentsInfo.components.filter(c => c.author !== 'unknown'),
        status: 'pending'
      },
      {
        name: "Phase 2: Browser Extraction",
        description: "Извлечение кода компонентов через браузер",
        components: componentsInfo.components,
        status: 'pending'
      },
      {
        name: "Phase 3: Code Integration",
        description: "Интеграция собранного кода в единый проект",
        components: componentsInfo.components,
        status: 'pending'
      },
      {
        name: "Phase 4: Build System",
        description: "Настройка системы сборки и тестирования",
        components: [],
        status: 'pending'
      }
    ],
    statistics: {
      totalComponents: componentsInfo.total,
      withGitHub: 0,
      extracted: 0,
      integrated: 0,
      ready: 0
    }
  };

  return plan;
}

// Создаем структуру для каждого компонента
function createComponentStructure(component) {
  const componentDir = path.join('v0-unified-project/components', component.name);
  
  const structure = {
    [`${component.name}.tsx`]: `// ${component.name}
// Автор: ${component.author}
// URL: ${component.url}
// Тип: ${component.type}

import React from 'react';

interface ${component.name.replace(/-/g, '')}Props {
  // Добавьте пропсы по необходимости
}

export const ${component.name.replace(/-/g, '')}: React.FC<${component.name.replace(/-/g, '')}Props> = (props) => {
  return (
    <div className="${component.name}">
      {/* Компонент будет добавлен здесь */}
      <h2>${component.name}</h2>
      <p>Автор: ${component.author}</p>
      <p>URL: <a href="${component.url}" target="_blank" rel="noopener noreferrer">${component.url}</a></p>
    </div>
  );
};

export default ${component.name.replace(/-/g, '')};`,
    [`${component.name}.stories.tsx`]: `// Storybook story для ${component.name}
import type { Meta, StoryObj } from '@storybook/react';
import { ${component.name.replace(/-/g, '')} } from './${component.name}';

const meta: Meta<typeof ${component.name.replace(/-/g, '')}> = {
  title: 'Components/${component.name}',
  component: ${component.name.replace(/-/g, '')},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};`,
    [`${component.name}.test.tsx`]: `// Тесты для ${component.name}
import { render, screen } from '@testing-library/react';
import { ${component.name.replace(/-/g, '')} } from './${component.name}';

describe('${component.name.replace(/-/g, '')}', () => {
  it('renders without crashing', () => {
    render(<${component.name.replace(/-/g, '')} />);
    expect(screen.getByText('${component.name}')).toBeInTheDocument();
  });

  it('displays author information', () => {
    render(<${component.name.replace(/-/g, '')} />);
    expect(screen.getByText('Автор: ${component.author}')).toBeInTheDocument();
  });

  it('has working link to original', () => {
    render(<${component.name.replace(/-/g, '')} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '${component.url}');
    expect(link).toHaveAttribute('target', '_blank');
  });
});`,
    'index.ts': `// Экспорт компонента ${component.name}
export { ${component.name.replace(/-/g, '')} } from './${component.name}';
export { default } from './${component.name}';`
  };

  return { componentDir, structure };
}

// Создаем главную страницу с каталогом компонентов
function createMainPage() {
  const mainPageContent = `// Главная страница каталога компонентов v0.app
import React from 'react';
import Link from 'next/link';

const components = ${JSON.stringify(componentsInfo.components, null, 2)};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            v0.app Components Catalog
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Единый каталог всех компонентов v0.app
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-gray-900">Всего компонентов</h3>
              <p className="text-2xl font-bold text-blue-600">{componentsInfo.total}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-gray-900">Community</h3>
              <p className="text-2xl font-bold text-green-600">{componentsInfo.byType.community}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-gray-900">Chat</h3>
              <p className="text-2xl font-bold text-purple-600">{componentsInfo.byType.chat}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {components.map((component) => (
            <div key={component.name} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {component.name.replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase())}
              </h2>
              <p className="text-gray-600 mb-4">
                Автор: <span className="font-medium">{component.author}</span>
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className={\`px-2 py-1 rounded-full text-xs font-medium \${
                  component.type === 'community' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-purple-100 text-purple-800'
                }\`}>
                  {component.type}
                </span>
                <span className={\`px-2 py-1 rounded-full text-xs font-medium \${
                  component.status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }\`}>
                  {component.status}
                </span>
              </div>
              <div className="space-y-2">
                <a 
                  href={component.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                >
                  Посмотреть оригинал
                </a>
                {component.githubLink && (
                  <a 
                    href={component.githubLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`;

  return mainPageContent;
}

// Основная функция
function main() {
  console.log('🚀 Создание плана сбора компонентов v0.app...\n');

  const plan = createCollectionPlan();
  
  // Сохраняем план
  const planPath = path.join('v0-unified-project', 'collection-plan.json');
  fs.writeFileSync(planPath, JSON.stringify(plan, null, 2));
  console.log(`✅ Создан план сбора: collection-plan.json`);

  // Создаем структуру для каждого компонента
  componentsInfo.components.forEach(component => {
    const { componentDir, structure } = createComponentStructure(component);
    
    // Создаем директорию компонента
    if (!fs.existsSync(componentDir)) {
      fs.mkdirSync(componentDir, { recursive: true });
    }

    // Создаем файлы компонента
    Object.entries(structure).forEach(([filename, content]) => {
      const filePath = path.join(componentDir, filename);
      fs.writeFileSync(filePath, content);
    });
    
    console.log(`✅ Создана структура для: ${component.name}`);
  });

  // Создаем главную страницу
  const mainPagePath = path.join('v0-unified-project', 'app', 'page.tsx');
  fs.writeFileSync(mainPagePath, createMainPage());
  console.log(`✅ Создана главная страница: app/page.tsx`);

  // Создаем layout
  const layoutPath = path.join('v0-unified-project', 'app', 'layout.tsx');
  const layoutContent = `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'v0.app Components Catalog',
  description: 'Единый каталог всех компонентов v0.app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}`;
  fs.writeFileSync(layoutPath, layoutContent);
  console.log(`✅ Создан layout: app/layout.tsx`);

  // Создаем глобальные стили
  const globalsPath = path.join('v0-unified-project', 'app', 'globals.css');
  const globalsContent = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}`;
  fs.writeFileSync(globalsPath, globalsContent);
  console.log(`✅ Созданы глобальные стили: app/globals.css`);

  console.log(`\n🎉 План сбора компонентов создан!`);
  console.log(`📊 Статистика:`);
  console.log(`   - Всего компонентов: ${plan.statistics.totalComponents}`);
  console.log(`   - Фаз сбора: ${plan.phases.length}`);
  console.log(`   - Структура создана для всех компонентов`);

  console.log(`\n📝 Следующие шаги:`);
  console.log(`   1. cd v0-unified-project`);
  console.log(`   2. npm install`);
  console.log(`   3. npm run dev`);
  console.log(`   4. Начать Phase 1: Поиск GitHub репозиториев через MCP Vercel`);
  console.log(`   5. Начать Phase 2: Извлечение кода через браузер`);
}

if (require.main === module) {
  main();
}

module.exports = { createCollectionPlan, createComponentStructure, createMainPage };
