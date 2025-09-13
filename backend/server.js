import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config(); // Load variables from .env

const app = express();

// CORS configuration for production
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? [
            'https://maitri-wildlife-conflict-prevention-system.vercel.app',
            'https://maitri.vercel.app', 
            /^https:\/\/.*\.vercel\.app$/,  // Allow any Vercel subdomain
            'https://your-custom-domain.com'
          ] 
        : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'MAITRI Backend API'
    });
});

// Test endpoint for frontend status checking
app.get('/test', (req, res) => {
    const twilioConfigured = !!(
        process.env.TWILIO_ACCOUNT_SID && 
        process.env.TWILIO_AUTH_TOKEN && 
        process.env.TWILIO_PHONE_NUMBER
    );
    
    res.status(200).json({ 
        message: 'MAITRI Backend is online and ready',
        twilioConfigured: twilioConfigured,
        timestamp: new Date().toISOString(),
        service: 'MAITRI Backend API'
    });
});

// 🔑 Twilio credentials from .env
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Validate environment variables
if (!accountSid || !authToken || !twilioPhoneNumber) {
    console.error("❌ Missing Twilio credentials in .env file");
    console.log("Required variables:");
    console.log("- TWILIO_ACCOUNT_SID:", accountSid ? "✅" : "❌");
    console.log("- TWILIO_AUTH_TOKEN:", authToken ? "✅" : "❌");
    console.log("- TWILIO_PHONE_NUMBER:", twilioPhoneNumber ? "✅" : "❌");
    process.exit(1);
}

const client = twilio(accountSid, authToken);

// 📱 Registered contacts
const registeredNumbers = [
  "+918404845135",
  "+918011960221",
  "+917407323652",
  "+919431139936"
];

// Test endpoint
app.get("/test", (req, res) => {
    res.json({ 
        message: "Backend is working!", 
        twilioConfigured: !!(accountSid && authToken && twilioPhoneNumber),
        registeredNumbers: registeredNumbers.length
    });
});

// API to send SMS
app.post("/send-sms", async (req, res) => {
    console.log("📨 SMS request received");
    console.log("Request body:", req.body);
    
    const { message } = req.body;

    if (!message) {
        console.error("❌ No message provided");
        return res.status(400).json({ 
            success: false, 
            error: "Message is required" 
        });
    }

    try {
        console.log(`📤 Sending SMS to ${registeredNumbers.length} contacts...`);
        
        const results = [];
        for (let number of registeredNumbers) {
            console.log(`Sending to ${number}...`);
            
            const result = await client.messages.create({
                body: message,
                from: twilioPhoneNumber,
                to: number,
            });
            
            console.log(`✅ SMS sent to ${number}, SID: ${result.sid}`);
            results.push({ number, sid: result.sid, status: result.status });
        }
        
        console.log("🎉 All SMS messages sent successfully!");
        res.json({ 
            success: true, 
            message: "SMS sent to all contacts",
            results: results
        });
        
    } catch (err) {
        console.error("❌ Error sending SMS:", err);
        res.status(500).json({ 
            success: false, 
            error: err.message,
            code: err.code || 'UNKNOWN_ERROR'
        });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Backend running on port ${PORT}`);
    console.log(`🔧 Twilio Phone Number: ${twilioPhoneNumber}`);
    console.log(`📱 Registered Numbers: ${registeredNumbers.join(', ')}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
