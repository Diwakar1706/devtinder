# Cloudinary Setup Guide

This application uses Cloudinary for storing profile photos. Follow these steps to set up Cloudinary:

## 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a free account (or log in if you already have one)

## 2. Get Your Cloudinary Credentials

1. After logging in, go to your Dashboard
2. You'll see your account details including:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## 3. Add Environment Variables

Add the following environment variables to your `.env` file in the `backend` directory:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Example:**
```env
CLOUDINARY_CLOUD_NAME=demo
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

## 4. Restart Your Server

After adding the environment variables, restart your backend server:

```bash
npm run dev
# or
npm start
```

## Features

- ✅ Automatic image optimization
- ✅ CDN delivery for fast loading
- ✅ Automatic image transformations (resize, crop, format conversion)
- ✅ Secure HTTPS URLs
- ✅ Free tier: 25GB storage, 25GB bandwidth/month

## Notes

- Images are stored in the folder: `devtinder/profiles/`
- Images are automatically optimized and converted to the best format (WebP when supported)
- Profile photos are automatically resized to 400x400px with face detection
- Old images are automatically deleted when users update their profile photos

