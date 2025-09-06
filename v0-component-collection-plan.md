# План сбора компонентов с v0.app

## Цель
Создать автоматизированную систему для сбора всех компонентов с предоставленных v0.app страниц и их интеграции в единую архитектуру проекта.

## Список URL для сбора

### File Manager компоненты
- https://v0.app/chat/file-manager-wukORjs2J9p
- https://v0.app/community/file-manager-hN0nNvAchzi

### Chat Interface компоненты
- https://v0.app/community/ai-chat-interface-6VLiqkGu5vw
- https://v0.app/community/chat-ui-with-vibration-xf3RmrkKlxc
- https://v0.app/community/chat-ui-h4Ga3LeTpbl
- https://v0.app/community/modern-ai-chatbot-interface-template-GzHBHQAiS2F

### Layout и Navigation
- https://v0.app/community/integrations-page-7HOUCTcoR5n
- https://v0.app/community/sidebar-layout-ybLyeN1sesS
- https://v0.app/community/sidebar-in-dialog-WzUz8z8OdKf
- https://v0.app/community/file-tree-sidebar-NBfcFIKai4T

### UI Components
- https://v0.app/community/action-search-bar-S3nMPSmpQzk
- https://v0.app/community/ai-card-generation-Tpxvlz16QiJ
- https://v0.app/community/vercel-tabs-BT27p0aGPsa
- https://v0.app/community/animated-beam-voQije6wyja
- https://v0.app/community/glow-menu-component-XqrIezRilBR
- https://v0.app/community/fluid-dropdown-zWgCGYGZIcx
- https://v0.app/community/toast-fLjYRXrijvp
- https://v0.app/community/bento-grid-8QW53cSzCxp

### Specialized Components
- https://v0.app/community/image-to-ascii-0UE1nczWzbu
- https://v0.app/community/documentation-starter-ov3ApgfOdx5
- https://v0.app/community/admin-dashboard-yBomF3O9Yu3
- https://v0.app/community/light-dark-image-transition-0WSCfiIps92
- https://v0.app/community/dynamic-table-hJCDzsfPzdV
- https://v0.app/community/drageasy-drag-and-drop-dashboard-mLIx6xWQwmP

### Authentication
- https://v0.app/community/login-03-LtQ7cIPj9o5
- https://v0.app/community/login-02-lgh5A223SiR

### Team Management
- https://v0.app/community/team-member-invites-BtbvdBJqRve

### Eleven Labs Integration
- https://v0.app/community/eleven-labs-conversational-ai-starter-5TN93pl3bRS
- https://v0.app/community/eleven-labs-music-starter-xuCjYtmbQri
- https://v0.app/community/eleven-labs-agents-starter-5TN93pl3bRS
- https://v0.app/community/eleven-labs-v3-podcast-generator-9zvVUBtxy6i

### Design Systems
- https://v0.app/community/modern-library-design-YzJGL4XM0VM
- https://v0.app/community/marketplace-b3DN1aOd6mQ
- https://v0.app/community/background-paths-s2R42ut7CxT
- https://v0.app/community/creative-xYqdqPAJD3j
- https://v0.app/community/shopify-product-page-design-NxSj0IgX4vu
- https://v0.app/community/creative-agency-portfolio-hJnIgxCCUr5
- https://v0.app/community/financial-dashboard-functional-jUBqSBJsNrz
- https://v0.app/community/ai-elements-with-ai-sdk-5-ksSTzATPzMq
- https://v0.app/community/origin-e-commerce-ui-w98dsZBVaaU

### Chat Components
- https://v0.app/chat/next-js-doc-like-file-tree-BNbIj6SOUTQ
- https://v0.app/chat/cuisine-selector-chips-b1LMjSX49FY
- https://v0.app/chat/general-greeting-oaN8bYkHdWq

## Стратегия сбора

### Этап 1: Анализ структуры
1. Изучить структуру v0.app страниц
2. Определить селекторы для кнопок "Open in"
3. Создать базовый скрипт для навигации

### Этап 2: Создание коллектора
1. Использовать MCP Playwright для автоматизации
2. Создать систему для извлечения кода
3. Добавить обработку ошибок и retry логику

### Этап 3: Структурирование данных
1. Создать метаданные для каждого компонента
2. Категоризировать компоненты по типам
3. Создать систему зависимостей

### Этап 4: Интеграция
1. Адаптировать компоненты под архитектуру проекта
2. Создать единую систему стилей
3. Добавить TypeScript типизацию

## Технические требования

### Инструменты
- MCP Playwright для автоматизации браузера
- Node.js для обработки данных
- TypeScript для типизации
- JSON для хранения метаданных

### Структура данных
```json
{
  "component": {
    "id": "unique-id",
    "name": "Component Name",
    "category": "ui|layout|auth|etc",
    "url": "source-url",
    "code": "component-code",
    "dependencies": ["dependency-list"],
    "metadata": {
      "description": "component description",
      "tags": ["tag1", "tag2"],
      "complexity": "low|medium|high"
    }
  }
}
```

## Ожидаемые результаты
- 50+ компонентов собранных и структурированных
- Единая система стилей и архитектуры
- Полная интеграция в существующий проект
- Документация по использованию компонентов
