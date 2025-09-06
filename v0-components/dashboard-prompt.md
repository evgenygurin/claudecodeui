# Claude Code UI Dashboard Component - v0 Prompt

Create a modern, responsive dashboard component for Claude Code UI with the following specifications:

## Design System
- **Primary Color**: #3B82F6 (blue-500)
- **Success**: #10B981 (emerald-500) 
- **Warning**: #F59E0B (amber-500)
- **Error**: #EF4444 (red-500)
- **Typography**: Inter font family
- **Spacing**: 4px base unit (space-1 = 4px, space-4 = 16px, space-6 = 24px, space-8 = 32px)

## Layout Structure (1440x900px)
```
├── Header (64px height)
│   ├── Logo: "Claude Code UI" 
│   ├── Search bar (400px width)
│   └── User menu (32px avatar)
├── Sidebar (280px width)
│   ├── Navigation sections with icons
│   └── CLI tools section
└── Main Content (padding: 32px)
    ├── Welcome Section (elevated card)
    ├── Stats Grid (3 columns, 24px gap)
    ├── Quick Actions (2x2 grid)
    └── Recent Activity (list with avatars)
```

## Components Needed

### Header
- Fixed position, white background, border-bottom
- Logo with primary blue color (#3B82F6)
- Search input with focus states (border: 2px primary, shadow: primary-100)
- User avatar (32px, rounded-full, primary background)

### Sidebar  
- Gray-50 background, 280px width
- Navigation items with hover states (gray-100 hover, primary-100 active)
- Icons: 📊 Dashboard, 💬 Chat, 📁 Files, ⚡ Terminal, 🎯 Tasks, 📈 Analytics, ⚙️ Settings
- CLI section: 🤖 Claude, ✨ Cursor, 🚀 Codegen

### Welcome Section
- Elevated card with medium shadow
- Title: "Добро пожаловать! 👋"
- Subtitle: "Управляйте своими AI-проектами с Claude, Cursor и Codegen в одном месте"

### Stats Cards (4 cards in grid)
1. **Активные сессии**: 12, trend: "↗ +3 за сегодня" (success color)
2. **Проекты**: 8, trend: "↗ +1 на этой неделе" (success color)  
3. **Токены использовано**: 45.2K, trend: "↘ -12% за месяц" (error color)
4. **Файлов изменено**: 127, trend: "↗ +23 за неделю" (success color)

Each card: white background, border, 12px radius, small shadow, hover effects

### Quick Actions (2x2 grid)
- "➕ Новый проект" (primary button)
- "💬 Начать чат" (secondary button)  
- "⚡ Открыть терминал" (secondary button)
- "📁 Обзор файлов" (secondary button)

### Recent Activity
- List of activity items with 32px avatars
- Sample activities:
  - "ЕГ" avatar: "Создал новую сессию в проекте 'Claude Code UI'" (2 минуты назад)
  - "🤖" avatar: "Claude завершил рефакторинг компонента ChatInterface" (15 минут назад)
  - "ЕГ" avatar: "Изменил 5 файлов в проекте 'Mobile App'" (1 час назад)

## Interactive Features
- Hover effects on all cards and buttons
- Active states for navigation
- Responsive behavior (mobile-first)
- Search input focus states

## Styling Requirements
- Use Tailwind CSS classes
- Implement proper hover and focus states
- Ensure accessibility (proper contrast, focus indicators)
- Mobile responsive (sidebar collapses on mobile)

Create a modern, clean dashboard that matches this exact specification with proper TypeScript and React best practices.

