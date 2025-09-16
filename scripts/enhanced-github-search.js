#!/usr/bin/env node

/**
 * Enhanced GitHub Search
 * Расширенный поиск репозиториев с большим количеством вариантов названий
 */

const fs = require('fs');
const path = require('path');

// Загружаем анализ компонентов
const analysisPath = path.join(__dirname, 'github-repo-analysis.json');
const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));

/**
 * Генерирует расширенные варианты поиска для компонента
 */
function generateEnhancedSearchVariants(componentName) {
  const variants = [];
  
  // Базовые варианты
  variants.push(componentName);
  variants.push(componentName.replace(/-/g, ' '));
  variants.push(componentName.replace(/-/g, '_'));
  
  // С префиксами
  const prefixes = [
    'v0', 'nextjs', 'react', 'vue', 'angular', 'svelte',
    'ui', 'component', 'web', 'app', 'frontend', 'client',
    'modern', 'advanced', 'simple', 'basic', 'mini', 'lite',
    'pro', 'premium', 'enterprise', 'starter', 'template', 'boilerplate'
  ];
  
  prefixes.forEach(prefix => {
    variants.push(`${prefix}-${componentName}`);
    variants.push(`${prefix}_${componentName.replace(/-/g, '_')}`);
    variants.push(`${prefix}${componentName.charAt(0).toUpperCase() + componentName.slice(1)}`);
  });
  
  // С суффиксами
  const suffixes = [
    'component', 'ui', 'template', 'starter', 'boilerplate',
    'app', 'web', 'frontend', 'client', 'widget', 'plugin',
    'library', 'package', 'module', 'tool', 'utility'
  ];
  
  suffixes.forEach(suffix => {
    variants.push(`${componentName}-${suffix}`);
    variants.push(`${componentName}_${suffix}`);
    variants.push(`${componentName}${suffix.charAt(0).toUpperCase() + suffix.slice(1)}`);
  });
  
  // CamelCase и PascalCase
  const camelCase = componentName
    .split('-')
    .map((word, index) => 
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('');
  variants.push(camelCase);
  
  const pascalCase = componentName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  variants.push(pascalCase);
  
  // Комбинированные варианты
  prefixes.forEach(prefix => {
    suffixes.forEach(suffix => {
      variants.push(`${prefix}-${componentName}-${suffix}`);
      variants.push(`${prefix}_${componentName.replace(/-/g, '_')}_${suffix}`);
    });
  });
  
  // Варианты с числами и версиями
  ['2', '3', 'v2', 'v3', 'v1', 'v4', 'v5'].forEach(version => {
    variants.push(`${componentName}-${version}`);
    variants.push(`${componentName}${version}`);
    variants.push(`v0-${componentName}-${version}`);
  });
  
  // Варианты с технологиями
  const techs = ['js', 'ts', 'tsx', 'jsx', 'css', 'scss', 'sass', 'less'];
  techs.forEach(tech => {
    variants.push(`${componentName}-${tech}`);
    variants.push(`${componentName}.${tech}`);
  });
  
  // Варианты с описательными словами
  const descriptive = [
    'modern', 'advanced', 'simple', 'basic', 'mini', 'lite', 'pro',
    'premium', 'enterprise', 'demo', 'example', 'sample', 'test',
    'dev', 'development', 'production', 'beta', 'alpha', 'rc'
  ];
  
  descriptive.forEach(desc => {
    variants.push(`${desc}-${componentName}`);
    variants.push(`${componentName}-${desc}`);
    variants.push(`${desc}_${componentName.replace(/-/g, '_')}`);
  });
  
  // Убираем дубликаты и возвращаем
  return [...new Set(variants)].filter(v => v.length > 0);
}

/**
 * Создает расширенные поисковые запросы
 */
function createEnhancedSearchQueries(componentName) {
  const variants = generateEnhancedSearchVariants(componentName);
  const queries = [];
  
  // Точные совпадения в названии
  variants.slice(0, 20).forEach(variant => {
    queries.push({
      type: 'exact_name',
      query: `"${variant}" in:name`,
      description: `Точное совпадение: "${variant}"`
    });
  });
  
  // Поиск в описании
  variants.slice(0, 10).forEach(variant => {
    queries.push({
      type: 'description',
      query: `"${variant}" in:description`,
      description: `В описании: "${variant}"`
    });
  });
  
  // Поиск в README
  variants.slice(0, 10).forEach(variant => {
    queries.push({
      type: 'readme',
      query: `"${variant}" in:readme`,
      description: `В README: "${variant}"`
    });
  });
  
  // Поиск по тегам
  variants.slice(0, 10).forEach(variant => {
    queries.push({
      type: 'topics',
      query: `"${variant}" in:topics`,
      description: `В тегах: "${variant}"`
    });
  });
  
  // Комбинированные поиски
  const mainVariants = variants.slice(0, 5);
  mainVariants.forEach(variant => {
    queries.push({
      type: 'combined',
      query: `"${variant}" language:JavaScript language:TypeScript`,
      description: `JS/TS: "${variant}"`
    });
    
    queries.push({
      type: 'combined',
      query: `"${variant}" language:React language:Next.js`,
      description: `React/Next.js: "${variant}"`
    });
    
    queries.push({
      type: 'combined',
      query: `"${variant}" stars:>10`,
      description: `Популярные: "${variant}"`
    });
  });
  
  // Поиск по ключевым словам
  const keywords = componentName.split('-');
  keywords.forEach(keyword => {
    if (keyword.length > 2) {
      queries.push({
        type: 'keyword',
        query: `"${keyword}" in:name language:JavaScript`,
        description: `Ключевое слово: "${keyword}"`
      });
    }
  });
  
  return queries;
}

/**
 * Создает HTML страницу с расширенными поисковыми запросами
 */
function createEnhancedSearchHTML() {
  const componentsToSearch = analysis.components.slice(0, 15); // Берем первые 15 компонентов
  
  let html = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enhanced GitHub Search</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            background: #f6f8fa;
        }
        .header {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .stat-card {
            background: white;
            padding: 15px;
            border-radius: 6px;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .stat-number {
            font-size: 24px;
            font-weight: 600;
            color: #0366d6;
        }
        .stat-label {
            font-size: 14px;
            color: #586069;
            margin-top: 5px;
        }
        .component {
            background: white;
            margin-bottom: 20px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .component-header {
            background: #24292e;
            color: white;
            padding: 15px 20px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .component-content {
            padding: 20px;
        }
        .search-category {
            margin-bottom: 25px;
        }
        .category-title {
            font-size: 16px;
            font-weight: 600;
            color: #24292e;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e1e4e8;
        }
        .search-query {
            margin-bottom: 12px;
            padding: 12px;
            background: #f6f8fa;
            border-radius: 6px;
            border-left: 4px solid #0366d6;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .query-info {
            flex: 1;
        }
        .query-type {
            font-size: 11px;
            color: #586069;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 4px;
        }
        .query-description {
            font-size: 14px;
            color: #24292e;
            margin-bottom: 4px;
        }
        .query-text {
            font-size: 12px;
            color: #586069;
            font-family: monospace;
            background: #e1e4e8;
            padding: 2px 6px;
            border-radius: 3px;
            display: inline-block;
        }
        .search-link {
            background: #0366d6;
            color: white;
            padding: 8px 16px;
            text-decoration: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            margin-left: 15px;
        }
        .search-link:hover {
            background: #0256cc;
        }
        .original-link {
            color: #586069;
            font-size: 12px;
            margin-bottom: 15px;
        }
        .auto-search-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            z-index: 1000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .auto-search-btn:hover {
            background: #218838;
        }
        .progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: #0366d6;
            z-index: 1001;
            transition: width 0.3s ease;
        }
    </style>
</head>
<body>
    <div class="progress-bar" id="progressBar"></div>
    
    <button class="auto-search-btn" onclick="startAutoSearch()">
        🚀 Автоматический поиск
    </button>

    <div class="header">
        <h1>🔍 Enhanced GitHub Search</h1>
        <p>Расширенный поиск репозиториев с множественными вариантами названий</p>
    </div>

    <div class="stats">
        <div class="stat-card">
            <div class="stat-number">${componentsToSearch.length}</div>
            <div class="stat-label">Компонентов</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${componentsToSearch.reduce((sum, comp) => sum + createEnhancedSearchQueries(comp.componentName).length, 0)}</div>
            <div class="stat-label">Поисковых запросов</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${analysis.metadata.totalLinks}</div>
            <div class="stat-label">Всего ссылок v0.app</div>
        </div>
    </div>
`;

  componentsToSearch.forEach((component, index) => {
    const searchQueries = createEnhancedSearchQueries(component.componentName);
    const queriesByType = {};
    
    // Группируем запросы по типам
    searchQueries.forEach(query => {
      if (!queriesByType[query.type]) {
        queriesByType[query.type] = [];
      }
      queriesByType[query.type].push(query);
    });
    
    html += `
    <div class="component">
        <div class="component-header">
            ${index + 1}. ${component.componentName}
            <span style="font-size: 12px; opacity: 0.8;">${searchQueries.length} запросов</span>
        </div>
        <div class="component-content">
            <div class="original-link">
                📎 Оригинальная ссылка: <a href="${component.originalUrl}" target="_blank">${component.originalUrl}</a>
            </div>
`;

    // Добавляем запросы по категориям
    Object.entries(queriesByType).forEach(([type, queries]) => {
      const typeNames = {
        'exact_name': 'Точные совпадения в названии',
        'description': 'Поиск в описании',
        'readme': 'Поиск в README',
        'topics': 'Поиск по тегам',
        'combined': 'Комбинированные поиски',
        'keyword': 'Поиск по ключевым словам'
      };
      
      html += `
            <div class="search-category">
                <div class="category-title">${typeNames[type] || type}</div>
`;

      queries.slice(0, 8).forEach((query, queryIndex) => { // Ограничиваем до 8 запросов на категорию
        html += `
                <div class="search-query">
                    <div class="query-info">
                        <div class="query-type">${type}</div>
                        <div class="query-description">${query.description}</div>
                        <div class="query-text">${query.query}</div>
                    </div>
                    <a href="https://github.com/search?q=${encodeURIComponent(query.query)}&type=repositories&s=stars" 
                       target="_blank" 
                       class="search-link"
                       data-component="${component.componentName}"
                       data-query="${query.query}">
                        🔍 Поиск
                    </a>
                </div>
`;
      });

      html += `
            </div>
`;
    });

    html += `
        </div>
    </div>
`;
  });

  html += `
    <script>
        let currentSearchIndex = 0;
        let totalSearches = 0;
        let searchLinks = [];
        
        // Собираем все ссылки для поиска
        function collectSearchLinks() {
            searchLinks = Array.from(document.querySelectorAll('.search-link'));
            totalSearches = searchLinks.length;
            console.log(\`Найдено \${totalSearches} поисковых запросов\`);
        }
        
        // Автоматический поиск
        function startAutoSearch() {
            collectSearchLinks();
            currentSearchIndex = 0;
            updateProgress();
            
            if (totalSearches === 0) {
                alert('Нет поисковых запросов для выполнения');
                return;
            }
            
            const confirmMessage = \`Начать автоматический поиск для \${totalSearches} запросов?\\n\\nЭто откроет много вкладок в браузере.\\nРекомендуется закрыть другие вкладки перед началом.\`;
            
            if (!confirm(confirmMessage)) {
                return;
            }
            
            performNextSearch();
        }
        
        // Выполнение следующего поиска
        function performNextSearch() {
            if (currentSearchIndex >= totalSearches) {
                alert('Автоматический поиск завершен!');
                return;
            }
            
            const link = searchLinks[currentSearchIndex];
            const component = link.getAttribute('data-component');
            const query = link.getAttribute('data-query');
            
            console.log(\`Поиск \${currentSearchIndex + 1}/\${totalSearches}: \${component} - \${query}\`);
            
            // Открываем ссылку в новой вкладке
            window.open(link.href, '_blank');
            
            currentSearchIndex++;
            updateProgress();
            
            // Задержка между запросами (2 секунды)
            setTimeout(performNextSearch, 2000);
        }
        
        // Обновление прогресс-бара
        function updateProgress() {
            const progress = (currentSearchIndex / totalSearches) * 100;
            document.getElementById('progressBar').style.width = progress + '%';
        }
        
        // Инициализация
        document.addEventListener('DOMContentLoaded', function() {
            collectSearchLinks();
        });
    </script>
</body>
</html>`;

  return html;
}

/**
 * Основная функция
 */
function main() {
  console.log('🚀 Создаем расширенный поиск...');
  
  const html = createEnhancedSearchHTML();
  
  // Сохраняем HTML страницу
  const htmlPath = path.join(__dirname, 'enhanced-github-search.html');
  fs.writeFileSync(htmlPath, html);
  
  // Создаем также JSON с расширенными запросами
  const enhancedQueries = analysis.components.slice(0, 15).map(component => ({
    componentName: component.componentName,
    originalUrl: component.originalUrl,
    searchQueries: createEnhancedSearchQueries(component.componentName)
  }));
  
  const jsonPath = path.join(__dirname, 'enhanced-search-queries.json');
  fs.writeFileSync(jsonPath, JSON.stringify({
    metadata: {
      createdDate: new Date().toISOString(),
      totalComponents: enhancedQueries.length,
      totalQueries: enhancedQueries.reduce((sum, comp) => sum + comp.searchQueries.length, 0),
      description: "Расширенные поисковые запросы для GitHub"
    },
    components: enhancedQueries
  }, null, 2));
  
  console.log('✅ Файлы созданы:');
  console.log(`  - ${htmlPath} - HTML страница с расширенным поиском`);
  console.log(`  - ${jsonPath} - JSON с расширенными запросами`);
  
  console.log('\n🔍 Особенности расширенного поиска:');
  console.log('  - Множественные варианты названий (префиксы, суффиксы, версии)');
  console.log('  - Поиск в разных полях (название, описание, README, теги)');
  console.log('  - Комбинированные запросы с фильтрами');
  console.log('  - Автоматический поиск с прогресс-баром');
  console.log('  - Группировка запросов по типам');
}

if (require.main === module) {
  main();
}

module.exports = {
  generateEnhancedSearchVariants,
  createEnhancedSearchQueries,
  createEnhancedSearchHTML
};


