# Claude Code UI Chat Interface - v0 Prompt

Create a modern chat interface component for Claude Code UI with the following specifications:

## Design System
- **Primary Color**: #3B82F6 (blue-500)
- **Success**: #10B981 (emerald-500)
- **Gray Scale**: gray-50 to gray-900
- **Typography**: Inter for UI, JetBrains Mono for code
- **Spacing**: 4px base unit

## Layout Structure (Full Screen)
```
├── Chat Header (64px height)
│   ├── Session info (avatar + details)
│   └── Controls (settings, export, clear)
├── Messages Area (flex-1, scrollable)
│   ├── Message bubbles (user/assistant)
│   ├── Code blocks with syntax highlighting
│   ├── File attachments
│   └── Typing indicator
└── Message Input (auto-height, min 56px)
    ├── Textarea (auto-resize 56px-120px)
    ├── Attachment button
    └── Send button
```

## Message Types

### User Messages
- Background: Primary blue (#3B82F6)
- Text: White
- Border radius: 18px 18px 4px 18px (rounded except bottom-right)
- Max width: 70%
- Align: Right
- Padding: 12px 16px

### Assistant Messages  
- Background: White
- Text: Gray-900
- Border: 1px gray-200
- Border radius: 18px 18px 18px 4px (rounded except bottom-left)
- Max width: 80%
- Align: Left
- Padding: 16px

### Code Blocks
- Background: Gray-900 (dark theme)
- Text: Gray-100
- Font: JetBrains Mono
- Border radius: 8px
- Padding: 16px
- Copy button: Ghost style, small size
- Syntax highlighting for JavaScript/TypeScript

### File Attachments
- Card style: white background, border, 8px radius
- Size: 240x80px
- Icon: 24x24px (📄 for general files)
- File name: 14px medium weight
- File size: 11px gray-500

### Typing Indicator
- 3 animated dots (6px each)
- Gray-400 color
- CSS animation: scale and opacity changes
- Animation timing: 1.4s infinite ease-in-out

## Sample Messages

### Assistant Message with Code
```
Отличная идея! Давайте разобьем ChatInterface.jsx на логические компоненты. Вот план рефакторинга:

[CODE BLOCK - JavaScript]
// Новая структура компонентов:
src/components/chat/
├── ChatInterface.jsx          // Главный контейнер
├── MessageList/
│   ├── MessageList.jsx        // Виртуализированный список
│   ├── Message.jsx           // Отдельное сообщение
│   └── TypingIndicator.jsx   // Индикатор печати
├── MessageInput/
│   ├── MessageInput.jsx      // Поле ввода
│   ├── AttachmentButton.jsx  // Кнопка вложений
│   └── SendButton.jsx        // Кнопка отправки
└── SessionHeader/
    ├── SessionHeader.jsx     // Заголовок сессии
    └── SessionControls.jsx   // Элементы управления

Это позволит:
• Улучшить производительность через виртуализацию
• Упростить тестирование отдельных компонентов  
• Повысить переиспользуемость кода
```

### User Message
```
Нужно разбить ChatInterface.jsx на более мелкие компоненты. Файл слишком большой - 165KB.
```

## Interactive Features

### Auto-resize Textarea
- Min height: 56px
- Max height: 120px
- Auto-expand on content
- Placeholder: "Напишите сообщение... (Shift+Enter для новой строки)"

### Keyboard Shortcuts
- Enter: Send message
- Shift+Enter: New line
- Focus management

### Copy Code Functionality
- Copy button in code blocks
- Clipboard API integration
- Success feedback ("Скопировано!")

### Message Input Actions
- 📎 Attach file button
- 😊 Emoji button  
- ➤ Send button (primary style, 40px)

## Chat Header
- Session avatar: 32px, primary background, "🤖" emoji
- Session name: "Claude Chat Session"
- Session details: "Проект: Claude Code UI • Активна 2ч 15м"
- Control buttons: ⚙️ Settings, 📤 Export, 🗑️ Clear

## Styling Requirements
- Use Tailwind CSS
- Smooth animations for typing indicator
- Proper focus states for accessibility
- Responsive design (mobile-friendly)
- Virtual scrolling for performance
- Message timestamps (11px, gray-400)

Create a fully functional chat interface with proper TypeScript, React hooks for state management, and smooth UX interactions.

