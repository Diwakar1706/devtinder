# ✅ How to Check if Your Backend is Running on Render

After deploying to Render, here are multiple ways to verify your backend is running:

## 🔍 Method 1: Render Dashboard (Easiest)

### Check Service Status
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your service (`devtinder-backend`)
3. Look at the top of the page:
   - ✅ **"Live"** status = Backend is running
   - ❌ **"Failed"** or **"Stopped"** = Backend is not running

### Check Logs
1. In your service page, click on **"Logs"** tab
2. Look for these success messages:
   ```
   ✅ Database connected successfully
   ✅ HTTP Server is successfully listening on port 10000
   ✅ WebSocket Server is ready for connections
   ```
3. If you see errors, check the error messages

---

## 🌐 Method 2: Health Check Endpoint

Your backend has a health check endpoint at `/health`

### Using Browser
1. Open your browser
2. Go to: `https://your-service-name.onrender.com/health`
3. You should see:
   ```json
   {
     "status": "ok",
     "message": "Server is running",
     "timestamp": "2025-01-07T..."
   }
   ```

### Using curl (Terminal)
```bash
curl https://your-service-name.onrender.com/health
```

Expected response:
```json
{"status":"ok","message":"Server is running","timestamp":"2025-01-07T18:35:00.000Z"}
```

### Using Postman/Thunder Client
1. Create a new GET request
2. URL: `https://your-service-name.onrender.com/health`
3. Send request
4. Should return status `200 OK` with JSON response

---

## 🧪 Method 3: Test API Endpoints

### Test Root Endpoint
```bash
# Using curl
curl https://your-service-name.onrender.com/

# Or open in browser
https://your-service-name.onrender.com/
```

### Test Login Endpoint (POST)
```bash
curl -X POST https://your-service-name.onrender.com/login \
  -H "Content-Type: application/json" \
  -d '{"emailId":"test@example.com","password":"test123"}' \
  -v
```

### Test Signup Endpoint (POST)
```bash
curl -X POST https://your-service-name.onrender.com/signup \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","emailId":"test@example.com","password":"test123"}' \
  -v
```

---

## 📊 Method 4: Check Render Metrics

1. Go to Render Dashboard → Your Service
2. Click on **"Metrics"** tab
3. Check:
   - **CPU Usage** - Should show activity
   - **Memory Usage** - Should show memory being used
   - **Network** - Should show incoming/outgoing traffic
   - **Request Rate** - Should show requests if you're testing

---

## 🔍 Method 5: Check Environment Variables

1. Go to Render Dashboard → Your Service
2. Click on **"Environment"** tab
3. Verify all required variables are set:
   - ✅ `MONGODB_URI`
   - ✅ `JWT_SECRET`
   - ✅ `NODE_ENV=production`
   - ✅ `CORS_ORIGINS`
   - ✅ `PORT`
   - ✅ `COOKIE_SECURE`
   - ✅ `COOKIE_SAME_SITE`

---

## ⚠️ Common Issues & Solutions

### Issue 1: Service Shows "Failed" or "Stopped"

**Check Logs for:**
- Database connection errors
- Missing environment variables
- Port conflicts
- Build errors

**Solutions:**
- Verify all environment variables are set
- Check MongoDB connection string is correct
- Ensure MongoDB Atlas allows Render IPs

### Issue 2: Health Check Returns 404

**Possible Causes:**
- Service not fully deployed
- Wrong URL
- Route not configured

**Solutions:**
- Wait a few minutes for deployment to complete
- Verify the URL is correct
- Check logs for errors

### Issue 3: Health Check Returns Error

**Check:**
- Service logs for specific error messages
- Environment variables are correct
- Database connection is working

### Issue 4: CORS Errors in Browser Console

**Solutions:**
- Verify `CORS_ORIGINS` includes your frontend URL
- Check `COOKIE_SECURE=true` and `COOKIE_SAME_SITE=none`
- Ensure frontend URL has `https://` protocol

### Issue 5: Database Connection Failed

**Check:**
- MongoDB Atlas Network Access allows `0.0.0.0/0`
- Connection string is correct
- Database user has proper permissions

---

## 🎯 Quick Status Check Checklist

- [ ] Service status shows "Live" in Render Dashboard
- [ ] Logs show "Database connected successfully"
- [ ] Logs show "HTTP Server is successfully listening"
- [ ] Health endpoint returns `{"status":"ok"}`
- [ ] Can access backend URL in browser
- [ ] API endpoints respond (even with errors, they should respond)
- [ ] Metrics show CPU/Memory activity

---

## 📱 Quick Test Script

Save this as `test-backend.js` and run: `node test-backend.js`

```javascript
const https = require('https');

const backendUrl = 'https://your-service-name.onrender.com';

// Test health endpoint
https.get(`${backendUrl}/health`, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('✅ Health Check Response:');
    console.log(JSON.parse(data));
    console.log(`\n✅ Status Code: ${res.statusCode}`);
    console.log(`\n✅ Backend is ${res.statusCode === 200 ? 'RUNNING' : 'NOT RUNNING'}`);
  });
}).on('error', (err) => {
  console.error('❌ Error:', err.message);
  console.log('❌ Backend is NOT accessible');
});
```

---

## 🆘 Still Having Issues?

1. **Check Render Logs** - Most detailed information
2. **Verify Environment Variables** - All required vars are set
3. **Test Locally First** - Ensure backend works locally with same env vars
4. **Check MongoDB Atlas** - Network access and connection string
5. **Render Support** - Contact Render support if service won't start

---

## 📞 Useful Links

- Render Dashboard: https://dashboard.render.com
- Render Docs: https://render.com/docs
- Your Service URL: `https://your-service-name.onrender.com`

---

**Quick Test:** Open `https://your-service-name.onrender.com/health` in your browser right now! 🚀

