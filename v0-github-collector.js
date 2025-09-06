#!/usr/bin/env node

/**
 * v0.app GitHub Link Collector
 * 
 * Этот скрипт помогает собирать GitHub ссылки для компонентов v0.app
 * 
 * Использование:
 * 1. Запустите скрипт: node v0-github-collector.js
 * 2. Следуйте инструкциям для каждого компонента
 * 3. Результаты сохранятся в v0-app-github-links.md
 */

const fs = require('fs');
const readline = require('readline');

// Список всех компонентов v0.app
const components = [
  { name: "file-manager-wukORjs2J9p", url: "https://v0.app/chat/file-manager-wukORjs2J9p" },
  { name: "file-manager-hN0nNvAchzi", url: "https://v0.app/community/file-manager-hN0nNvAchzi" },
  { name: "ai-chat-interface-6VLiqkGu5vw", url: "https://v0.app/community/ai-chat-interface-6VLiqkGu5vw" },
  { name: "integrations-page-7HOUCTcoR5n", url: "https://v0.app/community/integrations-page-7HOUCTcoR5n" },
  { name: "sidebar-layout-ybLyeN1sesS", url: "https://v0.app/community/sidebar-layout-ybLyeN1sesS" },
  { name: "action-search-bar-S3nMPSmpQzk", url: "https://v0.app/community/action-search-bar-S3nMPSmpQzk" },
  { name: "ai-card-generation-Tpxvlz16QiJ", url: "https://v0.app/community/ai-card-generation-Tpxvlz16QiJ" },
  { name: "vercel-tabs-BT27p0aGPsa", url: "https://v0.app/community/vercel-tabs-BT27p0aGPsa" },
  { name: "animated-beam-voQije6wyja", url: "https://v0.app/community/animated-beam-voQije6wyja" },
  { name: "image-to-ascii-0UE1nczWzbu", url: "https://v0.app/community/image-to-ascii-0UE1nczWzbu" },
  { name: "documentation-starter-ov3ApgfOdx5", url: "https://v0.app/community/documentation-starter-ov3ApgfOdx5" },
  { name: "admin-dashboard-yBomF3O9Yu3", url: "https://v0.app/community/admin-dashboard-yBomF3O9Yu3" },
  { name: "chat-ui-with-vibration-xf3RmrkKlxc", url: "https://v0.app/community/chat-ui-with-vibration-xf3RmrkKlxc" },
  { name: "chat-ui-h4Ga3LeTpbl", url: "https://v0.app/community/chat-ui-h4Ga3LeTpbl" },
  { name: "eleven-labs-conversational-ai-starter-5TN93pl3bRS", url: "https://v0.app/community/eleven-labs-conversational-ai-starter-5TN93pl3bRS" },
  { name: "light-dark-image-transition-0WSCfiIps92", url: "https://v0.app/community/light-dark-image-transition-0WSCfiIps92" },
  { name: "dynamic-table-hJCDzsfPzdV", url: "https://v0.app/community/dynamic-table-hJCDzsfPzdV" },
  { name: "drageasy-drag-and-drop-dashboard-mLIx6xWQwmP", url: "https://v0.app/community/drageasy-drag-and-drop-dashboard-mLIx6xWQwmP" },
  { name: "login-03-LtQ7cIPj9o5", url: "https://v0.app/community/login-03-LtQ7cIPj9o5" },
  { name: "sidebar-in-dialog-WzUz8z8OdKf", url: "https://v0.app/community/sidebar-in-dialog-WzUz8z8OdKf" },
  { name: "login-02-lgh5A223SiR", url: "https://v0.app/community/login-02-lgh5A223SiR" },
  { name: "file-tree-sidebar-NBfcFIKai4T", url: "https://v0.app/community/file-tree-sidebar-NBfcFIKai4T" },
  { name: "team-member-invites-BtbvdBJqRve", url: "https://v0.app/community/team-member-invites-BtbvdBJqRve" },
  { name: "eleven-labs-music-starter-xuCjYtmbQri", url: "https://v0.app/community/eleven-labs-music-starter-xuCjYtmbQri" },
  { name: "eleven-labs-agents-starter-5TN93pl3bRS", url: "https://v0.app/community/eleven-labs-agents-starter-5TN93pl3bRS" },
  { name: "eleven-labs-v3-podcast-generator-9zvVUBtxy6i", url: "https://v0.app/community/eleven-labs-v3-podcast-generator-9zvVUBtxy6i" },
  { name: "next-js-doc-like-file-tree-BNbIj6SOUTQ", url: "https://v0.app/chat/next-js-doc-like-file-tree-BNbIj6SOUTQ" },
  { name: "glow-menu-component-XqrIezRilBR", url: "https://v0.app/community/glow-menu-component-XqrIezRilBR" },
  { name: "fluid-dropdown-zWgCGYGZIcx", url: "https://v0.app/community/fluid-dropdown-zWgCGYGZIcx" },
  { name: "toast-fLjYRXrijvp", url: "https://v0.app/community/toast-fLjYRXrijvp" },
  { name: "bento-grid-8QW53cSzCxp", url: "https://v0.app/community/bento-grid-8QW53cSzCxp" },
  { name: "chat-ui-with-vibration-Enjda8qtpct", url: "https://v0.app/community/chat-ui-with-vibration-Enjda8qtpct" },
  { name: "modern-library-design-YzJGL4XM0VM", url: "https://v0.app/community/modern-library-design-YzJGL4XM0VM" },
  { name: "cuisine-selector-chips-b1LMjSX49FY", url: "https://v0.app/chat/cuisine-selector-chips-b1LMjSX49FY" },
  { name: "general-greeting-oaN8bYkHdWq", url: "https://v0.app/chat/general-greeting-oaN8bYkHdWq" },
  { name: "background-paths-s2R42ut7CxT", url: "https://v0.app/community/background-paths-s2R42ut7CxT" },
  { name: "creative-xYqdqPAJD3j", url: "https://v0.app/community/creative-xYqdqPAJD3j" },
  { name: "shopify-product-page-design-NxSj0IgX4vu", url: "https://v0.app/community/shopify-product-page-design-NxSj0IgX4vu" },
  { name: "creative-agency-portfolio-hJnIgxCCUr5", url: "https://v0.app/community/creative-agency-portfolio-hJnIgxCCUr5" },
  { name: "financial-dashboard-functional-jUBqSBJsNrz", url: "https://v0.app/community/financial-dashboard-functional-jUBqSBJsNrz" },
  { name: "ai-elements-with-ai-sdk-5-ksSTzATPzMq", url: "https://v0.app/community/ai-elements-with-ai-sdk-5-ksSTzATPzMq" }
];

// Результаты
const results = {
  found: [],
  notFound: [],
  confirmed: [
    {
      name: "image-to-ascii-0UE1nczWzbu",
      url: "https://v0.app/community/image-to-ascii-0UE1nczWzbu",
      github: "https://github.com/rauchg/image-to-ascii",
      author: "rauchg"
    },
    {
      name: "chat-ui-with-vibration-xf3RmrkKlxc",
      url: "https://v0.app/community/chat-ui-with-vibration-xf3RmrkKlxc",
      github: "https://github.com/rauchg/chat-ui-with-vibration",
      author: "rauchg"
    },
    {
      name: "eleven-labs-conversational-ai-starter-5TN93pl3bRS",
      url: "https://v0.app/community/eleven-labs-conversational-ai-starter-5TN93pl3bRS",
      github: "https://github.com/elevenlabs/agents-starter",
      author: "elevenlabs-devs"
    }
  ]
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function processComponent(component, index) {
  console.log(`\n📋 Компонент ${index + 1}/${components.length}: ${component.name}`);
  console.log(`🔗 URL: ${component.url}`);
  
  console.log('\n📝 Инструкции:');
  console.log('1. Откройте ссылку в браузере');
  console.log('2. Найдите кнопку "Open in" или "View Project"');
  console.log('3. Ищите GitHub ссылку в настройках проекта');
  console.log('4. Проверьте профиль автора');
  
  const githubUrl = await askQuestion('\n🔗 Введите GitHub URL (или "skip" для пропуска): ');
  
  if (githubUrl.toLowerCase() === 'skip') {
    results.notFound.push(component);
    console.log('⏭️  Компонент пропущен');
    return;
  }
  
  if (githubUrl.toLowerCase() === 'exit') {
    console.log('👋 Завершение работы...');
    return false;
  }
  
  if (githubUrl && githubUrl.includes('github.com')) {
    const author = await askQuestion('👤 Введите имя автора (опционально): ');
    
    results.found.push({
      name: component.name,
      url: component.url,
      github: githubUrl,
      author: author || 'Unknown'
    });
    
    console.log('✅ GitHub ссылка добавлена!');
  } else {
    console.log('❌ Неверный URL GitHub');
    results.notFound.push(component);
  }
  
  return true;
}

async function main() {
  console.log('🚀 v0.app GitHub Link Collector');
  console.log('================================');
  console.log(`📊 Всего компонентов: ${components.length}`);
  console.log(`✅ Уже найдено: ${results.confirmed.length}`);
  console.log(`⏳ Осталось обработать: ${components.length}`);
  
  const startFrom = await askQuestion('\n🔢 С какого компонента начать? (по умолчанию 0): ');
  const startIndex = parseInt(startFrom) || 0;
  
  for (let i = startIndex; i < components.length; i++) {
    const component = components[i];
    const continueProcessing = await processComponent(component, i);
    
    if (continueProcessing === false) {
      break;
    }
    
    // Сохраняем промежуточные результаты
    if ((i + 1) % 5 === 0) {
      await saveResults();
      console.log(`\n💾 Промежуточные результаты сохранены (${i + 1}/${components.length})`);
    }
  }
  
  await saveResults();
  console.log('\n🎉 Сбор завершен!');
  console.log(`✅ Найдено: ${results.found.length}`);
  console.log(`❌ Не найдено: ${results.notFound.length}`);
  console.log(`📄 Результаты сохранены в v0-app-github-links.md`);
  
  rl.close();
}

async function saveResults() {
  let content = `# v0.app Components - GitHub Repository Links\n\n`;
  content += `Обновлено: ${new Date().toLocaleString()}\n\n`;
  
  content += `## Статистика\n`;
  content += `- Всего компонентов: ${components.length}\n`;
  content += `- Найдено GitHub ссылок: ${results.confirmed.length + results.found.length}\n`;
  content += `- Не найдено: ${results.notFound.length}\n\n`;
  
  content += `## Подтвержденные GitHub репозитории\n\n`;
  
  [...results.confirmed, ...results.found].forEach((item, index) => {
    content += `### ${index + 1}. ${item.name}\n`;
    content += `- **v0.app**: ${item.url}\n`;
    content += `- **GitHub**: ${item.github}\n`;
    content += `- **Автор**: ${item.author}\n\n`;
  });
  
  if (results.notFound.length > 0) {
    content += `## Компоненты без GitHub ссылок\n\n`;
    results.notFound.forEach((item, index) => {
      content += `${index + 1}. [${item.name}](${item.url})\n`;
    });
  }
  
  fs.writeFileSync('v0-app-github-links.md', content, 'utf8');
}

// Запуск
main().catch(console.error);
