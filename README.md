# Claude Code UI - Modern Vercel Integration

A modern, responsive web interface for Claude Code CLI, Cursor CLI, and Codegen with full Vercel integration and MCP (Model Context Protocol) support.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/evgenygurin/claudecodeui&project-name=claude-code-ui&repository-name=claudecodeui)

## 🚀 Features

- **Modern UI/UX** - Built with Next.js 14, React 18, and Tailwind CSS
- **Vercel Integration** - Optimized for Vercel deployment with MCP support
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **File Management** - Advanced file explorer with drag-and-drop support
- **AI Chat Interface** - Real-time chat with Claude, Cursor, and Codegen
- **Project Management** - Organize and manage multiple coding projects
- **MCP Protocol** - Full Model Context Protocol integration
- **Dark/Light Mode** - Automatic theme switching
- **Real-time Updates** - WebSocket support for live collaboration

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes, MCP Handler
- **Deployment**: Vercel
- **Protocol**: Model Context Protocol (MCP)

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Vercel account
- Claude Code CLI (optional)

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/claudecodeui-modern.git
   cd claudecodeui-modern
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🚀 Vercel Deployment

### Option 1: One-Click Deploy (Fastest)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/evgenygurin/claudecodeui&project-name=claude-code-ui&repository-name=claudecodeui)

**Just click the button above and deploy in seconds!**

### Option 2: Vercel CLI (Recommended)

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy to Vercel**

   ```bash
   vercel
   ```

4. **Set environment variables**
   ```bash
   vercel env add VERCEL_API_TOKEN
   vercel env add CLAUDE_API_KEY
   # Add other required environment variables
   ```

### Option 2: Vercel Dashboard

1. **Connect your repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure build settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Set environment variables**
   - Add all required environment variables in the dashboard

4. **Deploy**
   - Click "Deploy" to start the deployment process

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Vercel Configuration
VERCEL_API_TOKEN=your_vercel_api_token
VERCEL_PROJECT_ID=your_project_id
VERCEL_TEAM_ID=your_team_id

# Claude Code Configuration
CLAUDE_API_KEY=your_claude_api_key
CLAUDE_PROJECT_PATH=/path/to/claude/projects

# MCP Configuration
MCP_SERVER_URL=http://localhost:3000/api/mcp
MCP_ENABLED=true

# Development Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### MCP Integration

The application includes a built-in MCP server at `/api/mcp` with the following tools:

- `claude_code_execute` - Execute Claude Code CLI commands
- `file_operations` - File system operations (read, write, list, delete)
- `project_management` - Manage Claude Code projects
- `chat_session` - Chat session management
- `git_operations` - Git operations integration

## 📱 Usage

### Dashboard

- View project statistics and recent activity
- Quick access to common actions
- Real-time project status

### Chat Interface

- Communicate with Claude, Cursor, or Codegen
- Support for code generation and debugging
- Message history and session management

### File Manager

- Browse project files and directories
- Drag-and-drop file operations
- Syntax highlighting for code files
- Search and filter capabilities

### Project Management

- Create and manage multiple projects
- Switch between different coding environments
- Project-specific settings and configurations

## 🎨 Customization

### Themes

The application supports both light and dark themes with automatic system preference detection.

### Components

All UI components are built with Radix UI and can be easily customized using Tailwind CSS classes.

### MCP Tools

Add custom MCP tools by extending the server configuration in `src/app/api/mcp/route.ts`.

## 🔒 Security

- All API routes are protected with proper authentication
- Environment variables are securely managed
- CORS is properly configured for cross-origin requests
- Input validation using Zod schemas

## 📊 Performance

- Optimized for Vercel's Edge Network
- Automatic code splitting and lazy loading
- Image optimization with Next.js Image component
- Efficient state management with React hooks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vercel](https://vercel.com) for hosting and deployment platform
- [Anthropic](https://anthropic.com) for Claude AI
- [Radix UI](https://radix-ui.com) for accessible component primitives
- [Tailwind CSS](https://tailwindcss.com) for utility-first CSS framework
- [v0.app](https://v0.app) for design inspiration and templates

## 📞 Support

For support, email support@claudecodeui.com or join our Discord community.

---

**Made with ❤️ for the Claude Code community**
