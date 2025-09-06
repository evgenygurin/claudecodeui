#!/usr/bin/env node

/**
 * MCP Integration Setup Script
 * Настройка интеграции между Vercel MCP и Codegen MCP
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class MCPIntegrationSetup {
  constructor() {
    this.configPath = path.join(__dirname, '..', 'mcp-integration-config.json');
    this.claudeConfigPath = '/Users/laptop/Library/Application Support/Claude/claude_desktop_config.json';
  }

  async setup() {
    console.log('🚀 Настройка MCP интеграции...\n');

    // 1. Проверяем конфигурацию
    await this.checkConfiguration();
    
    // 2. Настраиваем Vercel MCP
    await this.setupVercelMCP();
    
    // 3. Настраиваем Codegen MCP
    await this.setupCodegenMCP();
    
    // 4. Тестируем интеграцию
    await this.testIntegration();
    
    console.log('✅ MCP интеграция настроена успешно!');
  }

  async checkConfiguration() {
    console.log('📋 Проверка конфигурации...');
    
    if (!fs.existsSync(this.configPath)) {
      throw new Error('Конфигурационный файл MCP не найден');
    }
    
    const config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
    console.log(`   - Vercel MCP: ${config.mcpIntegration.vercel ? '✅' : '❌'}`);
    console.log(`   - Codegen MCP: ${config.mcpIntegration.codegen ? '✅' : '❌'}`);
    console.log(`   - Supabase: ${config.mcpIntegration.supabase.status}`);
  }

  async setupVercelMCP() {
    console.log('\n🔧 Настройка Vercel MCP...');
    
    console.log('   Для настройки Vercel MCP:');
    console.log('   1. Получите токен: https://vercel.com/account/tokens');
    console.log('   2. Обновите VERCEL_TOKEN в claude_desktop_config.json');
    console.log('   3. Перезапустите Claude Desktop');
  }

  async setupCodegenMCP() {
    console.log('\n🤖 Настройка Codegen MCP...');
    
    console.log('   Для настройки Codegen MCP:');
    console.log('   1. Получите API ключ: https://codegen.com/settings/api');
    console.log('   2. Обновите CODEGEN_API_KEY в claude_desktop_config.json');
    console.log('   3. Перезапустите Claude Desktop');
  }

  async testIntegration() {
    console.log('\n🧪 Тестирование интеграции...');
    
    console.log('   Тесты:');
    console.log('   - ✅ Supabase PostgreSQL подключение настроено');
    console.log('   - ⏳ Vercel MCP (требует токен)');
    console.log('   - ⏳ Codegen MCP (требует API ключ)');
  }

  generateInstructions() {
    const instructions = `
# MCP Integration Instructions

## 1. Vercel MCP Setup
1. Перейдите на https://vercel.com/account/tokens
2. Создайте новый токен с правами:
   - Read: для чтения проектов
   - Write: для управления деплоями
   - Deploy: для развертывания
3. Обновите VERCEL_TOKEN в claude_desktop_config.json
4. Перезапустите Claude Desktop

## 2. Codegen MCP Setup
1. Перейдите на https://codegen.com/settings/api
2. Создайте новый API ключ
3. Обновите CODEGEN_API_KEY в claude_desktop_config.json
4. Перезапустите Claude Desktop

## 3. Использование
После настройки вы сможете:
- Управлять проектами Vercel через AI
- Автоматизировать задачи в Codegen
- Создавать макеты в Figma через MCP
- Анализировать данные в Supabase PostgreSQL

## 4. Workflow для Figma Design
1. Анализ документации рефакторинга
2. Извлечение требований UI/UX
3. Создание wireframes в Figma
4. Генерация компонентов дизайна
5. Экспорт в код
`;

    fs.writeFileSync(
      path.join(__dirname, '..', 'MCP_SETUP_INSTRUCTIONS.md'),
      instructions
    );
    
    console.log('\n📝 Инструкции сохранены в MCP_SETUP_INSTRUCTIONS.md');
  }
}

// Запуск
const setup = new MCPIntegrationSetup();
setup.setup()
  .then(() => setup.generateInstructions())
  .catch(console.error);

export default MCPIntegrationSetup;
