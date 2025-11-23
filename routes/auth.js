const express = require('express');
const bcrypt = require('bcrypt');
const { pool } = require('../db');

const router = express.Router();

// User Signup
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send('Please fill in all required fields.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).send('Invalid email address.');
    }

    if (password.length < 6) {
        return res.status(400).send('Password must be at least 6 characters long.');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.execute(
            'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        res.send('<script>alert("Signup successful! Redirecting to login..."); window.location.href="signup.html";</script>');
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.send('<script>alert("Email already registered. Try logging in."); window.location.href="signup.html";</script>');
        } else {
            res.status(500).send('Error: ' + error.message);
        }
    }
});

// User Login (if needed, but seems not used in current setup)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Please enter both email and password.');
    }

    try {
        const [rows] = await pool.execute('SELECT * FROM registrations WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.send('<script>alert("No account found with this email. Please register."); window.location.href="Admin-portal/school-login.html";</script>');
        }

        const user = rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (isValidPassword) {
            req.session.user = user;
            res.send('<script>alert("Login successful! Redirecting..."); window.location.href="Admin-portal/dashboard.html";</script>');
        } else {
            res.send('<script>alert("Incorrect password. Please try again."); window.location.href="Admin-portal/school-login.html";</script>');
        }
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

module.exports = router;
