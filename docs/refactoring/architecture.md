# Архитектура Claude Code UI

## 🏗️ Общий обзор архитектуры

Claude Code UI представляет собой full-stack веб-приложение, предоставляющее графический интерфейс для работы с различными CLI инструментами разработки.

### 📊 Архитектурная диаграмма

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React SPA)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Sidebar   │  │ MainContent │  │   Settings Panel    │  │
│  │             │  │             │  │                     │  │
│  │ - Projects  │  │ - Chat      │  │ - CLI Config        │  │
│  │ - Sessions  │  │ - Files     │  │ - Auth Settings     │  │
│  │ - Tasks     │  │ - Terminal  │  │ - Theme Settings    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    CONTEXT PROVIDERS                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Theme     │  │    Auth     │  │     WebSocket       │  │
│  │  Context    │  │  Context    │  │      Context        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Node.js/Express)                 │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Routes    │  │ Middleware  │  │    WebSocket        │  │
│  │             │  │             │  │     Server          │  │
│  │ - API       │  │ - Auth      │  │                     │  │
│  │ - Git       │  │ - CORS      │  │ - Real-time         │  │
│  │ - MCP       │  │ - Error     │  │ - Project Updates   │  │
│  │ - Tasks     │  │ - Logging   │  │ - Session Events    │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    CLI INTEGRATIONS                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Claude CLI  │  │ Cursor CLI  │  │    Codegen CLI      │  │
│  │             │  │             │  │                     │  │
│  │ - Sessions  │  │ - Sessions  │  │ - Sessions          │  │
│  │ - Messages  │  │ - Messages  │  │ - Messages          │  │
│  │ - Projects  │  │ - Projects  │  │ - Projects          │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                      DATA LAYER                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   SQLite    │  │ File System │  │     Supabase        │  │
│  │             │  │             │  │    PostgreSQL       │  │
│  │ - Users     │  │ - Projects  │  │                     │  │
│  │ - Sessions  │  │ - Files     │  │ - Analytics         │  │
│  │ - Tasks     │  │ - Logs      │  │ - Monitoring        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Архитектурные принципы

### 1. **Разделение ответственности (Separation of Concerns)**
- **Frontend**: Пользовательский интерфейс и взаимодействие
- **Backend**: Бизнес-логика и интеграции с CLI
- **Data Layer**: Хранение и управление данными

### 2. **Компонентная архитектура**
- Модульные React компоненты
- Переиспользуемые UI элементы
- Четкое разделение презентационных и контейнерных компонентов

### 3. **Реактивность и Real-time**
- WebSocket соединения для мгновенных обновлений
- Context API для управления глобальным состоянием
- Система защиты активных сессий

### 4. **Расширяемость**
- Модульная система интеграций с CLI
- Плагинная архитектура для новых инструментов
- Гибкая система маршрутизации

## 🔧 Технические компоненты

### Frontend Architecture

#### **Основные компоненты:**
- `App.jsx` - Главный компонент с маршрутизацией
- `Sidebar.jsx` - Навигация и управление проектами
- `MainContent.jsx` - Основная рабочая область
- `ChatInterface.jsx` - Интерфейс чата с CLI
- `FileTree.jsx` - Файловый менеджер
- `Shell.jsx` - Терминальный интерфейс

#### **Context Providers:**
- `ThemeContext` - Управление темами
- `AuthContext` - Аутентификация пользователей
- `WebSocketContext` - Real-time соединения
- `TaskMasterContext` - Управление задачами

#### **Хуки (Hooks):**
- `useVersionCheck` - Проверка обновлений
- Custom hooks для API взаимодействий

### Backend Architecture

#### **Основные модули:**
- `index.js` - Главный сервер и WebSocket
- `projects.js` - Управление проектами
- `claude-cli.js` - Интеграция с Claude CLI
- `cursor-cli.js` - Интеграция с Cursor CLI
- `codegen-cli.js` - Интеграция с Codegen CLI

#### **Маршруты (Routes):**
- `/api/auth` - Аутентификация
- `/api/git` - Git операции
- `/api/mcp` - MCP интеграции
- `/api/taskmaster` - Управление задачами

#### **Middleware:**
- Аутентификация JWT
- CORS настройки
- Обработка ошибок
- Логирование

## 🔄 Потоки данных

### 1. **Инициализация приложения**
```
User → Frontend → Auth Check → Load Projects → WebSocket Connect → Ready
```

### 2. **Создание новой сессии**
```
User Input → Frontend → API Request → CLI Spawn → Session Created → WebSocket Update
```

### 3. **Отправка сообщения**
```
User Message → Frontend → WebSocket → CLI Process → Response → Frontend Update
```

### 4. **Обновление проектов**
```
File Change → CLI Watch → Backend Event → WebSocket → Frontend Update (if not protected)
```

## 🛡️ Система защиты сессий

### **Проблема:**
Автоматические обновления проектов через WebSocket прерывали активные разговоры, очищая сообщения чата.

### **Решение:**
Система отслеживания активных сессий:

1. **Активация сессии**: При отправке сообщения пользователем
2. **Пауза обновлений**: Блокировка обновлений проектов во время активной сессии
3. **Деактивация**: При завершении или прерывании разговора
4. **Возобновление**: Восстановление нормальных обновлений

```javascript
// Пример логики защиты сессий
const protectSession = (sessionId) => {
  activeSessions.add(sessionId);
  // Блокировка обновлений проектов
};

const unprotectSession = (sessionId) => {
  activeSessions.delete(sessionId);
  // Возобновление обновлений
};
```

## 📱 Адаптивность и мобильная поддержка

### **Компоненты мобильного интерфейса:**
- `MobileNav.jsx` - Мобильная навигация
- Адаптивные компоненты с Tailwind CSS
- Touch-friendly интерфейсы

### **Responsive Design:**
- Breakpoints для различных размеров экранов
- Оптимизированные компоненты для мобильных устройств
- Адаптивная типографика и spacing

## 🔌 Интеграции и расширения

### **CLI Интеграции:**
- **Claude CLI**: Anthropic's официальный CLI
- **Cursor CLI**: Интеграция с Cursor IDE
- **Codegen CLI**: Интеграция с Codegen платформой

### **Внешние сервисы:**
- **Supabase PostgreSQL**: Аналитика и мониторинг
- **GitHub**: Git операции и интеграции
- **MCP Servers**: Расширенные интеграции

## 🚀 Производительность

### **Оптимизации Frontend:**
- Code splitting с React.lazy
- Мемоизация компонентов
- Виртуализация больших списков
- Оптимизированные WebSocket соединения

### **Оптимизации Backend:**
- Кэширование проектов
- Эффективное управление процессами CLI
- Оптимизированные запросы к базе данных
- Graceful shutdown процессов

## 🔍 Мониторинг и логирование

### **Логирование:**
- Структурированные логи
- Отслеживание ошибок
- Performance метрики
- User activity tracking

### **Мониторинг:**
- Health checks
- Resource usage monitoring
- CLI process monitoring
- WebSocket connection monitoring

## 🎯 Области для улучшения

1. **Архитектурные улучшения:**
   - Внедрение state management (Redux/Zustand)
   - Микросервисная архитектура для CLI интеграций
   - Улучшенная система кэширования

2. **Производительность:**
   - Server-side rendering (SSR)
   - Progressive Web App (PWA)
   - Оптимизация bundle size

3. **Масштабируемость:**
   - Горизонтальное масштабирование
   - Load balancing
   - Database sharding

4. **Безопасность:**
   - Enhanced authentication
   - API rate limiting
   - Input validation improvements

5. **Developer Experience:**
   - TypeScript migration
   - Improved testing coverage
   - Better error handling
