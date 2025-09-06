# API структура Claude Code UI

## 🌐 Обзор API архитектуры

Claude Code UI использует RESTful API с WebSocket соединениями для real-time коммуникации между frontend и backend компонентами.

## 📊 Структура API endpoints

### 🔐 Аутентификация (`/api/auth`)

#### **POST /api/auth/login**
```javascript
// Request
{
  "username": "string",
  "password": "string"
}

// Response
{
  "token": "jwt_token",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
```

#### **POST /api/auth/logout**
```javascript
// Headers: Authorization: Bearer <token>
// Response: 200 OK
```

#### **GET /api/auth/me**
```javascript
// Headers: Authorization: Bearer <token>
// Response
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "preferences": {}
  }
}
```

### 📁 Проекты (`/api/projects`)

#### **GET /api/projects**
```javascript
// Response
{
  "projects": [
    {
      "id": "string",
      "name": "string",
      "path": "string",
      "type": "claude|cursor|codegen",
      "lastActivity": "ISO_date",
      "status": "active|inactive",
      "sessionsCount": "number"
    }
  ]
}
```

#### **POST /api/projects**
```javascript
// Request
{
  "name": "string",
  "path": "string",
  "type": "claude|cursor|codegen",
  "config": {}
}

// Response
{
  "project": {
    "id": "string",
    "name": "string",
    "path": "string",
    "type": "string",
    "createdAt": "ISO_date"
  }
}
```

#### **PUT /api/projects/:id**
```javascript
// Request
{
  "name": "string",
  "config": {}
}

// Response: Updated project object
```

#### **DELETE /api/projects/:id**
```javascript
// Response: 204 No Content
```

### 💬 Сессии (`/api/sessions`)

#### **GET /api/projects/:projectId/sessions**
```javascript
// Response
{
  "sessions": [
    {
      "id": "string",
      "projectId": "string",
      "name": "string",
      "type": "chat|terminal",
      "status": "active|completed|aborted",
      "createdAt": "ISO_date",
      "lastActivity": "ISO_date",
      "messagesCount": "number"
    }
  ]
}
```

#### **POST /api/projects/:projectId/sessions**
```javascript
// Request
{
  "name": "string",
  "type": "chat|terminal",
  "config": {}
}

// Response: New session object
```

#### **GET /api/sessions/:sessionId/messages**
```javascript
// Query params: ?page=1&limit=50
// Response
{
  "messages": [
    {
      "id": "string",
      "sessionId": "string",
      "type": "user|assistant|system",
      "content": "string",
      "timestamp": "ISO_date",
      "metadata": {}
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "hasMore": "boolean"
  }
}
```

#### **POST /api/sessions/:sessionId/messages**
```javascript
// Request
{
  "content": "string",
  "type": "user",
  "attachments": [
    {
      "type": "file|image",
      "name": "string",
      "content": "base64|url"
    }
  ]
}

// Response: New message object
```

### 📂 Файлы (`/api/files`)

#### **GET /api/projects/:projectId/files**
```javascript
// Query params: ?path=/src&recursive=true
// Response
{
  "files": [
    {
      "name": "string",
      "path": "string",
      "type": "file|directory",
      "size": "number",
      "modified": "ISO_date",
      "gitStatus": "modified|added|deleted|untracked"
    }
  ]
}
```

#### **GET /api/projects/:projectId/files/content**
```javascript
// Query params: ?path=/src/App.jsx
// Response
{
  "content": "string",
  "encoding": "utf8|base64",
  "metadata": {
    "size": "number",
    "modified": "ISO_date",
    "language": "javascript"
  }
}
```

#### **PUT /api/projects/:projectId/files/content**
```javascript
// Request
{
  "path": "string",
  "content": "string",
  "encoding": "utf8"
}

// Response: 200 OK
```

#### **POST /api/projects/:projectId/files**
```javascript
// Request
{
  "path": "string",
  "type": "file|directory",
  "content": "string" // for files only
}

// Response: Created file/directory object
```

#### **DELETE /api/projects/:projectId/files**
```javascript
// Query params: ?path=/src/unused.js
// Response: 204 No Content
```

### 🔧 Git операции (`/api/git`)

#### **GET /api/projects/:projectId/git/status**
```javascript
// Response
{
  "branch": "string",
  "status": {
    "modified": ["file1.js", "file2.js"],
    "added": ["file3.js"],
    "deleted": ["file4.js"],
    "untracked": ["file5.js"]
  },
  "ahead": "number",
  "behind": "number"
}
```

#### **POST /api/projects/:projectId/git/commit**
```javascript
// Request
{
  "message": "string",
  "files": ["file1.js", "file2.js"]
}

// Response
{
  "commitHash": "string",
  "message": "string",
  "timestamp": "ISO_date"
}
```

#### **GET /api/projects/:projectId/git/log**
```javascript
// Query params: ?limit=10&offset=0
// Response
{
  "commits": [
    {
      "hash": "string",
      "message": "string",
      "author": "string",
      "timestamp": "ISO_date",
      "files": ["string"]
    }
  ]
}
```

### 📋 TaskMaster (`/api/taskmaster`)

#### **GET /api/projects/:projectId/tasks**
```javascript
// Response
{
  "tasks": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "status": "todo|in_progress|done",
      "priority": "low|medium|high",
      "assignee": "string",
      "dueDate": "ISO_date",
      "createdAt": "ISO_date"
    }
  ]
}
```

#### **POST /api/projects/:projectId/tasks**
```javascript
// Request
{
  "title": "string",
  "description": "string",
  "priority": "low|medium|high",
  "dueDate": "ISO_date"
}

// Response: New task object
```

#### **PUT /api/tasks/:taskId**
```javascript
// Request
{
  "status": "todo|in_progress|done",
  "assignee": "string"
}

// Response: Updated task object
```

#### **GET /api/projects/:projectId/prd**
```javascript
// Response
{
  "files": [
    {
      "name": "string",
      "path": "string",
      "content": "string",
      "lastModified": "ISO_date"
    }
  ]
}
```

### ⚙️ Настройки (`/api/settings`)

#### **GET /api/settings**
```javascript
// Response
{
  "settings": {
    "theme": "light|dark|auto",
    "language": "en|ru",
    "notifications": {
      "updates": "boolean",
      "tasks": "boolean",
      "errors": "boolean"
    },
    "cli": {
      "claude": {
        "path": "string",
        "enabled": "boolean"
      },
      "cursor": {
        "path": "string",
        "enabled": "boolean"
      },
      "codegen": {
        "apiKey": "string",
        "enabled": "boolean"
      }
    }
  }
}
```

#### **PUT /api/settings**
```javascript
// Request: Partial settings object
// Response: Updated settings object
```

## 🔌 WebSocket API

### **Соединение**
```javascript
// URL: ws://localhost:3001/ws
// Headers: Authorization: Bearer <token>
```

### **События (Client → Server)**

#### **join_project**
```javascript
{
  "type": "join_project",
  "projectId": "string"
}
```

#### **send_message**
```javascript
{
  "type": "send_message",
  "sessionId": "string",
  "content": "string",
  "attachments": []
}
```

#### **abort_session**
```javascript
{
  "type": "abort_session",
  "sessionId": "string"
}
```

### **События (Server → Client)**

#### **project_updated**
```javascript
{
  "type": "project_updated",
  "projectId": "string",
  "data": {
    "files": [],
    "sessions": []
  }
}
```

#### **message_received**
```javascript
{
  "type": "message_received",
  "sessionId": "string",
  "message": {
    "id": "string",
    "content": "string",
    "type": "assistant",
    "timestamp": "ISO_date"
  }
}
```

#### **session_status_changed**
```javascript
{
  "type": "session_status_changed",
  "sessionId": "string",
  "status": "active|completed|aborted"
}
```

#### **typing_indicator**
```javascript
{
  "type": "typing_indicator",
  "sessionId": "string",
  "isTyping": "boolean"
}
```

## 🔧 CLI интеграции

### **Claude CLI**
```javascript
// Spawn process
spawn('claude', ['chat', '--project', projectPath], {
  cwd: projectPath,
  env: process.env
});

// Message format
{
  "role": "user|assistant",
  "content": "string",
  "timestamp": "ISO_date"
}
```

### **Cursor CLI**
```javascript
// Spawn process
spawn('cursor', ['--chat', '--project', projectPath], {
  cwd: projectPath,
  env: process.env
});

// Message format
{
  "type": "user_message|assistant_response",
  "content": "string",
  "metadata": {}
}
```

### **Codegen CLI**
```javascript
// API integration
const response = await fetch('https://api.codegen.com/v1/chat', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: content,
    project: projectId
  })
});
```

## 🚨 Обработка ошибок

### **Стандартный формат ошибок**
```javascript
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {},
    "timestamp": "ISO_date"
  }
}
```

### **HTTP статус коды**
- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error

### **WebSocket ошибки**
```javascript
{
  "type": "error",
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

## 🔒 Безопасность

### **Аутентификация**
- JWT токены с истечением срока действия
- Refresh token механизм
- Secure HTTP-only cookies для веб-клиентов

### **Авторизация**
- Role-based access control (RBAC)
- Project-level permissions
- API rate limiting

### **Валидация данных**
```javascript
// Пример middleware валидации
const validateProject = (req, res, next) => {
  const { name, path, type } = req.body;
  
  if (!name || name.length < 1) {
    return res.status(400).json({
      error: { code: 'INVALID_NAME', message: 'Project name is required' }
    });
  }
  
  if (!['claude', 'cursor', 'codegen'].includes(type)) {
    return res.status(400).json({
      error: { code: 'INVALID_TYPE', message: 'Invalid project type' }
    });
  }
  
  next();
};
```

## 📈 Мониторинг и логирование

### **Метрики API**
- Request/response времена
- Количество запросов по endpoints
- Ошибки и их частота
- WebSocket соединения

### **Логирование**
```javascript
// Структурированные логи
{
  "timestamp": "ISO_date",
  "level": "info|warn|error",
  "message": "string",
  "metadata": {
    "userId": "string",
    "projectId": "string",
    "endpoint": "string",
    "duration": "number"
  }
}
```

## 🔄 Рекомендации по рефакторингу API

### **1. Версионирование API**
```javascript
// Текущее: /api/projects
// Рекомендуемое: /api/v1/projects
```

### **2. Пагинация**
```javascript
// Стандартизированная пагинация
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### **3. Фильтрация и сортировка**
```javascript
// GET /api/v1/projects?filter[type]=claude&sort=-lastActivity&limit=10
```

### **4. Batch операции**
```javascript
// POST /api/v1/projects/batch
{
  "operations": [
    { "method": "DELETE", "id": "project1" },
    { "method": "UPDATE", "id": "project2", "data": {} }
  ]
}
```

### **5. GraphQL интеграция**
```javascript
// Для сложных запросов с множественными связями
query GetProjectWithSessions($projectId: ID!) {
  project(id: $projectId) {
    id
    name
    sessions {
      id
      name
      messagesCount
    }
  }
}
```

### **6. Кэширование**
```javascript
// Redis для кэширования частых запросов
// ETags для условных запросов
// Cache-Control headers
```

### **7. Rate Limiting**
```javascript
// Ограничения по пользователям и endpoints
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
```

Эта API структура обеспечивает надежную основу для Claude Code UI с возможностями для масштабирования и улучшения производительности.
