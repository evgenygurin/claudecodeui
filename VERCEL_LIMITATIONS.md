# Vercel Deployment - Known Limitations

## Current Status

✅ **Working**: Frontend UI, базовые API endpoints
❌ **Not Working**: WebSocket, real-time Claude interactions, terminal sessions

## Technical Limitations

### WebSocket Support

**Problem**: Claude Code UI активно использует WebSocket для:
- Реального времени общения с Claude SDK
- Terminal sessions (PTY)
- Live file updates
- Project synchronization

**Vercel Limitation**: Serverless Functions на Hobby плане **НЕ поддерживают WebSocket**.

### What Works on Vercel

- ✅ Static frontend (React SPA)
- ✅ Authentication endpoints (`/api/auth/*`)
- ✅ Git operations (`/api/git/*`)
- ✅ Settings management (`/api/settings/*`)
- ✅ Projects listing (`/api/projects/*`)
- ✅ Database (Postgres) integration

### What Doesn't Work

- ❌ Claude SDK interactions (требует WebSocket)
- ❌ Terminal sessions (требует node-pty и WebSocket)
- ❌ Real-time file updates
- ❌ MCP server connections
- ❌ Cursor CLI integration
- ❌ Live chat with Claude

## Recommended Solutions

### Option 1: Use Alternative Platform (Recommended)

Deploy full application with WebSocket support on platforms that support long-running processes:

**Best choices:**
- **Railway** - https://railway.app (generous free tier, full WebSocket support)
- **Render** - https://render.com (free tier available, supports WebSocket)
- **Fly.io** - https://fly.io (Docker-based, full control)
- **Heroku** - https://heroku.com (classic choice, WebSocket supported)

**Migration steps:**
1. Create account on chosen platform
2. Connect GitHub repository
3. Set environment variables (Postgres credentials)
4. Deploy automatically from main branch

### Option 2: Hybrid Deployment

- **Frontend**: Deploy on Vercel (fast CDN, great performance)
- **Backend**: Deploy on Railway/Render (WebSocket support)

**Steps:**
1. Keep frontend on Vercel (current deployment)
2. Deploy `server/` to Railway/Render
3. Update frontend API URL to point to backend server
4. Configure CORS on backend to allow Vercel frontend

### Option 3: Local Development Only

Use Vercel deployment только для демонстрации UI, а actual работу с Claude вести локально:

```bash
# Local full-featured development
npm run dev

# Access at http://localhost:3001
```

## Current Vercel Setup

**Live URL**: https://claudecodeui-theta.vercel.app

**What you can do:**
- View the UI
- Login with credentials (goldmeat / P58tbs2uu_)
- Browse projects list
- View settings

**What won't work:**
- Starting new Claude chat sessions
- Terminal access
- File operations requiring Claude SDK
- Real-time features

## Database Access

✅ **Postgres database is connected and working**

Connection details in Vercel environment variables:
- POSTGRES_URL
- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_HOST
- POSTGRES_DATABASE

User created: `goldmeat` (password: `P58tbs2uu_`)

## Next Steps

**Recommended**: Deploy to Railway for full functionality

```bash
# Quick deploy to Railway
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
railway init

# 4. Add Postgres
railway add postgres

# 5. Deploy
railway up

# 6. Set environment variables from Vercel
railway variables set POSTGRES_URL="..."
```

## Questions?

- Vercel is great for static sites and simple APIs
- For real-time applications with WebSocket, use platforms designed for that
- This project requires long-running process support

**TL;DR**: Vercel deployment works partially. For full Claude Code UI functionality, use Railway or Render.
