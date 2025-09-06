# 🏗️ Архитектурные изменения

## 📋 Обзор

Этот документ описывает основные архитектурные изменения для модернизации Claude Code UI.

## 🎯 Текущая архитектура

### Проблемы

- **Монолитная структура** - весь код в одном приложении
- **Смешанная ответственность** - UI и бизнес-логика в одних компонентах
- **Дублирование кода** - повторяющаяся логика в CLI интеграциях
- **Отсутствие абстракций** - прямая работа с API и WebSocket

## 🚀 Целевая архитектура

### 1. Микросервисная архитектура

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Microservices │
│   (React SPA)   │◄──►│   (Express)     │◄──►│                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   WebSocket     │
                       │   Hub           │
                       └─────────────────┘
```

### 2. Разделение сервисов

#### 2.1 Auth Service

```typescript
// services/auth.service.ts
export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    // JWT токен генерация
    // Валидация пользователя
    // Управление сессиями
  }
  
  async refreshToken(token: string): Promise<string> {
    // Обновление токена
  }
  
  async logout(token: string): Promise<void> {
    // Инвалидация токена
  }
}
```

#### 2.2 Project Service

```typescript
// services/project.service.ts
export class ProjectService {
  async getProjects(): Promise<Project[]> {
    // Сканирование файловой системы
    // Кэширование результатов
    // Возврат структурированных данных
  }
  
  async createProject(data: CreateProjectDto): Promise<Project> {
    // Создание нового проекта
    // Валидация данных
    // Сохранение в базе данных
  }
  
  async deleteProject(id: string): Promise<void> {
    // Удаление проекта
    // Очистка связанных данных
  }
}
```

#### 2.3 Chat Service

```typescript
// services/chat.service.ts
export class ChatService {
  async sendMessage(
    sessionId: string, 
    message: string, 
    provider: AIProvider
  ): Promise<ChatResponse> {
    // Маршрутизация к соответствующему CLI
    // Обработка ответа
    // Сохранение в истории
  }
  
  async getSessionHistory(sessionId: string): Promise<Message[]> {
    // Загрузка истории сообщений
    // Пагинация
  }
}
```

### 3. Repository Pattern

#### 3.1 Project Repository

```typescript
// repositories/project.repository.ts
export interface ProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  findByPath(path: string): Promise<Project | null>;
  create(project: CreateProjectDto): Promise<Project>;
  update(id: string, project: UpdateProjectDto): Promise<Project>;
  delete(id: string): Promise<void>;
}

export class FileSystemProjectRepository implements ProjectRepository {
  async findAll(): Promise<Project[]> {
    // Сканирование ~/.claude/projects/
    // Парсинг JSONL файлов
    // Возврат структурированных данных
  }
  
  async findById(id: string): Promise<Project | null> {
    // Поиск проекта по ID
  }
  
  // ... остальные методы
}
```

#### 3.2 Session Repository

```typescript
// repositories/session.repository.ts
export interface SessionRepository {
  findByProjectId(projectId: string): Promise<Session[]>;
  findById(id: string): Promise<Session | null>;
  create(session: CreateSessionDto): Promise<Session>;
  update(id: string, session: UpdateSessionDto): Promise<Session>;
  delete(id: string): Promise<void>;
}

export class ClaudeSessionRepository implements SessionRepository {
  async findByProjectId(projectId: string): Promise<Session[]> {
    // Чтение JSONL файлов
    // Парсинг сообщений
    // Возврат сессий
  }
  
  // ... остальные методы
}
```

### 4. CLI Provider Abstraction

#### 4.1 Базовый интерфейс

```typescript
// providers/base.provider.ts
export abstract class CLIProvider {
  abstract spawn(
    command: string, 
    options: SpawnOptions
  ): Promise<CLIProcess>;
  
  abstract abort(sessionId: string): boolean;
  
  abstract getStatus(): ProviderStatus;
  
  abstract getSessions(projectPath: string): Promise<Session[]>;
}

export interface SpawnOptions {
  projectPath: string;
  sessionId?: string;
  resume?: boolean;
  model?: string;
  outputFormat?: string;
}

export interface CLIProcess {
  id: string;
  stdout: ReadableStream;
  stderr: ReadableStream;
  stdin: WritableStream;
  kill(): void;
  onExit(callback: (code: number) => void): void;
}
```

#### 4.2 Claude Provider

```typescript
// providers/claude.provider.ts
export class ClaudeProvider extends CLIProvider {
  async spawn(command: string, options: SpawnOptions): Promise<CLIProcess> {
    const args = this.buildArgs(command, options);
    const process = spawn('claude', args, {
      cwd: options.projectPath,
      env: { ...process.env, ...this.getEnvironment() }
    });
    
    return new ClaudeProcess(process);
  }
  
  private buildArgs(command: string, options: SpawnOptions): string[] {
    const args = [];
    
    if (options.resume && options.sessionId) {
      args.push('--resume', options.sessionId);
    }
    
    if (options.model) {
      args.push('--model', options.model);
    }
    
    if (options.outputFormat) {
      args.push('--output-format', options.outputFormat);
    }
    
    if (command) {
      args.push(command);
    }
    
    return args;
  }
  
  async getSessions(projectPath: string): Promise<Session[]> {
    // Сканирование ~/.claude/projects/
    // Парсинг JSONL файлов
    // Возврат сессий
  }
}
```

#### 4.3 Cursor Provider

```typescript
// providers/cursor.provider.ts
export class CursorProvider extends CLIProvider {
  async spawn(command: string, options: SpawnOptions): Promise<CLIProcess> {
    // Текущая реализация отключена
    // Возврат ошибки о недоступности
    throw new Error('Cursor CLI chat interface is not available');
  }
  
  async getSessions(projectPath: string): Promise<Session[]> {
    // Сканирование ~/.cursor/chats/
    // Чтение SQLite баз данных
    // Возврат сессий
  }
}
```

### 5. Event-Driven Architecture

#### 5.1 Event Bus

```typescript
// events/event-bus.ts
export class EventBus {
  private listeners = new Map<string, Function[]>();
  
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }
  
  emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(data));
  }
  
  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event) || [];
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }
}
```

#### 5.2 Events

```typescript
// events/events.ts
export interface ProjectCreatedEvent {
  type: 'project.created';
  data: {
    project: Project;
    timestamp: Date;
  };
}

export interface SessionStartedEvent {
  type: 'session.started';
  data: {
    sessionId: string;
    projectId: string;
    provider: AIProvider;
    timestamp: Date;
  };
}

export interface MessageReceivedEvent {
  type: 'message.received';
  data: {
    sessionId: string;
    message: Message;
    timestamp: Date;
  };
}
```

### 6. Dependency Injection

#### 6.1 Container

```typescript
// di/container.ts
export class Container {
  private services = new Map<string, any>();
  
  register<T>(token: string, factory: () => T): void {
    this.services.set(token, factory);
  }
  
  resolve<T>(token: string): T {
    const factory = this.services.get(token);
    if (!factory) {
      throw new Error(`Service ${token} not found`);
    }
    return factory();
  }
}

// di/tokens.ts
export const TOKENS = {
  PROJECT_REPOSITORY: 'ProjectRepository',
  SESSION_REPOSITORY: 'SessionRepository',
  CLAUDE_PROVIDER: 'ClaudeProvider',
  CURSOR_PROVIDER: 'CursorProvider',
  EVENT_BUS: 'EventBus',
} as const;
```

#### 6.2 Service Registration

```typescript
// di/register-services.ts
export function registerServices(container: Container): void {
  // Repositories
  container.register(TOKENS.PROJECT_REPOSITORY, () => 
    new FileSystemProjectRepository()
  );
  
  container.register(TOKENS.SESSION_REPOSITORY, () => 
    new ClaudeSessionRepository()
  );
  
  // Providers
  container.register(TOKENS.CLAUDE_PROVIDER, () => 
    new ClaudeProvider()
  );
  
  container.register(TOKENS.CURSOR_PROVIDER, () => 
    new CursorProvider()
  );
  
  // Services
  container.register('ProjectService', () => 
    new ProjectService(
      container.resolve(TOKENS.PROJECT_REPOSITORY),
      container.resolve(TOKENS.EVENT_BUS)
    )
  );
}
```

## 🔄 Миграционный план

### Этап 1: Подготовка (1 неделя)

1. Создание TypeScript конфигурации
2. Настройка ESLint и Prettier
3. Создание базовой структуры папок

### Этап 2: Рефакторинг сервисов (2 недели)

1. Создание базовых интерфейсов
2. Реализация Repository pattern
3. Создание CLI Provider абстракции

### Этап 3: Интеграция (1 неделя)

1. Обновление существующих компонентов
2. Тестирование новой архитектуры
3. Исправление ошибок

### Этап 4: Оптимизация (1 неделя)

1. Профилирование производительности
2. Оптимизация критических путей
3. Финальное тестирование

## 📊 Ожидаемые результаты

- **Улучшение maintainability** - четкое разделение ответственности
- **Повышение testability** - изолированные компоненты
- **Упрощение расширения** - легкое добавление новых провайдеров
- **Улучшение производительности** - оптимизированные запросы и кэширование

## 🔗 Связанные документы

- [02-performance.md](./02-performance.md) - Оптимизация производительности
- [05-code-quality.md](./05-code-quality.md) - Качество кода и тестирование
- [06-implementation.md](./06-implementation.md) - План внедрения
