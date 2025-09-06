#!/usr/bin/env node

/**
 * Demo Advanced Development Tools
 * Демонстрация использования fd, rg, ast-grep, jq, yq
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class DevToolsDemo {
  constructor() {
    this.projectRoot = path.join(__dirname, '..');
  }

  /**
   * Выполняет команду и возвращает результат
   */
  execCommand(command, options = {}) {
    try {
      const result = execSync(command, { 
        cwd: this.projectRoot,
        encoding: 'utf8',
        ...options 
      });
      return result.trim();
    } catch (error) {
      return `Ошибка: ${error.message}`;
    }
  }

  /**
   * Демонстрация fd (поиск файлов)
   */
  demoFd() {
    console.log('🔍 === ДЕМОНСТРАЦИЯ FD (поиск файлов) ===\n');
    
    // Поиск всех TypeScript файлов
    console.log('1. Поиск всех TypeScript файлов:');
    const tsFiles = this.execCommand('fd --type f --extension ts');
    console.log(tsFiles.split('\n').slice(0, 5).join('\n'));
    console.log('...\n');
    
    // Поиск компонентов
    console.log('2. Поиск файлов компонентов:');
    const components = this.execCommand('fd --type f --glob "*component*"');
    console.log(components.split('\n').slice(0, 5).join('\n'));
    console.log('...\n');
    
    // Поиск по размеру
    console.log('3. Поиск больших файлов (>10KB):');
    const largeFiles = this.execCommand('fd --type f --size +10k');
    console.log(largeFiles.split('\n').slice(0, 3).join('\n'));
    console.log('...\n');
  }

  /**
   * Демонстрация rg (поиск по содержимому)
   */
  demoRg() {
    console.log('🔍 === ДЕМОНСТРАЦИЯ RG (поиск по содержимому) ===\n');
    
    // Поиск импортов React
    console.log('1. Поиск импортов React:');
    const reactImports = this.execCommand('rg "import.*React" --type tsx --type ts');
    console.log(reactImports.split('\n').slice(0, 5).join('\n'));
    console.log('...\n');
    
    // Поиск компонентов с определенными пропсами
    console.log('2. Поиск компонентов с пропсами:');
    const withProps = this.execCommand('rg "interface.*Props" --type tsx --type ts');
    console.log(withProps.split('\n').slice(0, 3).join('\n'));
    console.log('...\n');
    
    // Поиск TODO комментариев
    console.log('3. Поиск TODO комментариев:');
    const todos = this.execCommand('rg "TODO|FIXME|HACK" --type tsx --type ts');
    console.log(todos.split('\n').slice(0, 3).join('\n'));
    console.log('...\n');
  }

  /**
   * Демонстрация jq (работа с JSON)
   */
  demoJq() {
    console.log('📄 === ДЕМОНСТРАЦИЯ JQ (работа с JSON) ===\n');
    
    // Анализ package.json
    console.log('1. Анализ зависимостей из package.json:');
    const dependencies = this.execCommand('jq ".dependencies | keys" package.json');
    console.log(dependencies);
    console.log();
    
    // Подсчет зависимостей
    console.log('2. Количество зависимостей:');
    const depCount = this.execCommand('jq ".dependencies | length" package.json');
    console.log(`Всего зависимостей: ${depCount}`);
    console.log();
    
    // Анализ метаданных компонентов
    if (fs.existsSync('collected-components/components-metadata.json')) {
      console.log('3. Анализ метаданных компонентов:');
      const componentCount = this.execCommand('jq "length" collected-components/components-metadata.json');
      console.log(`Всего компонентов: ${componentCount}`);
      
      const categories = this.execCommand('jq "group_by(.category) | map({category: .[0].category, count: length})" collected-components/components-metadata.json');
      console.log('По категориям:');
      console.log(categories);
      console.log();
    }
  }

  /**
   * Демонстрация yq (работа с YAML)
   */
  demoYq() {
    console.log('📋 === ДЕМОНСТРАЦИЯ YQ (работа с YAML) ===\n');
    
    // Создаем тестовый YAML файл
    const testYaml = `
name: "Claude Code UI"
version: "1.0.0"
description: "Modern UI for Claude Code"
features:
  - "Component Collection"
  - "Vercel Integration"
  - "Advanced Dev Tools"
dependencies:
  react: "^18.2.0"
  next: "^14.0.0"
  typescript: "^5.0.0"
`;
    
    const yamlFile = path.join(this.projectRoot, 'test-config.yaml');
    fs.writeFileSync(yamlFile, testYaml);
    
    console.log('1. Чтение YAML файла:');
    const yamlContent = this.execCommand(`yq eval '.' ${yamlFile}`);
    console.log(yamlContent);
    console.log();
    
    console.log('2. Извлечение списка фич:');
    const features = this.execCommand(`yq eval '.features[]' ${yamlFile}`);
    console.log(features);
    console.log();
    
    console.log('3. Извлечение версии:');
    const version = this.execCommand(`yq eval '.version' ${yamlFile}`);
    console.log(`Версия: ${version}`);
    console.log();
    
    // Удаляем тестовый файл
    fs.unlinkSync(yamlFile);
  }

  /**
   * Демонстрация ast-grep (анализ AST)
   */
  demoAstGrep() {
    console.log('🌳 === ДЕМОНСТРАЦИЯ AST-GREP (анализ AST) ===\n');
    
    // Поиск React компонентов
    console.log('1. Поиск React компонентов:');
    const reactComponents = this.execCommand('ast-grep --pattern "const $COMPONENT = () => { $$$ }" --lang tsx src/');
    console.log(reactComponents.split('\n').slice(0, 3).join('\n'));
    console.log('...\n');
    
    // Поиск экспортов
    console.log('2. Поиск экспортов:');
    const exports = this.execCommand('ast-grep --pattern "export const $NAME" --lang tsx --lang ts src/');
    console.log(exports.split('\n').slice(0, 3).join('\n'));
    console.log('...\n');
    
    // Поиск интерфейсов
    console.log('3. Поиск TypeScript интерфейсов:');
    const interfaces = this.execCommand('ast-grep --pattern "interface $NAME { $$$ }" --lang tsx --lang ts src/');
    console.log(interfaces.split('\n').slice(0, 3).join('\n'));
    console.log('...\n');
  }

  /**
   * Комбинированные примеры использования
   */
  demoCombined() {
    console.log('🔄 === КОМБИНИРОВАННЫЕ ПРИМЕРЫ ===\n');
    
    // Найти все компоненты и подсчитать их
    console.log('1. Найти все компоненты и подсчитать:');
    const componentFiles = this.execCommand('fd --type f --glob "*component*" --extension tsx');
    const componentCount = componentFiles.split('\n').filter(line => line.trim()).length;
    console.log(`Найдено файлов компонентов: ${componentCount}`);
    console.log();
    
    // Найти все импорты и создать отчет
    console.log('2. Анализ импортов:');
    const imports = this.execCommand('rg "import.*from" --type tsx --type ts | head -10');
    console.log(imports);
    console.log();
    
    // Создать JSON отчет о проекте
    console.log('3. Создание отчета о проекте:');
    const report = {
      timestamp: new Date().toISOString(),
      project: 'Claude Code UI',
      stats: {
        componentFiles: componentCount,
        totalFiles: this.execCommand('fd --type f | wc -l'),
        linesOfCode: this.execCommand('rg --type tsx --type ts --count . | tail -1')
      }
    };
    
    const reportFile = path.join(this.projectRoot, 'project-report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    console.log(`Отчет сохранен в: ${reportFile}`);
    console.log();
  }

  /**
   * Запуск всех демонстраций
   */
  run() {
    console.log('🎯 ДЕМОНСТРАЦИЯ ПРОДВИНУТЫХ ИНСТРУМЕНТОВ РАЗРАБОТКИ\n');
    console.log('=' .repeat(60));
    console.log();
    
    this.demoFd();
    this.demoRg();
    this.demoJq();
    this.demoYq();
    this.demoAstGrep();
    this.demoCombined();
    
    console.log('✅ Демонстрация завершена!');
    console.log('\n💡 Полезные команды для ежедневной работы:');
    console.log('  fd --type f --extension tsx  # Найти все TSX файлы');
    console.log('  rg "TODO" --type tsx         # Найти TODO в TSX файлах');
    console.log('  jq ".dependencies" package.json  # Анализ зависимостей');
    console.log('  ast-grep --pattern "const $NAME = () => { $$$ }" --lang tsx  # Найти компоненты');
  }
}

// Запуск демонстрации
if (require.main === module) {
  const demo = new DevToolsDemo();
  demo.run();
}

module.exports = DevToolsDemo;
