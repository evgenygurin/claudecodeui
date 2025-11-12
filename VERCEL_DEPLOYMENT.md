# Deploying Claude Code UI to Vercel

This guide will help you deploy Claude Code UI to Vercel with Postgres database support.

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free tier works)
- [Vercel CLI](https://vercel.com/cli) installed (optional, but recommended)
- Git repository with your code

## Quick Deploy (Automated)

### Option 1: Deploy via Vercel Dashboard

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Click "Import Project"
   - Select your Git repository
   - Vercel will automatically detect the project settings

3. **Configure Environment Variables**
   - In your Vercel project dashboard, go to "Settings" → "Environment Variables"
   - Add any custom environment variables you need (optional)
   - The database variables will be set automatically in the next step

4. **Create Postgres Database**
   - Go to "Storage" tab in your Vercel project
   - Click "Create Database"
   - Select "Postgres"
   - Choose a name for your database
   - Click "Create"
   - Vercel will automatically connect the database to your project
   - Environment variables (`POSTGRES_URL`, etc.) are automatically added

5. **Deploy**
   - Click "Deploy" or push changes to trigger deployment
   - Wait for the build to complete

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy to Vercel**
   ```bash
   vercel
   ```
   - Follow the prompts to link your project
   - Choose your team (if applicable)
   - Confirm project settings

4. **Create Postgres Database**
   ```bash
   # Via Vercel Dashboard (recommended)
   # Go to Storage → Create Database → Postgres
   ```
   Or use Vercel CLI:
   ```bash
   vercel env pull .env.production
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Database Setup

### Automatic Setup (Recommended)

When you create a Postgres database in Vercel:

1. Vercel automatically sets these environment variables:
   - `POSTGRES_URL` - Connection string for connection pooling
   - `POSTGRES_PRISMA_URL` - Prisma-compatible connection string
   - `POSTGRES_URL_NON_POOLING` - Direct connection string
   - `POSTGRES_USER` - Database username
   - `POSTGRES_HOST` - Database host
   - `POSTGRES_PASSWORD` - Database password
   - `POSTGRES_DATABASE` - Database name

2. The application automatically detects Vercel environment and uses Postgres
3. Database schema is initialized on first run

### Manual Database Initialization (if needed)

If you need to manually initialize the database schema:

```bash
# Connect to your Postgres database
psql $POSTGRES_URL

# Run the schema
\i server/database/postgres-schema.sql

# Verify tables
\dt
```

## Environment Variables

### Required Variables (Automatically Set by Vercel)

- `VERCEL_ENV` - Deployment environment (production/preview/development)
- `POSTGRES_URL` - Postgres connection URL
- All other Postgres variables are automatically set when you create a database

### Optional Variables

You can set these in Vercel Dashboard → Settings → Environment Variables:

- `PORT` - Server port (default: 3001, but Vercel handles this automatically)
- `NODE_ENV` - Set to "production" (automatically set by Vercel)
- `CLAUDE_CLI_PATH` - Path to Claude CLI (if custom)
- `CONTEXT_WINDOW` - Claude Code context window size (default: 160000)

## Architecture Overview

### Database Adapter Pattern

The application uses an intelligent database adapter that automatically switches between:

- **Local Development**: SQLite (`better-sqlite3`)
- **Vercel Deployment**: Postgres (`@vercel/postgres`)

Detection logic in `server/database/db.js`:
```javascript
const isVercel = process.env.VERCEL_ENV || process.env.POSTGRES_URL;
const usePostgres = isVercel || process.env.USE_POSTGRES === 'true';
```

### File Structure

```text
claudecodeui/
├── server/
│   ├── database/
│   │   ├── db.js                  # Smart adapter (SQLite/Postgres)
│   │   ├── postgres-adapter.js    # Vercel Postgres implementation
│   │   ├── postgres-schema.sql    # Postgres schema
│   │   └── init.sql               # SQLite schema (local)
│   └── index.js                   # Express server
├── dist/                          # Built frontend (Vite output)
├── vercel.json                    # Vercel configuration
└── package.json
```

## Troubleshooting

### Build Errors

**Error: `better-sqlite3` build fails on Vercel**

This is expected! The app uses SQLite only for local development. On Vercel, it uses Postgres.

**Solution**: Ensure `vercel.json` is configured correctly (already done).

### Database Connection Issues

**Error: "Cannot connect to database"**

1. Verify Postgres database is created in Vercel dashboard
2. Check environment variables are set (Storage → [Your DB] → .env.local)
3. Redeploy the project: `vercel --prod`

**Error: "Tables not found"**

The schema should initialize automatically on first run. If not:

```bash
# Get database credentials
vercel env pull .env.production

# Connect and initialize
psql $POSTGRES_URL -f server/database/postgres-schema.sql
```

### WebSocket Issues

If you experience WebSocket connection problems:

1. Vercel Serverless Functions have limitations with long-lived connections
2. Consider using Vercel's Edge Network or external WebSocket service
3. Or use Vercel Pro plan with better serverless function limits

## Local Development with Postgres (Optional)

To test Postgres locally before deploying:

1. **Install PostgreSQL locally**
   ```bash
   # macOS
   brew install postgresql@15
   brew services start postgresql@15

   # Or use Docker
   docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:15
   ```

2. **Create local database**
   ```bash
   createdb claudecodeui_dev
   ```

3. **Set environment variable**
   ```bash
   export POSTGRES_URL="postgresql://localhost:5432/claudecodeui_dev"
   export USE_POSTGRES=true
   ```

4. **Initialize schema**
   ```bash
   psql $POSTGRES_URL -f server/database/postgres-schema.sql
   ```

5. **Run the app**
   ```bash
   npm run dev
   ```

## Production Checklist

Before going live:

- [ ] Postgres database created in Vercel
- [ ] All environment variables configured
- [ ] Database schema initialized (automatic on first run)
- [ ] Test authentication flow
- [ ] Test file operations
- [ ] Test WebSocket connections
- [ ] Set up custom domain (optional)
- [ ] Configure monitoring and logging

## Monitoring

### Vercel Dashboard

- **Deployments**: View build logs and deployment history
- **Functions**: Monitor serverless function invocations and errors
- **Analytics**: Track usage and performance (paid feature)
- **Logs**: Real-time logs for debugging (Runtime Logs)

### Database Monitoring

- **Vercel Storage**: View connection stats, query performance
- **Postgres Logs**: Enable query logging for debugging

## Cost Considerations

### Free Tier Limits (Hobby Plan)

- **Deployments**: Unlimited
- **Bandwidth**: 100 GB/month
- **Serverless Function Execution**: 100 GB-Hrs/month
- **Postgres**:
  - 256 MB storage
  - 60 hours compute time/month
  - Shared resources

### Upgrade Triggers

Consider upgrading to Pro if:
- You exceed free tier limits
- Need custom domains on production
- Require better serverless function performance
- Need larger Postgres database
- Want advanced analytics

## Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use Vercel Environment Variables** - Encrypted at rest
3. **Enable Vercel Authentication** - For sensitive deployments
4. **Regular Updates** - Keep dependencies updated
5. **Monitor Logs** - Watch for suspicious activity

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel Functions Docs](https://vercel.com/docs/functions)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)

## Support

For issues specific to:
- **Claude Code UI**: [GitHub Issues](https://github.com/evgenygurin/claudecodeui/issues)
- **Vercel Platform**: [Vercel Support](https://vercel.com/support)
- **Claude Code CLI**: [Anthropic Documentation](https://docs.anthropic.com)

---

**Ready to deploy?** Start with Option 1 (Vercel Dashboard) for the easiest experience!
