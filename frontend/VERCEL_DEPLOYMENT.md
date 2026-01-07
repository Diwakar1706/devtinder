# 🚀 Deploy Frontend to Vercel

This guide will help you deploy your React + Vite frontend to Vercel.

## ✅ Why Vercel?

- **Best for Frontend**: Optimized for React/Vite applications
- **Fast CDN**: Global edge network for instant loading
- **Easy Setup**: Automatic deployments from GitHub
- **Free Tier**: Generous free tier with great performance
- **Zero Configuration**: Works out of the box with Vite

---

## 📋 Prerequisites

1. ✅ Backend deployed on Render (you should have the URL)
2. ✅ Frontend code pushed to GitHub
3. ✅ Vercel account (sign up at [vercel.com](https://vercel.com))

---

## 🚀 Step-by-Step Deployment

### Step 1: Push Code to GitHub

Make sure your frontend code is pushed to GitHub:

```bash
cd frontend
git add .
git commit -m "Ready for Vercel deployment"
git push
```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Sign up with GitHub (recommended for easy integration)

### Step 3: Import Project

1. After signing in, click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Select the repository containing your frontend code

### Step 4: Configure Project

Vercel will auto-detect Vite, but verify these settings:

#### Framework Preset
- **Framework Preset**: `Vite` (should be auto-detected)

#### Build Settings
- **Root Directory**: `frontend` (if frontend is in a subdirectory)
  - If your frontend is at the root, leave this empty
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

#### Environment Variables

Click on **"Environment Variables"** and add:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `VITE_API_URL` | `https://your-backend.onrender.com` | Your Render backend URL |

**Important:**
- Replace `your-backend.onrender.com` with your actual Render backend URL
- **No trailing slash** (e.g., `https://devtinder-backend.onrender.com`)
- Must use `https://` (not `http://`)

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (usually 1-2 minutes)
3. Your app will be live at: `https://your-project-name.vercel.app`

---

## 🔧 Configuration Details

### Environment Variables

Vite requires environment variables to be prefixed with `VITE_` to be accessible in the browser.

**In Vercel Dashboard:**
- Variable: `VITE_API_URL`
- Value: `https://your-backend.onrender.com`

**The code automatically uses this:**
```javascript
export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8008";
```

### CORS Configuration

Make sure your backend (Render) has your Vercel frontend URL in `CORS_ORIGINS`:

```
CORS_ORIGINS=https://your-project-name.vercel.app
```

Or if you have a custom domain:
```
CORS_ORIGINS=https://your-custom-domain.com
```

---

## 🎯 After Deployment

### 1. Test Your App

Visit your Vercel URL and test:
- ✅ Login/Signup
- ✅ API calls to backend
- ✅ Socket.io connections
- ✅ Image loading

### 2. Update Backend CORS

Go to Render Dashboard → Your Backend Service → Environment:
- Add your Vercel URL to `CORS_ORIGINS`:
  ```
  CORS_ORIGINS=https://your-project-name.vercel.app
  ```
- Save and redeploy backend

### 3. Check Vercel Logs

1. Go to Vercel Dashboard
2. Click on your project
3. Go to **"Deployments"** tab
4. Click on latest deployment
5. Check **"Build Logs"** for any errors

---

## 🔄 Automatic Deployments

Vercel automatically deploys when you push to:
- **Production**: `main` or `master` branch
- **Preview**: Any other branch (creates preview URLs)

### Custom Domain (Optional)

1. Go to Project Settings → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

---

## 🐛 Troubleshooting

### Issue 1: API Calls Fail (CORS Errors)

**Solution:**
- Add Vercel URL to backend `CORS_ORIGINS` in Render
- Ensure `VITE_API_URL` is set correctly in Vercel
- Check backend logs in Render

### Issue 2: Environment Variable Not Working

**Solution:**
- Ensure variable name starts with `VITE_`
- Redeploy after adding environment variables
- Check variable is set in Vercel dashboard

### Issue 3: Build Fails

**Check:**
- All dependencies in `package.json`
- Build logs in Vercel dashboard
- Node version compatibility

### Issue 4: Socket.io Connection Fails

**Solution:**
- Ensure backend URL in `VITE_API_URL` uses `https://`
- Check backend CORS allows Vercel domain
- Verify Socket.io is configured correctly on backend

### Issue 5: Images Not Loading

**Solution:**
- Check image URLs use full backend URL
- Verify backend serves static files correctly
- Check CORS for image requests

---

## 📊 Vercel Dashboard Features

### Analytics
- View page views, visitors, and performance metrics

### Logs
- Real-time function logs
- Build logs
- Runtime logs

### Deployments
- View all deployments
- Rollback to previous versions
- Preview deployments for branches

---

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit sensitive data
2. **HTTPS**: Vercel provides HTTPS automatically
3. **CORS**: Restrict CORS origins on backend
4. **API Keys**: Store in Vercel environment variables

---

## 💰 Pricing

### Free Tier Includes:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Preview deployments

### Paid Plans:
- Start at $20/month for more features

---

## 📚 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
- Vite Deployment: https://vitejs.dev/guide/static-deploy.html#vercel

---

## ✅ Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Root directory set to `frontend` (if needed)
- [ ] `VITE_API_URL` environment variable set
- [ ] Backend CORS updated with Vercel URL
- [ ] Deployment successful
- [ ] App tested and working

---

## 🎉 You're Done!

Your frontend is now live on Vercel! 🚀

**Next Steps:**
1. Test all features
2. Share your app URL
3. Set up custom domain (optional)
4. Monitor analytics

---

**Need Help?**
- Vercel Support: https://vercel.com/support
- Check deployment logs
- Verify environment variables

