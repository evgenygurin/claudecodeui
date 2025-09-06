#!/usr/bin/env node

/**
 * Component Integration Analyzer
 * Анализ и интеграция собранных компонентов с v0.app
 */

const fs = require('fs');
const path = require('path');

class ComponentIntegrationAnalyzer {
  constructor() {
    this.baseDir = path.join(__dirname, '..');
    this.componentsDir = path.join(this.baseDir, 'collected-components');
    this.metadataFile = path.join(this.componentsDir, 'components-metadata.json');
    this.extractedDir = path.join(this.baseDir, 'v0-extracted-components');
    this.outputDir = path.join(this.baseDir, 'src', 'components', 'integrated');
    
    this.loadMetadata();
  }

  /**
   * Загружает метаданные компонентов
   */
  loadMetadata() {
    if (fs.existsSync(this.metadataFile)) {
      this.components = JSON.parse(fs.readFileSync(this.metadataFile, 'utf8'));
    } else {
      console.error('❌ Файл метаданных не найден:', this.metadataFile);
      this.components = [];
    }
  }

  /**
   * Анализирует сложность компонентов
   */
  analyzeComponentComplexity() {
    console.log('🔍 Анализ сложности компонентов...\n');

    const complexityAnalysis = {
      low: [],
      medium: [],
      high: [],
      veryHigh: []
    };

    this.components.forEach(component => {
      const complexity = this.determineComplexity(component);
      component.analyzedComplexity = complexity;
      complexityAnalysis[complexity].push(component);
    });

    console.log('📊 Результаты анализа сложности:');
    console.log(`  🟢 Низкая сложность: ${complexityAnalysis.low.length} компонентов`);
    console.log(`  🟡 Средняя сложность: ${complexityAnalysis.medium.length} компонентов`);
    console.log(`  🟠 Высокая сложность: ${complexityAnalysis.high.length} компонентов`);
    console.log(`  🔴 Очень высокая сложность: ${complexityAnalysis.veryHigh.length} компонентов`);

    return complexityAnalysis;
  }

  /**
   * Определяет сложность компонента
   */
  determineComplexity(component) {
    const { name, category, url } = component;
    
    // Критерии для определения сложности
    const highComplexityKeywords = [
      'dashboard', 'admin', 'financial', 'e-commerce', 'marketplace',
      'eleven-labs', 'ai-sdk', 'drag-and-drop', 'dynamic-table'
    ];
    
    const mediumComplexityKeywords = [
      'chat', 'file-manager', 'sidebar', 'layout', 'authentication',
      'team', 'documentation', 'creative', 'portfolio'
    ];

    const lowComplexityKeywords = [
      'button', 'input', 'toast', 'tabs', 'beam', 'grid',
      'dropdown', 'menu', 'badge', 'card'
    ];

    const nameLower = name.toLowerCase();
    const categoryLower = category.toLowerCase();

    // Проверяем на очень высокую сложность
    if (highComplexityKeywords.some(keyword => 
      nameLower.includes(keyword) || categoryLower.includes(keyword)
    )) {
      return 'veryHigh';
    }

    // Проверяем на высокую сложность
    if (mediumComplexityKeywords.some(keyword => 
      nameLower.includes(keyword) || categoryLower.includes(keyword)
    )) {
      return 'high';
    }

    // Проверяем на среднюю сложность
    if (lowComplexityKeywords.some(keyword => 
      nameLower.includes(keyword) || categoryLower.includes(keyword)
    )) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Анализирует зависимости между компонентами
   */
  analyzeDependencies() {
    console.log('\n🔗 Анализ зависимостей между компонентами...\n');

    const dependencies = {
      'ui-components': [],
      'layout-components': [],
      'feature-components': [],
      'integration-components': []
    };

    this.components.forEach(component => {
      const deps = this.findDependencies(component);
      component.dependencies = deps;
      
      // Категоризируем по типу зависимостей
      if (deps.includes('ui') || deps.includes('button') || deps.includes('input')) {
        dependencies['ui-components'].push(component);
      } else if (deps.includes('layout') || deps.includes('sidebar')) {
        dependencies['layout-components'].push(component);
      } else if (deps.includes('api') || deps.includes('integration')) {
        dependencies['integration-components'].push(component);
      } else {
        dependencies['feature-components'].push(component);
      }
    });

    console.log('📋 Категории зависимостей:');
    Object.entries(dependencies).forEach(([category, components]) => {
      console.log(`  ${category}: ${components.length} компонентов`);
    });

    return dependencies;
  }

  /**
   * Находит зависимости компонента
   */
  findDependencies(component) {
    const { name, category } = component;
    const deps = [];

    // Анализируем название и категорию для определения зависимостей
    if (name.toLowerCase().includes('chat')) {
      deps.push('ui', 'api');
    }
    if (name.toLowerCase().includes('file')) {
      deps.push('ui', 'file-system');
    }
    if (name.toLowerCase().includes('sidebar')) {
      deps.push('layout', 'navigation');
    }
    if (name.toLowerCase().includes('eleven-labs')) {
      deps.push('api', 'integration', 'audio');
    }
    if (name.toLowerCase().includes('dashboard')) {
      deps.push('ui', 'data', 'charts');
    }
    if (name.toLowerCase().includes('auth') || name.toLowerCase().includes('login')) {
      deps.push('ui', 'security', 'validation');
    }

    return deps;
  }

  /**
   * Создает план интеграции
   */
  createIntegrationPlan() {
    console.log('\n📋 Создание плана интеграции...\n');

    const plan = {
      phases: [
        {
          phase: 1,
          name: 'Базовая инфраструктура',
          description: 'Создание базовых UI компонентов',
          components: this.components.filter(c => c.analyzedComplexity === 'low'),
          estimatedHours: 8,
          priority: 'critical'
        },
        {
          phase: 2,
          name: 'Layout и Navigation',
          description: 'Интеграция компонентов макета',
          components: this.components.filter(c => 
            c.category === 'layout' || c.name.toLowerCase().includes('sidebar')
          ),
          estimatedHours: 12,
          priority: 'high'
        },
        {
          phase: 3,
          name: 'Feature Components',
          description: 'Интеграция функциональных компонентов',
          components: this.components.filter(c => 
            c.category === 'chat' || c.category === 'file-manager'
          ),
          estimatedHours: 16,
          priority: 'high'
        },
        {
          phase: 4,
          name: 'Advanced Components',
          description: 'Интеграция сложных компонентов',
          components: this.components.filter(c => 
            c.analyzedComplexity === 'high' || c.analyzedComplexity === 'veryHigh'
          ),
          estimatedHours: 20,
          priority: 'medium'
        },
        {
          phase: 5,
          name: 'Integration Components',
          description: 'Интеграция внешних сервисов',
          components: this.components.filter(c => 
            c.category === 'eleven-labs' || c.name.toLowerCase().includes('api')
          ),
          estimatedHours: 12,
          priority: 'low'
        }
      ],
      totalEstimatedHours: 0,
      totalComponents: this.components.length
    };

    // Подсчитываем общее время
    plan.totalEstimatedHours = plan.phases.reduce((sum, phase) => sum + phase.estimatedHours, 0);

    console.log('📊 План интеграции:');
    plan.phases.forEach(phase => {
      console.log(`  Фаза ${phase.phase}: ${phase.name}`);
      console.log(`    Компонентов: ${phase.components.length}`);
      console.log(`    Время: ${phase.estimatedHours} часов`);
      console.log(`    Приоритет: ${phase.priority}\n`);
    });

    console.log(`⏱️ Общее время: ${plan.totalEstimatedHours} часов`);
    console.log(`📦 Всего компонентов: ${plan.totalComponents}`);

    return plan;
  }

  /**
   * Создает метрики для отслеживания прогресса
   */
  createProgressMetrics() {
    console.log('\n📊 Создание метрик прогресса...\n');

    const metrics = {
      'integration-progress': {
        name: 'Прогресс интеграции',
        formula: '(integrated_components / total_components) * 100',
        target: 100,
        current: 0
      },
      'phase-completion': {
        name: 'Завершение фаз',
        formula: '(completed_phases / total_phases) * 100',
        target: 100,
        current: 0
      },
      'code-quality': {
        name: 'Качество кода',
        formula: '(components_without_issues / total_components) * 100',
        target: 95,
        current: 0
      },
      'test-coverage': {
        name: 'Покрытие тестами',
        formula: '(tested_components / total_components) * 100',
        target: 80,
        current: 0
      }
    };

    console.log('📈 Метрики созданы:');
    Object.entries(metrics).forEach(([key, metric]) => {
      console.log(`  ${metric.name}: ${metric.target}% (текущее: ${metric.current}%)`);
    });

    return metrics;
  }

  /**
   * Создает структуру для интеграции
   */
  createIntegrationStructure() {
    console.log('\n📁 Создание структуры для интеграции...\n');

    const structure = {
      'src/components/integrated': {
        'ui': 'Базовые UI компоненты',
        'layout': 'Компоненты макета',
        'features': 'Функциональные компоненты',
        'integrations': 'Интеграции с внешними сервисами',
        'advanced': 'Сложные компоненты'
      },
      'src/types': {
        'integrated-components.ts': 'Типы для интегрированных компонентов'
      },
      'src/utils': {
        'component-utils.ts': 'Утилиты для работы с компонентами'
      }
    };

    // Создаем директории
    Object.keys(structure).forEach(dir => {
      const fullPath = path.join(this.baseDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`✅ Создана директория: ${dir}`);
      }
    });

    return structure;
  }

  /**
   * Генерирует отчет об анализе
   */
  generateAnalysisReport() {
    console.log('\n📋 Генерация отчета об анализе...\n');

    const complexityAnalysis = this.analyzeComponentComplexity();
    const dependencies = this.analyzeDependencies();
    const integrationPlan = this.createIntegrationPlan();
    const metrics = this.createProgressMetrics();
    const structure = this.createIntegrationStructure();

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalComponents: this.components.length,
        totalEstimatedHours: integrationPlan.totalEstimatedHours,
        phases: integrationPlan.phases.length,
        categories: Object.keys(dependencies).length
      },
      complexityAnalysis,
      dependencies,
      integrationPlan,
      metrics,
      structure,
      recommendations: [
        'Начните с Фазы 1 - базовые UI компоненты',
        'Используйте TypeScript для типизации всех компонентов',
        'Создавайте тесты для каждого интегрированного компонента',
        'Документируйте процесс интеграции',
        'Регулярно обновляйте метрики прогресса'
      ]
    };

    const reportFile = path.join(this.baseDir, 'component-integration-analysis.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

    console.log('✅ Отчет сохранен в:', reportFile);
    return report;
  }

  /**
   * Запускает полный анализ
   */
  run() {
    console.log('🚀 Запуск анализа интеграции компонентов...\n');
    console.log('=' .repeat(60));

    const report = this.generateAnalysisReport();

    console.log('\n🎯 АНАЛИЗ ЗАВЕРШЕН!');
    console.log('=' .repeat(60));
    console.log(`📦 Всего компонентов: ${report.summary.totalComponents}`);
    console.log(`⏱️ Общее время: ${report.summary.totalEstimatedHours} часов`);
    console.log(`📋 Фаз интеграции: ${report.summary.phases}`);
    console.log(`📊 Категорий: ${report.summary.categories}`);

    console.log('\n💡 Рекомендации:');
    report.recommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec}`);
    });

    return report;
  }
}

// Запуск анализа
if (require.main === module) {
  const analyzer = new ComponentIntegrationAnalyzer();
  analyzer.run();
}

module.exports = ComponentIntegrationAnalyzer;
