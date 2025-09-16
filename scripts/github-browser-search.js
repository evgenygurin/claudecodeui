#!/usr/bin/env node

/**
 * GitHub Browser Search
 * Использует браузер для поиска репозиториев на GitHub
 */

const fs = require('fs');
const path = require('path');

// Загружаем анализ компонентов
const analysisPath = path.join(__dirname, 'github-repo-analysis.json');
const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));

/**
 * Создает инструкции для поиска в браузере
 */
function createBrowserSearchInstructions() {
  const instructions = [];
  
  // Берем первые 10 компонентов для демонстрации
  const componentsToSearch = analysis.components.slice(0, 10);
  
  for (const component of componentsToSearch) {
    const searchQueries = component.githubSearchQueries.slice(0, 3); // Берем первые 3 запроса
    
    instructions.push({
      componentName: component.componentName,
      originalUrl: component.originalUrl,
      searchQueries: searchQueries.map(query => ({
        name: query.name,
        url: `https://github.com/search?q=${encodeURIComponent(query.query)}&type=repositories&s=stars`,
        description: query.description
      }))
    });
  }
  
  return instructions;
}

/**
 * Создает HTML страницу для поиска
 */
function createSearchHTML(instructions) {
  let html = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub Repository Search</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1200px;
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
        }
        .component-content {
            padding: 20px;
        }
        .search-query {
            margin-bottom: 15px;
            padding: 15px;
            background: #f6f8fa;
            border-radius: 6px;
            border-left: 4px solid #0366d6;
        }
        .search-query h4 {
            margin: 0 0 10px 0;
            color: #24292e;
        }
        .search-query p {
            margin: 0 0 10px 0;
            color: #586069;
            font-size: 14px;
        }
        .search-link {
            display: inline-block;
            background: #0366d6;
            color: white;
            padding: 8px 16px;
            text-decoration: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
        }
        .search-link:hover {
            background: #0256cc;
        }
        .original-link {
            color: #586069;
            font-size: 12px;
            margin-top: 10px;
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
    </style>
</head>
<body>
    <div class="header">
        <h1>🔍 GitHub Repository Search</h1>
        <p>Поиск репозиториев для компонентов v0.app</p>
    </div>

    <div class="stats">
        <div class="stat-card">
            <div class="stat-number">${instructions.length}</div>
            <div class="stat-label">Компонентов</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${instructions.reduce((sum, comp) => sum + comp.searchQueries.length, 0)}</div>
            <div class="stat-label">Поисковых запросов</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${analysis.metadata.totalLinks}</div>
            <div class="stat-label">Всего ссылок v0.app</div>
        </div>
    </div>
`;

  instructions.forEach((instruction, index) => {
    html += `
    <div class="component">
        <div class="component-header">
            ${index + 1}. ${instruction.componentName}
        </div>
        <div class="component-content">
            <div class="original-link">
                📎 Оригинальная ссылка: <a href="${instruction.originalUrl}" target="_blank">${instruction.originalUrl}</a>
            </div>
`;

    instruction.searchQueries.forEach((query, queryIndex) => {
      html += `
            <div class="search-query">
                <h4>${queryIndex + 1}. ${query.name}</h4>
                <p>${query.description}</p>
                <a href="${query.url}" target="_blank" class="search-link">🔍 Поиск на GitHub</a>
            </div>
`;
    });

    html += `
        </div>
    </div>
`;
  });

  html += `
    <div class="header">
        <h2>📋 Инструкции по использованию</h2>
        <ol>
            <li>Нажмите на кнопку "🔍 Поиск на GitHub" для каждого запроса</li>
            <li>На странице GitHub изучите найденные репозитории</li>
            <li>Обратите внимание на:
                <ul>
                    <li>⭐ Количество звезд (рекомендуется > 10)</li>
                    <li>📅 Дата последнего обновления (рекомендуется < 6 месяцев)</li>
                    <li>📝 Наличие README файла</li>
                    <li>🏷️ Релевантные теги (react, nextjs, ui, component)</li>
                    <li>📦 Наличие package.json</li>
                </ul>
            </li>
            <li>Скопируйте ссылки на подходящие репозитории</li>
            <li>Сохраните результаты в файл github-found-repositories.json</li>
        </ol>
    </div>

    <script>
        // Автоматическое открытие ссылок (опционально)
        function openAllSearches() {
            const links = document.querySelectorAll('.search-link');
            links.forEach((link, index) => {
                setTimeout(() => {
                    window.open(link.href, '_blank');
                }, index * 2000); // Задержка 2 секунды между открытием
            });
        }
        
        // Добавляем кнопку для автоматического открытия всех ссылок
        const autoOpenBtn = document.createElement('button');
        autoOpenBtn.textContent = '🚀 Открыть все поиски автоматически';
        autoOpenBtn.style.cssText = \`
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            z-index: 1000;
        \`;
        autoOpenBtn.onclick = openAllSearches;
        document.body.appendChild(autoOpenBtn);
    </script>
</body>
</html>`;

  return html;
}

/**
 * Создает JSON шаблон для сохранения результатов
 */
function createResultsTemplate(instructions) {
  const template = {
    metadata: {
      searchDate: new Date().toISOString(),
      totalComponents: instructions.length,
      description: "Найденные репозитории на GitHub для компонентов v0.app"
    },
    results: instructions.map(instruction => ({
      componentName: instruction.componentName,
      originalUrl: instruction.originalUrl,
      foundRepositories: []
    }))
  };

  return template;
}

/**
 * Основная функция
 */
function main() {
  console.log('🚀 Создаем инструкции для поиска в браузере...');
  
  const instructions = createBrowserSearchInstructions();
  const html = createSearchHTML(instructions);
  const resultsTemplate = createResultsTemplate(instructions);
  
  // Сохраняем HTML страницу
  const htmlPath = path.join(__dirname, 'github-search-page.html');
  fs.writeFileSync(htmlPath, html);
  
  // Сохраняем шаблон для результатов
  const templatePath = path.join(__dirname, 'github-found-repositories.json');
  fs.writeFileSync(templatePath, JSON.stringify(resultsTemplate, null, 2));
  
  console.log('✅ Файлы созданы:');
  console.log(`  - ${htmlPath} - HTML страница для поиска`);
  console.log(`  - ${templatePath} - Шаблон для сохранения результатов`);
  
  console.log('\n🔍 Инструкции:');
  console.log('  1. Откройте github-search-page.html в браузере');
  console.log('  2. Используйте кнопки поиска для каждого компонента');
  console.log('  3. Сохраните найденные репозитории в github-found-repositories.json');
  console.log('  4. Используйте кнопку "🚀 Открыть все поиски автоматически" для массового поиска');
}

if (require.main === module) {
  main();
}

module.exports = {
  createBrowserSearchInstructions,
  createSearchHTML,
  createResultsTemplate
};


