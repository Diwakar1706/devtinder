# 🔧 Fix: Cookies Not Working in Production (Vercel → Render)

## 🚨 Problem
- ✅ Works locally
- ❌ Cookies not received in production
- ❌ Redirected to login after successful login/signup

## 🔍 Root Cause
Cross-origin cookies require specific settings that must be configured in **Render environment variables**.

---

## ✅ Solution: Update Render Environment Variables

### Step 1: Go to Render Dashboard
1. Visit: [https://dashboard.render.com](https://dashboard.render.com)
2. Click on your backend: **`devtinder-backend`**
3. Go to **Environment** tab

### Step 2: Set These EXACT Values

| Variable | Value | Why |
|----------|-------|-----|
| `COOKIE_SECURE` | `true` | Required for HTTPS cookies |
| `COOKIE_SAME_SITE` | `none` | Required for cross-origin cookies |
| `CORS_ORIGINS` | `https://devtinder-iota.vercel.app,http://localhost:5173,http://localhost:5174` | Must include your Vercel URL |

### Step 3: Verify NODE_ENV
Make sure `NODE_ENV` is set to:
```
production
```

### Step 4: Save and Redeploy
1. Click **"Save Changes"**
2. Render will automatically redeploy
3. Wait 1-2 minutes for deployment

---

## 🔍 How to Verify Cookie Settings

### Check Render Logs
After redeployment, check logs for:
- ✅ "Database connected successfully"
- ✅ "HTTP Server is successfully listening"
- ❌ No cookie-related errors

### Check Browser DevTools
1. Open your Vercel app: [https://devtinder-iota.vercel.app/](https://devtinder-iota.vercel.app/)
2. Open DevTools (F12)
3. Go to **Application** tab → **Cookies**
4. Login
5. Check if `jwt` cookie appears with:
   - **Secure**: ✅ Checked
   - **SameSite**: None
   - **HttpOnly**: ✅ (won't show in DevTools, but it's set)

### Check Network Tab
1. Open DevTools (F12) → **Network** tab
2. Login
3. Check the login request:
   - **Response Headers**: Should include `Set-Cookie: jwt=...`
   - Cookie should have: `Secure; HttpOnly; SameSite=None`
4. Check profile request:
   - **Request Headers**: Should include `Cookie: jwt=...`

---

## 🐛 Common Issues

### Issue 1: Cookie Not Set
**Symptoms:** Login succeeds but no cookie in browser

**Check:**
- ✅ `COOKIE_SECURE=true` in Render
- ✅ `COOKIE_SAME_SITE=none` in Render
- ✅ Backend is using HTTPS (Render provides this)
- ✅ Frontend is using HTTPS (Vercel provides this)

### Issue 2: Cookie Not Sent
**Symptoms:** Cookie is set but not sent with requests

**Check:**
- ✅ Frontend uses `withCredentials: true` (already done ✅)
- ✅ CORS allows credentials (already configured ✅)
- ✅ `CORS_ORIGINS` includes Vercel URL
- ✅ Cookie `SameSite=None` and `Secure=true`

### Issue 3: Cookie Rejected by Browser
**Symptoms:** Browser console shows cookie warnings

**Check Browser Console for:**
- "Cookie was rejected because SameSite=None was not Secure"
  - **Fix:** Set `COOKIE_SECURE=true`
- "Cookie was rejected because SameSite attribute was invalid"
  - **Fix:** Set `COOKIE_SAME_SITE=none`

---

## 📋 Complete Environment Variables Checklist

### Required in Render:

```
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CORS_ORIGINS=https://devtinder-iota.vercel.app,http://localhost:5173,http://localhost:5174
COOKIE_SECURE=true
COOKIE_SAME_SITE=none
PORT=10000
REDIS_ENABLED=false
```

---

## 🧪 Test After Fix

### Test 1: Login Flow
1. Clear browser cookies
2. Go to [https://devtinder-iota.vercel.app/](https://devtinder-iota.vercel.app/)
3. Login
4. Check DevTools → Application → Cookies
5. Should see `jwt` cookie

### Test 2: Profile Access
1. After login, try to edit profile
2. Should NOT redirect to login
3. Profile should load/edit successfully

### Test 3: Network Inspection
1. Open DevTools → Network tab
2. Try to edit profile
3. Check request headers:
   - Should include: `Cookie: jwt=...`
4. Check response:
   - Should be 200 (not 401)

---

## 🔧 Code Changes Made

I've updated the cookie settings in the code to:
- ✅ Always set `path: "/"` for cookies
- ✅ Properly handle `sameSite: "none"` for cross-origin
- ✅ Better error handling for expired/invalid tokens
- ✅ Added debugging logs (in development mode)

**You still need to:**
1. ✅ Push code changes to GitHub
2. ✅ Update Render environment variables (as shown above)
3. ✅ Wait for redeployment

---

## 🎯 Quick Fix Summary

**In Render Dashboard → Environment Variables:**

1. Set `COOKIE_SECURE=true`
2. Set `COOKIE_SAME_SITE=none`
3. Ensure `CORS_ORIGINS` includes `https://devtinder-iota.vercel.app`
4. Save and wait for redeployment

**That's it!** After this, cookies will work in production.

---

## 📚 Technical Details

### Cross-Origin Cookie Requirements

For cookies to work across different domains (Vercel → Render):

1. **Both must use HTTPS**
   - ✅ Vercel: `https://devtinder-iota.vercel.app`
   - ✅ Render: `https://devtinder-backend-niyc.onrender.com`

2. **Cookie must have:**
   - ✅ `Secure=true` (HTTPS only)
   - ✅ `SameSite=None` (allows cross-origin)
   - ✅ `HttpOnly=true` (security)
   - ✅ `Path=/` (available for all routes)

3. **CORS must allow:**
   - ✅ `credentials: true`
   - ✅ Frontend origin in allowed origins

### Why It Works Locally

Locally, both frontend and backend are on `localhost` (same origin), so:
- ✅ Cookies work with `SameSite=Lax` (default)
- ✅ No cross-origin issues
- ✅ Less strict requirements

### Why It Fails in Production

In production, frontend and backend are on different domains:
- ❌ `SameSite=Lax` doesn't send cookies cross-origin
- ❌ Need `SameSite=None` + `Secure=true`
- ❌ Must be configured in environment variables

---

## 🆘 Still Not Working?

1. **Check Render Logs:**
   - Look for cookie-related errors
   - Verify environment variables are set

2. **Check Browser Console:**
   - Look for CORS errors
   - Look for cookie warnings

3. **Verify Environment Variables:**
   - Double-check values in Render dashboard
   - Ensure no typos
   - Ensure values are saved

4. **Clear Everything:**
   - Clear browser cookies
   - Clear cache
   - Try in incognito mode

---

**After fixing these settings, your authentication will work in production!** 🎉

