# 🚀 Deploy MAITRI Backend to Render

## 📋 Prerequisites
- GitHub repository with your MAITRI project
- Render account (free at https://render.com)
- Twilio account with credentials

## 🔧 Step-by-Step Deployment

### **Step 1: Prepare Your Repository**
Make sure your changes are pushed to GitHub:
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### **Step 2: Create Render Account**
1. Go to **https://render.com**
2. **Sign up** using your GitHub account
3. **Authorize Render** to access your repositories

### **Step 3: Deploy Backend to Render**

#### **Option A: Using Render Dashboard (Recommended)**
1. **Log in to Render Dashboard**
2. **Click "New +"** button
3. **Select "Web Service"**
4. **Connect GitHub Repository:**
   - Choose `alok-devforge/MAITRI`
   - Repository access: Public repository
5. **Configure Service:**
   ```
   Name: maitri-backend
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```

#### **Option B: Using Infrastructure as Code**
1. **Fork/Import Repository** in Render
2. Render will **automatically detect** the `render.yaml` file
3. **Deploy automatically** based on configuration

### **Step 4: Configure Environment Variables**
In Render Dashboard → Your Service → Environment:

**Required Variables:**
```
NODE_ENV = production
PORT = 10000
TWILIO_ACCOUNT_SID = your_account_sid_here
TWILIO_AUTH_TOKEN = your_auth_token_here  
TWILIO_PHONE_NUMBER = +1234567890
```

**How to get Twilio credentials:**
1. Go to https://console.twilio.com
2. Copy **Account SID** and **Auth Token**
3. Purchase a **phone number** for SMS
4. Add these to Render environment variables

### **Step 5: Update Frontend Configuration**
Update your frontend `.env` file to use the new Render URL:

```env
VITE_API_URL=https://maitri-backend.onrender.com
```

**Note:** Replace `maitri-backend` with your actual Render service name.

### **Step 6: Deploy Frontend to Vercel**
```bash
cd frontend
npm run build

# Deploy to Vercel
vercel --prod
```

## 🔗 **Your Deployed URLs**

After deployment, you'll have:
- **Backend:** `https://your-service-name.onrender.com`
- **Frontend:** `https://your-app.vercel.app`

## 🧪 **Test Your Deployment**

### **1. Test Backend Health**
```bash
curl https://your-service-name.onrender.com/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-09-13T10:30:00.000Z",
  "service": "MAITRI Backend API"
}
```

### **2. Test SMS Functionality**
Use your frontend to submit a wildlife report and verify SMS delivery.

## ⚠️ **Important Notes**

### **Free Tier Limitations:**
- **Sleep Mode:** Render free services sleep after 15 minutes of inactivity
- **Cold Starts:** First request after sleep takes 30-60 seconds
- **Monthly Hours:** 750 hours/month on free tier

### **Production Considerations:**
- **Upgrade to Paid Plan** for 24/7 uptime
- **Add Custom Domain** for professional URLs
- **Set up Health Checks** for monitoring
- **Configure Auto-Deploy** from GitHub

## 🔧 **Troubleshooting**

### **Service Won't Start:**
```bash
# Check logs in Render Dashboard
# Common issues:
# 1. Missing environment variables
# 2. Wrong start command
# 3. Port configuration
```

### **SMS Not Working:**
```bash
# Verify in Render logs:
# 1. Twilio credentials are set
# 2. Phone number format (+1234567890)
# 3. Network connectivity
```

### **CORS Issues:**
```bash
# Update backend/server.js:
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend-url.vercel.app'
  ]
}));
```

## 📊 **Monitoring**

### **Render Dashboard:**
- **Logs:** View real-time application logs
- **Metrics:** Monitor CPU, memory, and network usage
- **Events:** Track deployments and service events

### **Health Monitoring:**
```bash
# Add to your monitoring tools:
https://your-service-name.onrender.com/health
```

## 🔄 **Auto-Deployment**

Render automatically deploys when you push to your main branch:
```bash
git add .
git commit -m "Update backend features"
git push origin main
# Render automatically deploys the changes
```

## 🎯 **Next Steps**

1. ✅ **Backend deployed to Render**
2. ✅ **Frontend deployed to Vercel**  
3. ✅ **Environment variables configured**
4. ✅ **SMS functionality tested**
5. 🔜 **Add custom domain** (optional)
6. 🔜 **Set up monitoring** (optional)
7. 🔜 **Upgrade to paid plan** for production use

## 📞 **Support**

- **Render Docs:** https://render.com/docs
- **Render Community:** https://community.render.com
- **MAITRI Issues:** https://github.com/alok-devforge/MAITRI/issues

---

**🌿 Your MAITRI Wildlife Protection System is now live and helping protect wildlife! 🚀**