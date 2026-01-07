# 🔧 Fix: Cookie Authentication Issue (Redirected to Login)

## 🚨 Problem
After successful login/signup, when trying to edit profile, you get redirected back to login page.

## 🔍 Root Cause
Cookies aren't being sent properly in cross-origin requests (Vercel frontend → Render backend).

---

## ✅ Solution: Fix Cookie Settings in Render

### Step 1: Update Render Environment Variables

Go to [Render Dashboard](https://dashboard.render.com) → Your Backend Service → **Environment** tab

**Update these variables:**

| Variable | Current Value | Required Value |
|----------|--------------|----------------|
| `COOKIE_SECURE` | `false` or missing | `true` ✅ |
| `COOKIE_SAME_SITE` | `lax` or missing | `none` ✅ |
| `CORS_ORIGINS` | (check current) | Must include Vercel URL ✅ |

### Step 2: Exact Values to Set

**1. COOKIE_SECURE:**
```
true
```

**2. COOKIE_SAME_SITE:**
```
none
```

**3. CORS_ORIGINS:**
```
https://devtinder-iota.vercel.app,http://localhost:5173,http://localhost:5174
```

### Step 3: Save and Redeploy

1. Click **"Save Changes"**
2. Render will automatically redeploy
3. Wait for deployment to complete (1-2 minutes)

---

## 🔍 Why This Happens

### Cross-Origin Cookie Requirements

When frontend (Vercel) and backend (Render) are on different domains:
- ✅ `COOKIE_SECURE=true` - Required for HTTPS cookies
- ✅ `COOKIE_SAME_SITE=none` - Required for cross-origin cookies
- ✅ `CORS_ORIGINS` must include frontend URL
- ✅ CORS must allow credentials

### Current Issue

If `COOKIE_SAME_SITE` is set to `lax` (default), cookies **won't be sent** in cross-origin requests. This causes:
- Login works (sets cookie)
- But subsequent requests (like profile edit) don't send the cookie
- Backend sees no cookie → returns 401 → redirects to login

---

## 🧪 Verify the Fix

### Test 1: Check Cookie Settings

After redeploying, check Render logs:
- Should see backend starting successfully
- No cookie-related errors

### Test 2: Test Login Flow

1. Open [https://devtinder-iota.vercel.app/](https://devtinder-iota.vercel.app/)
2. Login successfully
3. Open browser DevTools (F12)
4. Go to **Application** tab → **Cookies**
5. Check if `jwt` cookie is set
6. Check cookie properties:
   - **Secure**: ✅ (should be checked)
   - **SameSite**: None (should show "None")

### Test 3: Test Profile Edit

1. After login, try to edit profile
2. Should work without redirecting to login
3. Check Network tab in DevTools:
   - Profile edit request should include `Cookie` header
   - Response should be 200 (not 401)

---

## 🔧 Additional Checks

### Frontend Configuration

Verify frontend is sending credentials:

**In `frontend/src/components/Profile.jsx`:**
```javascript
const res = await axios.patch(
  BASE_URL + "/profile/edit",
  submitData,
  { withCredentials: true }  // ✅ This should be present
)
```

**In `frontend/src/Body.jsx`:**
```javascript
const res = await axios.get(BASE_URL + "/profile/view", {
  withCredentials: true,  // ✅ This should be present
});
```

### Backend CORS Configuration

Verify CORS allows credentials:

**In `backend/src/app.js`:**
```javascript
const corsOptions = {
  origin: function (origin, callback) {
    // ... origin check
  },
  credentials: true,  // ✅ This should be true
};
```

---

## 📋 Complete Checklist

### Render Environment Variables

- [ ] `COOKIE_SECURE=true`
- [ ] `COOKIE_SAME_SITE=none`
- [ ] `CORS_ORIGINS` includes `https://devtinder-iota.vercel.app`
- [ ] `NODE_ENV=production`
- [ ] Backend redeployed after changes

### Frontend (Vercel)

- [ ] `VITE_API_URL=https://devtinder-backend-niyc.onrender.com`
- [ ] All axios requests use `withCredentials: true`
- [ ] Frontend redeployed

### Browser

- [ ] Clear cookies and cache
- [ ] Try login again
- [ ] Check DevTools → Application → Cookies
- [ ] Verify `jwt` cookie is set with correct properties

---

## 🐛 If Still Not Working

### Check Browser Console

1. Open DevTools (F12)
2. Go to **Console** tab
3. Look for errors like:
   - "Cookie was rejected because SameSite=None"
   - "Cookie was rejected because Secure flag was not set"
   - CORS errors

### Check Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Try to edit profile
4. Check the request:
   - **Request Headers**: Should include `Cookie: jwt=...`
   - **Response Status**: Should be 200 (not 401)
   - **Response Headers**: Should include `Set-Cookie` on login

### Check Render Logs

1. Render Dashboard → Your Service → **Logs**
2. Look for:
   - "Unauthorized" errors
   - Cookie-related errors
   - CORS errors

---

## 🎯 Quick Fix Summary

**In Render Dashboard → Environment Variables:**

1. Set `COOKIE_SECURE=true`
2. Set `COOKIE_SAME_SITE=none`
3. Ensure `CORS_ORIGINS` includes your Vercel URL
4. Save and wait for redeployment

**That's it!** After redeployment, cookies should work properly for cross-origin requests.

---

## 📚 Technical Details

### SameSite Cookie Values

- `Strict`: Cookie only sent in same-site requests
- `Lax`: Cookie sent in same-site and top-level navigation (default)
- `None`: Cookie sent in all contexts, including cross-origin (requires Secure)

### For Cross-Origin (Different Domains)

- ✅ `SameSite=None` + `Secure=true` = Cookies work cross-origin
- ❌ `SameSite=Lax` + `Secure=true` = Cookies **don't** work cross-origin
- ❌ `SameSite=None` + `Secure=false` = Cookies **rejected** by browser

---

**After fixing these settings, your authentication should work properly!** 🎉

