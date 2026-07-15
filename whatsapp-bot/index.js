const express = require('express');
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

console.log('Initializing WhatsApp Client...');

// Initialize WhatsApp Client with LocalAuth so session is saved
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Generate QR Code for authentication
client.on('qr', (qr) => {
    console.log('\n--- SCAN THIS QR CODE WITH YOUR WHATSAPP ---');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('\n✅ WhatsApp Client is ready and connected!');
});

client.on('disconnected', (reason) => {
    console.log('\n❌ WhatsApp Client was disconnected:', reason);
});

// Start the client
client.initialize();

// Express API Endpoint for sending welcome messages
app.post('/send-welcome', async (req, res) => {
    try {
        const { name, mobile_number } = req.body;

        if (!mobile_number) {
            return res.status(400).json({ error: 'Mobile number is required' });
        }

        // Clean the phone number (remove +, spaces, dashes)
        let cleanedNumber = mobile_number.replace(/\D/g, '');
        
        // If it doesn't have a country code and is 10 digits (India standard), prepend 91
        if (cleanedNumber.length === 10) {
            cleanedNumber = `91${cleanedNumber}`;
        }

        const chatId = `${cleanedNumber}@c.us`;
        const message = `Namaste ${name || 'there'}! 🙏\n\nThank you for booking a consultation with Jivhala. We have received your request and our holistic wellness coach will contact you shortly to schedule your session.\n\nTake a deep breath, your journey to radical calm begins now. 🌱`;

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
