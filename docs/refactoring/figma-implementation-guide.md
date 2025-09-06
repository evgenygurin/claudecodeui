# Figma Implementation Guide - Claude Code UI

## 🎨 Руководство по созданию дизайнов в Figma

Этот документ содержит детальные инструкции для создания современных дизайнов Claude Code UI в Figma на основе созданных wireframes и технических требований.

## 📋 Структура Figma файла

### **Название файла**: `Claude Code UI - Refactoring Design System`

### **Страницы в Figma**:
1. **🎨 Design System** - Основа дизайн-системы
2. **🖥️ Desktop Screens** - Десктопные экраны
3. **📱 Mobile Screens** - Мобильные экраны
4. **🔄 User Flows** - Пользовательские сценарии
5. **🎯 Prototypes** - Интерактивные прототипы
6. **📚 Documentation** - Документация для разработчиков

## 🎨 Design System (Страница 1)

### **Цветовая палитра**

#### **Primary Colors**
```
Primary Blue: #3B82F6
- Primary 50: #EFF6FF
- Primary 100: #DBEAFE
- Primary 200: #BFDBFE
- Primary 300: #93C5FD
- Primary 400: #60A5FA
- Primary 500: #3B82F6 (Main)
- Primary 600: #2563EB
- Primary 700: #1D4ED8
- Primary 800: #1E40AF
- Primary 900: #1E3A8A
```

#### **Semantic Colors**
```
Success: #10B981
- Success 50: #ECFDF5
- Success 500: #10B981 (Main)
- Success 700: #047857

Warning: #F59E0B
- Warning 50: #FFFBEB
- Warning 500: #F59E0B (Main)
- Warning 700: #B45309

Error: #EF4444
- Error 50: #FEF2F2
- Error 500: #EF4444 (Main)
- Error 700: #B91C1C
```

#### **Neutral Colors**
```
Gray Scale:
- White: #FFFFFF
- Gray 50: #F9FAFB
- Gray 100: #F3F4F6
- Gray 200: #E5E7EB
- Gray 300: #D1D5DB
- Gray 400: #9CA3AF
- Gray 500: #6B7280
- Gray 600: #4B5563
- Gray 700: #374151
- Gray 800: #1F2937
- Gray 900: #111827
- Black: #000000
```

#### **Background Colors**
```
Light Theme:
- Background: #FFFFFF
- Surface: #F8FAFC
- Card: #FFFFFF
- Border: #E5E7EB

Dark Theme:
- Background: #0F172A
- Surface: #1E293B
- Card: #334155
- Border: #475569
```

### **Типографика**

#### **Font Families**
```
Primary Font: Inter
- Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- Usage: UI elements, body text, headings

Code Font: JetBrains Mono
- Weights: 400 (Regular), 500 (Medium)
- Usage: Code blocks, terminal, file paths
```

#### **Text Styles**
```
Headings:
- H1: Inter Bold, 32px, Line Height 40px, Letter Spacing -0.02em
- H2: Inter Bold, 24px, Line Height 32px, Letter Spacing -0.01em
- H3: Inter Semibold, 20px, Line Height 28px
- H4: Inter Semibold, 18px, Line Height 24px
- H5: Inter Medium, 16px, Line Height 24px
- H6: Inter Medium, 14px, Line Height 20px

Body Text:
- Body Large: Inter Regular, 16px, Line Height 24px
- Body Medium: Inter Regular, 14px, Line Height 20px
- Body Small: Inter Regular, 12px, Line Height 16px

Code Text:
- Code Large: JetBrains Mono Regular, 14px, Line Height 20px
- Code Small: JetBrains Mono Regular, 12px, Line Height 16px

UI Text:
- Button Large: Inter Medium, 16px, Line Height 24px
- Button Medium: Inter Medium, 14px, Line Height 20px
- Button Small: Inter Medium, 12px, Line Height 16px
- Caption: Inter Regular, 11px, Line Height 16px
```

### **Spacing System**

#### **Spacing Scale**
```
Space 0.5: 2px
Space 1: 4px
Space 2: 8px
Space 3: 12px
Space 4: 16px
Space 5: 20px
Space 6: 24px
Space 8: 32px
Space 10: 40px
Space 12: 48px
Space 16: 64px
Space 20: 80px
Space 24: 96px
```

#### **Component Spacing**
```
Padding:
- Small: 8px
- Medium: 16px
- Large: 24px
- XL: 32px

Margins:
- Small: 8px
- Medium: 16px
- Large: 24px
- XL: 32px

Gaps:
- Tight: 4px
- Normal: 8px
- Relaxed: 16px
- Loose: 24px
```

### **Border Radius**
```
None: 0px
Small: 4px
Medium: 8px
Large: 12px
XL: 16px
2XL: 24px
Full: 9999px
```

### **Shadows**
```
Small: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
Medium: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
Large: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
XL: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
Inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)
```

## 🧩 Компонентная библиотека

### **Кнопки**

#### **Button Variants**
```
Primary Button:
- Background: Primary 500 (#3B82F6)
- Text: White
- Border: None
- Hover: Primary 600 (#2563EB)
- Active: Primary 700 (#1D4ED8)
- Disabled: Gray 300 (#D1D5DB)

Secondary Button:
- Background: Gray 100 (#F3F4F6)
- Text: Gray 900 (#111827)
- Border: None
- Hover: Gray 200 (#E5E7EB)
- Active: Gray 300 (#D1D5DB)

Outline Button:
- Background: Transparent
- Text: Primary 600 (#2563EB)
- Border: 1px Primary 300 (#93C5FD)
- Hover: Primary 50 (#EFF6FF)
- Active: Primary 100 (#DBEAFE)

Ghost Button:
- Background: Transparent
- Text: Gray 600 (#4B5563)
- Border: None
- Hover: Gray 100 (#F3F4F6)
- Active: Gray 200 (#E5E7EB)
```

#### **Button Sizes**
```
Small:
- Height: 32px
- Padding: 8px 12px
- Font: Button Small (12px)
- Border Radius: 6px

Medium:
- Height: 40px
- Padding: 10px 16px
- Font: Button Medium (14px)
- Border Radius: 8px

Large:
- Height: 48px
- Padding: 12px 20px
- Font: Button Large (16px)
- Border Radius: 8px
```

### **Input Fields**

#### **Input Variants**
```
Default Input:
- Background: White
- Border: 1px Gray 300 (#D1D5DB)
- Text: Gray 900 (#111827)
- Placeholder: Gray 400 (#9CA3AF)
- Border Radius: 8px

Focus State:
- Border: 2px Primary 500 (#3B82F6)
- Shadow: 0 0 0 3px Primary 100 (#DBEAFE)

Error State:
- Border: 2px Error 500 (#EF4444)
- Shadow: 0 0 0 3px Error 100 (#FEE2E2)

Success State:
- Border: 2px Success 500 (#10B981)
- Shadow: 0 0 0 3px Success 100 (#D1FAE5)

Disabled State:
- Background: Gray 50 (#F9FAFB)
- Border: 1px Gray 200 (#E5E7EB)
- Text: Gray 400 (#9CA3AF)
```

#### **Input Sizes**
```
Small:
- Height: 32px
- Padding: 8px 12px
- Font: Body Small (12px)

Medium:
- Height: 40px
- Padding: 10px 14px
- Font: Body Medium (14px)

Large:
- Height: 48px
- Padding: 12px 16px
- Font: Body Large (16px)
```

### **Cards**

#### **Card Variants**
```
Default Card:
- Background: White
- Border: 1px Gray 200 (#E5E7EB)
- Border Radius: 12px
- Shadow: Small
- Padding: 24px

Elevated Card:
- Background: White
- Border: None
- Border Radius: 12px
- Shadow: Medium
- Padding: 24px

Interactive Card:
- Background: White
- Border: 1px Gray 200 (#E5E7EB)
- Border Radius: 12px
- Shadow: Small
- Hover: Shadow Medium, Border Primary 200
- Padding: 24px
```

### **Navigation**

#### **Sidebar**
```
Desktop Sidebar:
- Width: 280px
- Background: Gray 50 (#F9FAFB)
- Border Right: 1px Gray 200 (#E5E7EB)
- Padding: 24px 16px

Collapsed Sidebar:
- Width: 64px
- Icons only
- Tooltips on hover

Navigation Items:
- Height: 40px
- Padding: 8px 12px
- Border Radius: 8px
- Hover: Gray 100 (#F3F4F6)
- Active: Primary 100 (#DBEAFE) + Primary 600 text
```

#### **Mobile Navigation**
```
Bottom Tab Bar:
- Height: 64px
- Background: White
- Border Top: 1px Gray 200 (#E5E7EB)
- Shadow: Large (inverted)

Tab Items:
- Width: Equal distribution
- Height: 64px
- Padding: 8px
- Active: Primary 600 color + icon
- Inactive: Gray 400 color + icon
```

## 🖥️ Desktop Screens (Страница 2)

### **Canvas Setup**
```
Frame Size: 1440x900px
Grid: 8px baseline grid
Margins: 24px
Columns: 12 columns, 24px gutter
```

### **1. Dashboard Screen**

#### **Layout Structure**
```
Header:
- Height: 64px
- Background: White
- Border Bottom: 1px Gray 200
- Content: Logo + Search + User Menu

Sidebar:
- Width: 280px
- Background: Gray 50
- Navigation items with icons

Main Content:
- Padding: 32px
- Grid: 3 columns for cards
- Gap: 24px between cards
```

#### **Components**
```
Welcome Section:
- Card: Elevated
- Padding: 32px
- Title: H2 "Welcome back! 👋"
- Subtitle: Body Large

Stats Cards:
- Card: Default
- Size: 320x160px
- Icon: 24x24px
- Title: H4
- Value: H2
- Trend: Body Small + Success/Error color

Quick Actions:
- Card: Interactive
- Button Grid: 2x2
- Button Size: Large
- Icons: 20x20px

Recent Activity:
- Card: Default
- List items: 48px height
- Avatar: 32x32px
- Text: Body Medium
- Timestamp: Caption + Gray 500
```

### **2. Chat Interface Screen**

#### **Layout Structure**
```
Chat Header:
- Height: 64px
- Background: White
- Border Bottom: 1px Gray 200
- Session info + controls

Message Area:
- Background: Gray 50
- Padding: 16px
- Scroll: Virtual scrolling

Message Input:
- Height: Auto (min 56px)
- Background: White
- Border Top: 1px Gray 200
- Padding: 16px
```

#### **Message Components**
```
User Message:
- Background: Primary 500
- Text: White
- Border Radius: 18px 18px 4px 18px
- Max Width: 70%
- Padding: 12px 16px
- Font: Body Medium

Assistant Message:
- Background: White
- Text: Gray 900
- Border: 1px Gray 200
- Border Radius: 18px 18px 18px 4px
- Max Width: 80%
- Padding: 16px
- Font: Body Medium

Code Block:
- Background: Gray 900
- Text: Gray 100
- Font: Code Large
- Border Radius: 8px
- Padding: 16px
- Copy button: Ghost + Small

File Attachment:
- Card: Default
- Size: 240x80px
- Icon: 24x24px
- Name: Body Medium
- Size: Caption + Gray 500
```

### **3. File Manager Screen**

#### **Layout Structure**
```
File Header:
- Height: 64px
- Breadcrumb navigation
- Search + Actions

File Tree (Left):
- Width: 320px
- Background: Gray 50
- Border Right: 1px Gray 200
- Padding: 16px

File Preview (Right):
- Flex: 1
- Background: White
- Padding: 24px
```

#### **File Components**
```
File Tree Item:
- Height: 32px
- Padding: 4px 8px
- Border Radius: 6px
- Hover: Gray 100
- Selected: Primary 100 + Primary 600 text
- Icon: 16x16px
- Indent: 16px per level

File Preview:
- Header: File name + actions
- Content: Code editor or preview
- Footer: File info (size, modified)

File Actions:
- Button Group: Ghost buttons
- Icons: 16x16px
- Spacing: 8px gap
```

### **4. Terminal Screen**

#### **Layout Structure**
```
Terminal Header:
- Height: 48px
- Background: Gray 800
- Tab bar + controls

Terminal Content:
- Background: Gray 900
- Text: Gray 100
- Font: Code Large
- Padding: 16px
- Line Height: 20px
```

#### **Terminal Components**
```
Terminal Tab:
- Height: 32px
- Padding: 6px 12px
- Border Radius: 6px 6px 0 0
- Active: Gray 700
- Inactive: Gray 800
- Close button: 16x16px

Terminal Text:
- Font: JetBrains Mono
- Size: 14px
- Line Height: 20px
- Colors: ANSI color palette

Command Prompt:
- Prefix: Primary 400 color
- Cursor: Blinking white block
- Input: White text
```

### **5. Task Management Screen**

#### **Layout Structure**
```
Task Header:
- Height: 64px
- Title + filters + actions

Kanban Board:
- 3 columns: To Do, In Progress, Done
- Column width: Equal (33.33%)
- Gap: 24px
- Padding: 24px
```

#### **Task Components**
```
Column Header:
- Height: 48px
- Title: H5
- Count: Badge (Small)
- Background: Gray 100
- Border Radius: 8px
- Padding: 12px 16px

Task Card:
- Card: Interactive
- Min Height: 120px
- Padding: 16px
- Margin Bottom: 12px
- Drag handle: 4px left border

Priority Badge:
- High: Error 500 background
- Medium: Warning 500 background
- Low: Success 500 background
- Size: Small
- Border Radius: Full
```

## 📱 Mobile Screens (Страница 3)

### **Canvas Setup**
```
Frame Size: 375x812px (iPhone 13)
Grid: 4px baseline grid
Margins: 16px
Safe Area: Top 44px, Bottom 34px
```

### **Mobile Components**

#### **Mobile Header**
```
Height: 56px
Background: White
Border Bottom: 1px Gray 200
Padding: 0 16px

Left: Back button or Hamburger (24x24px)
Center: Title (H5)
Right: Action button (24x24px)
```

#### **Bottom Navigation**
```
Height: 64px + Safe Area
Background: White
Border Top: 1px Gray 200
Shadow: Large (inverted)

Tab Items:
- Width: 75px (5 tabs)
- Height: 64px
- Icon: 24x24px
- Label: Caption
- Active: Primary 600
- Inactive: Gray 400
```

#### **Mobile Cards**
```
Full Width Cards:
- Width: 343px (375px - 32px margins)
- Padding: 16px
- Border Radius: 12px
- Margin Bottom: 12px

Compact Cards:
- Height: 80px
- Horizontal layout
- Icon: 40x40px
- Content: Flex 1
```

## 🔄 User Flows (Страница 4)

### **Flow Diagrams**

#### **Project Creation Flow**
```
1. Dashboard → New Project Button
2. Project Type Selection (Claude/Cursor/Codegen)
3. Project Configuration Form
4. Directory Selection
5. Project Created → Redirect to Chat
```

#### **Chat Session Flow**
```
1. Project Selection
2. New Session Button
3. Session Type (Chat/Terminal)
4. Session Started
5. Message Exchange
6. Session Completion
```

#### **File Management Flow**
```
1. Files Tab
2. Directory Navigation
3. File Selection
4. File Preview/Edit
5. Save Changes
6. Git Integration (Optional)
```

## 🎯 Prototypes (Страница 5)

### **Desktop Prototype**

#### **Interactions**
```
Sidebar:
- Hover states for navigation items
- Collapse/expand animation (280px ↔ 64px)
- Active state transitions

Chat Interface:
- Message send animation
- Typing indicator
- Scroll to bottom on new message
- File upload drag & drop

File Manager:
- Tree expand/collapse
- File selection states
- Preview transitions
- Context menu on right-click

Terminal:
- Tab switching
- Text cursor blinking
- Command execution feedback
```

### **Mobile Prototype**

#### **Touch Interactions**
```
Bottom Navigation:
- Tab switching with slide animation
- Active state feedback (scale + color)

Chat Interface:
- Pull to refresh
- Swipe to reply
- Long press for context menu
- Keyboard handling

File Browser:
- Swipe actions (edit, delete, share)
- Long press for selection mode
- Pull to refresh directory

Task Management:
- Drag and drop between columns
- Swipe to complete/delete
- Pull to refresh
```

## 📚 Documentation (Страница 6)

### **Developer Handoff**

#### **Spacing Documentation**
```
Component Spacing Guide:
- Visual examples of all spacing values
- Padding and margin applications
- Grid system usage
- Responsive breakpoints
```

#### **Color Usage Guide**
```
Color Application Examples:
- When to use each color
- Accessibility considerations
- Dark mode variations
- State color mappings
```

#### **Typography Guide**
```
Text Style Applications:
- Hierarchy examples
- Line height rationale
- Font weight usage
- Code vs UI text distinction
```

#### **Component States**
```
Interactive State Examples:
- Default, hover, active, disabled
- Focus states for accessibility
- Loading states
- Error states
```

## 🔧 Figma Best Practices

### **Organization**
```
Layer Naming:
- Use descriptive names
- Group related elements
- Use consistent prefixes (btn-, card-, nav-)

Components:
- Create master components for reusability
- Use variants for different states
- Document component usage

Auto Layout:
- Use for responsive components
- Set proper constraints
- Define spacing between elements

Styles:
- Create text styles for all typography
- Use color styles for consistency
- Create effect styles for shadows
```

### **Responsive Design**
```
Constraints:
- Set proper constraints for responsive behavior
- Use min/max width where appropriate
- Test at different screen sizes

Breakpoints:
- Desktop: 1440px, 1024px
- Tablet: 768px
- Mobile: 375px, 320px

Grid Systems:
- 12-column grid for desktop
- 4-column grid for mobile
- Consistent gutters and margins
```

## 🚀 Implementation Timeline

### **Week 1: Design System Setup**
- Color palette and typography
- Basic component library
- Grid system and spacing

### **Week 2: Desktop Screens**
- Dashboard and navigation
- Chat interface design
- File manager layout

### **Week 3: Mobile Screens**
- Mobile navigation patterns
- Touch-optimized components
- Responsive adaptations

### **Week 4: Prototyping & Documentation**
- Interactive prototypes
- User flow documentation
- Developer handoff materials

Этот гид обеспечивает полную основу для создания современного и функционального дизайна Claude Code UI в Figma.
