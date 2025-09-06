# 🚀 Claude Code UI - v0 Component Prompts

Детальные промпты для создания React компонентов Claude Code UI через v0 с полной дизайн-системой и интерактивностью.

## 📋 Структура промптов

### 🎨 **Компонентная библиотека**
- **[component-library-prompt.md](./component-library-prompt.md)** - Полная дизайн-система и базовые компоненты

### 🖥️ **Desktop компоненты**
- **[dashboard-prompt.md](./dashboard-prompt.md)** - Dashboard с sidebar и статистикой (1440x900px)
- **[chat-prompt.md](./chat-prompt.md)** - Chat interface с блоками кода и файлами

### 📱 **Mobile компоненты**
- **[mobile-prompt.md](./mobile-prompt.md)** - Mobile app с bottom navigation (375x812px)

## 🎯 Как использовать с v0

### 1. **Начните с компонентной библиотеки**
```bash
# Скопируйте содержимое component-library-prompt.md
# Вставьте в v0.dev для создания базовых компонентов
```

### 2. **Создайте основные экраны**
```bash
# Используйте dashboard-prompt.md для главной страницы
# Используйте chat-prompt.md для чата
# Используйте mobile-prompt.md для мобильной версии
```

### 3. **Кастомизируйте под проект**
- Адаптируйте цвета и брендинг
- Добавьте специфичную функциональность
- Интегрируйте с вашим API

## 🎨 Дизайн-система

### **Цветовая палитра**
```css
Primary: #3B82F6 (blue-500)
Success: #10B981 (emerald-500)  
Warning: #F59E0B (amber-500)
Error: #EF4444 (red-500)
Gray: 50-900 scale
```

### **Типографика**
```css
Font Family: Inter (UI), JetBrains Mono (Code)
Sizes: 11px-32px scale
Weights: 400, 500, 600, 700
```

### **Spacing System**
```css
Base Unit: 4px
Scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px
```

## 🧩 Компоненты

### **Базовые компоненты**
- **Button** (4 варианта: Primary, Secondary, Outline, Ghost)
- **Input** (5 состояний: Default, Focus, Error, Success, Disabled)
- **Card** (3 варианта: Default, Elevated, Interactive)
- **Avatar** (4 размера: sm, md, lg, xl)
- **Badge** (5 цветов, 2 размера)

### **Навигационные компоненты**
- **Sidebar** - Desktop навигация с иконками
- **Bottom Navigation** - Mobile табы (5 вкладок)
- **Header** - Поиск + user menu

### **Чат компоненты**
- **Message Bubble** - User/Assistant сообщения
- **Code Block** - Подсветка синтаксиса + копирование
- **File Attachment** - Карточки файлов
- **Typing Indicator** - Анимированные точки

### **Layout компоненты**
- **Container** - Responsive контейнеры
- **Grid** - Статистические карточки
- **Stack** - Вертикальные списки

## ⚡ Интерактивность

### **Анимации**
- Hover эффекты (transform, shadow, color)
- Focus состояния (ring, border)
- Loading состояния (spinner, skeleton)
- Smooth transitions (200ms ease)

### **Touch взаимодействия**
- Pull-to-refresh механика
- Swipe gestures
- Touch feedback
- Minimum 44px touch targets

### **Keyboard поддержка**
- Tab navigation
- Enter/Escape handling
- Arrow key navigation
- Focus management

## 📱 Responsive дизайн

### **Breakpoints**
```css
Mobile: 375px (base)
Tablet: 768px
Desktop: 1024px
Large: 1440px
```

### **Mobile-first подход**
- Touch-оптимизированные размеры
- Collapsed navigation
- Stacked layouts
- Safe area support

## 🔧 Технические требования

### **React + TypeScript**
- Functional components с hooks
- Proper TypeScript interfaces
- Props validation
- Error boundaries

### **Styling**
- Tailwind CSS классы
- CSS custom properties для цветов
- Responsive utilities
- Dark mode support (опционально)

### **Accessibility**
- ARIA labels и roles
- Keyboard navigation
- Screen reader support
- Color contrast compliance

### **Performance**
- Virtual scrolling для списков
- Lazy loading компонентов
- Optimized re-renders
- Bundle size optimization

## 🚀 Примеры использования

### **Dashboard Stats Card**
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

### **Chat Message с кодом**
```jsx
<MessageBubble
  type="assistant"
  content="Вот пример компонента:"
  timestamp={new Date()}
  avatar="🤖"
>
  <CodeBlock
    language="javascript"
    code={`const Button = ({ variant, children }) => {
  return (
    <button className={\`btn btn-\${variant}\`}>
      {children}
    </button>
  )
}`}
    copyable={true}
  />
</MessageBubble>
```

### **Mobile Navigation**
```jsx
<BottomNav
  activeTab="dashboard"
  tabs={[
    { id: 'dashboard', label: 'Главная', icon: '📊' },
    { id: 'chat', label: 'Чаты', icon: '💬', badge: 3 },
    { id: 'files', label: 'Файлы', icon: '📁' },
    { id: 'terminal', label: 'Терминал', icon: '⚡' },
    { id: 'settings', label: 'Настройки', icon: '⚙️' }
  ]}
  onTabChange={setActiveTab}
/>
```

## 🎯 Следующие шаги

1. **Создайте компоненты в v0** используя промпты
2. **Экспортируйте код** из v0 в ваш проект
3. **Настройте TypeScript** интерфейсы
4. **Добавьте состояние** с React hooks
5. **Интегрируйте с API** для реальных данных
6. **Тестируйте** на разных устройствах
7. **Оптимизируйте** производительность

**Готовые промпты для создания современного UI в v0! 🎉**

