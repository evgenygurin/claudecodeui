# Claude Code UI - Complete Implementation

A comprehensive web-based UI for [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) and [Cursor CLI](https://docs.cursor.com/en/cli/overview), providing desktop and mobile access to AI-powered coding assistance.

## 🌟 Features

This implementation includes **ALL** the features from the original Claude Code UI project:

### Core Features
- **🖥️ Responsive Design** - Works seamlessly across desktop, tablet, and mobile devices
- **💬 Interactive Chat Interface** - Built-in chat interface for seamless communication with Claude Code or Cursor
- **🖥️ Integrated Shell Terminal** - Direct access to Claude Code or Cursor CLI through built-in shell functionality
- **📁 File Explorer** - Interactive file tree with syntax highlighting and live editing
- **🔧 Git Explorer** - View, stage and commit your changes. You can also switch branches
- **⚡ Session Management** - Resume conversations, manage multiple sessions, and track history
- **🤖 Model Compatibility** - Works with Claude Sonnet 4, Opus 4.1, and GPT-5

### Advanced Features
- **📋 TaskMaster AI Integration** - Advanced project management with AI-powered task planning, PRD parsing, and workflow automation
- **🔒 Security & Tools Configuration** - Granular control over which Claude Code tools are enabled
- **📱 Progressive Web App (PWA)** - Can be installed as a native app on mobile devices
- **🌙 Dark/Light Mode Toggle** - Adaptive theming with system preference detection
- **🎯 Real-time Updates** - WebSocket integration for live project and session updates
- **📊 Version Update Notifications** - Automatic detection of new releases

### User Interface Components
- **Sidebar Navigation** - Project browser with session management
- **Mobile Navigation** - Touch-friendly bottom navigation bar for mobile
- **Settings Panel** - Comprehensive configuration options
- **Quick Settings** - Floating panel for common preferences
- **Code Editor** - Syntax-highlighted code editing with CodeMirror
- **Diff Viewer** - Visual diff comparison for file changes
- **Authentication** - Secure login system with JWT tokens

## 🏗️ Project Structure

```text
claudecodeui/
├── src/                          # Frontend React application
│   ├── components/              # React components
│   │   ├── ui/                 # Reusable UI components
│   │   ├── MainContent.jsx     # Main application content area
│   │   ├── Sidebar.jsx         # Project and session navigation
│   │   ├── MobileNav.jsx       # Mobile navigation bar
│   │   ├── Settings.jsx        # Settings modal
│   │   ├── GitPanel.jsx        # Git operations interface
│   │   ├── TaskIndicator.jsx   # Task status visualization
│   │   └── ...                 # Many more components
│   ├── contexts/               # React context providers
│   │   ├── AuthContext.jsx     # Authentication state
│   │   ├── WebSocketContext.jsx # WebSocket communication
│   │   ├── ThemeContext.jsx    # Theme management
│   │   ├── TaskMasterContext.jsx # TaskMaster integration
│   │   └── TasksSettingsContext.jsx # Task settings
│   ├── utils/                  # Utility functions
│   │   ├── api.js             # API communication
│   │   ├── websocket.js       # WebSocket utilities
│   │   └── whisper.js         # Speech recognition
│   └── App.jsx                # Main application component
├── server/                     # Backend Node.js server
│   ├── routes/                # Express route handlers
│   │   ├── auth.js           # Authentication routes
│   │   ├── git.js            # Git operations
│   │   ├── mcp.js            # MCP server integration
│   │   ├── cursor.js         # Cursor CLI integration
│   │   └── taskmaster.js     # TaskMaster AI routes
│   ├── middleware/           # Express middleware
│   │   └── auth.js          # JWT authentication
│   ├── database/            # SQLite database setup
│   │   └── db.js           # Database initialization
│   ├── utils/              # Server utilities
│   │   ├── mcp-detector.js # MCP server detection
│   │   └── taskmaster-websocket.js # TaskMaster WebSocket
│   ├── index.js           # Main server file
│   ├── projects.js        # Project management
│   ├── claude-cli.js      # Claude CLI integration
│   └── cursor-cli.js      # Cursor CLI integration
├── public/                # Static assets
│   ├── icons/            # Application icons
│   ├── screenshots/      # Documentation screenshots
│   ├── manifest.json     # PWA manifest
│   └── logo.svg         # Application logo
├── package.json          # Dependencies and scripts
├── vite.config.js       # Vite build configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── .env.example         # Environment variables template
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** v20 or higher
- **[Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code)** installed and configured
- **[Cursor CLI](https://docs.cursor.com/en/cli/overview)** installed and configured (optional)
- **[TaskMaster AI](https://github.com/eyaltoledano/claude-task-master)** for advanced project management (optional)

### Installation

1. **Dependencies are already installed!** The project is ready to run.

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env if needed (default port is 3001)
   ```

3. **Start the application:**
   ```bash
   # Development mode (with hot reload)
   npm run dev
   
   # The application will start at:
   # - Frontend: http://localhost:5173
   # - Backend: http://localhost:3001
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` and start using Claude Code UI!

## 🔧 Configuration

### Environment Variables

The application uses minimal environment configuration:

```env
# Backend server port (Express API + WebSocket server)
PORT=3001

# Frontend development port
VITE_PORT=5173
```

### Security & Tools

**🔒 Important Notice**: All Claude Code tools are **disabled by default** for security.

To enable tools:
1. Click the ⚙️ gear icon in the sidebar
2. Enable only the tools you need
3. Apply settings (saved locally)

### TaskMaster AI Integration

For advanced project management features:

1. Install [TaskMaster AI](https://github.com/eyaltoledano/claude-task-master)
2. Enable TaskMaster in Settings
3. Access visual task boards and PRD parsing features

## 📱 Mobile & PWA Support

### Progressive Web App
- Add to home screen on mobile devices
- Works offline for basic functionality
- Native app-like experience

### Responsive Design
- Touch-friendly interface
- Swipe gestures and navigation
- Optimized for all screen sizes
- Bottom tab navigation on mobile

## 🎯 Key Components

### Session Management
- **Session Protection System**: Prevents project updates during active conversations
- **Real-time Synchronization**: WebSocket integration for live updates
- **Cross-device Access**: Resume sessions from any device
- **History Tracking**: Complete conversation history with timestamps

### File Operations
- **Interactive File Tree**: Browse project structure with expand/collapse
- **Live File Editing**: Direct file modification with syntax highlighting
- **Git Integration**: Stage, commit, and manage changes
- **File Upload/Download**: Drag-and-drop file operations

### AI Integration
- **Multiple CLI Support**: Switch between Claude Code and Cursor
- **Model Selection**: Support for latest AI models
- **Tool Management**: Granular control over AI capabilities
- **Session Isolation**: Independent conversations per project

## 🏗️ Architecture

### Frontend (React + Vite)
- **React 18** with hooks and modern patterns
- **Tailwind CSS** for styling
- **CodeMirror** for code editing
- **WebSocket** for real-time communication
- **React Router** for navigation
- **Context API** for state management

### Backend (Node.js + Express)
- **Express Server** with REST API
- **WebSocket Server** for real-time updates
- **SQLite Database** for authentication and settings
- **JWT Authentication** for security
- **CLI Process Management** for Claude Code/Cursor integration
- **File System API** for project management

### Communication Flow
```text
┌─────────────────┐    WebSocket    ┌─────────────────┐    Process     ┌─────────────────┐
│   Frontend      │ ←→ & REST API ←→│   Backend       │ ←→ Management ←→│  Claude/Cursor  │
│   (React/Vite)  │                │ (Express/WS)    │                │      CLI        │
└─────────────────┘                └─────────────────┘                └─────────────────┘
```

## 🔧 Development

### Running the Application
```bash
# Development with hot reload
npm run dev

# Production build
npm run build
npm start

# Just frontend
npm run client

# Just backend  
npm run server
```

### Code Structure Guidelines
- **Components**: Reusable React components in `/src/components/`
- **Contexts**: State management with React Context API
- **Routes**: Express API endpoints in `/server/routes/`
- **Utilities**: Helper functions in `/src/utils/` and `/server/utils/`

## ⚠️ Known Issues & Solutions

### Node-pty Build Issues
If you encounter build errors with `node-pty`:

1. **Current Status**: Installed with `--ignore-scripts` to bypass compilation
2. **Terminal Feature**: Limited terminal functionality until native compilation works
3. **Alternative**: Use the chat interface for Claude Code communication
4. **Fix**: Use Node.js v18-20 or Docker for consistent compilation environment

### Claude Projects Not Found
1. Ensure Claude CLI is installed: `claude --version`
2. Run Claude in at least one project directory
3. Verify `~/.claude/projects/` exists

### File Explorer Issues
1. Check project directory permissions
2. Verify project path accessibility
3. Review server console for detailed errors

## 🤝 Contributing

We welcome contributions! This implementation includes:

- ✅ Complete feature parity with original project
- ✅ All UI components and functionality
- ✅ Backend API and WebSocket server  
- ✅ Authentication and security
- ✅ Mobile responsiveness
- ✅ TaskMaster AI integration
- ✅ Git operations
- ✅ Settings and configuration

### Development Process
1. Fork the repository
2. Create a feature branch
3. Make your changes following existing patterns
4. Test thoroughly across device types
5. Submit a Pull Request with clear description

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

### Original Project
This implementation is based on the excellent [Claude Code UI](https://github.com/siteboon/claudecodeui) by the Claude Code community.

### Built With
- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** - Anthropic's official CLI
- **[React](https://react.dev/)** - User interface library  
- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[CodeMirror](https://codemirror.net/)** - Advanced code editor
- **[Express](https://expressjs.com/)** - Backend web framework
- **[Socket.IO/ws](https://socket.io/)** - Real-time communication

---

## 📋 Implementation Status

### ✅ Completed Features

1. **Project Structure**: Complete React + Node.js application structure
2. **Dependencies**: All required packages installed and configured
3. **Frontend Components**: All UI components from original project
4. **Backend Server**: Express server with all API routes
5. **Authentication**: JWT-based authentication system
6. **WebSocket Integration**: Real-time communication setup
7. **File Management**: File explorer and editing capabilities
8. **Git Integration**: Git operations and version control
9. **TaskMaster AI**: Advanced project management integration
10. **Mobile Support**: Responsive design and PWA features
11. **Settings System**: Comprehensive configuration options
12. **Theme Support**: Dark/light mode switching

### 🔄 Current Limitations

1. **Terminal Feature**: Node-pty compilation issue limits terminal functionality
   - **Workaround**: Use chat interface for Claude Code communication
   - **Solution**: Requires compatible Node.js version or Docker environment

### 🚀 Ready to Use

The application is fully functional and ready to use with all major features:

- ✅ Web-based Claude Code and Cursor interface
- ✅ Project and session management
- ✅ File browsing and editing
- ✅ Git operations
- ✅ Mobile-responsive design
- ✅ PWA installation support
- ✅ Real-time updates
- ✅ TaskMaster AI integration

**Start the application with `npm run dev` and enjoy Claude Code from your browser!** 🎉
