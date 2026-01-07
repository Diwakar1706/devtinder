# 🔧 Fix: Frontend (Vercel) ↔ Backend (Render) Connection

## 🚨 Problem
Frontend on Vercel can't connect to backend on Render. Error: "Unable to connect to server"

## ✅ Solution: Configure Both Services

You need to configure **2 things**:

---

## 1️⃣ Configure Vercel (Frontend)

### Step 1: Add Environment Variable in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your **frontend project**
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"**
5. Add this variable:

   **Name:** `VITE_API_URL`  
   **Value:** `https://devtinder-backend-niyc.onrender.com`  
   **Environment:** Production, Preview, Development (select all)

6. Click **"Save"**

### Step 2: Redeploy

After adding the environment variable:
1. Go to **Deployments** tab
2. Click **"..."** (three dots) on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

---

## 2️⃣ Configure Render (Backend)

### Step 1: Add Vercel URL to CORS

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your **backend service** (`devtinder-backend`)
3. Go to **Environment** tab
4. Find `CORS_ORIGINS` variable
5. **Add your Vercel frontend URL** to it:

   **Current value might be:**
   ```
   http://localhost:5173,http://localhost:5174
   ```

   **Update to (add your Vercel URL):**
   ```
   https://your-frontend-project.vercel.app,http://localhost:5173,http://localhost:5174
   ```

   **Replace `your-frontend-project.vercel.app` with your actual Vercel URL!**

6. Click **"Save Changes"**
7. Render will automatically redeploy

### Step 2: Verify Environment Variables

Make sure these are set in Render:

| Variable | Value | Status |
|----------|-------|--------|
| `NODE_ENV` | `production` | ✅ Required |
| `MONGODB_URI` | Your MongoDB URL | ✅ Required |
| `JWT_SECRET` | Your secret | ✅ Required |
| `CORS_ORIGINS` | `https://your-vercel-url.vercel.app` | ✅ **Must include Vercel URL** |
| `COOKIE_SECURE` | `true` | ✅ Required for HTTPS |
| `COOKIE_SAME_SITE` | `none` | ✅ Required for cross-origin |
| `PORT` | `10000` | ✅ Render sets this automatically |

---

## 🧪 Test the Connection

### Test 1: Backend Health Check
Open in browser:
```
https://devtinder-backend-niyc.onrender.com/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "..."
}
```

### Test 2: Frontend Connection
1. Open your Vercel frontend URL
2. Try to login
3. Check browser console (F12) for errors
4. Check Network tab to see if requests are going to Render backend

---

## 🔍 Troubleshooting

### Issue 1: CORS Error in Browser Console

**Error:** `Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS policy`

**Solution:**
- ✅ Add Vercel URL to `CORS_ORIGINS` in Render
- ✅ Make sure URL starts with `https://`
- ✅ No trailing slash
- ✅ Redeploy backend after updating

### Issue 2: 404 or Connection Refused

**Error:** `Unable to connect to server`

**Solution:**
- ✅ Check `VITE_API_URL` is set in Vercel
- ✅ Value should be: `https://devtinder-backend-niyc.onrender.com`
- ✅ No trailing slash
- ✅ Redeploy frontend after adding variable

### Issue 3: Cookies Not Working

**Error:** Login works but session doesn't persist

**Solution:**
- ✅ Set `COOKIE_SECURE=true` in Render
- ✅ Set `COOKIE_SAME_SITE=none` in Render
- ✅ Frontend must use `withCredentials: true` in axios (already done)

### Issue 4: Socket.io Connection Fails

**Error:** WebSocket connection fails

**Solution:**
- ✅ Add Vercel URL to `CORS_ORIGINS` in Render
- ✅ Socket.io uses same CORS configuration
- ✅ Check browser console for specific error

---

## 📋 Quick Checklist

### Vercel (Frontend)
- [ ] `VITE_API_URL` environment variable added
- [ ] Value: `https://devtinder-backend-niyc.onrender.com`
- [ ] Applied to all environments (Production, Preview, Development)
- [ ] Frontend redeployed after adding variable

### Render (Backend)
- [ ] `CORS_ORIGINS` includes Vercel URL
- [ ] `COOKIE_SECURE=true`
- [ ] `COOKIE_SAME_SITE=none`
- [ ] `NODE_ENV=production`
- [ ] Backend redeployed after changes

---

## 🎯 Your Specific URLs

Based on your deployment:

**Backend (Render):**
```
https://devtinder-backend-niyc.onrender.com
```

**Frontend (Vercel):**
```
https://your-project-name.vercel.app
```
*(Replace with your actual Vercel URL)*

---

## ✅ After Configuration

1. **Vercel:** Set `VITE_API_URL=https://devtinder-backend-niyc.onrender.com`
2. **Render:** Add Vercel URL to `CORS_ORIGINS`
3. **Both:** Wait for redeployment
4. **Test:** Try logging in from Vercel frontend

---

## 🆘 Still Not Working?

1. **Check Vercel Logs:**
   - Vercel Dashboard → Your Project → Deployments → Latest → Logs
   - Look for API call errors

2. **Check Render Logs:**
   - Render Dashboard → Your Service → Logs
   - Look for CORS errors or connection issues

3. **Check Browser Console:**
   - Open DevTools (F12)
   - Check Console and Network tabs
   - Look for specific error messages

4. **Verify URLs:**
   - Backend health: `https://devtinder-backend-niyc.onrender.com/health`
   - Frontend: Your Vercel URL
   - Make sure both are accessible

---

**Need help?** Check the specific error message in browser console and share it!

