# Desktop Wireframes - Claude Code UI

## 🖥️ Главная страница (Dashboard)

### Layout: 1440x900px

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ┌─────┐ Claude Code UI                    🔍 Search...        👤 User   ⚙️      │
│ │ 🤖  │                                                                          │
│ └─────┘                                                                          │
├─────────────┬───────────────────────────────────────────────────────────────────┤
│             │ ┌─────────────────────────────────────────────────────────────┐   │
│ 📁 Projects │ │                    Welcome back! 👋                        │   │
│             │ │                                                             │   │
│ ⭐ Starred   │ │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │   │
│   • Project1│ │  │ 📊 Stats    │  │ 🚀 Quick    │  │ 📈 Recent Activity │ │   │
│   • Project2│ │  │             │  │ Actions     │  │                     │ │   │
│             │ │  │ 5 Projects  │  │             │  │ • Session started   │ │   │
│ 🔄 Recent   │ │  │ 12 Sessions │  │ [New Chat]  │  │ • File edited       │ │   │
│   • Session1│ │  │ 3 CLI Tools │  │ [Terminal]  │  │ • Task completed    │ │   │
│   • Session2│ │  └─────────────┘  │ [New Task]  │  └─────────────────────┘ │   │
│             │ │                   └─────────────┘                          │   │
│ 🛠️ CLI Tools│ │                                                             │   │
│   🤖 Claude │ │  ┌─────────────────────────────────────────────────────────┐ │   │
│   ⚡ Cursor │ │  │                Active Projects                          │ │   │
│   🔧 Codegen│ │  │                                                         │ │   │
│             │ │  │ ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐│ │   │
│ ⚙️ Settings │ │  │ │ 📁 Web App  │ │ 📁 API      │ │ 📁 Mobile App      ││ │   │
│             │ │  │ │ Claude CLI  │ │ Cursor CLI  │ │ Codegen CLI        ││ │   │
│             │ │  │ │ ⏰ 2h ago   │ │ ⏰ 1d ago   │ │ ⏰ 3d ago          ││ │   │
│             │ │  │ │ [Open Chat] │ │ [Open Term] │ │ [Open Tasks]       ││ │   │
│             │ │  │ └─────────────┘ └─────────────┘ └─────────────────────┘│ │   │
│             │ │  └─────────────────────────────────────────────────────────┘ │   │
│             │ └─────────────────────────────────────────────────────────────┘   │
├─────────────┴───────────────────────────────────────────────────────────────────┤
│ 🟢 Connected • v1.8.0 • 3 active sessions                    [Feedback] [Help] │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 💬 Chat Interface

### Layout: 1440x900px

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ┌─────┐ Claude Code UI                    🔍 Search...        👤 User   ⚙️      │
│ │ 🤖  │                                                                          │
│ └─────┘                                                                          │
├─────────────┬───────────────────────────────────────────────────────────────────┤
│             │ ┌─ Chat: Web App Project ─────────────────────────────────────┐   │
│ 📁 Projects │ │ 🤖 Claude Sonnet 4 • Session #1234 • ⏰ Active            │   │
│             │ │                                                             │   │
│ ⭐ Starred   │ ├─────────────────────────────────────────────────────────────┤   │
│ • ▶️ Web App│ │                                                             │   │
│   • Session1│ │ 👤 User: Can you help me refactor this component?          │   │
│   • Session2│ │                                                             │   │
│             │ │ 🤖 Claude: I'd be happy to help! Please share the          │   │
│ 🔄 Recent   │ │ component code you'd like to refactor.                     │   │
│   • Session3│ │                                                             │   │
│   • Session4│ │ 👤 User: [📎 Component.jsx attached]                       │   │
│             │ │                                                             │   │
│ 🛠️ CLI Tools│ │ 🤖 Claude: I can see several improvements we can make:     │   │
│   🤖 Claude │ │                                                             │   │
│   ⚡ Cursor │ │ ```javascript                                               │   │
│   🔧 Codegen│ │ // Optimized component structure                            │   │
│             │ │ const OptimizedComponent = React.memo(({...props}) => {    │   │
│ ⚙️ Settings │ │   // Component logic here                                  │   │
│             │ │ });                                                         │   │
│             │ │ ```                                                         │   │
│             │ │                                                             │   │
│             │ │ [Apply Changes] [Copy Code] [💾 Save to Files]             │   │
│             │ │                                                             │   │
│             │ ├─────────────────────────────────────────────────────────────┤   │
│             │ │ 💬 Type your message...                    📎 🎤 [Send] │   │
│             │ └─────────────────────────────────────────────────────────────┘   │
├─────────────┴───────────────────────────────────────────────────────────────────┤
│ 🟢 Connected • Typing... • 1.2k tokens used                  [Clear] [Export]   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 📁 File Manager

### Layout: 1440x900px

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ┌─────┐ Claude Code UI                    🔍 Search files...   👤 User   ⚙️      │
│ │ 🤖  │                                                                          │
│ └─────┘                                                                          │
├─────────────┬───────────────────────────────────────────────────────────────────┤
│             │ ┌─ Files: Web App Project ────────────────────────────────────┐   │
│ 📁 Projects │ │ 📁 /home/user/web-app • 🌿 main • ✅ Clean                 │   │
│             │ │                                                             │   │
│ ⭐ Starred   │ ├─────────────────┬───────────────────────────────────────────┤   │
│ • ▶️ Web App│ │ 📁 src/         │ ┌─ src/components/Header.jsx ─────────┐ │   │
│   • Session1│ │ ├─ 📁 components │ │ import React from 'react';          │ │   │
│   • Session2│ │ │  ├─ 📄 Header  │ │                                     │ │   │
│             │ │ │  ├─ 📄 Sidebar │ │ const Header = () => {              │ │   │
│ 🔄 Recent   │ │ │  └─ 📄 Footer  │ │   return (                          │ │   │
│   • Session3│ │ ├─ 📁 pages     │ │     <header className="header">     │ │   │
│   • Session4│ │ │  ├─ 📄 Home    │ │       <h1>Claude Code UI</h1>       │ │   │
│             │ │ │  └─ 📄 About   │ │     </header>                       │ │   │
│ 🛠️ CLI Tools│ │ ├─ 📁 utils     │ │   );                                │ │   │
│   🤖 Claude │ │ └─ 📄 App.jsx   │ │ };                                  │ │   │
│   ⚡ Cursor │ │                 │ │                                     │ │   │
│   🔧 Codegen│ │ 📁 public/      │ │ export default Header;              │ │   │
│             │ │ ├─ 📄 index.html│ │                                     │ │   │
│ ⚙️ Settings │ │ └─ 🖼️ favicon   │ │ [Edit] [Delete] [Rename] [Git]      │ │   │
│             │ │                 │ └─────────────────────────────────────┘ │   │
│             │ │ 📄 package.json │                                         │   │
│             │ │ 📄 README.md    │                                         │   │
│             │ │ 📄 .gitignore   │                                         │   │
│             │ └─────────────────┴───────────────────────────────────────────┘   │
├─────────────┴───────────────────────────────────────────────────────────────────┤
│ 🟢 Connected • 247 files • 15.2 MB                          [New] [Upload]      │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 💻 Terminal Interface

### Layout: 1440x900px

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ┌─────┐ Claude Code UI                    🔍 Search...        👤 User   ⚙️      │
│ │ 🤖  │                                                                          │
│ └─────┘                                                                          │
├─────────────┬───────────────────────────────────────────────────────────────────┤
│             │ ┌─ Terminal: Web App Project ─────────────────────────────────┐   │
│ 📁 Projects │ │ [Terminal 1] [Terminal 2] [+]                              │   │
│             │ │                                                             │   │
│ ⭐ Starred   │ ├─────────────────────────────────────────────────────────────┤   │
│ • ▶️ Web App│ │ user@claude-ui:~/web-app$ npm run dev                      │   │
│   • Session1│ │                                                             │   │
│   • Session2│ │ > web-app@1.0.0 dev                                        │   │
│             │ │ > vite --host                                               │   │
│ 🔄 Recent   │ │                                                             │   │
│   • Session3│ │   VITE v4.4.5  ready in 1234 ms                           │   │
│   • Session4│ │                                                             │   │
│             │ │   ➜  Local:   http://localhost:5173/                       │   │
│ 🛠️ CLI Tools│ │   ➜  Network: http://192.168.1.100:5173/                  │   │
│   🤖 Claude │ │                                                             │   │
│   ⚡ Cursor │ │ user@claude-ui:~/web-app$ git status                       │   │
│   🔧 Codegen│ │ On branch main                                              │   │
│             │ │ Your branch is up to date with 'origin/main'.             │   │
│ ⚙️ Settings │ │                                                             │   │
│             │ │ Changes not staged for commit:                              │   │
│             │ │   modified:   src/components/Header.jsx                     │   │
│             │ │                                                             │   │
│             │ │ user@claude-ui:~/web-app$ ▊                               │   │
│             │ │                                                             │   │
│             │ └─────────────────────────────────────────────────────────────┘   │
├─────────────┴───────────────────────────────────────────────────────────────────┤
│ 🟢 Connected • Terminal 1 • /home/user/web-app              [Clear] [Split]     │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 📋 Task Management

### Layout: 1440x900px

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ┌─────┐ Claude Code UI                    🔍 Search tasks...   👤 User   ⚙️      │
│ │ 🤖  │                                                                          │
│ └─────┘                                                                          │
├─────────────┬───────────────────────────────────────────────────────────────────┤
│             │ ┌─ Tasks: Web App Project ─────────────────────────────────────┐   │
│ 📁 Projects │ │ 📋 TaskMaster • 🟢 Active • 12 tasks                        │   │
│             │ │                                                             │   │
│ ⭐ Starred   │ ├─────────────────────────────────────────────────────────────┤   │
│ • ▶️ Web App│ │ ┌─ To Do (4) ─┐ ┌─ In Progress (2) ─┐ ┌─ Done (6) ────────┐│   │
│   • Session1│ │ │             │ │                   │ │                   ││   │
│   • Session2│ │ │ 🔴 HIGH     │ │ 🟡 MEDIUM        │ │ ✅ Refactor      ││   │
│             │ │ │ Refactor    │ │ Add tests        │ │ Header component  ││   │
│ 🔄 Recent   │ │ │ ChatInterface│ │ 👤 Assigned     │ │ ⏰ 2 days ago    ││   │
│   • Session3│ │ │ ⏰ Due today │ │ ⏰ In progress  │ │                   ││   │
│   • Session4│ │ │             │ │                   │ │ ✅ Setup CI/CD   ││   │
│             │ │ │ 🟡 MEDIUM   │ │ 🟢 LOW           │ │ Pipeline          ││   │
│ 🛠️ CLI Tools│ │ │ Update docs │ │ Fix mobile UI    │ │ ⏰ 1 week ago    ││   │
│   🤖 Claude │ │ │ ⏰ Due Mon   │ │ 👤 Assigned     │ │                   ││   │
│   ⚡ Cursor │ │ │             │ │ ⏰ Started       │ │ ✅ Database      ││   │
│   🔧 Codegen│ │ │ 🟢 LOW      │ │                   │ │ Migration         ││   │
│             │ │ │ Add feature │ │                   │ │ ⏰ 2 weeks ago   ││   │
│ ⚙️ Settings │ │ │ ⏰ Next week│ │                   │ │                   ││   │
│             │ │ │             │ │                   │ │ [View All]        ││   │
│             │ │ │ [+ Add Task]│ │                   │ │                   ││   │
│             │ │ └─────────────┘ └───────────────────┘ └───────────────────┘│   │
│             │ └─────────────────────────────────────────────────────────────┘   │
├─────────────┴───────────────────────────────────────────────────────────────────┤
│ 🟢 Connected • 12 total tasks • 2 overdue                   [New Task] [PRD]    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## ⚙️ Settings Panel

### Layout: 1440x900px

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ┌─────┐ Claude Code UI                    🔍 Search...        👤 User   ⚙️      │
│ │ 🤖  │                                                                          │
│ └─────┘                                                                          │
├─────────────┬───────────────────────────────────────────────────────────────────┤
│             │ ┌─ Settings ───────────────────────────────────────────────────┐   │
│ 📁 Projects │ │                                                             │   │
│             │ │ ┌─ General ──┐ ┌─ CLI Tools ──┐ ┌─ Appearance ─┐ ┌─ Advanced─┐│   │
│ ⭐ Starred   │ │ │            │ │              │ │              │ │           ││   │
│ • ▶️ Web App│ │ │ 👤 Profile │ │ 🤖 Claude    │ │ 🎨 Theme     │ │ 🔧 Debug  ││   │
│   • Session1│ │ │            │ │              │ │              │ │           ││   │
│   • Session2│ │ │ Name:      │ │ Status: ✅   │ │ ○ Light      │ │ Logs: ON  ││   │
│             │ │ │ [John Doe] │ │ Path: /usr/  │ │ ● Dark       │ │           ││   │
│ 🔄 Recent   │ │ │            │ │ local/bin/   │ │ ○ Auto       │ │ API: ON   ││   │
│   • Session3│ │ │ Email:     │ │ claude       │ │              │ │           ││   │
│   • Session4│ │ │ [john@...] │ │              │ │ 🔤 Font      │ │ Cache:    ││   │
│             │ │ │            │ │ ⚡ Cursor    │ │ Size: 14px   │ │ [Clear]   ││   │
│ 🛠️ CLI Tools│ │ │ 🔔 Notif.  │ │              │ │ Family:      │ │           ││   │
│   🤖 Claude │ │ │ ☑️ Updates │ │ Status: ✅   │ │ [Inter]      │ │ 📊 Stats  ││   │
│   ⚡ Cursor │ │ │ ☑️ Tasks   │ │ Path: /usr/  │ │              │ │ Sessions: ││   │
│   🔧 Codegen│ │ │ ☑️ Errors  │ │ local/bin/   │ │ 🎯 Layout    │ │ 1,234     ││   │
│             │ │ │            │ │ cursor       │ │ Sidebar:     │ │ Messages: ││   │
│ ⚙️ Settings │ │ │ 🔐 Privacy │ │              │ │ ● Left       │ │ 45,678    ││   │
│             │ │ │ Analytics: │ │ 🔧 Codegen   │ │ ○ Right      │ │           ││   │
│             │ │ │ ○ Enable   │ │              │ │              │ │ [Export]  ││   │
│             │ │ │ ● Disable  │ │ Status: ✅   │ │ [Preview]    │ │           ││   │
│             │ │ │            │ │ API Key:     │ │              │ │           ││   │
│             │ │ │ [Save]     │ │ [••••••••]   │ │ [Apply]      │ │ [Reset]   ││   │
│             │ │ └────────────┘ └──────────────┘ └──────────────┘ └───────────┘│   │
│             │ └─────────────────────────────────────────────────────────────────┘   │
├─────────────┴───────────────────────────────────────────────────────────────────┤
│ 🟢 Connected • Settings saved • Last sync: 2 min ago        [Import] [Export]   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 🎨 Design System Components

### Buttons
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   Primary   │ │  Secondary  │ │   Outline   │ │    Ghost    │
│   #3B82F6   │ │   #6B7280   │ │   Border    │ │ Transparent │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘

┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   Success   │ │   Warning   │ │    Error    │ │  Disabled   │
│   #10B981   │ │   #F59E0B   │ │   #EF4444   │ │   #9CA3AF   │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

### Input Fields
```
┌─────────────────────────────────────────────────────────────┐
│ Label                                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Placeholder text...                                     │ │
│ └─────────────────────────────────────────────────────────┘ │
│ Helper text                                                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Label                                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Valid input ✅                                          │ │
│ └─────────────────────────────────────────────────────────┘ │
│ Success message                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Label                                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Invalid input ❌                                        │ │
│ └─────────────────────────────────────────────────────────┘ │
│ Error message                                               │
└─────────────────────────────────────────────────────────────┘
```

### Cards
```
┌─────────────────────────────────────────────────────────────┐
│ ┌─ Card Title ──────────────────────────────────────────┐   │
│ │                                                       │   │
│ │ Card content goes here. This is a standard card      │   │
│ │ component with title, content, and optional actions.  │   │
│ │                                                       │   │
│ │                                    [Action] [Cancel]  │   │
│ └───────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```
