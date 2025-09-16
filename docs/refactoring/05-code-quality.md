# 🧪 Качество кода и тестирование

## 📋 Обзор

Этот документ описывает стратегии улучшения качества кода, внедрения тестирования и обеспечения надежности Claude Code UI.

## 🎯 Текущие проблемы качества

### Качество кода

- **Отсутствие TypeScript** - нет типизации
- **Смешанная ответственность** - логика и UI в одних компонентах
- **Дублирование кода** - повторяющиеся паттерны
- **Отсутствие документации** - нет JSDoc комментариев

### Тестирование

- **Нет unit тестов** - отсутствие тестов компонентов
- **Нет integration тестов** - нет тестов API
- **Нет E2E тестов** - нет тестов пользовательских сценариев
- **Нет тестов производительности** - нет нагрузочного тестирования

### Статический анализ

- **Отсутствие ESLint** - нет проверки стиля кода
- **Отсутствие Prettier** - нет форматирования кода
- **Отсутствие TypeScript** - нет проверки типов
- **Отсутствие SonarQube** - нет анализа качества

## 🚀 Стратегии улучшения

### 1. TypeScript миграция

#### 1.1 Конфигурация TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/services/*": ["src/services/*"],
      "@/types/*": ["src/types/*"],
      "@/utils/*": ["src/utils/*"]
    }
  },
  "include": ["src/**/*", "server/**/*"],
  "exclude": ["node_modules", "dist", "build"]
}
```

#### 1.2 Типы и интерфейсы

```typescript
// types/index.ts
export interface Project {
  id: string;
  name: string;
  path: string;
  displayName?: string;
  fullPath: string;
  sessions: Session[];
  cursorSessions: CursorSession[];
  sessionMeta: SessionMeta;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  title: string;
  provider: AIProvider;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessageAt?: string;
}

export interface CursorSession {
  id: string;
  title: string;
  projectPath: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export interface Message {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export type AIProvider = 'claude' | 'cursor' | 'codegen';

export interface SessionMeta {
  total: number;
  claude: number;
  cursor: number;
  codegen: number;
}

// API типы
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// WebSocket типы
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export interface ChatMessage extends WebSocketMessage {
  type: 'chat.message';
  data: {
    sessionId: string;
    message: Message;
  };
}

export interface ProjectUpdateMessage extends WebSocketMessage {
  type: 'projects.updated';
  data: {
    projects: Project[];
    changeType: 'add' | 'update' | 'delete';
    changedFile?: string;
  };
}
```

#### 1.3 Типизированные хуки

```typescript
// hooks/useProjects.ts
import { useState, useEffect, useCallback } from 'react';
import { Project } from '@/types';
import { projectService } from '@/services/project.service';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(async (projectData: CreateProjectDto): Promise<Project> => {
    try {
      const newProject = await projectService.create(projectData);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
      throw err;
    }
  }, []);

  const deleteProject = useCallback(async (projectId: string): Promise<void> => {
    try {
      await projectService.delete(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    deleteProject,
  };
};

// hooks/useWebSocket.ts
import { useEffect, useRef, useCallback } from 'react';
import { WebSocketMessage } from '@/types';

export const useWebSocket = (url: string) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      ws.current.onclose = () => {
        setIsConnected(false);
      };

      ws.current.onerror = event => {
        setError('WebSocket connection error');
        setIsConnected(false);
      };
    } catch (err) {
      setError('Failed to create WebSocket connection');
    }
  }, [url]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  const disconnect = useCallback(() => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    isConnected,
    error,
    sendMessage,
    connect,
    disconnect,
  };
};
```

### 2. Тестирование

#### 2.1 Настройка тестовой среды

```json
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}',
  ],
};
```

```typescript
// src/setupTests.ts
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-testid' });

// Mock WebSocket
global.WebSocket = class WebSocket {
  constructor() {}
  close() {}
  send() {}
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};
```

#### 2.2 Unit тесты компонентов

```typescript
// components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('applies correct variant classes', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByText('Click me')).toHaveClass('bg-primary-500');
  });
});
```

```typescript
// components/__tests__/ProjectList.test.tsx
import { render, screen } from '@testing-library/react';
import { ProjectList } from '../ProjectList';
import { Project } from '@/types';

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'test-project',
    path: '/test',
    fullPath: '/test',
    sessions: [],
    cursorSessions: [],
    sessionMeta: { total: 0, claude: 0, cursor: 0, codegen: 0 },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'another-project',
    path: '/another',
    fullPath: '/another',
    sessions: [],
    cursorSessions: [],
    sessionMeta: { total: 0, claude: 0, cursor: 0, codegen: 0 },
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
];

describe('ProjectList', () => {
  it('renders list of projects', () => {
    render(<ProjectList projects={mockProjects} />);

    expect(screen.getByText('test-project')).toBeInTheDocument();
    expect(screen.getByText('another-project')).toBeInTheDocument();
  });

  it('shows empty state when no projects', () => {
    render(<ProjectList projects={[]} />);
    expect(screen.getByText('No projects found')).toBeInTheDocument();
  });

  it('calls onProjectSelect when project is clicked', () => {
    const handleSelect = jest.fn();
    render(<ProjectList projects={mockProjects} onProjectSelect={handleSelect} />);

    fireEvent.click(screen.getByText('test-project'));
    expect(handleSelect).toHaveBeenCalledWith(mockProjects[0]);
  });
});
```

#### 2.3 Тесты хуков

```typescript
// hooks/__tests__/useProjects.test.ts
import { renderHook, act } from '@testing-library/react';
import { useProjects } from '../useProjects';
import { projectService } from '@/services/project.service';

jest.mock('@/services/project.service');

describe('useProjects', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches projects on mount', async () => {
    const mockProjects = [
      {
        id: '1',
        name: 'test',
        path: '/test',
        fullPath: '/test',
        sessions: [],
        cursorSessions: [],
        sessionMeta: { total: 0, claude: 0, cursor: 0, codegen: 0 },
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      },
    ];

    (projectService.getAll as jest.Mock).mockResolvedValue(mockProjects);

    const { result } = renderHook(() => useProjects());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.projects).toEqual(mockProjects);
    expect(projectService.getAll).toHaveBeenCalledTimes(1);
  });

  it('handles fetch error', async () => {
    const errorMessage = 'Failed to fetch projects';
    (projectService.getAll as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useProjects());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.projects).toEqual([]);
  });

  it('creates new project', async () => {
    const newProject = { name: 'new-project', path: '/new' };
    const createdProject = {
      id: '1',
      ...newProject,
      fullPath: '/new',
      sessions: [],
      cursorSessions: [],
      sessionMeta: { total: 0, claude: 0, cursor: 0, codegen: 0 },
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    };

    (projectService.getAll as jest.Mock).mockResolvedValue([]);
    (projectService.create as jest.Mock).mockResolvedValue(createdProject);

    const { result } = renderHook(() => useProjects());

    await act(async () => {
      await result.current.createProject(newProject);
    });

    expect(result.current.projects).toContain(createdProject);
    expect(projectService.create).toHaveBeenCalledWith(newProject);
  });
});
```

#### 2.4 Integration тесты

```typescript
// __tests__/integration/project-flow.test.ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { App } from '@/App';

const server = setupServer(
  rest.get('/api/projects', (req, res, ctx) => {
    return res(ctx.json([
      {
        id: '1',
        name: 'test-project',
        path: '/test',
        fullPath: '/test',
        sessions: [],
        cursorSessions: [],
        sessionMeta: { total: 0, claude: 0, cursor: 0, codegen: 0 },
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      }
    ]));
  }),

  rest.post('/api/projects', (req, res, ctx) => {
    return res(ctx.json({
      id: '2',
      name: 'new-project',
      path: '/new',
      fullPath: '/new',
      sessions: [],
      cursorSessions: [],
      sessionMeta: { total: 0, claude: 0, cursor: 0, codegen: 0 },
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Project Flow Integration', () => {
  it('allows user to create and view projects', async () => {
    render(<App />);

    // Wait for projects to load
    await waitFor(() => {
      expect(screen.getByText('test-project')).toBeInTheDocument();
    });

    // Click create project button
    fireEvent.click(screen.getByText('New Project'));

    // Fill form
    fireEvent.change(screen.getByLabelText('Project Name'), {
      target: { value: 'new-project' }
    });
    fireEvent.change(screen.getByLabelText('Project Path'), {
      target: { value: '/new' }
    });

    // Submit form
    fireEvent.click(screen.getByText('Create'));

    // Verify new project appears
    await waitFor(() => {
      expect(screen.getByText('new-project')).toBeInTheDocument();
    });
  });
});
```

#### 2.5 E2E тесты

```typescript
// cypress/e2e/project-management.cy.ts
describe('Project Management', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.login('testuser', 'password');
  });

  it('should create a new project', () => {
    cy.get('[data-testid="new-project-btn"]').click();
    cy.get('[data-testid="project-name-input"]').type('Test Project');
    cy.get('[data-testid="project-path-input"]').type('/test/path');
    cy.get('[data-testid="create-project-btn"]').click();

    cy.get('[data-testid="project-list"]').should('contain', 'Test Project');
  });

  it('should delete a project', () => {
    cy.get('[data-testid="project-item"]')
      .first()
      .within(() => {
        cy.get('[data-testid="delete-project-btn"]').click();
      });

    cy.get('[data-testid="confirm-delete-btn"]').click();
    cy.get('[data-testid="project-list"]').should('not.contain', 'Test Project');
  });

  it('should start a new chat session', () => {
    cy.get('[data-testid="project-item"]').first().click();
    cy.get('[data-testid="new-session-btn"]').click();
    cy.get('[data-testid="chat-input"]').type('Hello, Claude!');
    cy.get('[data-testid="send-message-btn"]').click();

    cy.get('[data-testid="chat-messages"]').should('contain', 'Hello, Claude!');
  });
});
```

### 3. Статический анализ

#### 3.1 ESLint конфигурация

```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    },
    "project": "./tsconfig.json"
  },
  "plugins": ["@typescript-eslint", "react", "react-hooks", "jsx-a11y", "import"],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always"
      }
    ],
    "jsx-a11y/anchor-is-valid": "off"
  },
  "settings": {
    "react": {
      "version": "detect"
    },
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true
      }
    }
  }
}
```

#### 3.2 Prettier конфигурация

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

#### 3.3 Husky и lint-staged

```json
// package.json
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write src/**/*.{ts,tsx,json,css,md}",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run type-check && npm run test"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"]
  }
}
```

### 4. Документация

#### 4.1 JSDoc комментарии

````typescript
/**
 * Represents a project in the Claude Code UI system
 * @interface Project
 */
export interface Project {
  /** Unique identifier for the project */
  id: string;

  /** Display name of the project */
  name: string;

  /** File system path to the project */
  path: string;

  /** Optional custom display name */
  displayName?: string;

  /** Full absolute path to the project */
  fullPath: string;

  /** List of Claude sessions in this project */
  sessions: Session[];

  /** List of Cursor sessions in this project */
  cursorSessions: CursorSession[];

  /** Metadata about sessions */
  sessionMeta: SessionMeta;

  /** ISO timestamp when project was created */
  createdAt: string;

  /** ISO timestamp when project was last updated */
  updatedAt: string;
}

/**
 * Custom hook for managing projects
 * @returns Object containing projects state and methods
 * @example
 * ```tsx
 * const { projects, loading, createProject } = useProjects();
 *
 * if (loading) return <LoadingSpinner />;
 *
 * return (
 *   <div>
 *     {projects.map(project => (
 *       <ProjectCard key={project.id} project={project} />
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useProjects = () => {
  // Implementation
};
````

#### 4.2 Storybook

```typescript
// stories/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    loading: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    loading: true,
    children: 'Button',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Button',
  },
};
```

### 5. CI/CD Pipeline

#### 5.1 GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Format check
        run: npm run format:check

      - name: Unit tests
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

      - name: E2E tests
        run: npm run test:e2e
        env:
          CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}

      - name: Build
        run: npm run build

      - name: Deploy to staging
        if: github.ref == 'refs/heads/develop'
        run: npm run deploy:staging

      - name: Deploy to production
        if: github.ref == 'refs/heads/main'
        run: npm run deploy:production
```

## 📊 Метрики качества

### KPI качества кода

- **TypeScript coverage**: 100%
- **Test coverage**: > 80%
- **ESLint errors**: 0
- **Code duplication**: < 5%
- **Cyclomatic complexity**: < 10

### Метрики тестирования

- **Unit test coverage**: > 80%
- **Integration test coverage**: > 70%
- **E2E test coverage**: > 60%
- **Test execution time**: < 5 минут

## 🚀 План внедрения

### Этап 1: TypeScript миграция (1 неделя)

1. Настройка TypeScript
2. Миграция основных типов
3. Типизация компонентов

### Этап 2: Тестирование (2 недели)

1. Настройка Jest и Testing Library
2. Unit тесты компонентов
3. Integration тесты

### Этап 3: Статический анализ (3 дня)

1. Настройка ESLint и Prettier
2. Настройка Husky
3. Автоматизация проверок

### Этап 4: Документация (3 дня)

1. JSDoc комментарии
2. Настройка Storybook
3. README обновления

### Этап 5: CI/CD (2 дня)

1. Настройка GitHub Actions
2. Автоматизация деплоя
3. Мониторинг качества

## 🔗 Связанные документы

- [01-architecture.md](./01-architecture.md) - Архитектурные изменения
- [02-performance.md](./02-performance.md) - Оптимизация производительности
- [06-implementation.md](./06-implementation.md) - План внедрения
