#!/usr/bin/env node

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
  console.log(`🔍 Поиск: ${query}`);
  
  // Заглушка - возвращаем пример результата
  return {
    total_count: 1,
    items: [{
      name: query.split(' ')[0].replace(/"/g, ''),
      full_name: `example/${query.split(' ')[0].replace(/"/g, '')}`,
      html_url: `https://github.com/example/${query.split(' ')[0].replace(/"/g, '')}`,
      stargazers_count: Math.floor(Math.random() * 100),
      description: `${query.split(' ')[0].replace(/"/g, '')} component`,
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
  
  console.log(`🚀 Начинаем поиск для ${analysis.components.length} компонентов...`);
  
  for (const component of analysis.components) {
    console.log(`\n📦 Поиск для: ${component.componentName}`);
    
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
        console.error(`❌ Ошибка поиска для ${query.name}: ${error.message}`);
      }
    }
    
    // Убираем дубликаты
    componentResults.foundRepositories = componentResults.foundRepositories
      .filter((repo, index, self) => 
        index === self.findIndex(r => r.fullName === repo.fullName)
      )
      .sort((a, b) => b.stars - a.stars);
    
    results.push(componentResults);
    
    console.log(`✅ Найдено ${componentResults.foundRepositories.length} репозиториев`);
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
  
  console.log(`\n🎉 Поиск завершен! Результаты сохранены в: ${outputPath}`);
  
  // Создаем сводный отчет
  createSummaryReport(results);
}

/**
 * Создает сводный отчет
 */
function createSummaryReport(results) {
  let report = `# GitHub Search Results Summary

## Общая статистика
- **Дата поиска**: ${new Date().toLocaleString('ru-RU')}
- **Всего компонентов**: ${results.length}
- **Всего найдено репозиториев**: ${results.reduce((sum, r) => sum + r.foundRepositories.length, 0)}

## Результаты по компонентам

`;

  results.forEach((result, index) => {
    report += `### ${index + 1}. ${result.componentName}
- **Оригинальная ссылка**: ${result.originalUrl}
- **Найдено репозиториев**: ${result.foundRepositories.length}

`;

    if (result.foundRepositories.length > 0) {
      report += `#### Найденные репозитории:
`;
      
      result.foundRepositories.forEach((repo, repoIndex) => {
        report += `${repoIndex + 1}. **[ ${repo.name} ](${repo.url})** ⭐ ${repo.stars}
   - Описание: ${repo.description || 'Нет описания'}
   - Обновлен: ${new Date(repo.lastUpdated).toLocaleDateString('ru-RU')}
   - Теги: ${repo.topics.join(', ') || 'Нет тегов'}

`;
      });
    } else {
      report += `❌ Репозитории не найдены

`;
    }
    
    report += `---
`;
  });

  const reportPath = path.join(__dirname, 'github-search-summary.md');
  fs.writeFileSync(reportPath, report);
  
  console.log(`📊 Сводный отчет создан: ${reportPath}`);
}

// Запускаем поиск
if (require.main === module) {
  performSearch().catch(console.error);
}

module.exports = { performSearch, searchRepository };
