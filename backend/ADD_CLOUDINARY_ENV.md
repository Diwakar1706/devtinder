# Where to Add Cloudinary Credentials

Add your Cloudinary credentials to the `.env` file in the `backend` directory.

## Location
**File:** `backend/.env`

## Add These Variables

Add these three lines to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Where to Get Your Credentials

1. Go to [Cloudinary Dashboard](https://console.cloudinary.com/)
2. Log in to your account
3. You'll see your credentials on the dashboard:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## After Adding

1. Save the `.env` file
2. Restart your backend server:
   ```bash
   npm run dev
   # or
   npm start
   ```

## Example .env File (Partial)

```env
# MongoDB Configuration
MONGODB_URI=your_mongodb_uri

# JWT Secret Key
JWT_SECRET=your_jwt_secret

# Server Port
PORT=8001

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# ... other variables
```
