# Deployment Guide for MAITRI Wildlife Conflict Prevention System

## 🚀 Quick Deployment Steps

### 1. Setup Twilio Account
1. Create account at https://twilio.com
2. Get your Account SID, Auth Token, and Phone Number
3. Add these to your environment variables

### 2. Backend Deployment (Railway/Render)

#### Option A: Railway (Recommended)
1. Go to https://railway.app
2. Connect your GitHub repository
3. Create new project from GitHub repo
4. Select the `backend` folder as root
5. Add environment variables:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN` 
   - `TWILIO_PHONE_NUMBER`
   - `PORT` (Railway will set this automatically)
   - `NODE_ENV=production`

#### Option B: Render
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repo
4. Set root directory to `backend`
5. Set start command: `npm start`
6. Add environment variables

### 3. Frontend Deployment (Vercel)

#### Option A: Vercel (Recommended)
1. Go to https://vercel.com
2. Import your GitHub repository
3. Set root directory to `frontend`
4. Build command: `npm run build`
5. Output directory: `dist`
6. Deploy!

#### Option B: Netlify
1. Go to https://netlify.com
2. Drag and drop the `frontend/dist` folder
3. Or connect GitHub for auto-deployment

### 4. Update Frontend API URL
After backend deployment, update the API URL in your frontend:

```javascript
// In your frontend components
const API_BASE_URL = 'https://your-backend-url.railway.app';
```

### 5. Update CORS in Backend
Update the CORS origin in `server.js` with your deployed frontend URL:

```javascript
origin: ['https://your-frontend-url.vercel.app']
```

## 🔧 Environment Variables Needed

### Backend (.env)
```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
PORT=5000
NODE_ENV=production
```

### Frontend (Optional)
```
VITE_API_URL=https://your-backend-url.railway.app
```

## 📱 Local Development
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## 🌐 Custom Domain (Optional)
- Configure custom domain in Vercel/Netlify dashboard
- Update CORS origins in backend
- Update any hardcoded URLs

## 🛡️ Security Checklist
- [ ] Environment variables are set correctly
- [ ] CORS is configured for production domains only
- [ ] Twilio credentials are secure
- [ ] API endpoints are tested
- [ ] SSL certificates are active

## 📊 Monitoring
- Check Railway/Render logs for backend issues
- Monitor Vercel/Netlify deployment logs
- Test SMS functionality after deployment
- Verify all features work in production

## 🆘 Troubleshooting
- Check deployment logs for errors
- Verify environment variables are set
- Test API endpoints directly
- Check CORS configuration
- Verify Twilio account is active