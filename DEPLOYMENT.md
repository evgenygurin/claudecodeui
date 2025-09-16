# 🚀 Deployment Guide - Claude Code UI

## Quick Deploy to Vercel

### Option 1: One-Click Deploy (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/evgenygurin/claudecodeui&project-name=claude-code-ui&repository-name=claudecodeui)

**Just click the button above and deploy in seconds!**

### Option 2: Manual Deploy via Vercel Dashboard

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import from GitHub:**
   - Repository: `evgenygurin/claudecodeui`
   - Framework Preset: `Next.js`
   - Root Directory: `./` (default)
4. **Configure Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
5. **Set Environment Variables (if needed):**
   ```
   NODE_ENV=production
   ```
6. **Click "Deploy"**

### Option 3: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## 🛠️ Build Configuration

The project is configured for optimal Vercel deployment:

### Next.js Configuration (`next.config.js`)

- ✅ Standalone output for better performance
- ✅ Image optimization enabled
- ✅ Security headers configured
- ✅ Webpack optimizations for Node.js compatibility

### Vercel Configuration (`vercel.json`)

- ✅ Next.js framework detection
- ✅ Build and dev commands configured
- ✅ Security headers
- ✅ Function timeout settings

### Package.json Scripts

- ✅ `vercel-build`: Optimized build command
- ✅ `postinstall`: Disables Next.js telemetry

## 🔧 Environment Variables

### Required (Optional)

```env
NODE_ENV=production
```

### Optional

```env
# Add any custom environment variables here
CUSTOM_KEY=your_value_here
```

## 📊 Performance Optimizations

The deployment includes several performance optimizations:

- **Static Generation**: Pages are pre-rendered for faster loading
- **Image Optimization**: Automatic image optimization with Next.js
- **Code Splitting**: Automatic code splitting for smaller bundles
- **Edge Network**: Global CDN for fast content delivery
- **Compression**: Gzip compression enabled

## 🚨 Troubleshooting

### Build Failures

1. **Check Node.js version**: Ensure you're using Node.js 18+
2. **Clear cache**: Delete `.next` folder and rebuild
3. **Check dependencies**: Run `npm install` to ensure all dependencies are installed

### Runtime Errors

1. **Check environment variables**: Ensure all required env vars are set
2. **Check function logs**: Use Vercel dashboard to view function logs
3. **Check build logs**: Review build output for any warnings or errors

### Common Issues

**Issue**: Build fails with TypeScript errors
**Solution**: Run `npm run type-check` locally to identify issues

**Issue**: Images not loading
**Solution**: Check image domains in `next.config.js`

**Issue**: API routes not working
**Solution**: Ensure API routes are in `src/app/api/` directory

## 📈 Monitoring

### Vercel Analytics

- Enable Vercel Analytics in your dashboard
- Monitor Core Web Vitals
- Track performance metrics

### Error Tracking

- Built-in error tracking with Vercel
- Function logs available in dashboard
- Real-time error notifications

## 🔄 Continuous Deployment

### Automatic Deployments

- Deployments trigger on every push to main branch
- Preview deployments for pull requests
- Branch-specific deployments

### Manual Deployments

```bash
# Deploy specific branch
vercel --prod --target production

# Deploy with specific environment
vercel --prod --env NODE_ENV=production
```

## 🎯 Best Practices

1. **Use Environment Variables**: Store sensitive data in Vercel environment variables
2. **Optimize Images**: Use Next.js Image component for automatic optimization
3. **Monitor Performance**: Enable Vercel Analytics for performance insights
4. **Test Locally**: Always test builds locally before deploying
5. **Use Preview Deployments**: Test changes in preview before production

## 📞 Support

If you encounter any deployment issues:

1. Check the [Vercel Documentation](https://vercel.com/docs)
2. Review the [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
3. Open an issue in the [GitHub Repository](https://github.com/evgenygurin/claudecodeui)

---

**Happy Deploying! 🚀**
