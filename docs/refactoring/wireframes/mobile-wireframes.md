# Mobile Wireframes - Claude Code UI

## 📱 Мобильная главная страница (Dashboard)

### Layout: 375x812px (iPhone 13)

```
┌─────────────────────────────────┐
│ ☰  Claude Code UI        👤 ⚙️ │
├─────────────────────────────────┤
│                                 │
│        Welcome back! 👋         │
│                                 │
│  ┌─────────────────────────────┐ │
│  │        📊 Overview          │ │
│  │                             │ │
│  │  5 Projects • 12 Sessions   │ │
│  │  3 CLI Tools • 2 Active     │ │
│  └─────────────────────────────┘ │
│                                 │
│  ┌─────────────────────────────┐ │
│  │      🚀 Quick Actions       │ │
│  │                             │ │
│  │  [💬 New Chat]              │ │
│  │  [💻 Terminal]              │ │
│  │  [📋 New Task]              │ │
│  └─────────────────────────────┘ │
│                                 │
│  ┌─────────────────────────────┐ │
│  │     📈 Recent Activity      │ │
│  │                             │ │
│  │  • Session started          │ │
│  │  • File edited              │ │
│  │  • Task completed           │ │
│  │  [View All]                 │ │
│  └─────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│ [💬] [📁] [💻] [📋] [⚙️]      │
│ Chat Files Term Tasks More      │
└─────────────────────────────────┘
```

## 💬 Мобильный Chat Interface

### Layout: 375x812px

```
┌─────────────────────────────────┐
│ ← Web App • Claude Sonnet 4  ⋮  │
├─────────────────────────────────┤
│                                 │
│ 👤 Can you help me refactor     │
│    this component?              │
│                                 │
│                    🤖 I'd be    │
│                    happy to     │
│                    help! Please │
│                    share the    │
│                    component.   │
│                                 │
│ 👤 [📎 Component.jsx]           │
│                                 │
│                    🤖 I can see │
│                    several      │
│                    improvements │
│                    we can make: │
│                                 │
│                    ```js        │
│                    const Opt... │
│                    ```          │
│                                 │
│                    [Apply]      │
│                    [Copy]       │
│                    [Save]       │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Type message...       📎 🎤│ │
│ │                       [>]  │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ [💬] [📁] [💻] [📋] [⚙️]      │
└─────────────────────────────────┘
```

## 📁 Мобильный File Manager

### Layout: 375x812px

```
┌─────────────────────────────────┐
│ ← Files • Web App Project    🔍 │
├─────────────────────────────────┤
│ 📁 /home/user/web-app           │
│ 🌿 main • ✅ Clean              │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📁 src/                     │ │
│ │ ├─ 📁 components             │ │
│ │ │  ├─ 📄 Header.jsx          │ │
│ │ │  ├─ 📄 Sidebar.jsx         │ │
│ │ │  └─ 📄 Footer.jsx          │ │
│ │ ├─ 📁 pages                 │ │
│ │ │  ├─ 📄 Home.jsx            │ │
│ │ │  └─ 📄 About.jsx           │ │
│ │ ├─ 📁 utils                 │ │
│ │ └─ 📄 App.jsx               │ │
│ │                             │ │
│ │ 📁 public/                  │ │
│ │ ├─ 📄 index.html            │ │
│ │ └─ 🖼️ favicon.ico           │ │
│ │                             │ │
│ │ 📄 package.json             │ │
│ │ 📄 README.md                │ │
│ │ 📄 .gitignore               │ │
│ └─────────────────────────────┘ │
│                                 │
│ [+ New] [📤 Upload]             │
│                                 │
├─────────────────────────────────┤
│ [💬] [📁] [💻] [📋] [⚙️]      │
└─────────────────────────────────┘
```

## 💻 Мобильный Terminal

### Layout: 375x812px

```
┌─────────────────────────────────┐
│ ← Terminal • Web App         ⋮  │
├─────────────────────────────────┤
│ [Term 1] [Term 2] [+]           │
│                                 │
│ user@claude-ui:~/web-app$       │
│ npm run dev                     │
│                                 │
│ > web-app@1.0.0 dev             │
│ > vite --host                   │
│                                 │
│   VITE v4.4.5  ready in 1234ms │
│                                 │
│   ➜  Local:                     │
│      http://localhost:5173/     │
│   ➜  Network:                   │
│      http://192.168.1.100:5173/ │
│                                 │
│ user@claude-ui:~/web-app$       │
│ git status                      │
│                                 │
│ On branch main                  │
│ Your branch is up to date with  │
│ 'origin/main'.                  │
│                                 │
│ Changes not staged for commit:  │
│   modified: src/components/     │
│             Header.jsx          │
│                                 │
│ user@claude-ui:~/web-app$ ▊     │
│                                 │
├─────────────────────────────────┤
│ [💬] [📁] [💻] [📋] [⚙️]      │
└─────────────────────────────────┘
```

## 📋 Мобильное управление задачами

### Layout: 375x812px

```
┌─────────────────────────────────┐
│ ← Tasks • Web App Project    🔍 │
├─────────────────────────────────┤
│ 📋 TaskMaster • 🟢 Active       │
│ 12 tasks • 2 overdue            │
│                                 │
│ ┌─ To Do (4) ─────────────────┐ │
│ │                             │ │
│ │ 🔴 HIGH                     │ │
│ │ Refactor ChatInterface      │ │
│ │ ⏰ Due today                │ │
│ │                             │ │
│ │ 🟡 MEDIUM                   │ │
│ │ Update documentation        │ │
│ │ ⏰ Due Monday               │ │
│ │                             │ │
│ │ 🟢 LOW                      │ │
│ │ Add new feature             │ │
│ │ ⏰ Next week                │ │
│ │                             │ │
│ │ [+ Add Task]                │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─ In Progress (2) ───────────┐ │
│ │                             │ │
│ │ 🟡 MEDIUM                   │ │
│ │ Add unit tests              │ │
│ │ 👤 Assigned • ⏰ Active     │ │
│ │                             │ │
│ │ 🟢 LOW                      │ │
│ │ Fix mobile UI issues        │ │
│ │ 👤 Assigned • ⏰ Started    │ │
│ └─────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│ [💬] [📁] [💻] [📋] [⚙️]      │
└─────────────────────────────────┘
```

## ⚙️ Мобильные настройки

### Layout: 375x812px

```
┌─────────────────────────────────┐
│ ← Settings                   🔍 │
├─────────────────────────────────┤
│                                 │
│ ┌─ General ───────────────────┐ │
│ │                             │ │
│ │ 👤 Profile                  │ │
│ │ Name: John Doe              │ │
│ │ Email: john@example.com     │ │
│ │                             │ │
│ │ 🔔 Notifications            │ │
│ │ ☑️ Updates                  │ │
│ │ ☑️ Tasks                    │ │
│ │ ☑️ Errors                   │ │
│ │                             │ │
│ │ 🔐 Privacy                  │ │
│ │ Analytics: ● Disabled       │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─ CLI Tools ─────────────────┐ │
│ │                             │ │
│ │ 🤖 Claude CLI               │ │
│ │ Status: ✅ Connected        │ │
│ │ Path: /usr/local/bin/claude │ │
│ │                             │ │
│ │ ⚡ Cursor CLI               │ │
│ │ Status: ✅ Connected        │ │
│ │ Path: /usr/local/bin/cursor │ │
│ │                             │ │
│ │ 🔧 Codegen CLI              │ │
│ │ Status: ✅ Connected        │ │
│ │ API Key: [••••••••]         │ │
│ └─────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│ [💬] [📁] [💻] [📋] [⚙️]      │
└─────────────────────────────────┘
```

## 🎨 Мобильные UI компоненты

### Кнопки
```
┌─────────────────────────────────┐
│ ┌─────────────────────────────┐ │
│ │         Primary             │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │        Secondary            │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │         Outline             │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │          Ghost              │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### Поля ввода
```
┌─────────────────────────────────┐
│ Label                           │
│ ┌─────────────────────────────┐ │
│ │ Placeholder text...         │ │
│ └─────────────────────────────┘ │
│ Helper text                     │
└─────────────────────────────────┘
```

### Карточки
```
┌─────────────────────────────────┐
│ ┌─ Card Title ───────────────┐ │
│ │                           │ │
│ │ Card content goes here.   │ │
│ │ This is optimized for     │ │
│ │ mobile viewing.           │ │
│ │                           │ │
│ │           [Action] [More] │ │
│ └───────────────────────────┘ │
└─────────────────────────────────┘
```

### Модальные окна
```
┌─────────────────────────────────┐
│ ┌─ Modal Title ──────────── ✕ │ │
│ │                           │ │
│ │ Modal content for mobile  │ │
│ │ devices. Optimized for    │ │
│ │ touch interactions.       │ │
│ │                           │ │
│ │ ┌─────────────────────────┐ │ │
│ │ │        Confirm          │ │ │
│ │ └─────────────────────────┘ │ │
│ │ ┌─────────────────────────┐ │ │
│ │ │        Cancel           │ │ │
│ │ └─────────────────────────┘ │ │
│ └───────────────────────────┘ │
└─────────────────────────────────┘
```

## 📱 Навигационные паттерны

### Bottom Navigation
```
┌─────────────────────────────────┐
│ [💬] [📁] [💻] [📋] [⚙️]      │
│ Chat Files Term Tasks More      │
└─────────────────────────────────┘
```

### Hamburger Menu
```
┌─────────────────────────────────┐
│ ☰  Claude Code UI        👤 ⚙️ │
├─────────────────────────────────┤
│ ┌─ Menu ─────────────────────┐ │
│ │                           │ │
│ │ 📁 Projects               │ │
│ │ ⭐ Starred                │ │
│ │ 🔄 Recent                 │ │
│ │ 🛠️ CLI Tools              │ │
│ │ ⚙️ Settings               │ │
│ │ ❓ Help                   │ │
│ │ 🚪 Logout                 │ │
│ │                           │ │
│ └───────────────────────────┘ │
└─────────────────────────────────┘
```

### Swipe Actions
```
┌─────────────────────────────────┐
│ ← Swipe for actions             │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Project Name                │ │
│ │ Last activity: 2h ago       │ │
│ │                             │ │
│ │ [📝] [🗑️] [⭐] [📤]        │ │
│ │ Edit Delete Star Share      │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

## 🎯 Touch Interactions

### Tap Targets
- Минимальный размер: 44x44px
- Отступы между элементами: 8px
- Активные состояния с визуальной обратной связью

### Gestures
- **Swipe left/right**: Навигация между вкладками
- **Pull to refresh**: Обновление списков
- **Long press**: Контекстные меню
- **Pinch to zoom**: Масштабирование в редакторе кода

### Responsive Breakpoints
- **Small phones**: 320px - 374px
- **Large phones**: 375px - 414px
- **Small tablets**: 768px - 834px
- **Large tablets**: 1024px+
