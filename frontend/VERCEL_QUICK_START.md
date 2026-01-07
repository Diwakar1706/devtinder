# ⚡ Quick Start: Deploy to Vercel

## 🚀 3-Minute Deployment

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel"
git push
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repo
4. Configure:
   - **Root Directory**: `frontend` (if backend is in subdirectory)
   - **Framework**: Vite (auto-detected)
5. Add Environment Variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend.onrender.com` (your Render backend URL)
6. Click **"Deploy"**

### 3. Update Backend CORS

In Render Dashboard → Backend Service → Environment:
- Add to `CORS_ORIGINS`: `https://your-project.vercel.app`

### 4. Done! 🎉

Your app is live at: `https://your-project.vercel.app`

---

## ✅ Checklist

- [ ] Code on GitHub
- [ ] Vercel account created
- [ ] `VITE_API_URL` set in Vercel
- [ ] Backend CORS updated
- [ ] App tested

---

## 🔧 Environment Variable

**In Vercel:**
```
VITE_API_URL=https://your-backend.onrender.com
```

**Important:**
- Must start with `VITE_` for Vite
- Use `https://` (not `http://`)
- No trailing slash

---

For detailed guide, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

