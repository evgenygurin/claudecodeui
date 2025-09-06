
#!/usr/bin/env node

/**
 * Component Processor
 * Обрабатывает собранные компоненты и интегрирует их в проект
 */

const fs = require('fs');
const path = require('path');

class ComponentProcessor {
  constructor() {
    this.baseDir = path.join(__dirname, '..', 'collected-components');
    this.outputDir = path.join(__dirname, '..', 'src', 'components', 'collected');
  }

  /**
   * Обрабатывает все собранные компоненты
   */
  async processAllComponents() {
    console.log('🔄 Начинаем обработку компонентов...');
    
    const categories = fs.readdirSync(this.baseDir)
      .filter(item => fs.statSync(path.join(this.baseDir, item)).isDirectory());
    
    for (const category of categories) {
      await this.processCategory(category);
    }
    
    console.log('✅ Обработка завершена!');
  }

  /**
   * Обрабатывает категорию компонентов
   */
  async processCategory(category) {
    console.log(`📁 Обрабатываем категорию: ${category}`);
    
    const categoryDir = path.join(this.baseDir, category);
    const files = fs.readdirSync(categoryDir)
      .filter(file => file.endsWith('.tsx') || file.endsWith('.jsx'));
    
    for (const file of files) {
      await this.processComponent(category, file);
    }
  }

  /**
   * Обрабатывает отдельный компонент
   */
  async processComponent(category, filename) {
    const filePath = path.join(this.baseDir, category, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Адаптируем компонент под архитектуру проекта
    const adaptedContent = this.adaptComponent(content, category, filename);
    
    // Создаем выходную директорию
    const outputCategoryDir = path.join(this.outputDir, category);
    if (!fs.existsSync(outputCategoryDir)) {
      fs.mkdirSync(outputCategoryDir, { recursive: true });
    }
    
    // Сохраняем адаптированный компонент
    const outputPath = path.join(outputCategoryDir, filename);
    fs.writeFileSync(outputPath, adaptedContent);
    
    console.log(`✅ Обработан: ${category}/${filename}`);
  }

  /**
   * Адаптирует компонент под архитектуру проекта
   */
  adaptComponent(content, category, filename) {
    // Добавляем импорты для UI компонентов
    const uiImports = `
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
`;

    // Заменяем относительные импорты на абсолютные
    let adaptedContent = content
      .replace(/from ['"]\.\.?\//g, 'from "@/')
      .replace(/from ['"]\.\.?\//g, 'from "@/');

    // Добавляем TypeScript типизацию если её нет
    if (!adaptedContent.includes('interface') && !adaptedContent.includes('type')) {
      adaptedContent = adaptedContent.replace(
        /export const (\w+)/,
        `interface ${category.charAt(0).toUpperCase() + category.slice(1)}Props {
  // Определите пропсы компонента
}

export const $1`
      );
    }

    return adaptedContent;
  }
}

// Запуск обработки
if (require.main === module) {
  const processor = new ComponentProcessor();
  processor.processAllComponents().catch(console.error);
}

module.exports = ComponentProcessor;
