# Deployment Guide for Render

This guide will help you deploy the DevTinder backend to Render.

## Prerequisites

1. A GitHub account with your code pushed to a repository
2. A Render account (sign up at [render.com](https://render.com))
3. MongoDB Atlas account (or your MongoDB connection string)

## Step-by-Step Deployment

### 1. Prepare Your Repository

Make sure your code is pushed to GitHub:
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create a New Web Service on Render

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** button
3. Select **"Web Service"**
4. Connect your GitHub account if not already connected
5. Select your repository (`divTinder-backend` or your repo name)
6. Click **"Connect"**

### 3. Configure the Service

Fill in the following settings:

#### Basic Settings
- **Name**: `devtinder-backend` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend` (if your backend is in a subdirectory)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

#### Environment Variables

Click on **"Environment"** tab and add the following variables:

| Key | Value | Description |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `10000` | Render automatically sets PORT, but you can specify |
| `MONGODB_URI` | `your_mongodb_connection_string` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `your_strong_random_secret` | A strong, random secret for JWT (generate one) |
| `CORS_ORIGINS` | `https://your-frontend-domain.com` | Your frontend URL(s), comma-separated |
| `COOKIE_SECURE` | `true` | Set to true for HTTPS |
| `COOKIE_SAME_SITE` | `none` | Required for cross-origin cookies |
| `REDIS_ENABLED` | `false` | Set to false if not using Redis |

**Important Notes:**
- Replace `your_mongodb_connection_string` with your actual MongoDB connection string
- Generate a strong JWT secret (you can use: `openssl rand -base64 32`)
- Add your frontend URL(s) to `CORS_ORIGINS` (e.g., `https://devtinder-frontend.onrender.com`)
- If deploying multiple frontends, separate URLs with commas: `https://app1.com,https://app2.com`

### 4. Advanced Settings (Optional)

- **Auto-Deploy**: Enable to automatically deploy on every push to main branch
- **Health Check Path**: Leave empty (or set to `/` if you add a health check endpoint)

### 5. Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying your application
3. Wait for the deployment to complete (usually 2-5 minutes)
4. Your service will be available at: `https://your-service-name.onrender.com`

### 6. Verify Deployment

1. Check the logs in Render dashboard to ensure no errors
2. Test your API endpoint: `https://your-service-name.onrender.com/`
3. Check MongoDB connection in logs
4. Test authentication endpoints

## MongoDB Atlas Configuration

If using MongoDB Atlas:

1. Go to your MongoDB Atlas cluster
2. Click **"Network Access"**
3. Add `0.0.0.0/0` to allow connections from anywhere (or Render's IP ranges)
4. Go to **"Database Access"** and ensure your user has proper permissions
5. Get your connection string from **"Connect"** → **"Connect your application"**

## Frontend Configuration

Update your frontend to use the Render backend URL:

```javascript
// In frontend/src/utils/constants.js
export const BASE_URL = process.env.NODE_ENV === 'production' 
  ? "https://your-service-name.onrender.com"
  : "http://localhost:8008";
```

Or use environment variables in your frontend build.

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check that `package.json` has a `start` script
   - Verify all dependencies are listed in `package.json`
   - Check build logs for specific errors

2. **Application Crashes**
   - Check environment variables are set correctly
   - Verify MongoDB connection string is correct
   - Check logs for specific error messages

3. **CORS Errors**
   - Ensure `CORS_ORIGINS` includes your frontend URL
   - Verify `COOKIE_SECURE` is `true` and `COOKIE_SAME_SITE` is `none` for HTTPS

4. **Database Connection Fails**
   - Verify MongoDB Atlas network access allows Render IPs
   - Check connection string format
   - Ensure database user has proper permissions

5. **Socket.io Connection Issues**
   - Ensure CORS origins include your frontend URL
   - Check that WebSocket connections are allowed
   - Verify Socket.io configuration

### Viewing Logs

1. Go to your service in Render dashboard
2. Click on **"Logs"** tab
3. Check for errors or warnings

### Updating Environment Variables

1. Go to your service in Render dashboard
2. Click on **"Environment"** tab
3. Add or modify environment variables
4. Click **"Save Changes"**
5. Service will automatically redeploy

## Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use strong JWT secrets** - Generate random, long strings
3. **Restrict CORS origins** - Only allow your frontend domains
4. **Use HTTPS** - Render provides HTTPS by default
5. **Secure MongoDB** - Use strong passwords and restrict network access
6. **Regular updates** - Keep dependencies updated

## Monitoring

Render provides:
- **Logs**: Real-time application logs
- **Metrics**: CPU, Memory, and Network usage
- **Events**: Deployment and service events

## Cost

- **Free Tier**: 750 hours/month (enough for one service)
- **Paid Plans**: Start at $7/month for more resources

## Support

- Render Documentation: [https://render.com/docs](https://render.com/docs)
- Render Community: [https://community.render.com](https://community.render.com)

---

**Last Updated**: January 2025

