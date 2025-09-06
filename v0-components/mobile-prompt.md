# Claude Code UI Mobile App - v0 Prompt

Create a mobile-first React component for Claude Code UI with the following specifications:

## Design System
- **Primary Color**: #3B82F6 (blue-500)
- **Success**: #10B981, **Warning**: #F59E0B, **Error**: #EF4444
- **Typography**: Inter font family
- **Spacing**: 4px base unit
- **Mobile Size**: 375x812px (iPhone 13 dimensions)

## Layout Structure
```
├── Mobile Header (56px height)
│   ├── Hamburger menu (24x24px)
│   ├── Title: "Claude Code UI"
│   └── Action buttons (search, settings)
├── Tab Content (flex-1, scrollable)
│   └── 5 different tab panes
├── Floating Action Button (56px, bottom-right)
└── Bottom Navigation (64px + safe area)
    └── 5 tabs with icons and labels
```

## Bottom Navigation Tabs

### Tab Structure (5 tabs, equal width ~75px each)
1. **📊 Главная** (Dashboard) - Active by default
2. **💬 Чаты** (Chat list)
3. **📁 Файлы** (File manager)
4. **⚡ Терминал** (Mobile terminal)
5. **⚙️ Настройки** (Settings)

### Tab Styling
- Height: 64px + safe area
- Background: White
- Border top: 1px gray-200
- Shadow: Large (inverted)
- Active: Primary-600 color
- Inactive: Gray-400 color
- Icon: 20px, Label: 10px font-weight-500

## Tab Content

### 1. Dashboard Tab (Active)
```
├── Welcome Card (primary background, white text)
│   ├── Title: "Добро пожаловать! 👋"
│   └── Subtitle: "Управляйте AI-проектами на ходу"
├── Stats Row (2 columns grid)
│   ├── Sessions: 12 (💬 icon)
│   └── Projects: 8 (📁 icon)
└── Quick Actions (2x2 grid)
    ├── ➕ Новый проект
    ├── 💬 Начать чат
    ├── 📁 Файлы
    └── ⚡ Терминал
```

### 2. Chat Tab
```
Chat List (vertical stack):
├── Chat Item 1
│   ├── Avatar: 🤖 (40px)
│   ├── Name: "Claude Chat"
│   ├── Status: "Активна • Claude Code UI"
│   ├── Time: "14:32"
│   └── Preview: "Отличная идея! Давайте разобьем ChatInterface.jsx..."
├── Chat Item 2 (✨ Cursor Session)
└── Chat Item 3 (🚀 Codegen Bot)
```

### 3. Files Tab
```
File List (vertical stack):
├── 📁 src (24 файла • Изменен 2ч назад)
├── 📁 components (12 файлов • Изменен 1ч назад)
├── JS ChatInterface.jsx (165KB • Изменен 30м назад)
├── JS Sidebar.jsx (67KB • Изменен 1ч назад)
├── CSS styles.css (45KB • Изменен 2ч назад)
└── MD README.md (12KB • Изменен вчера)
```

### 4. Terminal Tab
```
Terminal Container:
├── Background: Gray-900
├── Font: JetBrains Mono, 12px
├── Text: Gray-100
└── Sample content:
    claude-code-ui $ npm run dev
    > claude-code-ui@1.0.0 dev
    > vite --host
    
    VITE v7.0.4  ready in 1.2s
    
    ➜  Local:   http://localhost:5173/
    ➜  Network: http://192.168.1.100:5173/
    
    claude-code-ui $ █ (blinking cursor)
```

### 5. Settings Tab
```
Simple placeholder:
- Center aligned text
- "Настройки" heading
- "Здесь будут настройки приложения" subtitle
```

## Mobile Header
- Height: 56px
- Background: White
- Border bottom: 1px gray-200
- Left: ☰ Hamburger (24x24px)
- Center: "Claude Code UI" (16px font-weight-600)
- Right: 🔍 Search, ⚙️ Settings (24x24px each)

## Interactive Features

### Pull-to-Refresh
- Touch event handling
- Visual indicator with spinner
- "Потяните для обновления" text
- Smooth animations

### Touch Interactions
- Tap feedback on all interactive elements
- Minimum 44px touch targets
- Swipe gestures (planned)
- Long press for context menus

### Floating Action Button
- Size: 56px diameter
- Background: Primary-500
- Icon: ➕ (24px, white)
- Position: Fixed, bottom-right (16px from edges)
- Shadow: Large
- Hover: Primary-600, translateY(-2px)

## Component Styling

### Cards (Mobile optimized)
- Full width: 343px (375px - 32px margins)
- Padding: 16px
- Border radius: 12px
- Margin bottom: 12px
- Background: White
- Shadow: Small

### Compact Cards (for lists)
- Height: 80px
- Horizontal layout
- Icon: 40x40px
- Content: Flex-1
- Touch-friendly spacing

### Stats Cards
- 2-column grid
- Background: White
- Border radius: 12px
- Padding: 16px
- Icon: 16px
- Title: 12px gray-600
- Value: 24px font-weight-700

## Safe Area Support
```css
@supports (padding: max(0px)) {
  .mobile-app {
    padding-top: max(0px, env(safe-area-inset-top));
    padding-bottom: max(0px, env(safe-area-inset-bottom));
  }
}
```

## Responsive Behavior
- Mobile-first design (375px base)
- Touch-optimized interactions
- Proper keyboard handling
- Accessibility support (ARIA labels)

Create a fully functional mobile app component with proper state management, touch interactions, and smooth animations. Use React hooks and TypeScript for type safety.

