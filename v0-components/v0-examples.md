# 🎨 v0 Examples - Создание компонентов Claude Code UI

Практические примеры создания компонентов через v0.dev с готовыми промптами и результатами.

## 🚀 Как использовать v0

### 1. **Откройте v0.dev**
```
https://v0.dev
```

### 2. **Скопируйте промпт**
Выберите нужный промпт из папки и скопируйте полное содержимое

### 3. **Создайте компонент**
Вставьте промпт в v0 и получите готовый React компонент

### 4. **Экспортируйте код**
Скачайте TypeScript/React код для интеграции в проект

## 📋 Пошаговые примеры

### **Пример 1: Dashboard Component**

#### Шаг 1: Промпт для v0
```
Скопируйте содержимое dashboard-prompt.md полностью
```

#### Шаг 2: Ожидаемый результат
v0 создаст компонент с:
- ✅ Responsive layout (1440x900px)
- ✅ Sidebar с навигацией
- ✅ Header с поиском
- ✅ Stats grid (4 карточки)
- ✅ Quick actions (2x2)
- ✅ Recent activity список
- ✅ Hover эффекты
- ✅ TypeScript интерфейсы

#### Шаг 3: Кастомизация
```typescript
// Адаптируйте под ваши данные
interface DashboardProps {
  user: User
  stats: DashboardStats
  activities: Activity[]
  onActionClick: (action: string) => void
}
```

### **Пример 2: Chat Interface**

#### Шаг 1: Промпт для v0
```
Скопируйте содержимое chat-prompt.md полностью
```

#### Шаг 2: Ожидаемый результат
v0 создаст компонент с:
- ✅ Chat header с session info
- ✅ Message bubbles (user/assistant)
- ✅ Code blocks с syntax highlighting
- ✅ File attachments
- ✅ Typing indicator анимация
- ✅ Auto-resize textarea
- ✅ Copy code функциональность
- ✅ Keyboard shortcuts

#### Шаг 3: Интеграция с WebSocket
```typescript
// Добавьте real-time функциональность
const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080')
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      setMessages(prev => [...prev, message])
    }
    return () => ws.close()
  }, [])
  
  // ... rest of component
}
```

### **Пример 3: Mobile App**

#### Шаг 1: Промпт для v0
```
Скопируйте содержимое mobile-prompt.md полностью
```

#### Шаг 2: Ожидаемый результат
v0 создаст компонент с:
- ✅ Mobile header (56px)
- ✅ Bottom navigation (5 tabs)
- ✅ Tab content switching
- ✅ Pull-to-refresh
- ✅ Floating Action Button
- ✅ Touch-optimized sizes
- ✅ Safe area support

#### Шаг 3: Добавление touch gestures
```typescript
// Добавьте swipe navigation
import { useSwipeable } from 'react-swipeable'

const MobileApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  
  const handlers = useSwipeable({
    onSwipedLeft: () => nextTab(),
    onSwipedRight: () => prevTab(),
    trackMouse: true
  })
  
  return (
    <div {...handlers} className="mobile-app">
      {/* content */}
    </div>
  )
}
```

## 🎨 Компонентная библиотека

### **Создание базовых компонентов**

#### Button Component
```typescript
// v0 создаст что-то похожее на:
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  children,
  onClick
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200'
  
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-100',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-100',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-100',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-100'
  }
  
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg'
  }
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <Spinner className="mr-2" />}
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  )
}
```

#### Card Component
```typescript
// v0 создаст адаптивную карточку:
interface CardProps {
  variant: 'default' | 'elevated' | 'interactive'
  padding?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  onClick
}) => {
  const baseClasses = 'bg-white rounded-lg transition-all duration-200'
  
  const variantClasses = {
    default: 'border border-gray-200',
    elevated: 'shadow-md',
    interactive: 'border border-gray-200 hover:shadow-lg hover:border-blue-200 cursor-pointer'
  }
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
```

## 🔧 Интеграция в проект

### **1. Установка зависимостей**
```bash
npm install react react-dom typescript
npm install -D @types/react @types/react-dom
npm install tailwindcss @tailwindcss/forms
npm install lucide-react # для иконок
npm install react-window # для виртуализации
```

### **2. Настройка Tailwind**
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          500: '#3B82F6',
          600: '#2563EB'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace']
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
```

### **3. Структура проекта**
```
src/
├── components/
│   ├── ui/           # Базовые компоненты из v0
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Avatar.tsx
│   ├── layout/       # Layout компоненты
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Container.tsx
│   └── features/     # Feature компоненты
│       ├── Dashboard.tsx
│       ├── ChatInterface.tsx
│       └── MobileApp.tsx
├── hooks/            # Custom hooks
├── utils/            # Utilities
└── types/            # TypeScript types
```

### **4. Пример интеграции**
```typescript
// App.tsx
import { Dashboard } from './components/features/Dashboard'
import { ChatInterface } from './components/features/ChatInterface'
import { MobileApp } from './components/features/MobileApp'

const App = () => {
  const [view, setView] = useState<'desktop' | 'mobile'>('desktop')
  
  return (
    <div className="min-h-screen bg-gray-50">
      {view === 'desktop' ? (
        <div className="flex">
          <Dashboard />
          <ChatInterface />
        </div>
      ) : (
        <MobileApp />
      )}
    </div>
  )
}
```

## 🎯 Советы по работе с v0

### **1. Детализированные промпты**
- Указывайте точные размеры и цвета
- Описывайте все состояния компонентов
- Включайте примеры данных

### **2. Итеративная разработка**
- Начинайте с простых компонентов
- Постепенно добавляйте сложность
- Тестируйте каждый компонент отдельно

### **3. Кастомизация результатов**
- Адаптируйте под ваш дизайн
- Добавляйте бизнес-логику
- Интегрируйте с API

### **4. Оптимизация**
- Используйте React.memo для производительности
- Добавляйте lazy loading
- Оптимизируйте bundle size

**Готовые промпты и примеры для создания современного UI через v0! 🚀**

