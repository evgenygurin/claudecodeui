#!/usr/bin/env node

/**
 * V0.app Component Collector
 * Автоматический сбор компонентов с v0.app страниц
 */

const fs = require('fs');
const path = require('path');

// Список URL для сбора компонентов
const V0_URLS = [
  // File Manager компоненты
  'https://v0.app/chat/file-manager-wukORjs2J9p',
  'https://v0.app/community/file-manager-hN0nNvAchzi',
  
  // Chat Interface компоненты
  'https://v0.app/community/ai-chat-interface-6VLiqkGu5vw',
  'https://v0.app/community/chat-ui-with-vibration-xf3RmrkKlxc',
  'https://v0.app/community/chat-ui-h4Ga3LeTpbl',
  'https://v0.app/community/modern-ai-chatbot-interface-template-GzHBHQAiS2F',
  
  // Layout и Navigation
  'https://v0.app/community/integrations-page-7HOUCTcoR5n',
  'https://v0.app/community/sidebar-layout-ybLyeN1sesS',
  'https://v0.app/community/sidebar-in-dialog-WzUz8z8OdKf',
  'https://v0.app/community/file-tree-sidebar-NBfcFIKai4T',
  
  // UI Components
  'https://v0.app/community/action-search-bar-S3nMPSmpQzk',
  'https://v0.app/community/ai-card-generation-Tpxvlz16QiJ',
  'https://v0.app/community/vercel-tabs-BT27p0aGPsa',
  'https://v0.app/community/animated-beam-voQije6wyja',
  'https://v0.app/community/glow-menu-component-XqrIezRilBR',
  'https://v0.app/community/fluid-dropdown-zWgCGYGZIcx',
  'https://v0.app/community/toast-fLjYRXrijvp',
  'https://v0.app/community/bento-grid-8QW53cSzCxp',
  
  // Specialized Components
  'https://v0.app/community/image-to-ascii-0UE1nczWzbu',
  'https://v0.app/community/documentation-starter-ov3ApgfOdx5',
  'https://v0.app/community/admin-dashboard-yBomF3O9Yu3',
  'https://v0.app/community/light-dark-image-transition-0WSCfiIps92',
  'https://v0.app/community/dynamic-table-hJCDzsfPzdV',
  'https://v0.app/community/drageasy-drag-and-drop-dashboard-mLIx6xWQwmP',
  
  // Authentication
  'https://v0.app/community/login-03-LtQ7cIPj9o5',
  'https://v0.app/community/login-02-lgh5A223SiR',
  
  // Team Management
  'https://v0.app/community/team-member-invites-BtbvdBJqRve',
  
  // Eleven Labs Integration
  'https://v0.app/community/eleven-labs-conversational-ai-starter-5TN93pl3bRS',
  'https://v0.app/community/eleven-labs-music-starter-xuCjYtmbQri',
  'https://v0.app/community/eleven-labs-agents-starter-5TN93pl3bRS',
  'https://v0.app/community/eleven-labs-v3-podcast-generator-9zvVUBtxy6i',
  
  // Design Systems
  'https://v0.app/community/modern-library-design-YzJGL4XM0VM',
  'https://v0.app/community/marketplace-b3DN1aOd6mQ',
  'https://v0.app/community/background-paths-s2R42ut7CxT',
  'https://v0.app/community/creative-xYqdqPAJD3j',
  'https://v0.app/community/shopify-product-page-design-NxSj0IgX4vu',
  'https://v0.app/community/creative-agency-portfolio-hJnIgxCCUr5',
  'https://v0.app/community/financial-dashboard-functional-jUBqSBJsNrz',
  'https://v0.app/community/ai-elements-with-ai-sdk-5-ksSTzATPzMq',
  'https://v0.app/community/origin-e-commerce-ui-w98dsZBVaaU',
  
  // Chat Components
  'https://v0.app/chat/next-js-doc-like-file-tree-BNbIj6SOUTQ',
  'https://v0.app/chat/cuisine-selector-chips-b1LMjSX49FY',
  'https://v0.app/chat/general-greeting-oaN8bYkHdWq'
];

// Категории компонентов
const COMPONENT_CATEGORIES = {
  'file-manager': ['file-manager'],
  'chat': ['chat', 'ai-chat', 'chatbot'],
  'layout': ['sidebar', 'layout', 'navigation'],
  'ui': ['button', 'input', 'dropdown', 'tabs', 'toast', 'beam', 'grid'],
  'auth': ['login', 'auth'],
  'team': ['team', 'invite'],
  'eleven-labs': ['eleven-labs'],
  'design': ['creative', 'portfolio', 'dashboard', 'marketplace'],
  'specialized': ['ascii', 'documentation', 'table', 'drag']
};

/**
 * Определяет категорию компонента по URL
 */
function getComponentCategory(url) {
  const urlLower = url.toLowerCase();
  
  for (const [category, keywords] of Object.entries(COMPONENT_CATEGORIES)) {
    if (keywords.some(keyword => urlLower.includes(keyword))) {
      return category;
    }
  }
  
  return 'misc';
}

/**
 * Извлекает ID компонента из URL
 */
function extractComponentId(url) {
  const match = url.match(/\/([^\/]+)$/);
  return match ? match[1] : 'unknown';
}

/**
 * Создает метаданные для компонента
 */
function createComponentMetadata(url, category) {
  const id = extractComponentId(url);
  const name = id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    id,
    name,
    category,
    url,
    source: 'v0.app',
    collectedAt: new Date().toISOString(),
    status: 'pending',
    complexity: 'medium', // Будет определено позже
    dependencies: [],
    tags: []
  };
}

/**
 * Основная функция сбора компонентов
 */
async function collectComponents() {
  console.log('🚀 Начинаем сбор компонентов с v0.app...');
  
  const components = [];
  const errors = [];
  
  for (const url of V0_URLS) {
    try {
      console.log(`📦 Обрабатываем: ${url}`);
      
      const category = getComponentCategory(url);
      const metadata = createComponentMetadata(url, category);
      
      components.push(metadata);
      
      console.log(`✅ Добавлен компонент: ${metadata.name} (${category})`);
      
    } catch (error) {
      console.error(`❌ Ошибка при обработке ${url}:`, error.message);
      errors.push({ url, error: error.message });
    }
  }
  
  // Сохраняем результаты
  const outputDir = path.join(__dirname, '..', 'collected-components');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Сохраняем метаданные
  const metadataFile = path.join(outputDir, 'components-metadata.json');
  fs.writeFileSync(metadataFile, JSON.stringify(components, null, 2));
  
  // Сохраняем ошибки
  if (errors.length > 0) {
    const errorsFile = path.join(outputDir, 'collection-errors.json');
    fs.writeFileSync(errorsFile, JSON.stringify(errors, null, 2));
  }
  
  // Создаем отчет
  const report = {
    totalUrls: V0_URLS.length,
    successful: components.length,
    errors: errors.length,
    categories: {},
    timestamp: new Date().toISOString()
  };
  
  // Подсчитываем по категориям
  components.forEach(component => {
    report.categories[component.category] = (report.categories[component.category] || 0) + 1;
  });
  
  const reportFile = path.join(outputDir, 'collection-report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  
  console.log('\n📊 Результаты сбора:');
  console.log(`✅ Успешно обработано: ${components.length}`);
  console.log(`❌ Ошибок: ${errors.length}`);
  console.log(`📁 Результаты сохранены в: ${outputDir}`);
  
  console.log('\n📈 По категориям:');
  Object.entries(report.categories).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} компонентов`);
  });
  
  return { components, errors, report };
}

/**
 * Создает структуру директорий для компонентов
 */
function createComponentStructure() {
  const baseDir = path.join(__dirname, '..', 'collected-components');
  const categories = Object.keys(COMPONENT_CATEGORIES);
  
  categories.forEach(category => {
    const categoryDir = path.join(baseDir, category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }
  });
  
  console.log('📁 Создана структура директорий для компонентов');
}

// Запуск скрипта
if (require.main === module) {
  (async () => {
    try {
      createComponentStructure();
      await collectComponents();
      console.log('\n🎉 Сбор компонентов завершен!');
    } catch (error) {
      console.error('💥 Критическая ошибка:', error);
      process.exit(1);
    }
  })();
}

module.exports = {
  collectComponents,
  createComponentStructure,
  V0_URLS,
  COMPONENT_CATEGORIES
};
