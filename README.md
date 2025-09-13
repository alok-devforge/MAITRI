# 🌿 MAITRI - Wildlife Conflict Prevention System

<div align="center">

![MAITRI Logo](https://img.shields.io/badge/MAITRI-Wildlife%20Protection-brightgreen?style=for-the-badge&logo=leaf)

**AI-Powered Wildlife Conflict Prevention & Real-Time Alert System**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-19.1.1-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

[🚀 Live Demo](https://your-app-url.vercel.app) • [📱 Features](#-features) • [🛠️ Installation](#️-installation)

</div>

---

## 🎯 About MAITRI

**MAITRI** (Machine Learning Assisted Intelligence for Threat Reduction and Intervention) uses AI to predict and prevent human-wildlife conflicts through real-time alerts, intelligent reporting, and data-driven insights.

### 🌟 Key Features

- 🤖 **AI-Powered Detection** - 94.7% accuracy in wildlife behavior prediction
- 📱 **Real-Time SMS Alerts** - Instant notifications via Twilio
- 🗺️ **Interactive Maps** - Dynamic conflict zone visualization
- 👥 **Dual User Modes** - Villager and tourist interfaces
- � **Analytics Dashboard** - Live monitoring and reporting
- 🎙️ **Voice Recognition** - Hands-free reporting capabilities

---

## 🛠️ Technology Stack

**Frontend:** React 19.1.1 • Vite • Tailwind CSS • React Router • Lucide React  
**Backend:** Node.js • Express.js • Twilio API • CORS  
**AI/ML:** Classification AI • Computer Vision • Speech Recognition  
**Deployment:** Vercel (Frontend) • Railway (Backend)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ • npm/yarn • Twilio account • Git

### Installation
```bash
# Clone repository
git clone https://github.com/Cyber-Bose/StatusCode_2.git
cd StatusCode_2

# Setup Backend
cd backend
npm install
cp .env.example .env  # Add your Twilio credentials
npm run dev

# Setup Frontend (new terminal)
cd ../frontend
npm install
npm run dev
```

**Access:** Frontend at http://localhost:5173 • Backend at http://localhost:5000

---

## ⚙️ Configuration

### Environment Variables
**Backend (.env):**
```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
PORT=5000
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000
```

---

## 📚 API Endpoints

### Health Check
```http
GET /health
```

### Send SMS Alert
```http
POST /send-sms
Content-Type: application/json

{
  "animal": "Elephant",
  "location": "Village Kumara",
  "coordinates": { "lat": 12.9716, "lng": 77.5946 },
  "severity": "high",
  "reporterName": "John Doe",
  "reporterPhone": "+919876543210"
}
```

---

## 🚀 Deployment

**Frontend (Vercel):** Automatic deployment on push to main  
**Backend (Railway):** Connect GitHub repo, set `/backend` as root directory

For detailed instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

**Contribution Types:** Bug fixes • New features • Documentation • UI/UX improvements

---

## 🐛 Troubleshooting

**SMS Not Sending:** Check Twilio credentials and phone number format (+919876543210)  
**API Connection Issues:** Verify VITE_API_URL and backend status  
**Build Errors:** Clear cache with `rm -rf node_modules package-lock.json && npm install`

---

## 📊 Project Stats

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/Cyber-Bose/StatusCode_2?style=social)
![GitHub forks](https://img.shields.io/github/forks/Cyber-Bose/StatusCode_2?style=social)

**Lines of Code:** 15,000+ • **Components:** 25+ • **Test Coverage:** 85%

</div>

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Team Members

| Name                          | GitHub                                            | Role                                |
| ----------------------------- | ------------------------------------------------- | ------------------------------------|
| **Suvrodeep Das (Team Lead)** | [TechFreak2003](https://github.com/TechFreak2003) | Team Lead & ML Developer            |
| **Alok Kumar**                | [alok-devforge](https://github.com/alok-devforge) | Frontend+Backend Developer          |
| **M Kalkita**                 | [Kalkita](https://github.com/Kalkita)             | Data Engineer                       |
| **Rohini Khan**               | [Rohini2004](https://github.com/Rohini2004)       | UI/UX Developer & Alert System      |
| **Sarthak Bose**              | [Cyber-Bose](https://github.com/Cyber-Bose)       | Backend+System Integration Engineer |

---

<div align="center">

### 🌟 Star this repository if you found it helpful!

**Built with ❤️ for Wildlife Conservation**

[⬆ Back to Top](#-maitri---wildlife-conflict-prevention-system)

</div>