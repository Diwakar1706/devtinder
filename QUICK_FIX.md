# ⚡ Quick Fix: Vercel ↔ Render Connection

## 🎯 Two Steps to Fix

### 1. Vercel (Frontend) - Add Environment Variable

**Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

Add:
- **Name:** `VITE_API_URL`
- **Value:** `https://devtinder-backend-niyc.onrender.com`
- **Environments:** All (Production, Preview, Development)

Then **Redeploy** your frontend.

---

### 2. Render (Backend) - Update CORS

**Render Dashboard** → Your Backend Service → **Environment** tab

Find `CORS_ORIGINS` and add your Vercel URL:

```
https://your-vercel-project.vercel.app
```

**Example:**
```
https://devtinder-frontend.vercel.app,http://localhost:5173
```

Then **Save** (Render auto-redeploys).

---

## ✅ That's It!

After both are configured:
1. Wait for deployments to complete
2. Test your frontend
3. Should work! 🎉

---

**For detailed guide, see:** `FIX_VERCEL_RENDER_CONNECTION.md`

