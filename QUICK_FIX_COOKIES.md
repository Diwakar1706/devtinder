# ⚡ Quick Fix: Cookie Authentication Issue

## 🚨 Problem
After login/signup, editing profile redirects to login page.

## ✅ Solution: Update Render Cookie Settings

### Go to Render Dashboard
1. [Render Dashboard](https://dashboard.render.com)
2. Your backend service → **Environment** tab
3. Update these **3 variables**:

### 1. COOKIE_SECURE
**Set to:** `true`

### 2. COOKIE_SAME_SITE  
**Set to:** `none`

### 3. CORS_ORIGINS
**Add your Vercel URL:**
```
https://devtinder-iota.vercel.app,http://localhost:5173,http://localhost:5174
```

### Save and Wait
- Click **"Save Changes"**
- Wait for redeployment (1-2 minutes)
- Test again!

---

## 🎯 Why This Fixes It

Cross-origin cookies (Vercel → Render) require:
- ✅ `COOKIE_SECURE=true` (HTTPS required)
- ✅ `COOKIE_SAME_SITE=none` (allows cross-origin)
- ✅ CORS must allow credentials

Without these, cookies aren't sent with requests → backend sees no auth → redirects to login.

---

## ✅ After Fix

1. Clear browser cookies
2. Login again
3. Try editing profile
4. Should work! 🎉

---

**For detailed explanation, see:** `FIX_COOKIE_AUTHENTICATION.md`

