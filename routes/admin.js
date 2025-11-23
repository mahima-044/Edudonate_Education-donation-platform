const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const { pool } = require('../db');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';
        if (file.fieldname === 'regCertificate') {
            uploadPath += 'certificates/';
        } else if (file.fieldname === 'images') {
            uploadPath += 'images/';
        } else if (file.fieldname === 'documents') {
            uploadPath += 'documents/';
        }
        require('fs').mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|jpg|jpeg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, JPG, JPEG, PNG allowed.'));
        }
    }
});

// Admin Registration
router.post('/register', upload.single('regCertificate'), async (req, res) => {
    const { orgName, email, phone, address, regNumber, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match.');
    }

    if (!req.file) {
        return res.status(400).send('Registration certificate is required.');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.execute(
            'INSERT INTO registrations (org_name, email, phone, address, reg_number, reg_certificate, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [orgName, email, phone, address, regNumber, req.file.path, hashedPassword]
        );

        res.send(`
      <h2>✅ Registration Successful!</h2>
      <p>Your organization <strong>${orgName}</strong> has been registered successfully.</p>
      <a href='school-login.html'>Click here to Login</a>
    `);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).send('Email already registered.');
        } else {
            res.status(500).send('Error: ' + error.message);
        }
    }
});

// Admin Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Please fill all fields.');
    }

    try {
        const [rows] = await pool.execute('SELECT * FROM registrations WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(400).send('<p>No account found with this email.</p>');
        }

        const user = rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (isValidPassword) {
            req.session.admin = user;
            res.send(`
        <h2>Welcome, ${user.org_name}!</h2>
        <p>Login successful. Redirecting to your dashboard...</p>
        <script>setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);</script>
      `);
        } else {
            res.status(400).send('<p>Invalid password. Try again.</p>');
        }
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

// Submit Donation Request
router.post('/submit-request', upload.fields([
    { name: 'images', maxCount: 1 },
    { name: 'documents', maxCount: 1 }
]), async (req, res) => {
    const { title, category, amount, beneficiaries, description } = req.body;

    const imagePath = req.files.images ? req.files.images[0].path : '';
    const documentPath = req.files.documents ? req.files.documents[0].path : '';

    try {
        await pool.execute(
            'INSERT INTO donation_requests (title, category, amount, beneficiaries, description, image_path, document_path) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, category, parseFloat(amount), parseInt(beneficiaries), description, imagePath, documentPath]
        );

        res.send('<script>alert("Donation request created successfully!"); window.location.href="dashboard.html";</script>');
    } catch (error) {
        res.send('<script>alert("Error: Could not save your request."); window.history.back();</script>');
    }
});

// Admin Dashboard
router.get('/dashboard', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM donations ORDER BY created_at DESC');
        res.render('admin_dashboard', { donations: rows });
    } catch (error) {
        res.status(500).send('Error loading dashboard: ' + error.message);
    }
});

module.exports = router;
