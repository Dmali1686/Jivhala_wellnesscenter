/**
 * leadCapture.js
 * 
 * Multi-step conversational lead capture for Jivhala Wellness Center.
 * 
 * Flow:
 *   1. User sends a booking/appointment keyword.
 *   2. Bot asks for their full name.
 *   3. Bot asks for their mobile number.
 *   4. Bot posts the lead to the backend API and sends a confirmation.
 */

const axios = require('axios');

// ─────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────
const BACKEND_URL     = process.env.BACKEND_URL     || 'http://localhost:8000';
const BACKEND_API_KEY = process.env.BACKEND_API_KEY || ''; // Optional — add if you secure the leads endpoint

/**
 * Keywords (case-insensitive) that trigger the booking lead capture flow.
 */
const BOOKING_KEYWORDS = [
    'appointment',
    'book',
    'booking',
    'consult',
    'consultation',
    'enquiry',
    'inquiry',
    'session',
    'schedule',
];

// ─────────────────────────────────────────────
// In-Memory Session Store
// Key   : sender phone ID (e.g. "917xxxxxxxxx@c.us")
// Value : { step: 'asked_name' | 'asked_number', name?: string }
// ─────────────────────────────────────────────
const sessions = new Map();

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/**
 * Returns true if the message body contains any booking keyword.
 */
function isBookingTrigger(text) {
    const lower = text.toLowerCase().trim();
    return BOOKING_KEYWORDS.some((kw) =>
        new RegExp(`\\b${kw}\\b`).test(lower)
    );
}

/**
 * Clean and validate a mobile number string.
 * Returns the cleaned 10–15 digit string, or null if invalid.
 */
function cleanNumber(raw) {
    const digits = raw.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) return null;
    // Prepend Indian country code if only 10 digits are provided
    return digits.length === 10 ? `91${digits}` : digits;
}

/**
 * Post the captured lead to the Jivhala backend /api/v1/leads/ endpoint.
 */
async function postLeadToBackend(name, mobile) {
    const headers = { 'Content-Type': 'application/json' };
    if (BACKEND_API_KEY) headers['X-API-Key'] = BACKEND_API_KEY;

    const payload = {
        name,
        mobile_number: `+${mobile}`,
        consent_given: true, // User initiated contact — implicit consent
    };

    const response = await axios.post(
        `${BACKEND_URL}/api/v1/leads/`,
        payload,
        { headers, timeout: 10000 }
    );

    return response.data;
}

// ─────────────────────────────────────────────
// Main Handler — called from index.js
// ─────────────────────────────────────────────

/**
 * handleLeadCapture
 * 
 * Call this for every inbound message BEFORE any other auto-reply logic.
 * 
 * @param {object} msg    - whatsapp-web.js Message object
 * @param {Client} client - whatsapp-web.js Client instance (unused here, kept for API consistency)
 * @returns {boolean}       true if this message was consumed by lead capture, false otherwise
 */
async function handleLeadCapture(msg, client) {
    const from    = msg.from;
    const body    = (msg.body || '').trim();
    const session = sessions.get(from);

    // ── Step 0: No active session — check for booking keyword trigger ──
    if (!session && isBookingTrigger(body)) {
        sessions.set(from, { step: 'asked_name' });

        await msg.reply(
            `🙏 *Namaste! Welcome to Jivhala Wellness Center.*\n\n` +
            `We'd love to help you book a session with our holistic wellness coach. 🌿\n\n` +
            `To get started, could you please share your *full name*? 😊`
        );
        return true;
    }

    // ── Step 1: Active session — waiting for name ──
    if (session && session.step === 'asked_name') {
        if (body.length < 2) {
            await msg.reply(
                `😊 Please enter your *full name* so we can personalise your experience.`
            );
            return true;
        }

        sessions.set(from, { step: 'asked_number', name: body });

        await msg.reply(
            `Thank you, *${body}*! 🌿\n\n` +
            `Could you please share your *mobile number* (10-digit or with country code)?\n\n` +
            `_Example: 9876543210 or +447911123456_`
        );
        return true;
    }

    // ── Step 2: Active session — waiting for mobile number ──
    if (session && session.step === 'asked_number') {
        const cleaned = cleanNumber(body);

        if (!cleaned) {
            await msg.reply(
                `🔢 That doesn't look like a valid mobile number.\n` +
                `Please enter your 10-digit number *(e.g. 9876543210)*.`
            );
            return true;
        }

        const { name } = session;
        sessions.delete(from); // Clear session before API call

        try {
            await postLeadToBackend(name, cleaned);
            console.log(`✅ [LeadCapture] Lead saved — Name: ${name}, Mobile: +${cleaned}`);
        } catch (err) {
            // Log the error but don't expose it to the user
            console.error(`❌ [LeadCapture] Failed to post lead to backend:`, err.message);
        }

        await msg.reply(
            `✅ *Thank you, ${name}!*\n\n` +
            `We've received your booking enquiry. Our wellness coach will reach out to you shortly to schedule your session. 🌱\n\n` +
            `_Take a deep breath — your journey to radical calm begins now._ 🙏`
        );
        return true;
    }

    // Message was not part of a lead capture flow
    return false;
}

module.exports = { handleLeadCapture, isBookingTrigger };
