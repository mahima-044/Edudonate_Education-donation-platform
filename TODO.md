# Conversion Plan: PHP to Node.js for Vercel Hosting

## Information Gathered
- PHP backend manages MySQL database connections, user authentication (signup/login), donation processing, admin portal (registration, login, donation requests), and admin dashboard.
- Key tables: users, registrations, donation_requests, donations.
- Features include password hashing, form validation, file uploads (certificates, images, documents), and dynamic HTML rendering.
- Frontend is static HTML/CSS/JS, with PHP handling POST requests and some pages embedding PHP for data display.

## Plan
1. Set up Node.js project structure (package.json, app.js, routes/, views/, public/, .env).
2. Create db.js for database connection and table creation using mysql2.
3. Implement Express routes for user signup (/signup), login (/login), donation processing (/donate), and thank you page (/thank-you).
4. Implement admin routes: registration (/admin/register), login (/admin/login), submit request (/admin/submit-request), dashboard (/admin/dashboard).
5. Create EJS templates for dynamic pages (thank_you.ejs, admin_dashboard.ejs).
6. Update HTML form actions to point to new Node.js routes.
7. Handle file uploads using multer for admin registrations and requests.
8. Use bcrypt for password hashing and verification.
9. Remove all PHP files after conversion.
10. Test locally and deploy to Vercel.

## Dependent Files to be edited
- Remove: db_connect.php, signup.php, login.php, donate_process.php, thank_you.php, Admin-portal/register.php, Admin-portal/login.php, Admin-portal/submit-request.php, Admin-portal/admin.php
- Update: signup.html (form action), donate.html (form action), Admin-portal/register.html (form action), Admin-portal/school-login.html (form action), Admin-portal/create-request.html (form action)
- New: package.json, app.js, db.js, routes/auth.js, routes/admin.js, routes/donate.js, views/thank_you.ejs, views/admin_dashboard.ejs, .env, vercel.json

## Followup steps
- Install Node.js dependencies (npm install). ✅
- Run locally (npm start) and test all functionalities. ✅ (signup, login, donate, thank-you, admin dashboard working)
- Deploy to Vercel (vercel --prod), ensure .env is configured for production DB.
- Verify file uploads work in production (may need cloud storage like Vercel Blob or AWS S3).
- For production, use a cloud MySQL database (e.g., PlanetScale, AWS RDS) instead of local XAMPP.
- Update .env with production DB credentials.
- Install Vercel CLI globally (npm install -g vercel). ✅
- Run vercel login, then vercel --prod to deploy.

## Completed Tasks
- [x] Created package.json with dependencies
- [x] Created .env file
- [x] Created db.js with database initialization
- [x] Created app.js with Express setup
- [x] Created routes/auth.js for user signup and login
- [x] Created routes/donate.js for donation processing and thank you page
- [x] Created routes/admin.js for admin registration, login, submit request, and dashboard
- [x] Created views/thank_you.ejs
- [x] Created views/admin_dashboard.ejs
- [x] Updated signup.html form actions
- [x] Updated donate.html form action
- [x] Updated Admin-portal/school-login.html form action
- [x] Updated Admin-portal/register.html form action
- [x] Updated Admin-portal/create-request.html form action
- [x] Fixed db.js to use query for non-prepared statements
- [x] Created vercel.json for deployment
- [x] Removed all PHP files
- [x] Tested locally - server starts and database initializes successfully
