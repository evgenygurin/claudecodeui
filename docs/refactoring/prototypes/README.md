# 🎨 Claude Code UI - Figma Prototypes

Интерактивные HTML/CSS прототипы, созданные на основе детального [Figma Implementation Guide](../figma-implementation-guide.md). Полностью соответствуют дизайн-системе с цветовой палитрой, типографикой и компонентами.

## 🚀 Быстрый доступ

**[📋 Главная страница прототипов](./index.html)** - Навигация по всем макетам

### 🖥️ Desktop Prototypes
- **[Dashboard](./dashboard.html)** - Главная страница (1440x900px)
- **[Chat Interface](./chat.html)** - Интерфейс чата с блоками кода

### 📱 Mobile Prototypes  
- **[Mobile App](./mobile.html)** - Мобильное приложение (375x812px)

## 🎯 Особенности прототипов

### ✨ **Полная дизайн-система**
- **Цветовая палитра**: Primary (#3B82F6), Success (#10B981), Warning (#F59E0B), Error (#EF4444)
- **Типографика**: Inter для UI, JetBrains Mono для кода
- **Spacing**: 4px базовая единица, консистентная система отступов
- **Компоненты**: Кнопки, карточки, формы с hover состояниями

### 🖥️ **Desktop Dashboard**
```
Размер: 1440x900px
Компоненты:
├── Header (64px) - Logo + Search + User Menu
├── Sidebar (280px) - Navigation с иконками
└── Main Content
    ├── Welcome Section - Приветственная карточка
    ├── Stats Grid (3 колонки) - Статистические карточки
    ├── Quick Actions (2x2) - Быстрые действия
    └── Recent Activity - Лента активности
```

**Интерактивные элементы:**
- ✅ Hover эффекты на всех кнопках и карточках
- ✅ Активные состояния навигации
- ✅ Responsive поведение
- ✅ Поиск с focus состояниями

### 💬 **Chat Interface**
```
Структура:
├── Chat Header (64px) - Информация о сессии + контролы
├── Messages Area - Виртуализированный список сообщений
└── Message Input (auto-height) - Поле ввода с действиями
```

**Типы сообщений:**
- 👤 **User Messages**: Синие пузырьки справа (max-width: 70%)
- 🤖 **Assistant Messages**: Белые пузырьки слева (max-width: 80%)
- 💻 **Code Blocks**: Темная тема с подсветкой синтаксиса
- 📎 **File Attachments**: Карточки с иконками и метаданными
- ⌨️ **Typing Indicator**: Анимированные точки

**Интерактивность:**
- ✅ Auto-resize textarea (56px - 120px)
- ✅ Enter для отправки, Shift+Enter для новой строки
- ✅ Копирование кода одним кликом
- ✅ Анимация индикатора печати

### 📱 **Mobile App**
```
Размер: 375x812px (iPhone 13)
Архитектура:
├── Mobile Header (56px) - Hamburger + Title + Actions
├── Tab Content - 5 вкладок с контентом
├── Floating Action Button (56px) - Быстрые действия
└── Bottom Navigation (64px + Safe Area) - 5 вкладок
```

**Вкладки:**
1. **📊 Dashboard** - Статистика + быстрые действия
2. **💬 Chat** - Список активных чатов
3. **📁 Files** - Файловый менеджер
4. **⚡ Terminal** - Мобильный терминал
5. **⚙️ Settings** - Настройки приложения

**Touch-оптимизация:**
- ✅ Pull-to-refresh механика
- ✅ Swipe gestures (планируется)
- ✅ Touch-friendly размеры (min 44px)
- ✅ Safe Area support для iOS
- ✅ Bottom navigation с активными состояниями

## 🛠️ Технические детали

### **CSS Custom Properties**
```css
:root {
  /* Colors */
  --primary-500: #3B82F6;
  --success-500: #10B981;
  --warning-500: #F59E0B;
  --error-500: #EF4444;
  
  /* Spacing */
  --space-1: 4px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  
  /* Shadows */
  --shadow-small: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-medium: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-large: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

### **Responsive Breakpoints**
```css
/* Mobile First */
@media (max-width: 768px) { /* Mobile */ }
@media (min-width: 769px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Large Desktop */ }
```

### **JavaScript Функциональность**
- **Auto-resize textarea** - Автоматическое изменение высоты
- **Tab navigation** - Переключение вкладок в мобильной версии
- **Pull-to-refresh** - Touch события для обновления
- **Copy to clipboard** - Копирование кода и ссылок
- **Keyboard shortcuts** - Enter/Shift+Enter в чате

## 📋 Соответствие Figma Guide

Прототипы полностью соответствуют спецификациям из [figma-implementation-guide.md](../figma-implementation-guide.md):

### ✅ **Design System (Страница 1)**
- [x] Полная цветовая палитра (Primary, Semantic, Neutral)
- [x] Типографическая система (Inter + JetBrains Mono)
- [x] Spacing system (4px базовая единица)
- [x] Border radius, shadows, компоненты

### ✅ **Desktop Screens (Страница 2)**
- [x] Dashboard Screen (1440x900px)
- [x] Chat Interface Screen (полноэкранный)
- [x] Все компоненты и их состояния

### ✅ **Mobile Screens (Страница 3)**
- [x] Mobile App (375x812px)
- [x] Bottom navigation, touch-оптимизация
- [x] Safe area support

### ✅ **Interactive Prototypes (Страница 5)**
- [x] Desktop interactions (hover, active states)
- [x] Mobile touch interactions (pull-to-refresh, FAB)
- [x] Keyboard handling, animations

## 🚀 Использование

### **Локальный просмотр**
```bash
# Откройте любой HTML файл в браузере
open docs/refactoring/prototypes/index.html

# Или запустите локальный сервер
cd docs/refactoring/prototypes
python -m http.server 8000
# Откройте http://localhost:8000
```

### **Для разработчиков**
1. **Изучите дизайн-систему** в CSS custom properties
2. **Скопируйте компоненты** для использования в React
3. **Адаптируйте стили** под ваш build процесс
4. **Используйте как референс** при создании реальных компонентов

### **Для дизайнеров**
1. **Сравните с Figma** макетами
2. **Проверьте интерактивность** всех элементов
3. **Тестируйте на разных устройствах**
4. **Предложите улучшения** через GitHub Issues

## 🔗 Связанные документы

- **[Figma Implementation Guide](../figma-implementation-guide.md)** - Детальное руководство по созданию дизайнов
- **[Architecture Analysis](../architecture.md)** - Анализ текущей архитектуры
- **[Components Analysis](../components.md)** - Анализ компонентов с размерами
- **[Desktop Wireframes](../wireframes/desktop-wireframes.md)** - Wireframes для desktop
- **[Mobile Wireframes](../wireframes/mobile-wireframes.md)** - Wireframes для mobile

## 🎯 Следующие шаги

1. **✅ Прототипы созданы** - HTML/CSS версии готовы
2. **🎨 Создание в Figma** - Перенос в реальный Figma файл
3. **⚛️ React компоненты** - Создание реальных компонентов
4. **🧪 Тестирование** - Проверка на разных устройствах
5. **🚀 Внедрение** - Интеграция в основное приложение

**Готовые интерактивные прототипы для команды разработки! 🎉**

