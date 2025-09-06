# CLI интеграции Claude Code UI

## 🔧 Обзор интеграций

Claude Code UI интегрируется с тремя основными CLI инструментами для разработки: Claude CLI, Cursor CLI и Codegen CLI. Каждая интеграция имеет свои особенности и требования.

## 🤖 Claude CLI интеграция

### **Архитектура интеграции**
```javascript
// server/claude-cli.js
import { spawn } from 'child_process';
import { EventEmitter } from 'events';

class ClaudeCliManager extends EventEmitter {
  constructor() {
    super();
    this.activeSessions = new Map();
    this.processes = new Map();
  }

  async spawnSession(projectPath, sessionId) {
    const process = spawn('claude', ['chat', '--project', projectPath], {
      cwd: projectPath,
      env: {
        ...process.env,
        CLAUDE_API_KEY: process.env.CLAUDE_API_KEY
      },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    this.processes.set(sessionId, process);
    this.setupProcessHandlers(process, sessionId);
    
    return sessionId;
  }
}
```

### **Конфигурация**
```javascript
// Требуемые переменные окружения
CLAUDE_API_KEY=your_api_key_here
CLAUDE_CLI_PATH=/usr/local/bin/claude

// Настройки проекта
{
  "claude": {
    "model": "claude-3-sonnet-20240229",
    "maxTokens": 4096,
    "temperature": 0.7,
    "systemPrompt": "You are a helpful coding assistant."
  }
}
```

### **Формат сообщений**
```javascript
// Входящее сообщение от пользователя
{
  "role": "user",
  "content": "Can you help me refactor this component?",
  "attachments": [
    {
      "type": "file",
      "path": "./src/Component.jsx",
      "content": "file_content_here"
    }
  ]
}

// Ответ от Claude
{
  "role": "assistant", 
  "content": "I can help you refactor this component...",
  "metadata": {
    "tokensUsed": 150,
    "model": "claude-3-sonnet-20240229",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### **Обработка файлов**
```javascript
// Автоматическое включение файлов в контекст
const includeProjectFiles = async (projectPath, message) => {
  const relevantFiles = await findRelevantFiles(projectPath, message);
  
  return {
    ...message,
    context: relevantFiles.map(file => ({
      path: file.path,
      content: file.content,
      language: detectLanguage(file.path)
    }))
  };
};
```

### **Управление сессиями**
```javascript
// Защита активных сессий
const protectSession = (sessionId) => {
  activeSessions.add(sessionId);
  // Блокировка автообновлений проекта
  projectUpdateManager.pauseUpdates(sessionId);
};

const unprotectSession = (sessionId) => {
  activeSessions.delete(sessionId);
  projectUpdateManager.resumeUpdates(sessionId);
};
```

## ⚡ Cursor CLI интеграция

### **Архитектура интеграции**
```javascript
// server/cursor-cli.js
class CursorCliManager extends EventEmitter {
  constructor() {
    super();
    this.cursorPath = process.env.CURSOR_CLI_PATH || 'cursor';
  }

  async spawnSession(projectPath, sessionId) {
    const process = spawn(this.cursorPath, [
      '--chat',
      '--project', projectPath,
      '--session', sessionId
    ], {
      cwd: projectPath,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    return this.setupCursorProcess(process, sessionId);
  }

  setupCursorProcess(process, sessionId) {
    process.stdout.on('data', (data) => {
      const message = this.parseCursorOutput(data.toString());
      this.emit('message', sessionId, message);
    });

    process.stderr.on('data', (data) => {
      this.emit('error', sessionId, data.toString());
    });

    return sessionId;
  }
}
```

### **Конфигурация**
```javascript
// Настройки Cursor CLI
{
  "cursor": {
    "model": "gpt-4",
    "codebaseContext": true,
    "autoImports": true,
    "linting": true,
    "formatting": true
  }
}

// Переменные окружения
CURSOR_CLI_PATH=/Applications/Cursor.app/Contents/Resources/app/bin/cursor
CURSOR_API_KEY=your_cursor_api_key
```

### **Особенности интеграции**
```javascript
// Cursor-специфичные команды
const cursorCommands = {
  // Применение изменений к файлам
  applyChanges: async (sessionId, changes) => {
    const process = this.processes.get(sessionId);
    process.stdin.write(JSON.stringify({
      command: 'apply_changes',
      changes: changes
    }) + '\n');
  },

  // Получение контекста кодовой базы
  getCodebaseContext: async (projectPath) => {
    return spawn(this.cursorPath, [
      '--get-context',
      '--project', projectPath
    ]);
  },

  // Форматирование кода
  formatCode: async (filePath, content) => {
    return spawn(this.cursorPath, [
      '--format',
      '--file', filePath
    ]);
  }
};
```

### **Обработка изменений файлов**
```javascript
// Автоматическое применение изменений
const handleCursorChanges = (sessionId, changes) => {
  changes.forEach(async (change) => {
    switch (change.type) {
      case 'file_edit':
        await applyFileEdit(change.path, change.content);
        break;
      case 'file_create':
        await createFile(change.path, change.content);
        break;
      case 'file_delete':
        await deleteFile(change.path);
        break;
    }
  });

  // Уведомление frontend об изменениях
  websocketManager.broadcast('files_changed', {
    sessionId,
    changes
  });
};
```

## 🔧 Codegen CLI интеграция

### **Архитектура интеграции**
```javascript
// server/codegen-cli.js
class CodegenCliManager extends EventEmitter {
  constructor() {
    super();
    this.apiKey = process.env.CODEGEN_API_KEY;
    this.baseUrl = 'https://api.codegen.com/v1';
  }

  async createSession(projectPath, sessionId) {
    // Codegen использует API вместо CLI процесса
    const session = await this.apiCall('/sessions', {
      method: 'POST',
      body: {
        projectPath,
        sessionId,
        config: await this.getProjectConfig(projectPath)
      }
    });

    return session.id;
  }

  async sendMessage(sessionId, message) {
    const response = await this.apiCall(`/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: {
        content: message.content,
        attachments: message.attachments,
        context: await this.getProjectContext(sessionId)
      }
    });

    return response;
  }
}
```

### **API интеграция**
```javascript
// HTTP API вместо CLI процесса
const codegenApiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: options.method || 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!response.ok) {
    throw new Error(`Codegen API error: ${response.statusText}`);
  }

  return response.json();
};
```

### **Конфигурация**
```javascript
// Настройки Codegen
{
  "codegen": {
    "model": "codegen-v2",
    "features": {
      "codeGeneration": true,
      "codeReview": true,
      "testing": true,
      "documentation": true
    },
    "integrations": {
      "github": true,
      "linear": true,
      "slack": false
    }
  }
}

// Переменные окружения
CODEGEN_API_KEY=your_codegen_api_key
CODEGEN_ORG_ID=your_org_id
```

### **Специальные возможности**
```javascript
// Codegen-специфичные функции
const codegenFeatures = {
  // Создание PR
  createPullRequest: async (sessionId, changes) => {
    return await apiCall(`/sessions/${sessionId}/pr`, {
      method: 'POST',
      body: {
        title: 'AI-generated changes',
        description: 'Changes generated by Codegen AI',
        changes
      }
    });
  },

  // Создание задач в Linear
  createLinearTask: async (sessionId, task) => {
    return await apiCall(`/sessions/${sessionId}/linear/tasks`, {
      method: 'POST',
      body: task
    });
  },

  // Анализ кода
  analyzeCode: async (projectPath) => {
    return await apiCall('/analyze', {
      method: 'POST',
      body: { projectPath }
    });
  }
};
```

## 🔄 Унифицированный интерфейс

### **Абстрактный базовый класс**
```javascript
// Базовый класс для всех CLI интеграций
class BaseCLIManager extends EventEmitter {
  constructor(type) {
    super();
    this.type = type;
    this.sessions = new Map();
  }

  // Абстрактные методы, которые должны быть реализованы
  async createSession(projectPath, sessionId) {
    throw new Error('createSession must be implemented');
  }

  async sendMessage(sessionId, message) {
    throw new Error('sendMessage must be implemented');
  }

  async abortSession(sessionId) {
    throw new Error('abortSession must be implemented');
  }

  // Общие методы
  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }

  getAllSessions() {
    return Array.from(this.sessions.values());
  }
}
```

### **Фабрика CLI менеджеров**
```javascript
// Фабрика для создания CLI менеджеров
class CLIManagerFactory {
  static create(type) {
    switch (type) {
      case 'claude':
        return new ClaudeCliManager();
      case 'cursor':
        return new CursorCliManager();
      case 'codegen':
        return new CodegenCliManager();
      default:
        throw new Error(`Unknown CLI type: ${type}`);
    }
  }

  static getSupportedTypes() {
    return ['claude', 'cursor', 'codegen'];
  }
}
```

### **Единый API для frontend**
```javascript
// Унифицированный API endpoint
app.post('/api/sessions/:sessionId/messages', async (req, res) => {
  const { sessionId } = req.params;
  const { content, attachments } = req.body;

  try {
    const session = sessionManager.getSession(sessionId);
    const cliManager = CLIManagerFactory.create(session.type);
    
    const response = await cliManager.sendMessage(sessionId, {
      content,
      attachments
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 📊 Мониторинг и метрики

### **Метрики по CLI интеграциям**
```javascript
// Сбор метрик для каждого CLI
const cliMetrics = {
  claude: {
    sessionsCount: 0,
    messagesCount: 0,
    tokensUsed: 0,
    averageResponseTime: 0,
    errorRate: 0
  },
  cursor: {
    sessionsCount: 0,
    messagesCount: 0,
    changesApplied: 0,
    averageResponseTime: 0,
    errorRate: 0
  },
  codegen: {
    sessionsCount: 0,
    messagesCount: 0,
    prsCreated: 0,
    tasksCreated: 0,
    averageResponseTime: 0,
    errorRate: 0
  }
};
```

### **Логирование**
```javascript
// Структурированное логирование для CLI операций
const logCLIOperation = (type, operation, sessionId, metadata = {}) => {
  logger.info('CLI operation', {
    cliType: type,
    operation,
    sessionId,
    timestamp: new Date().toISOString(),
    ...metadata
  });
};
```

## 🚨 Обработка ошибок

### **Типы ошибок**
```javascript
// Специфичные ошибки для каждого CLI
class CLIError extends Error {
  constructor(type, code, message, details = {}) {
    super(message);
    this.name = 'CLIError';
    this.type = type;
    this.code = code;
    this.details = details;
  }
}

// Примеры ошибок
const CLI_ERRORS = {
  CLAUDE_API_KEY_MISSING: 'Claude API key is not configured',
  CURSOR_NOT_INSTALLED: 'Cursor CLI is not installed',
  CODEGEN_RATE_LIMIT: 'Codegen API rate limit exceeded',
  SESSION_NOT_FOUND: 'Session not found',
  PROCESS_CRASHED: 'CLI process crashed unexpectedly'
};
```

### **Retry механизм**
```javascript
// Автоматические повторные попытки
const retryOperation = async (operation, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};
```

## 🔧 Конфигурация и настройка

### **Автоматическое обнаружение CLI**
```javascript
// Проверка доступности CLI инструментов
const detectCLITools = async () => {
  const tools = {};

  // Claude CLI
  try {
    await execAsync('claude --version');
    tools.claude = {
      available: true,
      path: await which('claude'),
      version: await getCLIVersion('claude')
    };
  } catch {
    tools.claude = { available: false };
  }

  // Cursor CLI
  try {
    await execAsync('cursor --version');
    tools.cursor = {
      available: true,
      path: await which('cursor'),
      version: await getCLIVersion('cursor')
    };
  } catch {
    tools.cursor = { available: false };
  }

  // Codegen (API-based)
  try {
    const response = await fetch('https://api.codegen.com/v1/health');
    tools.codegen = {
      available: response.ok,
      apiUrl: 'https://api.codegen.com/v1',
      version: 'v1'
    };
  } catch {
    tools.codegen = { available: false };
  }

  return tools;
};
```

### **Валидация конфигурации**
```javascript
// Проверка корректности настроек
const validateCLIConfig = (type, config) => {
  const validators = {
    claude: (config) => {
      if (!config.apiKey) throw new Error('Claude API key is required');
      if (!config.model) throw new Error('Claude model is required');
    },
    cursor: (config) => {
      if (!config.path) throw new Error('Cursor CLI path is required');
    },
    codegen: (config) => {
      if (!config.apiKey) throw new Error('Codegen API key is required');
      if (!config.orgId) throw new Error('Codegen organization ID is required');
    }
  };

  const validator = validators[type];
  if (validator) {
    validator(config);
  }
};
```

## 🚀 Рекомендации по улучшению

### **1. Стандартизация протоколов**
```javascript
// Единый протокол сообщений для всех CLI
const standardMessage = {
  id: 'uuid',
  sessionId: 'string',
  type: 'user|assistant|system',
  content: 'string',
  attachments: [],
  metadata: {
    timestamp: 'ISO_date',
    tokens: 'number',
    model: 'string'
  }
};
```

### **2. Кэширование ответов**
```javascript
// Кэширование для повторяющихся запросов
const responseCache = new Map();

const getCachedResponse = (messageHash) => {
  return responseCache.get(messageHash);
};

const cacheResponse = (messageHash, response) => {
  responseCache.set(messageHash, {
    response,
    timestamp: Date.now(),
    ttl: 3600000 // 1 hour
  });
};
```

### **3. Batch операции**
```javascript
// Группировка сообщений для эффективности
const batchMessages = async (sessionId, messages) => {
  const batchSize = 5;
  const batches = [];
  
  for (let i = 0; i < messages.length; i += batchSize) {
    batches.push(messages.slice(i, i + batchSize));
  }

  return Promise.all(
    batches.map(batch => processBatch(sessionId, batch))
  );
};
```

### **4. Graceful degradation**
```javascript
// Fallback механизмы при недоступности CLI
const sendMessageWithFallback = async (sessionId, message) => {
  const session = getSession(sessionId);
  const primaryCLI = session.type;
  
  try {
    return await sendMessage(primaryCLI, sessionId, message);
  } catch (error) {
    // Попытка использовать альтернативный CLI
    const fallbackCLI = getFallbackCLI(primaryCLI);
    if (fallbackCLI) {
      return await sendMessage(fallbackCLI, sessionId, message);
    }
    throw error;
  }
};
```

Эта архитектура CLI интеграций обеспечивает гибкость, надежность и возможность легкого добавления новых CLI инструментов в будущем.
