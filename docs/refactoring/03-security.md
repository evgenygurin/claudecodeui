# 🔒 Улучшения безопасности

## 📋 Обзор

Этот документ описывает комплексные меры по улучшению безопасности Claude Code UI для защиты от современных угроз.

## 🎯 Текущие уязвимости

### Аутентификация и авторизация

- **Слабые пароли** - отсутствие политики паролей
- **Небезопасное хранение** JWT токенов
- **Отсутствие rate limiting** для API
- **Недостаточная валидация** входных данных

### Сетевая безопасность

- **Отсутствие HTTPS** в продакшене
- **Небезопасные CORS** настройки
- **Отсутствие CSP** заголовков
- **Уязвимые WebSocket** соединения

### Файловая система

- **Path traversal** уязвимости
- **Небезопасная загрузка** файлов
- **Отсутствие валидации** типов файлов
- **Небезопасное выполнение** CLI команд

## 🛡️ Стратегии безопасности

### 1. Аутентификация и авторизация

#### 1.1 Усиленная аутентификация

```typescript
// Политика паролей
const passwordPolicy = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxAge: 90, // дней
  historyCount: 5, // не повторять последние 5 паролей
};

// Валидация пароля
const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (password.length < passwordPolicy.minLength) {
    errors.push(`Password must be at least ${passwordPolicy.minLength} characters long`);
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Безопасное хеширование паролей
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
};

const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
```

#### 1.2 JWT безопасность

```typescript
// Безопасная конфигурация JWT
const jwtConfig = {
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
  algorithm: 'RS256',
  issuer: 'claude-code-ui',
  audience: 'claude-code-ui-users',
};

// Генерация ключей
const generateKeyPair = (): { publicKey: string; privateKey: string } => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  
  return { publicKey, privateKey };
};

// Безопасная генерация токенов
const generateTokens = (userId: string): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    privateKey,
    {
      expiresIn: jwtConfig.accessTokenExpiry,
      algorithm: jwtConfig.algorithm,
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    }
  );
  
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    privateKey,
    {
      expiresIn: jwtConfig.refreshTokenExpiry,
      algorithm: jwtConfig.algorithm,
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    }
  );
  
  return { accessToken, refreshToken };
};

// Валидация токенов
const validateToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, publicKey, {
      algorithms: [jwtConfig.algorithm],
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    }) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
```

#### 1.3 Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Общий rate limiting
const generalLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

// Строгий rate limiting для аутентификации
const authLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5, // максимум 5 попыток входа
  message: 'Too many login attempts',
  skipSuccessfulRequests: true,
});

// Rate limiting для API
const apiLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 1 * 60 * 1000, // 1 минута
  max: 60, // максимум 60 запросов в минуту
  message: 'API rate limit exceeded',
});

// Применение rate limiting
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);
app.use(generalLimiter);
```

### 2. Валидация и санитизация

#### 2.1 Валидация входных данных

```typescript
import { z } from 'zod';

// Схемы валидации
const ProjectSchema = z.object({
  name: z.string()
    .min(1, 'Project name is required')
    .max(100, 'Project name too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid project name format'),
  path: z.string()
    .min(1, 'Project path is required')
    .refine((path) => {
      // Проверка на path traversal
      return !path.includes('..') && !path.includes('~');
    }, 'Invalid project path'),
  description: z.string().max(500).optional(),
});

const SessionSchema = z.object({
  title: z.string().min(1).max(200),
  provider: z.enum(['claude', 'cursor', 'codegen']),
  projectId: z.string().uuid(),
});

const MessageSchema = z.object({
  content: z.string().min(1).max(10000),
  sessionId: z.string().uuid(),
  type: z.enum(['user', 'assistant', 'system']),
});

// Middleware для валидации
const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors,
        });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
};

// Применение валидации
app.post('/api/projects', validateRequest(ProjectSchema), createProject);
app.post('/api/sessions', validateRequest(SessionSchema), createSession);
app.post('/api/messages', validateRequest(MessageSchema), sendMessage);
```

#### 2.2 Санитизация данных

```typescript
import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

// Санитизация HTML
const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'code', 'pre'],
    ALLOWED_ATTR: [],
  });
};

// Санитизация файловых путей
const sanitizePath = (path: string): string => {
  // Удаление опасных символов
  return path
    .replace(/[<>:"|?*]/g, '')
    .replace(/\.\./g, '')
    .replace(/^~/, '')
    .trim();
};

// Санитизация команд
const sanitizeCommand = (command: string): string => {
  // Разрешенные команды
  const allowedCommands = [
    'git', 'npm', 'yarn', 'node', 'python', 'ls', 'cat', 'echo'
  ];
  
  const [cmd, ...args] = command.split(' ');
  
  if (!allowedCommands.includes(cmd)) {
    throw new Error('Command not allowed');
  }
  
  // Санитизация аргументов
  const sanitizedArgs = args.map(arg => 
    arg.replace(/[;&|`$(){}[\]\\]/g, '')
  );
  
  return [cmd, ...sanitizedArgs].join(' ');
};
```

### 3. Сетевая безопасность

#### 3.1 HTTPS и SSL/TLS

```typescript
import https from 'https';
import fs from 'fs';

// Конфигурация HTTPS
const httpsOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH),
  ca: fs.readFileSync(process.env.SSL_CA_PATH),
  secureProtocol: 'TLSv1_2_method',
  ciphers: [
    'ECDHE-RSA-AES128-GCM-SHA256',
    'ECDHE-RSA-AES256-GCM-SHA384',
    'ECDHE-RSA-AES128-SHA256',
    'ECDHE-RSA-AES256-SHA384',
  ].join(':'),
  honorCipherOrder: true,
};

// Принудительное перенаправление на HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

#### 3.2 CORS и CSP

```typescript
import cors from 'cors';
import helmet from 'helmet';

// Безопасная конфигурация CORS
const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// Content Security Policy
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "wss:", "https:"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'same-origin' },
}));
```

#### 3.3 Безопасные WebSocket соединения

```typescript
import { WebSocketServer } from 'ws';
import { verify } from 'jsonwebtoken';

// Безопасная аутентификация WebSocket
const wss = new WebSocketServer({
  server,
  verifyClient: (info) => {
    const token = info.req.url?.split('token=')[1];
    
    if (!token) {
      return false;
    }
    
    try {
      const decoded = verify(token, publicKey);
      info.req.user = decoded;
      return true;
    } catch (error) {
      return false;
    }
  },
});

// Rate limiting для WebSocket
const wsRateLimit = new Map<string, { count: number; resetTime: number }>();

wss.on('connection', (ws, req) => {
  const clientId = req.socket.remoteAddress;
  const now = Date.now();
  
  // Проверка rate limit
  const clientLimit = wsRateLimit.get(clientId);
  if (clientLimit) {
    if (now < clientLimit.resetTime) {
      if (clientLimit.count >= 100) { // 100 сообщений в минуту
        ws.close(1008, 'Rate limit exceeded');
        return;
      }
      clientLimit.count++;
    } else {
      wsRateLimit.set(clientId, { count: 1, resetTime: now + 60000 });
    }
  } else {
    wsRateLimit.set(clientId, { count: 1, resetTime: now + 60000 });
  }
  
  // Обработка сообщений
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      // Валидация размера сообщения
      if (message.length > 1024 * 1024) { // 1MB
        ws.close(1009, 'Message too large');
        return;
      }
      
      // Обработка сообщения
      handleWebSocketMessage(ws, data);
    } catch (error) {
      ws.close(1003, 'Invalid message format');
    }
  });
});
```

### 4. Безопасность файловой системы

#### 4.1 Безопасная загрузка файлов

```typescript
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

// Конфигурация multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.env.UPLOAD_DIR, 'temp');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Генерация безопасного имени файла
    const hash = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${hash}${ext}`);
  },
});

// Фильтр файлов
const fileFilter = (req: any, file: Express.Multer.File, cb: Function) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'text/plain',
    'application/json',
  ];
  
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.txt', '.json'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5,
  },
});

// Сканирование файлов на вирусы
const scanFile = async (filePath: string): Promise<boolean> => {
  // Интеграция с антивирусом
  // Возвращает true если файл безопасен
  return true;
};
```

#### 4.2 Безопасное выполнение команд

```typescript
import { spawn } from 'child_process';
import { promisify } from 'util';

// Whitelist разрешенных команд
const allowedCommands = new Set([
  'git', 'npm', 'yarn', 'node', 'python', 'ls', 'cat', 'echo', 'pwd'
]);

// Безопасное выполнение команд
const executeCommand = async (
  command: string,
  args: string[],
  options: { cwd: string; timeout: number }
): Promise<{ stdout: string; stderr: string; code: number }> => {
  // Проверка разрешенных команд
  if (!allowedCommands.has(command)) {
    throw new Error(`Command ${command} is not allowed`);
  }
  
  // Валидация аргументов
  const sanitizedArgs = args.map(arg => 
    arg.replace(/[;&|`$(){}[\]\\]/g, '')
  );
  
  // Проверка рабочей директории
  const cwd = path.resolve(options.cwd);
  if (!cwd.startsWith(process.env.PROJECTS_ROOT)) {
    throw new Error('Invalid working directory');
  }
  
  return new Promise((resolve, reject) => {
    const child = spawn(command, sanitizedArgs, {
      cwd,
      env: { ...process.env, PATH: process.env.PATH },
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    // Таймаут
    const timeout = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error('Command timeout'));
    }, options.timeout);
    
    child.on('close', (code) => {
      clearTimeout(timeout);
      resolve({ stdout, stderr, code: code || 0 });
    });
    
    child.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
};
```

### 5. Мониторинг и логирование

#### 5.1 Безопасное логирование

```typescript
import winston from 'winston';

// Конфигурация логгера
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Middleware для логирования
const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // Логирование подозрительной активности
    if (res.statusCode >= 400) {
      logger.warn('Security event', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration,
        timestamp: new Date().toISOString(),
      });
    }
  });
  
  next();
};

// Логирование аутентификации
const logAuthEvent = (event: string, userId: string, ip: string, success: boolean) => {
  logger.info('Authentication event', {
    event,
    userId,
    ip,
    success,
    timestamp: new Date().toISOString(),
  });
};
```

#### 5.2 Мониторинг безопасности

```typescript
// Детекция атак
const detectAttack = (req: Request): boolean => {
  const suspiciousPatterns = [
    /\.\.\//, // Path traversal
    /<script/i, // XSS
    /union.*select/i, // SQL injection
    /eval\(/i, // Code injection
  ];
  
  const url = req.url;
  const body = JSON.stringify(req.body);
  
  return suspiciousPatterns.some(pattern => 
    pattern.test(url) || pattern.test(body)
  );
};

// Middleware для детекции атак
const attackDetection = (req: Request, res: Response, next: NextFunction) => {
  if (detectAttack(req)) {
    logger.warn('Potential attack detected', {
      ip: req.ip,
      url: req.url,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString(),
    });
    
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  
  next();
};
```

## 📊 Метрики безопасности

### KPI безопасности

- **Количество попыток атак**: 0 в день
- **Время обнаружения инцидентов**: < 5 минут
- **Время реагирования на инциденты**: < 1 час
- **Покрытие тестами безопасности**: > 90%

### Мониторинг

- **Логи аутентификации** - все события входа/выхода
- **API запросы** - подозрительная активность
- **Файловые операции** - доступ к файлам
- **CLI команды** - выполняемые команды

## 🚀 План внедрения

### Этап 1: Базовая безопасность (1 неделя)

1. Настройка HTTPS
2. Усиление аутентификации
3. Внедрение rate limiting

### Этап 2: Валидация и санитизация (1 неделя)

1. Внедрение схем валидации
2. Санитизация входных данных
3. Безопасная загрузка файлов

### Этап 3: Мониторинг (3 дня)

1. Настройка логирования
2. Детекция атак
3. Создание алертов

## 🔗 Связанные документы

- [01-architecture.md](./01-architecture.md) - Архитектурные изменения
- [02-performance.md](./02-performance.md) - Оптимизация производительности
- [07-metrics.md](./07-metrics.md) - Метрики и KPI
