const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// Donation Processing
router.post('/donate', async (req, res) => {
    const {
        'first-name': firstName,
        'last-name': lastName,
        email,
        phone,
        impact: impactType,
        'amount-type': amountType,
        'donation-amount': amount,
        'custom-amount': customAmount
    } = req.body;

    if (!firstName || !email) {
        return res.status(400).send('Please fill in all required fields.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).send('Invalid email address.');
    }

    const finalAmount = parseFloat(customAmount) > 0 ? parseFloat(customAmount) : parseFloat(amount);

    if (finalAmount <= 0) {
        return res.status(400).send('Please select or enter a valid donation amount.');
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO donations (first_name, last_name, email, phone, impact_type, amount_type, amount, custom_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [firstName, lastName, email, phone, impactType, amountType, parseFloat(amount), parseFloat(customAmount)]
        );

        const donationId = result.insertId;
        res.redirect(`/thank-you?donation_id=${donationId}`);
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

// Thank You Page
router.get('/thank-you', async (req, res) => {
    const donationId = parseInt(req.query.donation_id);

    if (!donationId) {
        return res.render('thank_you', { error: 'Invalid donation ID.' });
    }

    try {
        const [rows] = await pool.execute('SELECT * FROM donations WHERE id = ?', [donationId]);

        if (rows.length === 0) {
            return res.render('thank_you', { error: 'Donation not found.' });
        }

        const donation = rows[0];
        const impactType = donation.impact_type || 'General Support';
        const amount = donation.amount;
        const customAmount = donation.custom_amount;
        const donationAmount = customAmount > 0 ? customAmount : amount;
        const amountType = donation.amount_type || 'One-time';

        res.render('thank_you', {
            error: null,
            impactType,
            donationAmount,
            amountType,
            donationId: donation.id
        });
    } catch (error) {
        res.render('thank_you', { error: 'Error retrieving donation details.' });
    }
});

module.exports = router;
