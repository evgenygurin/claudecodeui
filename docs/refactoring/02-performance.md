# ⚡ Оптимизация производительности

## 📋 Обзор

Этот документ описывает стратегии оптимизации производительности Claude Code UI для улучшения пользовательского опыта.

## 🎯 Текущие проблемы производительности

### Frontend

- **Медленная загрузка** больших списков проектов
- **Избыточные ре-рендеры** компонентов
- **Большой размер бандла** без code splitting
- **Неоптимальные WebSocket** соединения

### Backend

- **Блокирующие операции** файловой системы
- **Отсутствие кэширования** результатов
- **Неэффективные запросы** к базе данных
- **Медленная обработка** больших файлов

## 🚀 Стратегии оптимизации

### 1. Frontend оптимизации

#### 1.1 Code Splitting и Lazy Loading

```typescript
// Lazy loading компонентов
const ChatInterface = lazy(() => import('./components/ChatInterface'));
const FileTree = lazy(() => import('./components/FileTree'));
const GitPanel = lazy(() => import('./components/GitPanel'));
const TaskMaster = lazy(() => import('./components/TaskMaster'));

// Route-based code splitting
const App = () => (
  <Router>
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/files" element={<FileTree />} />
        <Route path="/git" element={<GitPanel />} />
        <Route path="/tasks" element={<TaskMaster />} />
      </Routes>
    </Suspense>
  </Router>
);
```

#### 1.2 Виртуализация списков

```typescript
// Виртуализация списка проектов
import { FixedSizeList as List } from 'react-window';

const ProjectList = ({ projects }: { projects: Project[] }) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <ProjectItem project={projects[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={projects.length}
      itemSize={80}
      itemData={projects}
    >
      {Row}
    </List>
  );
};

// Виртуализация сообщений чата
const MessageList = ({ messages }: { messages: Message[] }) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <MessageItem message={messages[index]} />
    </div>
  );

  return (
    <List
      height={400}
      itemCount={messages.length}
      itemSize={120}
      itemData={messages}
    >
      {Row}
    </List>
  );
};
```

#### 1.3 Мемоизация и оптимизация ре-рендеров

```typescript
// Мемоизация компонентов
const ProjectItem = memo(({ project }: { project: Project }) => {
  const handleClick = useCallback(() => {
    onProjectSelect(project);
  }, [project.id]);

  return (
    <div onClick={handleClick}>
      <h3>{project.name}</h3>
      <p>{project.path}</p>
    </div>
  );
});

// Мемоизация селекторов
const useProjectSelector = () => {
  return useMemo(() => {
    return (state: AppState) => state.projects;
  }, []);
};

// Оптимизация контекста
const ProjectContext = createContext<ProjectContextValue | null>(null);

const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const value = useMemo(() => ({
    projects,
    selectedProject,
    setProjects,
    setSelectedProject,
  }), [projects, selectedProject]);

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};
```

#### 1.4 React Query для кэширования

```typescript
// Настройка React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 минут
      cacheTime: 10 * 60 * 1000, // 10 минут
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

// Хуки для API
const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000,
  });
};

const useProjectSessions = (projectId: string) => {
  return useQuery({
    queryKey: ['projects', projectId, 'sessions'],
    queryFn: () => fetchProjectSessions(projectId),
    enabled: !!projectId,
  });
};

const useSessionMessages = (sessionId: string) => {
  return useQuery({
    queryKey: ['sessions', sessionId, 'messages'],
    queryFn: () => fetchSessionMessages(sessionId),
    enabled: !!sessionId,
  });
};
```

#### 1.5 Оптимизация WebSocket

```typescript
// WebSocket connection pooling
class WebSocketManager {
  private connections = new Map<string, WebSocket>();
  private reconnectAttempts = new Map<string, number>();
  private maxReconnectAttempts = 5;

  connect(url: string): WebSocket {
    if (this.connections.has(url)) {
      return this.connections.get(url)!;
    }

    const ws = new WebSocket(url);
    this.connections.set(url, ws);

    ws.onclose = () => {
      this.handleReconnect(url);
    };

    return ws;
  }

  private handleReconnect(url: string): void {
    const attempts = this.reconnectAttempts.get(url) || 0;

    if (attempts < this.maxReconnectAttempts) {
      setTimeout(
        () => {
          this.reconnectAttempts.set(url, attempts + 1);
          this.connect(url);
        },
        Math.pow(2, attempts) * 1000
      ); // Exponential backoff
    }
  }
}

// Debounced WebSocket messages
const useDebouncedWebSocket = (ws: WebSocket, delay: number = 300) => {
  const debouncedSend = useMemo(
    () =>
      debounce((message: any) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(message));
        }
      }, delay),
    [ws, delay]
  );

  return debouncedSend;
};
```

### 2. Backend оптимизации

#### 2.1 Кэширование

```typescript
// Redis кэширование
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

class CacheService {
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set<T>(key: string, value: T, ttl: number = 300): Promise<void> {
    await redis.setex(key, ttl, JSON.stringify(value));
  }

  async invalidate(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}

// Кэширование проектов
const projectCache = new CacheService();

app.get('/api/projects', async (req, res) => {
  const cacheKey = 'projects:all';

  let projects = await projectCache.get<Project[]>(cacheKey);

  if (!projects) {
    projects = await getProjects();
    await projectCache.set(cacheKey, projects, 300); // 5 минут
  }

  res.json(projects);
});
```

#### 2.2 Асинхронная обработка файлов

```typescript
// Worker threads для тяжелых операций
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

if (isMainThread) {
  // Main thread
  const processFileTree = (projectPath: string): Promise<FileTreeItem[]> => {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: { projectPath },
      });

      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', code => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  };
} else {
  // Worker thread
  const { projectPath } = workerData;

  try {
    const fileTree = await getFileTree(projectPath);
    parentPort?.postMessage(fileTree);
  } catch (error) {
    parentPort?.postMessage({ error: error.message });
  }
}
```

#### 2.3 Оптимизация базы данных

```typescript
// Connection pooling
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Prepared statements
const getProjectById = pool.query('SELECT * FROM projects WHERE id = $1', [projectId]);

// Batch operations
const insertSessions = async (sessions: Session[]) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const session of sessions) {
      await client.query(
        'INSERT INTO sessions (id, project_id, title, created_at) VALUES ($1, $2, $3, $4)',
        [session.id, session.projectId, session.title, session.createdAt]
      );
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
```

#### 2.4 Оптимизация файловых операций

```typescript
// Streaming для больших файлов
import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';

app.get('/api/projects/:projectName/file', async (req, res) => {
  const { projectName } = req.params;
  const { filePath } = req.query;

  try {
    const fileStream = createReadStream(filePath);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);

    await pipeline(fileStream, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Параллельная обработка файлов
const processFilesInParallel = async (filePaths: string[]) => {
  const chunks = chunkArray(filePaths, 10); // Обрабатываем по 10 файлов

  const results = await Promise.all(chunks.map(chunk => Promise.all(chunk.map(processFile))));

  return results.flat();
};
```

### 3. Мониторинг производительности

#### 3.1 Frontend метрики

```typescript
// Performance monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const sendToAnalytics = (metric: any) => {
  // Отправка метрик в аналитику
  console.log(metric);
};

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);

// Custom performance marks
const measurePerformance = (name: string, fn: () => void) => {
  performance.mark(`${name}-start`);
  fn();
  performance.mark(`${name}-end`);
  performance.measure(name, `${name}-start`, `${name}-end`);
};
```

#### 3.2 Backend метрики

```typescript
// Response time middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });

  next();
});

// Memory usage monitoring
setInterval(() => {
  const usage = process.memoryUsage();
  console.log('Memory usage:', {
    rss: Math.round(usage.rss / 1024 / 1024) + ' MB',
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024) + ' MB',
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + ' MB',
    external: Math.round(usage.external / 1024 / 1024) + ' MB',
  });
}, 30000);
```

## 📊 Целевые метрики

### Frontend

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.5s
- **Bundle size**: < 2MB

### Backend

- **API response time**: < 200ms (95th percentile)
- **WebSocket latency**: < 50ms
- **File processing**: < 1s для файлов < 10MB
- **Memory usage**: < 512MB

### Пользовательский опыт

- **Время загрузки проектов**: < 500ms
- **Время отклика чата**: < 200ms
- **Время открытия файлов**: < 300ms
- **Время переключения между вкладками**: < 100ms

## 🔧 Инструменты оптимизации

### Frontend

- **Webpack Bundle Analyzer** - анализ размера бандла
- **React DevTools Profiler** - профилирование компонентов
- **Lighthouse** - аудит производительности
- **Chrome DevTools** - отладка производительности

### Backend

- **Node.js Profiler** - профилирование CPU
- **Clinic.js** - диагностика производительности
- **New Relic/DataDog** - мониторинг в продакшене
- **Redis** - кэширование

## 🚀 План внедрения

### Этап 1: Frontend оптимизации (1 неделя)

1. Настройка code splitting
2. Внедрение виртуализации
3. Оптимизация ре-рендеров

### Этап 2: Backend оптимизации (1 неделя)

1. Настройка кэширования
2. Оптимизация файловых операций
3. Улучшение базы данных

### Этап 3: Мониторинг (3 дня)

1. Настройка метрик
2. Создание дашбордов
3. Настройка алертов

## 🔗 Связанные документы

- [01-architecture.md](./01-architecture.md) - Архитектурные изменения
- [03-security.md](./03-security.md) - Улучшения безопасности
- [07-metrics.md](./07-metrics.md) - Метрики и KPI
