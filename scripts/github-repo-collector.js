#!/usr/bin/env node

/**
 * GitHub Repository Collector
 * Собирает найденные репозитории с GitHub и сохраняет их в структурированном виде
 */

const fs = require('fs');
const path = require('path');

// Загружаем анализ компонентов
const analysisPath = path.join(__dirname, 'github-repo-analysis.json');
const analysis = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));

/**
 * Создает структуру для сохранения найденных репозиториев
 */
function createRepositoryCollection() {
  const collection = {
    metadata: {
      collectionDate: new Date().toISOString(),
      totalComponents: analysis.components.length,
      description: 'Коллекция найденных репозиториев на GitHub для компонентов v0.app',
    },
    repositories: {
      // Категории репозиториев
      react: [],
      nextjs: [],
      vue: [],
      angular: [],
      vanilla: [],
      mobile: [],
      desktop: [],
      other: [],
    },
    components: analysis.components.map(component => ({
      componentName: component.componentName,
      originalUrl: component.originalUrl,
      foundRepositories: [],
      searchStatus: 'pending',
    })),
  };

  return collection;
}

/**
 * Создает HTML страницу для просмотра и управления коллекцией
 */
function createCollectionHTML(collection) {
  let html = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub Repository Collection</title>
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
        .category {
            background: white;
            margin-bottom: 20px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .category-header {
            background: #24292e;
            color: white;
            padding: 15px 20px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .category-count {
            background: #0366d6;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
        }
        .category-content {
            padding: 20px;
        }
        .repo-item {
            border: 1px solid #e1e4e8;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 15px;
            background: #fafbfc;
        }
        .repo-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
        }
        .repo-name {
            font-weight: 600;
            color: #0366d6;
            text-decoration: none;
            font-size: 16px;
        }
        .repo-name:hover {
            text-decoration: underline;
        }
        .repo-stats {
            display: flex;
            gap: 10px;
            font-size: 12px;
            color: #586069;
        }
        .repo-description {
            color: #24292e;
            margin-bottom: 10px;
            line-height: 1.4;
        }
        .repo-topics {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-bottom: 10px;
        }
        .topic {
            background: #f1f8ff;
            color: #0366d6;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            text-decoration: none;
        }
        .topic:hover {
            background: #e1ecf4;
        }
        .repo-actions {
            display: flex;
            gap: 10px;
        }
        .action-btn {
            background: #0366d6;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        .action-btn:hover {
            background: #0256cc;
        }
        .action-btn.secondary {
            background: #6a737d;
        }
        .action-btn.secondary:hover {
            background: #586069;
        }
        .component-section {
            background: white;
            margin-bottom: 20px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .component-header {
            background: #f6f8fa;
            padding: 15px 20px;
            border-bottom: 1px solid #e1e4e8;
        }
        .component-name {
            font-weight: 600;
            color: #24292e;
            margin-bottom: 5px;
        }
        .component-url {
            color: #586069;
            font-size: 12px;
        }
        .component-content {
            padding: 20px;
        }
        .search-status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
        }
        .status-pending {
            background: #fff3cd;
            color: #856404;
        }
        .status-in-progress {
            background: #d1ecf1;
            color: #0c5460;
        }
        .status-completed {
            background: #d4edda;
            color: #155724;
        }
        .add-repo-form {
            background: #f6f8fa;
            border: 1px solid #e1e4e8;
            border-radius: 6px;
            padding: 15px;
            margin-top: 15px;
        }
        .form-group {
            margin-bottom: 10px;
        }
        .form-label {
            display: block;
            font-size: 12px;
            font-weight: 600;
            color: #24292e;
            margin-bottom: 5px;
        }
        .form-input {
            width: 100%;
            padding: 8px;
            border: 1px solid #d1d5da;
            border-radius: 4px;
            font-size: 14px;
        }
        .form-textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #d1d5da;
            border-radius: 4px;
            font-size: 14px;
            resize: vertical;
            min-height: 60px;
        }
        .form-actions {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }
        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
        }
        .btn-primary {
            background: #0366d6;
            color: white;
        }
        .btn-primary:hover {
            background: #0256cc;
        }
        .btn-secondary {
            background: #6a737d;
            color: white;
        }
        .btn-secondary:hover {
            background: #586069;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📚 GitHub Repository Collection</h1>
        <p>Коллекция найденных репозиториев для компонентов v0.app</p>
    </div>

    <div class="stats">
        <div class="stat-card">
            <div class="stat-number">${collection.components.length}</div>
            <div class="stat-label">Компонентов</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${Object.values(collection.repositories).reduce((sum, repos) => sum + repos.length, 0)}</div>
            <div class="stat-label">Найдено репозиториев</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${collection.repositories.react.length}</div>
            <div class="stat-label">React</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${collection.repositories.nextjs.length}</div>
            <div class="stat-label">Next.js</div>
        </div>
    </div>
`;

  // Добавляем категории репозиториев
  Object.entries(collection.repositories).forEach(([category, repos]) => {
    if (repos.length > 0) {
      html += `
    <div class="category">
        <div class="category-header">
            <span>${category.toUpperCase()}</span>
            <span class="category-count">${repos.length}</span>
        </div>
        <div class="category-content">
`;

      repos.forEach(repo => {
        html += `
            <div class="repo-item">
                <div class="repo-header">
                    <a href="${repo.url}" target="_blank" class="repo-name">${repo.fullName}</a>
                    <div class="repo-stats">
                        <span>⭐ ${repo.stars}</span>
                        <span>📅 ${new Date(repo.lastUpdated).toLocaleDateString('ru-RU')}</span>
                    </div>
                </div>
                <div class="repo-description">${repo.description || 'Нет описания'}</div>
                <div class="repo-topics">
                    ${(repo.topics || []).map(topic => `<a href="https://github.com/topics/${topic}" target="_blank" class="topic">${topic}</a>`).join('')}
                </div>
                <div class="repo-actions">
                    <button class="action-btn" onclick="viewRepo('${repo.url}')">👁️ Просмотр</button>
                    <button class="action-btn secondary" onclick="copyUrl('${repo.url}')">📋 Копировать</button>
                </div>
            </div>
`;
      });

      html += `
        </div>
    </div>
`;
    }
  });

  // Добавляем секцию компонентов
  html += `
    <div class="component-section">
        <div class="component-header">
            <h2>🔍 Компоненты для поиска</h2>
        </div>
        <div class="component-content">
`;

  collection.components.forEach((component, index) => {
    html += `
            <div class="component-item">
                <div class="component-header">
                    <div class="component-name">${index + 1}. ${component.componentName}</div>
                    <div class="component-url">
                        <a href="${component.originalUrl}" target="_blank">${component.originalUrl}</a>
                    </div>
                    <span class="search-status status-${component.searchStatus}">${component.searchStatus}</span>
                </div>
                <div class="component-content">
                    <div class="add-repo-form">
                        <div class="form-group">
                            <label class="form-label">URL репозитория</label>
                            <input type="text" class="form-input" placeholder="https://github.com/username/repo" id="repo-url-${index}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Описание</label>
                            <textarea class="form-textarea" placeholder="Краткое описание репозитория" id="repo-desc-${index}"></textarea>
                        </div>
                        <div class="form-actions">
                            <button class="btn btn-primary" onclick="addRepository(${index})">➕ Добавить</button>
                            <button class="btn btn-secondary" onclick="markCompleted(${index})">✅ Завершить поиск</button>
                        </div>
                    </div>
                </div>
            </div>
`;
  });

  html += `
        </div>
    </div>

    <script>
        // Функции для работы с репозиториями
        function viewRepo(url) {
            window.open(url, '_blank');
        }
        
        function copyUrl(url) {
            navigator.clipboard.writeText(url).then(() => {
                alert('URL скопирован в буфер обмена!');
            });
        }
        
        function addRepository(componentIndex) {
            const urlInput = document.getElementById(\`repo-url-\${componentIndex}\`);
            const descInput = document.getElementById(\`repo-desc-\${componentIndex}\`);
            
            const url = urlInput.value.trim();
            const description = descInput.value.trim();
            
            if (!url) {
                alert('Пожалуйста, введите URL репозитория');
                return;
            }
            
            // Здесь можно добавить логику для сохранения репозитория
            console.log(\`Добавление репозитория для компонента \${componentIndex}:\`, { url, description });
            
            // Очищаем форму
            urlInput.value = '';
            descInput.value = '';
            
            alert('Репозиторий добавлен!');
        }
        
        function markCompleted(componentIndex) {
            console.log(\`Завершение поиска для компонента \${componentIndex}\`);
            alert('Поиск завершен!');
        }
        
        // Автоматическое сохранение данных
        function saveCollection() {
            const data = {
                metadata: {
                    lastSaved: new Date().toISOString()
                },
                // Здесь можно добавить логику для сбора данных из формы
            };
            
            console.log('Сохранение коллекции:', data);
        }
        
        // Сохраняем данные каждые 30 секунд
        setInterval(saveCollection, 30000);
    </script>
</body>
</html>`;

  return html;
}

/**
 * Создает JSON файл с найденными репозиториями
 */
function createRepositoryJSON(collection) {
  // Добавляем несколько примеров найденных репозиториев
  collection.repositories.react.push({
    name: 'react-file-manager',
    fullName: 'example/react-file-manager',
    url: 'https://github.com/example/react-file-manager',
    stars: 150,
    description: 'Modern file manager component built with React',
    lastUpdated: '2024-01-15T10:30:00Z',
    topics: ['react', 'file-manager', 'component', 'ui'],
    language: 'TypeScript',
  });

  collection.repositories.nextjs.push({
    name: 'nextjs-file-manager',
    fullName: 'example/nextjs-file-manager',
    url: 'https://github.com/example/nextjs-file-manager',
    stars: 89,
    description: 'File manager built with Next.js and TypeScript',
    lastUpdated: '2024-01-10T15:45:00Z',
    topics: ['nextjs', 'typescript', 'file-manager', 'react'],
    language: 'TypeScript',
  });

  return collection;
}

/**
 * Основная функция
 */
function main() {
  console.log('🚀 Создаем коллекцию репозиториев...');

  const collection = createRepositoryCollection();
  const collectionWithExamples = createRepositoryJSON(collection);
  const html = createCollectionHTML(collectionWithExamples);

  // Сохраняем JSON файл
  const jsonPath = path.join(__dirname, 'github-repository-collection.json');
  fs.writeFileSync(jsonPath, JSON.stringify(collectionWithExamples, null, 2));

  // Сохраняем HTML страницу
  const htmlPath = path.join(__dirname, 'github-repository-collection.html');
  fs.writeFileSync(htmlPath, html);

  console.log('✅ Файлы созданы:');
  console.log(`  - ${jsonPath} - JSON коллекция репозиториев`);
  console.log(`  - ${htmlPath} - HTML интерфейс для управления коллекцией`);

  console.log('\n📋 Инструкции:');
  console.log('  1. Откройте github-repository-collection.html в браузере');
  console.log('  2. Используйте форму для добавления найденных репозиториев');
  console.log('  3. Категоризируйте репозитории по технологиям');
  console.log('  4. Сохраняйте результаты в JSON файл');
}

if (require.main === module) {
  main();
}

module.exports = {
  createRepositoryCollection,
  createCollectionHTML,
  createRepositoryJSON,
};
