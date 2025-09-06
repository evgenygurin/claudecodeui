#!/usr/bin/env node

/**
 * v0.app Unified Project Collector
 * 
 * Этот скрипт собирает все компоненты v0.app в единый проект
 * 
 * Использование: node v0-unified-project-collector.js
 */

const fs = require('fs');
const path = require('path');

// Список всех компонентов v0.app
const components = [
  { name: "file-manager-wukORjs2J9p", url: "https://v0.app/chat/file-manager-wukORjs2J9p", author: "eagurin", type: "chat" },
  { name: "file-manager-hN0nNvAchzi", url: "https://v0.app/community/file-manager-hN0nNvAchzi", author: "michaelvanrantwijk-4113", type: "community" },
  { name: "ai-chat-interface-6VLiqkGu5vw", url: "https://v0.app/community/ai-chat-interface-6VLiqkGu5vw", author: "ahmedsenousy01", type: "community" },
  { name: "integrations-page-7HOUCTcoR5n", url: "https://v0.app/community/integrations-page-7HOUCTcoR5n", author: "babureddys003-5877", type: "community" },
  { name: "sidebar-layout-ybLyeN1sesS", url: "https://v0.app/community/sidebar-layout-ybLyeN1sesS", author: "unknown", type: "community" },
  { name: "action-search-bar-S3nMPSmpQzk", url: "https://v0.app/community/action-search-bar-S3nMPSmpQzk", author: "unknown", type: "community" },
  { name: "ai-card-generation-Tpxvlz16QiJ", url: "https://v0.app/community/ai-card-generation-Tpxvlz16QiJ", author: "unknown", type: "community" },
  { name: "vercel-tabs-BT27p0aGPsa", url: "https://v0.app/community/vercel-tabs-BT27p0aGPsa", author: "unknown", type: "community" },
  { name: "animated-beam-voQije6wyja", url: "https://v0.app/community/animated-beam-voQije6wyja", author: "unknown", type: "community" },
  { name: "image-to-ascii-0UE1nczWzbu", url: "https://v0.app/community/image-to-ascii-0UE1nczWzbu", author: "unknown", type: "community" },
  { name: "documentation-starter-ov3ApgfOdx5", url: "https://v0.app/community/documentation-starter-ov3ApgfOdx5", author: "unknown", type: "community" },
  { name: "admin-dashboard-yBomF3O9Yu3", url: "https://v0.app/community/admin-dashboard-yBomF3O9Yu3", author: "unknown", type: "community" },
  { name: "chat-ui-with-vibration-xf3RmrkKlxc", url: "https://v0.app/community/chat-ui-with-vibration-xf3RmrkKlxc", author: "unknown", type: "community" },
  { name: "chat-ui-h4Ga3LeTpbl", url: "https://v0.app/community/chat-ui-h4Ga3LeTpbl", author: "unknown", type: "community" },
  { name: "eleven-labs-conversational-ai-starter-5TN93pl3bRS", url: "https://v0.app/community/eleven-labs-conversational-ai-starter-5TN93pl3bRS", author: "unknown", type: "community" },
  { name: "light-dark-image-transition-0WSCfiIps92", url: "https://v0.app/community/light-dark-image-transition-0WSCfiIps92", author: "unknown", type: "community" },
  { name: "dynamic-table-hJCDzsfPzdV", url: "https://v0.app/community/dynamic-table-hJCDzsfPzdV", author: "unknown", type: "community" },
  { name: "drageasy-drag-and-drop-dashboard-mLIx6xWQwmP", url: "https://v0.app/community/drageasy-drag-and-drop-dashboard-mLIx6xWQwmP", author: "unknown", type: "community" },
  { name: "login-03-LtQ7cIPj9o5", url: "https://v0.app/community/login-03-LtQ7cIPj9o5", author: "unknown", type: "community" },
  { name: "sidebar-in-dialog-WzUz8z8OdKf", url: "https://v0.app/community/sidebar-in-dialog-WzUz8z8OdKf", author: "unknown", type: "community" },
  { name: "login-02-lgh5A223SiR", url: "https://v0.app/community/login-02-lgh5A223SiR", author: "unknown", type: "community" },
  { name: "file-tree-sidebar-NBfcFIKai4T", url: "https://v0.app/community/file-tree-sidebar-NBfcFIKai4T", author: "unknown", type: "community" },
  { name: "team-member-invites-BtbvdBJqRve", url: "https://v0.app/community/team-member-invites-BtbvdBJqRve", author: "unknown", type: "community" },
  { name: "eleven-labs-music-starter-xuCjYtmbQri", url: "https://v0.app/community/eleven-labs-music-starter-xuCjYtmbQri", author: "unknown", type: "community" },
  { name: "eleven-labs-agents-starter-5TN93pl3bRS", url: "https://v0.app/community/eleven-labs-agents-starter-5TN93pl3bRS", author: "unknown", type: "community" },
  { name: "eleven-labs-v3-podcast-generator-9zvVUBtxy6i", url: "https://v0.app/community/eleven-labs-v3-podcast-generator-9zvVUBtxy6i", author: "unknown", type: "community" },
  { name: "next-js-doc-like-file-tree-BNbIj6SOUTQ", url: "https://v0.app/chat/next-js-doc-like-file-tree-BNbIj6SOUTQ", author: "unknown", type: "chat" },
  { name: "glow-menu-component-XqrIezRilBR", url: "https://v0.app/community/glow-menu-component-XqrIezRilBR", author: "unknown", type: "community" },
  { name: "fluid-dropdown-zWgCGYGZIcx", url: "https://v0.app/community/fluid-dropdown-zWgCGYGZIcx", author: "unknown", type: "community" },
  { name: "toast-fLjYRXrijvp", url: "https://v0.app/community/toast-fLjYRXrijvp", author: "unknown", type: "community" },
  { name: "bento-grid-8QW53cSzCxp", url: "https://v0.app/community/bento-grid-8QW53cSzCxp", author: "unknown", type: "community" },
  { name: "chat-ui-with-vibration-Enjda8qtpct", url: "https://v0.app/community/chat-ui-with-vibration-Enjda8qtpct", author: "unknown", type: "community" },
  { name: "modern-library-design-YzJGL4XM0VM", url: "https://v0.app/community/modern-library-design-YzJGL4XM0VM", author: "unknown", type: "community" },
  { name: "cuisine-selector-chips-b1LMjSX49FY", url: "https://v0.app/chat/cuisine-selector-chips-b1LMjSX49FY", author: "unknown", type: "chat" },
  { name: "general-greeting-oaN8bYkHdWq", url: "https://v0.app/chat/general-greeting-oaN8bYkHdWq", author: "unknown", type: "chat" },
  { name: "marketplace-b3DN1aOd6mQ", url: "https://v0.app/community/marketplace-b3DN1aOd6mQ", author: "unknown", type: "community" },
  { name: "background-paths-s2R42ut7CxT", url: "https://v0.app/community/background-paths-s2R42ut7CxT", author: "unknown", type: "community" },
  { name: "creative-xYqdqPAJD3j", url: "https://v0.app/community/creative-xYqdqPAJD3j", author: "unknown", type: "community" },
  { name: "shopify-product-page-design-NxSj0IgX4vu", url: "https://v0.app/community/shopify-product-page-design-NxSj0IgX4vu", author: "unknown", type: "community" },
  { name: "creative-agency-portfolio-hJnIgxCCUr5", url: "https://v0.app/community/creative-agency-portfolio-hJnIgxCCUr5", author: "unknown", type: "community" },
  { name: "financial-dashboard-functional-jUBqSBJsNrz", url: "https://v0.app/community/financial-dashboard-functional-jUBqSBJsNrz", author: "unknown", type: "community" },
  { name: "ai-elements-with-ai-sdk-5-ksSTzATPzMq", url: "https://v0.app/community/ai-elements-with-ai-sdk-5-ksSTzATPzMq", author: "unknown", type: "community" },
  { name: "modern-ai-chatbot-interface-template-GzHBHQAiS2F", url: "https://v0.app/community/modern-ai-chatbot-interface-template-GzHBHQAiS2F", author: "unknown", type: "community" },
  { name: "origin-e-commerce-ui-w98dsZBVaaU", url: "https://v0.app/community/origin-e-commerce-ui-w98dsZBVaaU", author: "unknown", type: "community" }
];

// Создание структуры единого проекта
function createUnifiedProjectStructure() {
  const projectDir = 'v0-unified-project';
  
  // Создаем основную структуру
  const structure = {
    'package.json': {
      name: 'v0-unified-project',
      version: '1.0.0',
      description: 'Unified project containing all v0.app components',
      main: 'index.js',
      scripts: {
        'dev': 'next dev',
        'build': 'next build',
        'start': 'next start',
        'lint': 'next lint'
      },
      dependencies: {
        'next': '^14.0.0',
        'react': '^18.0.0',
        'react-dom': '^18.0.0',
        'typescript': '^5.0.0',
        '@types/react': '^18.0.0',
        '@types/node': '^20.0.0',
        'tailwindcss': '^3.0.0',
        'autoprefixer': '^10.0.0',
        'postcss': '^8.0.0'
      }
    },
    'next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig`,
    'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,
    'tsconfig.json': `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`,
    'README.md': `# v0.app Unified Project

Этот проект содержит все компоненты v0.app в единой структуре.

## Компоненты

${components.map(comp => `- **${comp.name}** - ${comp.url}`).join('\n')}

## Установка

\`\`\`bash
npm install
\`\`\`

## Запуск

\`\`\`bash
npm run dev
\`\`\`

## Структура

- \`/components\` - Все компоненты v0.app
- \`/pages\` - Страницы приложения
- \`/styles\` - Стили
- \`/utils\` - Утилиты
`
  };

  return { projectDir, structure };
}

// Создание файла с информацией о компонентах
function createComponentsInfo() {
  const componentsInfo = {
    total: components.length,
    byType: {
      community: components.filter(c => c.type === 'community').length,
      chat: components.filter(c => c.type === 'chat').length
    },
    byAuthor: {},
    components: components.map(comp => ({
      name: comp.name,
      url: comp.url,
      author: comp.author,
      type: comp.type,
      githubLink: null, // Будет заполнено позже
      status: 'pending'
    }))
  };

  // Группировка по авторам
  components.forEach(comp => {
    if (!componentsInfo.byAuthor[comp.author]) {
      componentsInfo.byAuthor[comp.author] = 0;
    }
    componentsInfo.byAuthor[comp.author]++;
  });

  return componentsInfo;
}

// Основная функция
function main() {
  console.log('🚀 Создание единого проекта v0.app...\n');

  const { projectDir, structure } = createUnifiedProjectStructure();
  const componentsInfo = createComponentsInfo();

  // Создаем директорию проекта
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }

  // Создаем файлы структуры
  Object.entries(structure).forEach(([filename, content]) => {
    const filePath = path.join(projectDir, filename);
    fs.writeFileSync(filePath, typeof content === 'string' ? content : JSON.stringify(content, null, 2));
    console.log(`✅ Создан файл: ${filename}`);
  });

  // Создаем информацию о компонентах
  const componentsPath = path.join(projectDir, 'components-info.json');
  fs.writeFileSync(componentsPath, JSON.stringify(componentsInfo, null, 2));
  console.log(`✅ Создан файл: components-info.json`);

  // Создаем директории
  const dirs = ['components', 'pages', 'styles', 'utils', 'app'];
  dirs.forEach(dir => {
    const dirPath = path.join(projectDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ Создана директория: ${dir}/`);
    }
  });

  console.log(`\n🎉 Единый проект создан в директории: ${projectDir}`);
  console.log(`📊 Статистика:`);
  console.log(`   - Всего компонентов: ${componentsInfo.total}`);
  console.log(`   - Community: ${componentsInfo.byType.community}`);
  console.log(`   - Chat: ${componentsInfo.byType.chat}`);
  console.log(`   - Уникальных авторов: ${Object.keys(componentsInfo.byAuthor).length}`);

  console.log(`\n📝 Следующие шаги:`);
  console.log(`   1. cd ${projectDir}`);
  console.log(`   2. npm install`);
  console.log(`   3. npm run dev`);
  console.log(`   4. Начать сборку компонентов...`);
}

if (require.main === module) {
  main();
}

module.exports = { createUnifiedProjectStructure, createComponentsInfo, components };
