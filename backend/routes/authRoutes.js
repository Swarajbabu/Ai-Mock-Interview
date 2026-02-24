const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-12345';

// Mock User DB
const users = [{ id: 1, email: 'user@example.com', password: 'password123' }];

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Simplistic auth for demonstration
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Step 1: Login successful, normally you'd trigger 2FA here
        res.json({ message: 'Credentials valid. Proceed to 2FA.', require2FA: true, tempToken: 'temp-123' });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

router.post('/verify-otp', (req, res) => {
    const { otp, tempToken } = req.body;

    // Mock 2FA validation (accept any 6 digit for now)
    if (otp && otp.length === 6 && tempToken === 'temp-123') {
        const token = jwt.sign({ userId: 1, email: 'user@example.com' }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ message: 'Authentication successful', token, user: { id: 1, email: 'user@example.com' } });
    } else {
        res.status(401).json({ error: 'Invalid OTP' });
    }
});

module.exports = router;
