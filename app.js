const express = require('express');
const session = require('express-session');
const path = require('path');
const { initializeDatabase } = require('./db');
const authRoutes = require('./routes/auth');
const donateRoutes = require('./routes/donate');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
initializeDatabase();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'edudonate-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production with HTTPS
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use('/Admin-portal', express.static(path.join(__dirname, 'Admin-portal')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Routes
app.use('/', authRoutes);
app.use('/', donateRoutes);
app.use('/admin', adminRoutes);

// Default route for static files
app.get('*', (req, res) => {
    const filePath = path.join(__dirname, req.path);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('File not found');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
