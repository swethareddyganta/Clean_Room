# Database Setup Guide

This guide will help you set up the complete database for the Clean Room application, including the password reset functionality.

## 🚀 Quick Setup

### Step 1: Check Environment Variables
```bash
node check-env.js
```

### Step 2: Set Up Database Tables
```bash
node setup-database.js
```

### Step 3: Verify Setup
```bash
npm run dev
```

## 📋 What Gets Created

The setup script will create these tables:

1. **user_profiles** - User authentication and profiles
2. **form_submissions** - Form data storage
3. **login_history** - Login tracking and security
4. **password_resets** - Password reset tokens
5. **password_reset_rate_limits** - Abuse prevention

## 🔧 Environment Variables Required

Create a `.env.local` file with these variables:

```env
# MySQL Database Configuration
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=clean_room_db
MYSQL_PORT=3306

# JWT Secret (for authentication)
JWT_SECRET=your_jwt_secret_key

# Application URL (for password reset links)
APP_URL=http://localhost:3000

# SMTP Configuration (for password reset emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Cleanroom Project" <no-reply@cleanroomproject.com>
```

## 🛠️ Manual Setup (Alternative)

If the script doesn't work, you can manually run the SQL:

1. Open your MySQL client (phpMyAdmin, MySQL Workbench, or command line)
2. Select your database (`clean_room_db`)
3. Copy and paste the contents of `setup-complete-database.sql`
4. Execute the SQL

## 🧪 Testing the Setup

### Test Database Connection
```bash
node check-database.js
```

### Test Password Reset Flow
1. Start the application: `npm run dev`
2. Go to `http://localhost:3000/forgot-password`
3. Enter an email address
4. Check your email for the reset link
5. Test the password reset flow

## 🔍 Troubleshooting

### Common Issues

1. **"Connection refused"**
   - Make sure MySQL server is running
   - Check your connection settings in `.env.local`

2. **"Access denied"**
   - Verify your MySQL username and password
   - Ensure the user has proper permissions

3. **"Database doesn't exist"**
   - Create the database first: `CREATE DATABASE clean_room_db;`

4. **"Table already exists"**
   - This is normal - the script skips existing tables

### Manual Database Creation
```sql
CREATE DATABASE IF NOT EXISTS clean_room_db;
USE clean_room_db;
-- Then run the setup-complete-database.sql content
```

## 📊 Database Structure

### user_profiles
- `id` - Primary key (UUID)
- `email` - Unique email address
- `name` - User's full name
- `password` - Hashed password
- `role` - User role (user/admin)
- `is_active` - Account status
- `created_at` - Registration date
- `last_login` - Last login timestamp

### password_resets
- `id` - Primary key (UUID)
- `user_id` - Foreign key to user_profiles
- `token_hash` - SHA-256 hashed token
- `expires_at` - Token expiration (30 minutes)
- `used` - Single-use flag
- `created_at` - Token creation time

### password_reset_rate_limits
- `id` - Primary key (UUID)
- `email` - Email address
- `ip_address` - Client IP
- `request_count` - Number of requests
- `blocked_until` - Block expiration
- `created_at` - Record creation time

## 🔐 Security Features

- **Hashed token storage** - Tokens are never stored in plain text
- **Rate limiting** - Prevents abuse (5 requests/hour)
- **Token expiration** - 30-minute timeout
- **Single-use tokens** - Cannot be reused
- **Constant-time comparison** - Prevents timing attacks

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-factor authentication
2. Generate an App Password:
   - Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
3. Use the app password in `SMTP_PASS`

### Other Providers
- **SendGrid**: `smtp.sendgrid.net`
- **Mailgun**: `smtp.mailgun.org`
- **Amazon SES**: Use your SES SMTP endpoint

## ✅ Verification Checklist

- [ ] All tables created successfully
- [ ] Environment variables configured
- [ ] MySQL connection working
- [ ] SMTP configuration tested
- [ ] Password reset flow working
- [ ] Rate limiting functional
- [ ] Email delivery confirmed

## 🆘 Support

If you encounter issues:

1. Check the error messages carefully
2. Verify your environment variables
3. Ensure MySQL server is running
4. Check database permissions
5. Test SMTP configuration separately

The setup script provides detailed feedback for each step, so you can identify exactly where any issues occur.
