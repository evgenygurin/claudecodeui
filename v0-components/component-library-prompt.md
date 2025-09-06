# Claude Code UI Component Library - v0 Prompt

Create a comprehensive component library for Claude Code UI with the following design system and components:

## Design System Foundation

### Color Palette
```typescript
const colors = {
  // Primary Colors
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE', 
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // Main primary
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A'
  },
  
  // Semantic Colors
  success: {
    50: '#ECFDF5',
    500: '#10B981',
    700: '#047857'
  },
  warning: {
    50: '#FFFBEB', 
    500: '#F59E0B',
    700: '#B45309'
  },
  error: {
    50: '#FEF2F2',
    500: '#EF4444', 
    700: '#B91C1C'
  },
  
  // Neutral Colors
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  }
}
```

### Typography Scale
```typescript
const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Consolas', 'monospace']
  },
  fontSize: {
    xs: '11px',    // Small labels
    sm: '12px',    // Captions
    base: '14px',  // Body text
    lg: '16px',    // Large body
    xl: '18px',    // H6
    '2xl': '20px', // H5
    '3xl': '24px', // H4
    '4xl': '32px'  // H3
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
}
```

### Spacing System (4px base unit)
```typescript
const spacing = {
  1: '4px',   // 0.25rem
  2: '8px',   // 0.5rem  
  3: '12px',  // 0.75rem
  4: '16px',  // 1rem
  5: '20px',  // 1.25rem
  6: '24px',  // 1.5rem
  8: '32px',  // 2rem
  10: '40px', // 2.5rem
  12: '48px', // 3rem
  16: '64px', // 4rem
  20: '80px', // 5rem
  24: '96px'  // 6rem
}
```

## Core Components

### 1. Button Component (4 variants)
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
}
```

**Variants:**
- **Primary**: bg-primary-500, text-white, hover:bg-primary-600
- **Secondary**: bg-gray-100, text-gray-900, hover:bg-gray-200  
- **Outline**: border-gray-300, text-gray-700, hover:bg-gray-50
- **Ghost**: text-gray-700, hover:bg-gray-100

**Sizes:**
- **sm**: h-8, px-3, text-sm
- **md**: h-10, px-4, text-base  
- **lg**: h-12, px-6, text-lg

### 2. Input Component (5 states)
```typescript
interface InputProps {
  state: 'default' | 'focus' | 'error' | 'success' | 'disabled'
  placeholder?: string
  label?: string
  helperText?: string
  icon?: React.ReactNode
  value?: string
  onChange?: (value: string) => void
}
```

**States:**
- **Default**: border-gray-300, focus:border-primary-500
- **Focus**: border-primary-500, ring-primary-100
- **Error**: border-error-500, ring-error-100
- **Success**: border-success-500, ring-success-100
- **Disabled**: bg-gray-50, text-gray-400, cursor-not-allowed

### 3. Card Component (3 variants)
```typescript
interface CardProps {
  variant: 'default' | 'elevated' | 'interactive'
  padding?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
}
```

**Variants:**
- **Default**: bg-white, border-gray-200, rounded-lg
- **Elevated**: bg-white, shadow-md, rounded-xl
- **Interactive**: hover:shadow-lg, hover:border-primary-200, cursor-pointer

### 4. Avatar Component
```typescript
interface AvatarProps {
  size: 'sm' | 'md' | 'lg' | 'xl'
  src?: string
  alt?: string
  fallback?: string
  status?: 'online' | 'offline' | 'away'
}
```

**Sizes:**
- **sm**: 24x24px
- **md**: 32x32px  
- **lg**: 40x40px
- **xl**: 48x48px

### 5. Badge Component
```typescript
interface BadgeProps {
  variant: 'primary' | 'success' | 'warning' | 'error' | 'gray'
  size: 'sm' | 'md'
  children: React.ReactNode
}
```

### 6. Navigation Components

#### Sidebar Navigation
```typescript
interface SidebarProps {
  sections: NavigationSection[]
  activeItem?: string
  onItemClick?: (id: string) => void
}

interface NavigationSection {
  title: string
  items: NavigationItem[]
}

interface NavigationItem {
  id: string
  label: string
  icon: React.ReactNode
  href?: string
  active?: boolean
}
```

#### Bottom Navigation (Mobile)
```typescript
interface BottomNavProps {
  tabs: BottomNavTab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

interface BottomNavTab {
  id: string
  label: string
  icon: React.ReactNode
  badge?: number
}
```

### 7. Message Components

#### Message Bubble
```typescript
interface MessageBubbleProps {
  type: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: Date
  avatar?: string
  attachments?: Attachment[]
}
```

#### Code Block
```typescript
interface CodeBlockProps {
  language: string
  code: string
  showLineNumbers?: boolean
  copyable?: boolean
  theme?: 'dark' | 'light'
}
```

### 8. Layout Components

#### Header
```typescript
interface HeaderProps {
  logo?: React.ReactNode
  searchPlaceholder?: string
  userMenu?: React.ReactNode
  actions?: React.ReactNode[]
}
```

#### Container
```typescript
interface ContainerProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: boolean
  children: React.ReactNode
}
```

## Interactive States & Animations

### Hover Effects
- **Cards**: transform: translateY(-2px), shadow increase
- **Buttons**: background color transition (200ms ease)
- **Navigation**: background color fade-in

### Focus States
- **Inputs**: 2px primary border, 3px primary-100 ring
- **Buttons**: 2px offset outline
- **Navigation**: visible focus indicator

### Loading States
- **Buttons**: spinner icon, disabled state
- **Cards**: skeleton loading animation
- **Lists**: shimmer effect

## Usage Examples

### Dashboard Stats Card
```jsx
<Card variant="elevated" padding="md">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold">Активные сессии</h3>
    <div className="w-6 h-6 bg-primary-500 rounded flex items-center justify-center">
      💬
    </div>
  </div>
  <div className="text-3xl font-bold mb-2">12</div>
  <div className="text-sm text-success-700">↗ +3 за сегодня</div>
</Card>
```

### Chat Message
```jsx
<MessageBubble
  type="assistant"
  content="Отличная идея! Давайте разобьем ChatInterface.jsx на логические компоненты."
  timestamp={new Date()}
  avatar="🤖"
/>
```

### Mobile Navigation
```jsx
<BottomNav
  activeTab="dashboard"
  tabs={[
    { id: 'dashboard', label: 'Главная', icon: '📊' },
    { id: 'chat', label: 'Чаты', icon: '💬' },
    { id: 'files', label: 'Файлы', icon: '📁' },
    { id: 'terminal', label: 'Терминал', icon: '⚡' },
    { id: 'settings', label: 'Настройки', icon: '⚙️' }
  ]}
  onTabChange={(tab) => setActiveTab(tab)}
/>
```

Create a comprehensive, type-safe component library with proper accessibility, responsive design, and smooth animations. Each component should be self-contained and reusable across the application.

