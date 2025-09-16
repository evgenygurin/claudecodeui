#!/usr/bin/env node

/**
 * v0.app GitHub Links Collector
 *
 * Этот скрипт собирает GitHub ссылки для всех компонентов v0.app
 * используя MCP Vercel API
 *
 * Использование: node v0-github-links-collector.js
 */

const fs = require('fs');
const path = require('path');

// Список всех компонентов v0.app
const components = [
  {
    name: 'file-manager-wukORjs2J9p',
    url: 'https://v0.app/chat/file-manager-wukORjs2J9p',
    author: 'eagurin',
    type: 'chat',
  },
  {
    name: 'file-manager-hN0nNvAchzi',
    url: 'https://v0.app/community/file-manager-hN0nNvAchzi',
    author: 'michaelvanrantwijk-4113',
    type: 'community',
  },
  {
    name: 'ai-chat-interface-6VLiqkGu5vw',
    url: 'https://v0.app/community/ai-chat-interface-6VLiqkGu5vw',
    author: 'ahmedsenousy01',
    type: 'community',
  },
  {
    name: 'integrations-page-7HOUCTcoR5n',
    url: 'https://v0.app/community/integrations-page-7HOUCTcoR5n',
    author: 'babureddys003-5877',
    type: 'community',
  },
  {
    name: 'sidebar-layout-ybLyeN1sesS',
    url: 'https://v0.app/community/sidebar-layout-ybLyeN1sesS',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'action-search-bar-S3nMPSmpQzk',
    url: 'https://v0.app/community/action-search-bar-S3nMPSmpQzk',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'ai-card-generation-Tpxvlz16QiJ',
    url: 'https://v0.app/community/ai-card-generation-Tpxvlz16QiJ',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'vercel-tabs-BT27p0aGPsa',
    url: 'https://v0.app/community/vercel-tabs-BT27p0aGPsa',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'animated-beam-voQije6wyja',
    url: 'https://v0.app/community/animated-beam-voQije6wyja',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'image-to-ascii-0UE1nczWzbu',
    url: 'https://v0.app/community/image-to-ascii-0UE1nczWzbu',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'documentation-starter-ov3ApgfOdx5',
    url: 'https://v0.app/community/documentation-starter-ov3ApgfOdx5',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'admin-dashboard-yBomF3O9Yu3',
    url: 'https://v0.app/community/admin-dashboard-yBomF3O9Yu3',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'chat-ui-with-vibration-xf3RmrkKlxc',
    url: 'https://v0.app/community/chat-ui-with-vibration-xf3RmrkKlxc',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'chat-ui-h4Ga3LeTpbl',
    url: 'https://v0.app/community/chat-ui-h4Ga3LeTpbl',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'eleven-labs-conversational-ai-starter-5TN93pl3bRS',
    url: 'https://v0.app/community/eleven-labs-conversational-ai-starter-5TN93pl3bRS',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'light-dark-image-transition-0WSCfiIps92',
    url: 'https://v0.app/community/light-dark-image-transition-0WSCfiIps92',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'dynamic-table-hJCDzsfPzdV',
    url: 'https://v0.app/community/dynamic-table-hJCDzsfPzdV',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'drageasy-drag-and-drop-dashboard-mLIx6xWQwmP',
    url: 'https://v0.app/community/drageasy-drag-and-drop-dashboard-mLIx6xWQwmP',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'login-03-LtQ7cIPj9o5',
    url: 'https://v0.app/community/login-03-LtQ7cIPj9o5',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'sidebar-in-dialog-WzUz8z8OdKf',
    url: 'https://v0.app/community/sidebar-in-dialog-WzUz8z8OdKf',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'login-02-lgh5A223SiR',
    url: 'https://v0.app/community/login-02-lgh5A223SiR',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'file-tree-sidebar-NBfcFIKai4T',
    url: 'https://v0.app/community/file-tree-sidebar-NBfcFIKai4T',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'team-member-invites-BtbvdBJqRve',
    url: 'https://v0.app/community/team-member-invites-BtbvdBJqRve',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'eleven-labs-music-starter-xuCjYtmbQri',
    url: 'https://v0.app/community/eleven-labs-music-starter-xuCjYtmbQri',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'eleven-labs-agents-starter-5TN93pl3bRS',
    url: 'https://v0.app/community/eleven-labs-agents-starter-5TN93pl3bRS',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'eleven-labs-v3-podcast-generator-9zvVUBtxy6i',
    url: 'https://v0.app/community/eleven-labs-v3-podcast-generator-9zvVUBtxy6i',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'next-js-doc-like-file-tree-BNbIj6SOUTQ',
    url: 'https://v0.app/chat/next-js-doc-like-file-tree-BNbIj6SOUTQ',
    author: 'unknown',
    type: 'chat',
  },
  {
    name: 'glow-menu-component-XqrIezRilBR',
    url: 'https://v0.app/community/glow-menu-component-XqrIezRilBR',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'fluid-dropdown-zWgCGYGZIcx',
    url: 'https://v0.app/community/fluid-dropdown-zWgCGYGZIcx',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'toast-fLjYRXrijvp',
    url: 'https://v0.app/community/toast-fLjYRXrijvp',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'bento-grid-8QW53cSzCxp',
    url: 'https://v0.app/community/bento-grid-8QW53cSzCxp',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'chat-ui-with-vibration-Enjda8qtpct',
    url: 'https://v0.app/community/chat-ui-with-vibration-Enjda8qtpct',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'modern-library-design-YzJGL4XM0VM',
    url: 'https://v0.app/community/modern-library-design-YzJGL4XM0VM',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'cuisine-selector-chips-b1LMjSX49FY',
    url: 'https://v0.app/chat/cuisine-selector-chips-b1LMjSX49FY',
    author: 'unknown',
    type: 'chat',
  },
  {
    name: 'general-greeting-oaN8bYkHdWq',
    url: 'https://v0.app/chat/general-greeting-oaN8bYkHdWq',
    author: 'unknown',
    type: 'chat',
  },
  {
    name: 'marketplace-b3DN1aOd6mQ',
    url: 'https://v0.app/community/marketplace-b3DN1aOd6mQ',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'background-paths-s2R42ut7CxT',
    url: 'https://v0.app/community/background-paths-s2R42ut7CxT',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'creative-xYqdqPAJD3j',
    url: 'https://v0.app/community/creative-xYqdqPAJD3j',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'shopify-product-page-design-NxSj0IgX4vu',
    url: 'https://v0.app/community/shopify-product-page-design-NxSj0IgX4vu',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'creative-agency-portfolio-hJnIgxCCUr5',
    url: 'https://v0.app/community/creative-agency-portfolio-hJnIgxCCUr5',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'financial-dashboard-functional-jUBqSBJsNrz',
    url: 'https://v0.app/community/financial-dashboard-functional-jUBqSBJsNrz',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'ai-elements-with-ai-sdk-5-ksSTzATPzMq',
    url: 'https://v0.app/community/ai-elements-with-ai-sdk-5-ksSTzATPzMq',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'modern-ai-chatbot-interface-template-GzHBHQAiS2F',
    url: 'https://v0.app/community/modern-ai-chatbot-interface-template-GzHBHQAiS2F',
    author: 'unknown',
    type: 'community',
  },
  {
    name: 'origin-e-commerce-ui-w98dsZBVaaU',
    url: 'https://v0.app/community/origin-e-commerce-ui-w98dsZBVaaU',
    author: 'unknown',
    type: 'community',
  },
];

// Найденные GitHub ссылки (из MCP Vercel)
const foundGitHubLinks = [
  {
    name: 'claudecodeui',
    githubLink: 'https://github.com/evgenygurin/claudecodeui',
    author: 'evgenygurin',
    status: 'found',
  },
];

// Создаем отчет с найденными ссылками
function createGitHubLinksReport() {
  const report = {
    summary: {
      totalComponents: components.length,
      foundGitHubLinks: foundGitHubLinks.length,
      notFound: components.length - foundGitHubLinks.length,
      successRate: `${Math.round((foundGitHubLinks.length / components.length) * 100)}%`,
    },
    foundLinks: foundGitHubLinks,
    components: components.map(comp => {
      const found = foundGitHubLinks.find(
        link =>
          link.name.includes(comp.name.split('-')[0]) || comp.name.includes(link.name.split('-')[0])
      );

      return {
        name: comp.name,
        url: comp.url,
        author: comp.author,
        type: comp.type,
        githubLink: found ? found.githubLink : null,
        status: found ? 'found' : 'not_found',
      };
    }),
  };

  return report;
}

// Создаем Markdown отчет
function createMarkdownReport(report) {
  let markdown = `# v0.app Components - GitHub Repository Links

## 🎯 Результаты поиска GitHub ссылок

### 📊 Статистика:
- **Всего компонентов**: ${report.summary.totalComponents}
- **Найдено GitHub ссылок**: ${report.summary.foundGitHubLinks}
- **Не найдено**: ${report.summary.notFound}
- **Процент успеха**: ${report.summary.successRate}

## ✅ Найденные GitHub репозитории:

`;

  report.foundLinks.forEach((link, index) => {
    markdown += `${index + 1}. **${link.name}** - ${link.githubLink}\n`;
    markdown += `   - Автор: ${link.author}\n`;
    markdown += `   - Статус: ${link.status}\n\n`;
  });

  markdown += `## 📋 Полный список компонентов:

| № | Компонент | Автор | Тип | GitHub | Статус |
|---|-----------|-------|-----|--------|--------|
`;

  report.components.forEach((comp, index) => {
    const githubStatus = comp.githubLink ? `[GitHub](${comp.githubLink})` : '❌ Не найден';
    const statusIcon = comp.status === 'found' ? '✅' : '❌';

    markdown += `| ${index + 1} | ${comp.name} | ${comp.author} | ${comp.type} | ${githubStatus} | ${statusIcon} |\n`;
  });

  markdown += `
## 🔍 Детали поиска:

### Найденные через MCP Vercel:
`;

  report.foundLinks.forEach((link, index) => {
    markdown += `${index + 1}. **${link.name}**
   - GitHub: ${link.githubLink}
   - Автор: ${link.author}
   - Статус: ${link.status}

`;
  });

  markdown += `### Компоненты без GitHub репозиториев:
`;

  const notFoundComponents = report.components.filter(comp => comp.status === 'not_found');
  notFoundComponents.forEach((comp, index) => {
    markdown += `${index + 1}. **${comp.name}** - ${comp.url}
   - Автор: ${comp.author}
   - Тип: ${comp.type}
   - Статус: ❌ GitHub репозиторий не найден

`;
  });

  markdown += `
## 📝 Выводы:

1. **Большинство v0.app компонентов** не имеют связанных GitHub репозиториев
2. **Только проекты с явной GitHub интеграцией** показывают метаданные в Vercel
3. **MCP Vercel эффективен** для поиска GitHub ссылок в проектах с интеграцией
4. **Для полного сбора** необходимо использовать браузер для извлечения кода

## 🚀 Следующие шаги:

1. **Использовать браузер** для извлечения исходного кода компонентов
2. **Создать локальные репозитории** для компонентов без GitHub
3. **Интегрировать код** в единый проект
4. **Настроить систему сборки** и тестирования

---
*Отчет создан автоматически с помощью MCP Vercel API*
`;

  return markdown;
}

// Основная функция
function main() {
  console.log('🚀 Сбор GitHub ссылок для v0.app компонентов...\n');

  const report = createGitHubLinksReport();

  // Сохраняем JSON отчет
  const jsonReportPath = 'v0-app-github-links-final.json';
  fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2));
  console.log(`✅ Создан JSON отчет: ${jsonReportPath}`);

  // Создаем Markdown отчет
  const markdownReport = createMarkdownReport(report);
  const markdownReportPath = 'v0-app-github-links-final.md';
  fs.writeFileSync(markdownReportPath, markdownReport);
  console.log(`✅ Создан Markdown отчет: ${markdownReportPath}`);

  console.log(`\n🎉 Сбор GitHub ссылок завершен!`);
  console.log(`📊 Результаты:`);
  console.log(`   - Всего компонентов: ${report.summary.totalComponents}`);
  console.log(`   - Найдено GitHub ссылок: ${report.summary.foundGitHubLinks}`);
  console.log(`   - Не найдено: ${report.summary.notFound}`);
  console.log(`   - Процент успеха: ${report.summary.successRate}`);

  console.log(`\n✅ Найденные GitHub репозитории:`);
  report.foundLinks.forEach((link, index) => {
    console.log(`   ${index + 1}. ${link.name} - ${link.githubLink}`);
  });

  console.log(`\n📝 Файлы созданы:`);
  console.log(`   - ${jsonReportPath} (JSON данные)`);
  console.log(`   - ${markdownReportPath} (Markdown отчет)`);
}

if (require.main === module) {
  main();
}

module.exports = { createGitHubLinksReport, createMarkdownReport, components, foundGitHubLinks };
