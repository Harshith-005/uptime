# UptimeGuard Deployment Guide

## Vercel Environment Variables
Add these in Vercel Dashboard → Project → Settings → Environment Variables:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CRON_SECRET=
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

## GitHub Repository Secrets
Add these in GitHub → Repository → Settings → Secrets → Actions:

APP_URL=https://your-domain.vercel.app
CRON_SECRET= (same value as Vercel)

## GitHub Actions Setup
1. Push code to GitHub
2. GitHub Actions will automatically run .github/workflows/monitor.yml
3. To test manually: go to Actions tab → UptimeGuard Monitor → Run workflow

## Supabase Setup
1. Enable Google OAuth in Supabase Dashboard → Authentication → Providers
2. Add your Vercel domain to allowed redirect URLs:
   https://your-domain.vercel.app/auth/callback
3. Add localhost for development:
   http://localhost:3000/auth/callback

## Post-Deployment Checklist
- [ ] All env variables set in Vercel
- [ ] GitHub secrets added
- [ ] Google OAuth configured in Supabase
- [ ] Test registration flow
- [ ] Add a test website
- [ ] Manually trigger GitHub Action to test monitoring
- [ ] Verify email alert received
- [ ] Check public status page loads
