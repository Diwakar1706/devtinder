# 🔧 Configure CORS for Your Deployment

## Your URLs

**Frontend (Vercel):** `https://devtinder-iota.vercel.app/`  
**Backend (Render):** `https://devtinder-backend-niyc.onrender.com`

---

## ✅ Step-by-Step: Update Render CORS

### 1. Go to Render Dashboard
1. Visit: [https://dashboard.render.com](https://dashboard.render.com)
2. Click on your backend service: **`devtinder-backend`**

### 2. Update Environment Variable
1. Click on **"Environment"** tab
2. Find the `CORS_ORIGINS` variable
3. Click **"Edit"** or update the value

### 3. Set CORS_ORIGINS Value

**Copy and paste this exact value:**

```
https://devtinder-iota.vercel.app,http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174
```

**Or if you want to keep it simple (production only):**

```
https://devtinder-iota.vercel.app
```

### 4. Save and Wait
1. Click **"Save Changes"**
2. Render will automatically redeploy (takes 1-2 minutes)
3. Wait for deployment to complete

---

## ✅ Step-by-Step: Update Vercel Environment Variable

### 1. Go to Vercel Dashboard
1. Visit: [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project: **`devtinder-iota`** (or your project name)

### 2. Add Environment Variable
1. Go to **Settings** → **Environment Variables**
2. Click **"Add New"**
3. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://devtinder-backend-niyc.onrender.com`
   - **Environments:** Select all (Production, Preview, Development)
4. Click **"Save"**

### 3. Redeploy Frontend
1. Go to **Deployments** tab
2. Click **"..."** (three dots) on latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

---

## 🧪 Test After Configuration

### Test 1: Backend Health
Open in browser:
```
https://devtinder-backend-niyc.onrender.com/health
```
Should return: `{"status":"ok",...}`

### Test 2: Frontend Connection
1. Open: [https://devtinder-iota.vercel.app/](https://devtinder-iota.vercel.app/)
2. Try to login
3. Open browser console (F12)
4. Check for errors

---

## ✅ Verification Checklist

### Render (Backend)
- [ ] `CORS_ORIGINS` includes: `https://devtinder-iota.vercel.app`
- [ ] `COOKIE_SECURE=true`
- [ ] `COOKIE_SAME_SITE=none`
- [ ] `NODE_ENV=production`
- [ ] Backend redeployed successfully

### Vercel (Frontend)
- [ ] `VITE_API_URL` = `https://devtinder-backend-niyc.onrender.com`
- [ ] Environment variable applied to all environments
- [ ] Frontend redeployed successfully

---

## 🎯 Exact Values to Use

### Render Environment Variables

| Variable | Value |
|----------|-------|
| `CORS_ORIGINS` | `https://devtinder-iota.vercel.app,http://localhost:5173,http://localhost:5174` |
| `COOKIE_SECURE` | `true` |
| `COOKIE_SAME_SITE` | `none` |
| `NODE_ENV` | `production` |

### Vercel Environment Variables

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://devtinder-backend-niyc.onrender.com` |

---

## 🔍 If Still Not Working

1. **Check Browser Console (F12):**
   - Look for CORS errors
   - Check Network tab for failed requests

2. **Check Render Logs:**
   - Render Dashboard → Your Service → Logs
   - Look for CORS-related errors

3. **Verify URLs:**
   - No trailing slashes
   - Use `https://` (not `http://`)
   - URLs are exact matches

4. **Wait for Redeployment:**
   - Both services need to finish redeploying
   - Usually takes 1-2 minutes each

---

## 🎉 After Configuration

Your app should work! The frontend at [https://devtinder-iota.vercel.app/](https://devtinder-iota.vercel.app/) will be able to connect to your backend at `https://devtinder-backend-niyc.onrender.com`.

