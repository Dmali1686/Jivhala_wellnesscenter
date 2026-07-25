const express = require('express');
const cors = require('cors');
const { Client, RemoteAuth } = require('whatsapp-web.js');
const { PostgresStore } = require('wwebjs-postgres');
const { Pool } = require('pg');
const qrcode = require('qrcode-terminal');
const { handleLeadCapture } = require('./src/leadCapture');

const app = express();

// Security: Restrict CORS to backend origin only
app.use(cors({
    origin: ['http://localhost:8000'],
    methods: ['POST'],
}));
app.use(express.json());

const PORT = 3000;

// API Key for inter-service authentication
const API_KEY = process.env.WHATSAPP_API_KEY || 'change-this-whatsapp-api-key-in-production';

// API Key validation middleware
function validateApiKey(req, res, next) {
    const providedKey = req.headers['x-api-key'];
    
    if (!providedKey || providedKey !== API_KEY) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or missing API key' });
    }
    
    next();
}

console.log('Initializing WhatsApp Client...');

// Initialize PostgreSQL connection for session storage
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neon_admin:secret@localhost/jivhala'
});
const store = new PostgresStore({ pool });

// Initialize WhatsApp Client with RemoteAuth so session is saved in the database
// Uses system Google Chrome — avoids "Couldn't link" errors with outdated bundled Chromium
const client = new Client({
    authStrategy: new RemoteAuth({
        store: store,
        backupSyncIntervalMs: 300000 // Backup every 5 minutes
    }),
    puppeteer: {
        // If deployed to Render via Docker, it uses PUPPETEER_EXECUTABLE_PATH.
        // On Mac (local dev), it falls back to the hardcoded Mac path.
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || (process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : undefined),
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu'
        ]
    }
});

// Generate QR Code for authentication
client.on('qr', (qr) => {
    console.log('\n--- SCAN THIS QR CODE WITH YOUR WHATSAPP ---');
    qrcode.generate(qr, { small: true });
});

client.on('remote_session_saved', () => {
    console.log('💾 WhatsApp session securely saved to PostgreSQL Database!');
});

client.on('ready', () => {
    console.log('\n✅ WhatsApp Client is ready and connected!');
});

client.on('disconnected', (reason) => {
    console.log('\n❌ WhatsApp Client was disconnected:', reason);
});

// ─── Inbound Message Handler ───────────────────────────────────────────────
client.on('message', async (msg) => {
    try {
        // Ignore status updates, own messages, group chats, broadcasts, newsletters
        if (
            msg.isStatus ||
            msg.fromMe ||
            msg.from.endsWith('@g.us') ||
            msg.from.endsWith('@broadcast') ||
            msg.from.endsWith('@newsletter')
        ) {
            return;
        }

        console.log(`📩 Inbound message from ${msg.from}: "${msg.body}"`);

        // Delegate to multi-step lead capture flow.
        // Returns true if the message was handled (booking keyword or active session).
        const handled = await handleLeadCapture(msg, client);

        if (!handled) {
            // Future: add other auto-reply rules here
        }
    } catch (err) {
        console.error('❌ Error handling inbound message:', err);
    }
});

// Start the client
client.initialize();

// Express API Endpoint for sending welcome messages (protected with API key)
app.post('/send-welcome', validateApiKey, async (req, res) => {
    try {
        const { name, mobile_number, language } = req.body;

        if (!mobile_number) {
            return res.status(400).json({ error: 'Mobile number is required' });
        }

        // Validate mobile number format (basic check — digits only after cleaning)
        let cleanedNumber = mobile_number.replace(/\D/g, '');
        
        if (cleanedNumber.length < 10 || cleanedNumber.length > 15) {
            return res.status(400).json({ error: 'Invalid mobile number format' });
        }
        
        // If it doesn't have a country code and is 10 digits (India standard), prepend 91
        if (cleanedNumber.length === 10) {
            cleanedNumber = `91${cleanedNumber}`;
        }

        const chatId = `${cleanedNumber}@c.us`;

        // ── Language-aware welcome message ────────────────────────────────────
        let message;
        if (language === 'mr') {
            message =
                `नमस्ते ${name || 'मित्रा'}! 🙏\n\n` +
                `जिव्हाळा वेलनेस सेंटरमध्ये समावेश केल्याबद्दल धन्यवाद!\n\n` +
                `आम्हाला तुमची सल्ला विनंती मिळाली आहे. आमचे समग्र वेलनेस कोच लवकरच तुमच्याशी संपर्क साधतील आणि तुमची सत्र वेळ निश्चित करतील.\n\n` +
                `एक दीर्घ श्वास घ्या — तुमचा उत्कट शांततेचा प्रवास आता सुरू होतो. 🌱`;
        } else {
            message =
                `Namaste ${name || 'there'}! 🙏\n\n` +
                `Thank you for booking a consultation with Jivhala. We have received your request and our holistic wellness coach will contact you shortly to schedule your session.\n\n` +
                `Take a deep breath, your journey to radical calm begins now. 🌱`;
        }

        // Send the message
        await client.sendMessage(chatId, message);
        console.log(`✅ Sent welcome message to ${cleanedNumber}`);

        res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('❌ Failed to send message:', error);
        res.status(500).json({ error: 'Failed to send WhatsApp message' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 WhatsApp Microservice API running on http://localhost:${PORT}`);
});

