#!/usr/bin/env node

/**
 * GitHub Repository Finder
 * Извлекает названия репозиториев из ссылок v0.app и ищет их на GitHub
 */

const fs = require('fs');
const path = require('path');

// Список ссылок v0.app для анализа
const v0Links = [
  'https://v0.app/chat/file-manager-wukORjs2J9p',
  'https://v0.app/community/file-manager-hN0nNvAchzi',
  'https://v0.app/community/ai-chat-interface-6VLiqkGu5vw',
  'https://v0.app/community/integrations-page-7HOUCTcoR5n',
  'https://v0.app/community/sidebar-layout-ybLyeN1sesS',
  'https://v0.app/community/action-search-bar-S3nMPSmpQzk',
  'https://v0.app/community/ai-card-generation-Tpxvlz16QiJ',
  'https://v0.app/community/vercel-tabs-BT27p0aGPsa',
  'https://v0.app/community/animated-beam-voQije6wyja',
  'https://v0.app/community/image-to-ascii-0UE1nczWzbu',
  'https://v0.app/community/documentation-starter-ov3ApgfOdx5',
  'https://v0.app/community/admin-dashboard-yBomF3O9Yu3',
  'https://v0.app/community/chat-ui-with-vibration-xf3RmrkKlxc',
  'https://v0.app/community/chat-ui-h4Ga3LeTpbl',
  'https://v0.app/community/eleven-labs-conversational-ai-starter-5TN93pl3bRS',
  'https://v0.app/community/light-dark-image-transition-0WSCfiIps92',
  'https://v0.app/community/dynamic-table-hJCDzsfPzdV',
  'https://v0.app/community/drageasy-drag-and-drop-dashboard-mLIx6xWQwmP',
  'https://v0.app/community/login-03-LtQ7cIPj9o5',
  'https://v0.app/community/sidebar-in-dialog-WzUz8z8OdKf',
  'https://v0.app/community/login-02-lgh5A223SiR',
  'https://v0.app/community/file-tree-sidebar-NBfcFIKai4T',
  'https://v0.app/community/team-member-invites-BtbvdBJqRve',
  'https://v0.app/community/eleven-labs-music-starter-xuCjYtmbQri',
  'https://v0.app/community/eleven-labs-agents-starter-5TN93pl3bRS',
  'https://v0.app/community/eleven-labs-v3-podcast-generator-9zvVUBtxy6i',
  'https://v0.app/chat/next-js-doc-like-file-tree-BNbIj6SOUTQ',
  'https://v0.app/community/vercel-tabs-BT27p0aGPsa',
  'https://v0.app/community/glow-menu-component-XqrIezRilBR',
  'https://v0.app/community/fluid-dropdown-zWgCGYGZIcx',
  'https://v0.app/community/toast-fLjYRXrijvp',
  'https://v0.app/community/bento-grid-8QW53cSzCxp',
  'https://v0.app/community/chat-ui-with-vibration-Enjda8qtpct',
  'https://v0.app/community/modern-library-design-YzJGL4XM0VM',
  'https://v0.app/chat/cuisine-selector-chips-b1LMjSX49FY',
  'https://v0.app/chat/general-greeting-oaN8bYkHdWq',
  'https://v0.app/community/marketplace-b3DN1aOd6mQ',
  'https://v0.app/community/background-paths-s2R42ut7CxT',
  'https://v0.app/community/creative-xYqdqPAJD3j',
  'https://v0.app/community/shopify-product-page-design-NxSj0IgX4vu',
  'https://v0.app/community/creative-agency-portfolio-hJnIgxCCUr5',
  'https://v0.app/community/financial-dashboard-functional-jUBqSBJsNrz',
  'https://v0.app/community/ai-elements-with-ai-sdk-5-ksSTzATPzMq',
  'https://v0.app/community/modern-ai-chatbot-interface-template-GzHBHQAiS2F',
  'https://v0.app/community/origin-e-commerce-ui-w98dsZBVaaU',
];

/**
 * Извлекает название компонента из URL v0.app
 */
function extractComponentName(url) {
  const urlParts = url.split('/');
  const lastPart = urlParts[urlParts.length - 1];

  // Убираем ID в конце (последние символы после последнего дефиса)
  const nameParts = lastPart.split('-');
  if (nameParts.length > 1) {
    // Убираем последнюю часть (ID)
    nameParts.pop();
  }

  return nameParts.join('-');
}

/**
 * Генерирует возможные названия репозиториев на основе названия компонента
 */
function generateRepoNameVariants(componentName) {
  const variants = [];

  // Оригинальное название
  variants.push(componentName);

  // С префиксами
  variants.push(`v0-${componentName}`);
  variants.push(`nextjs-${componentName}`);
  variants.push(`react-${componentName}`);
  variants.push(`ui-${componentName}`);
  variants.push(`component-${componentName}`);

  // С суффиксами
  variants.push(`${componentName}-component`);
  variants.push(`${componentName}-ui`);
  variants.push(`${componentName}-template`);
  variants.push(`${componentName}-starter`);

  // С заменой дефисов на подчеркивания
  variants.push(componentName.replace(/-/g, '_'));
  variants.push(`v0_${componentName.replace(/-/g, '_')}`);

  // CamelCase варианты
  const camelCase = componentName
    .split('-')
    .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join('');
  variants.push(camelCase);
  variants.push(`v0${camelCase.charAt(0).toUpperCase() + camelCase.slice(1)}`);

  // PascalCase варианты
  const pascalCase = componentName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  variants.push(pascalCase);
  variants.push(`V0${pascalCase}`);

  return [...new Set(variants)]; // Убираем дубликаты
}

/**
 * Создает инструкции для поиска репозиториев на GitHub
 */
function createGitHubSearchInstructions() {
  const instructions = [];

  for (const link of v0Links) {
    const componentName = extractComponentName(link);
    const repoVariants = generateRepoNameVariants(componentName);

    instructions.push({
      originalUrl: link,
      componentName,
      searchVariants: repoVariants,
      githubSearchQueries: repoVariants.map(variant => ({
        name: variant,
        query: `"${variant}" in:name`,
        description: `Поиск репозитория с названием "${variant}"`,
      })),
    });
  }

  return instructions;
}

/**
 * Создает JSON файл с результатами анализа
 */
function createAnalysisFile() {
  const analysis = {
    metadata: {
      totalLinks: v0Links.length,
      analysisDate: new Date().toISOString(),
      description: 'Анализ ссылок v0.app для поиска соответствующих репозиториев на GitHub',
    },
    components: createGitHubSearchInstructions(),
  };

  const outputPath = path.join(__dirname, 'github-repo-analysis.json');
  fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));

  console.log(`✅ Анализ сохранен в: ${outputPath}`);
  return analysis;
}

/**
 * Создает Markdown отчет с инструкциями
 */
function createMarkdownReport(analysis) {
  let markdown = `# GitHub Repository Search Analysis

## Обзор
- **Всего ссылок v0.app**: ${analysis.metadata.totalLinks}
- **Дата анализа**: ${new Date(analysis.metadata.analysisDate).toLocaleString('ru-RU')}
- **Описание**: Анализ ссылок v0.app для поиска соответствующих репозиториев на GitHub

## Компоненты для поиска

`;

  analysis.components.forEach((component, index) => {
    markdown += `### ${index + 1}. ${component.componentName}
- **Оригинальная ссылка**: ${component.originalUrl}
- **Варианты поиска**: ${component.searchVariants.length}

#### GitHub Search Queries:
`;

    component.githubSearchQueries.forEach((query, queryIndex) => {
      markdown += `${queryIndex + 1}. **${query.name}**
   - Query: \`${query.query}\`
   - Описание: ${query.description}

`;
    });

    markdown += `---
`;
  });

  markdown += `
## Инструкции по использованию

### 1. Использование MCP GitHub сервера
Для каждого компонента выполните поиск с помощью MCP GitHub инструментов:

\`\`\`javascript
// Пример поиска репозитория
const searchResults = await mcp_github_search_repositories({
  query: "v0-file-manager in:name",
  sort: "stars",
  order: "desc"
});
\`\`\`

### 2. Рекомендуемые поисковые запросы
1. **Точное совпадение**: \`"component-name" in:name\`
2. **Поиск по описанию**: \`"component-name" in:description\`
3. **Поиск по README**: \`"component-name" in:readme\`
4. **Поиск по тегам**: \`"component-name" in:topics\`

### 3. Критерии отбора репозиториев
- ⭐ Количество звезд > 10
- 📅 Последнее обновление < 6 месяцев
- 📝 Наличие README
- 🏷️ Релевантные теги (react, nextjs, ui, component)
- 📦 Наличие package.json

### 4. Сохранение результатов
Сохраните найденные репозитории в формате:
\`\`\`json
{
  "componentName": "file-manager",
  "originalUrl": "https://v0.app/community/file-manager-hN0nNvAchzi",
  "foundRepositories": [
    {
      "name": "v0-file-manager",
      "fullName": "username/v0-file-manager",
      "url": "https://github.com/username/v0-file-manager",
      "stars": 25,
      "description": "File manager component built with v0",
      "lastUpdated": "2024-01-15T10:30:00Z"
    }
  ]
}
\`\`\`
`;

  const outputPath = path.join(__dirname, 'github-search-instructions.md');
  fs.writeFileSync(outputPath, markdown);

  console.log(`✅ Инструкции сохранены в: ${outputPath}`);
}

/**
 * Создает скрипт для автоматического поиска
 */
function createSearchScript() {
  const script = `#!/usr/bin/env node

/**
 * Автоматический поиск репозиториев на GitHub
 * Использует результаты анализа для поиска соответствующих репозиториев
 */

const fs = require('fs');
const path = require('path');

// Загружаем анализ
const analysisPath = path.join(__dirname, 'github-repo-analysis.json');
const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));

/**
 * Функция для поиска репозитория (заглушка для MCP интеграции)
 */
async function searchRepository(query) {
  // Здесь будет интеграция с MCP GitHub сервером
  console.log(\`🔍 Поиск: \${query}\`);
  
  // Заглушка - возвращаем пример результата
  return {
    total_count: 1,
    items: [{
      name: query.split(' ')[0].replace(/"/g, ''),
      full_name: \`example/\${query.split(' ')[0].replace(/"/g, '')}\`,
      html_url: \`https://github.com/example/\${query.split(' ')[0].replace(/"/g, '')}\`,
      stargazers_count: Math.floor(Math.random() * 100),
      description: \`\${query.split(' ')[0].replace(/"/g, '')} component\`,
      updated_at: new Date().toISOString(),
      topics: ['react', 'nextjs', 'ui', 'component']
    }]
  };
}

/**
 * Основная функция поиска
 */
async function performSearch() {
  const results = [];
  
  console.log(\`🚀 Начинаем поиск для \${analysis.components.length} компонентов...\`);
  
  for (const component of analysis.components) {
    console.log(\`\\n📦 Поиск для: \${component.componentName}\`);
    
    const componentResults = {
      componentName: component.componentName,
      originalUrl: component.originalUrl,
      foundRepositories: []
    };
    
    // Ищем по каждому варианту названия
    for (const query of component.githubSearchQueries.slice(0, 3)) { // Ограничиваем до 3 запросов
      try {
        const searchResult = await searchRepository(query.query);
        
        if (searchResult.total_count > 0) {
          searchResult.items.forEach(repo => {
            componentResults.foundRepositories.push({
              name: repo.name,
              fullName: repo.full_name,
              url: repo.html_url,
              stars: repo.stargazers_count,
              description: repo.description,
              lastUpdated: repo.updated_at,
              topics: repo.topics || []
            });
          });
        }
        
        // Небольшая задержка между запросами
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(\`❌ Ошибка поиска для \${query.name}: \${error.message}\`);
      }
    }
    
    // Убираем дубликаты
    componentResults.foundRepositories = componentResults.foundRepositories
      .filter((repo, index, self) => 
        index === self.findIndex(r => r.fullName === repo.fullName)
      )
      .sort((a, b) => b.stars - a.stars);
    
    results.push(componentResults);
    
    console.log(\`✅ Найдено \${componentResults.foundRepositories.length} репозиториев\`);
  }
  
  // Сохраняем результаты
  const outputPath = path.join(__dirname, 'github-search-results.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    metadata: {
      searchDate: new Date().toISOString(),
      totalComponents: results.length,
      totalRepositories: results.reduce((sum, r) => sum + r.foundRepositories.length, 0)
    },
    results
  }, null, 2));
  
  console.log(\`\\n🎉 Поиск завершен! Результаты сохранены в: \${outputPath}\`);
  
  // Создаем сводный отчет
  createSummaryReport(results);
}

/**
 * Создает сводный отчет
 */
function createSummaryReport(results) {
  let report = \`# GitHub Search Results Summary

## Общая статистика
- **Дата поиска**: \${new Date().toLocaleString('ru-RU')}
- **Всего компонентов**: \${results.length}
- **Всего найдено репозиториев**: \${results.reduce((sum, r) => sum + r.foundRepositories.length, 0)}

## Результаты по компонентам

\`;

  results.forEach((result, index) => {
    report += \`### \${index + 1}. \${result.componentName}
- **Оригинальная ссылка**: \${result.originalUrl}
- **Найдено репозиториев**: \${result.foundRepositories.length}

\`;

    if (result.foundRepositories.length > 0) {
      report += \`#### Найденные репозитории:
\`;
      
      result.foundRepositories.forEach((repo, repoIndex) => {
        report += \`\${repoIndex + 1}. **[ \${repo.name} ](\${repo.url})** ⭐ \${repo.stars}
   - Описание: \${repo.description || 'Нет описания'}
   - Обновлен: \${new Date(repo.lastUpdated).toLocaleDateString('ru-RU')}
   - Теги: \${repo.topics.join(', ') || 'Нет тегов'}

\`;
      });
    } else {
      report += \`❌ Репозитории не найдены

\`;
    }
    
    report += \`---
\`;
  });

  const reportPath = path.join(__dirname, 'github-search-summary.md');
  fs.writeFileSync(reportPath, report);
  
  console.log(\`📊 Сводный отчет создан: \${reportPath}\`);
}

// Запускаем поиск
if (require.main === module) {
  performSearch().catch(console.error);
}

module.exports = { performSearch, searchRepository };
`;

  const outputPath = path.join(__dirname, 'github-search-automation.js');
  fs.writeFileSync(outputPath, script);

  // Делаем файл исполняемым
  fs.chmodSync(outputPath, '755');

  console.log(`✅ Скрипт автоматизации создан: ${outputPath}`);
}

/**
 * Основная функция
 */
function main() {
  console.log('🚀 Начинаем анализ ссылок v0.app...');

  const analysis = createAnalysisFile();
  createMarkdownReport(analysis);
  createSearchScript();

  console.log('\n✅ Анализ завершен!');
  console.log('\n📋 Созданные файлы:');
  console.log('  - github-repo-analysis.json - Детальный анализ компонентов');
  console.log('  - github-search-instructions.md - Инструкции по поиску');
  console.log('  - github-search-automation.js - Скрипт автоматизации');

  console.log('\n🔍 Следующие шаги:');
  console.log('  1. Используйте MCP GitHub сервер для поиска репозиториев');
  console.log('  2. Запустите github-search-automation.js для автоматического поиска');
  console.log('  3. Проанализируйте результаты в github-search-summary.md');
}

if (require.main === module) {
  main();
}

module.exports = {
  extractComponentName,
  generateRepoNameVariants,
  createGitHubSearchInstructions,
  createAnalysisFile,
  createMarkdownReport,
  createSearchScript,
};
