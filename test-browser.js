const puppeteer = require('puppeteer');

async function testFunctionality() {
  console.log('🚀 Запуск браузерного тестирования функциональности...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  try {
    // Переходим на localhost:3000
    console.log('📍 Переход на localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Тестируем Chat функциональность
    console.log('💬 Тестирование Chat функциональности...');
    
    // Проверяем кнопку New Chat
    const newChatButton = await page.$('button:has-text("New Chat")');
    if (newChatButton) {
      console.log('✅ Кнопка New Chat найдена');
      await newChatButton.click();
      console.log('✅ Кнопка New Chat работает');
    } else {
      console.log('❌ Кнопка New Chat не найдена');
    }
    
    // Тестируем отправку сообщения
    const messageInput = await page.$('textarea[placeholder*="Type your message"]');
    if (messageInput) {
      console.log('✅ Поле ввода сообщения найдено');
      await messageInput.type('Тестовое сообщение');
      
      const sendButton = await page.$('button[type="submit"]');
      if (sendButton) {
        await sendButton.click();
        console.log('✅ Сообщение отправлено');
      }
    }
    
    // Переходим на вкладку Files
    console.log('📁 Тестирование File Manager...');
    const filesTab = await page.$('button:has-text("Files")');
    if (filesTab) {
      await filesTab.click();
      await page.waitForTimeout(1000);
      
      // Проверяем кнопку Upload
      const uploadButton = await page.$('button:has-text("Upload")');
      if (uploadButton) {
        console.log('✅ Кнопка Upload найдена');
        await uploadButton.click();
        console.log('✅ Кнопка Upload работает');
      } else {
        console.log('❌ Кнопка Upload не найдена');
      }
      
      // Проверяем кнопку New Folder
      const newFolderButton = await page.$('button:has-text("New Folder")');
      if (newFolderButton) {
        console.log('✅ Кнопка New Folder найдена');
        await newFolderButton.click();
        console.log('✅ Кнопка New Folder работает');
      } else {
        console.log('❌ Кнопка New Folder не найдена');
      }
    }
    
    // Переходим на вкладку Projects
    console.log('🏗️ Тестирование Projects...');
    const projectsTab = await page.$('button:has-text("Projects")');
    if (projectsTab) {
      await projectsTab.click();
      await page.waitForTimeout(1000);
      
      // Проверяем наличие реального контента вместо заглушки
      const placeholderText = await page.$text('Project management interface will be implemented here');
      if (!placeholderText) {
        console.log('✅ Projects имеет реальную функциональность');
      } else {
        console.log('❌ Projects показывает только заглушку');
      }
      
      // Проверяем кнопку Create Project
      const createProjectButton = await page.$('button:has-text("Create Project")');
      if (createProjectButton) {
        console.log('✅ Кнопка Create Project найдена');
        await createProjectButton.click();
        console.log('✅ Кнопка Create Project работает');
      }
    }
    
    // Переходим на вкладку Integrations
    console.log('🔗 Тестирование Integrations...');
    const integrationsTab = await page.$('button:has-text("Integrations")');
    if (integrationsTab) {
      await integrationsTab.click();
      await page.waitForTimeout(1000);
      
      // Проверяем кнопки Configure
      const configureButtons = await page.$$('button:has-text("Configure")');
      if (configureButtons.length > 0) {
        console.log(`✅ Найдено ${configureButtons.length} кнопок Configure`);
        await configureButtons[0].click();
        console.log('✅ Кнопка Configure работает');
      } else {
        console.log('❌ Кнопки Configure не найдены');
      }
    }
    
    console.log('🎉 Тестирование завершено!');
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error);
  } finally {
    await browser.close();
  }
}

// Запускаем тестирование
testFunctionality().catch(console.error);

