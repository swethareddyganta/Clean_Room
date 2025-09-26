# Password Reset Functionality Setup Guide

This guide explains how to set up and use the password reset functionality in the STERI Clean Air application.

## Overview

The password reset system includes:
- Email-based password reset with secure tokens
- Token expiration (1 hour)
- Email templates with professional styling
- Database schema for reset tokens
- API endpoints for handling reset requests
- React components for the reset flow

## Database Setup

### 1. Update Database Schema

Run the updated `database-schema-complete.sql` to add the password reset tokens table:

```sql
-- Password Reset Tokens Table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);
```

### 2. Run Database Migration

```bash
# Connect to your MySQL database and run the schema
mysql -u root -p cleanroom_db < database-schema-complete.sql
```

## Email Configuration

### 1. Environment Variables

Add these variables to your `.env.local` file:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Base URL for reset links
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Generate a new app password for "Mail"
   - Use this app password as `SMTP_PASS`

### 3. Other Email Providers

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
```

**Yahoo:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
```

## API Endpoints

### 1. Forgot Password
- **Endpoint:** `POST /api/auth/forgot-password`
- **Body:** `{ "email": "user@example.com" }`
- **Response:** Success message (always returns success for security)

### 2. Reset Password
- **Endpoint:** `POST /api/auth/reset-password`
- **Body:** `{ "token": "reset-token", "newPassword": "new-password" }`
- **Response:** Success message

### 3. Validate Token
- **Endpoint:** `GET /api/auth/reset-password?token=reset-token`
- **Response:** Token validation result

## User Flow

### 1. Request Password Reset
1. User clicks "Forgot password?" on login page
2. User enters email address
3. System sends reset email (if user exists)
4. User receives email with reset link

### 2. Reset Password
1. User clicks reset link in email
2. System validates token
3. User enters new password
4. System updates password and sends confirmation email
5. User is redirected to login page

## Security Features

- **Token Expiration:** Reset tokens expire after 1 hour
- **One-time Use:** Tokens are marked as used after password reset
- **Secure Tokens:** 32-byte random tokens
- **Email Validation:** Tokens are tied to specific user accounts
- **Rate Limiting:** Prevents abuse (implement in production)

## Testing

### 1. Test Email Configuration
```bash
# Start the development server
npm run dev

# Test the forgot password endpoint
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### 2. Test Complete Flow
1. Register a test user
2. Click "Forgot password?" on login page
3. Enter the test user's email
4. Check email for reset link
5. Click reset link
6. Enter new password
7. Try logging in with new password

## Troubleshooting

### Common Issues

**1. Email Not Sending**
- Check SMTP credentials in `.env.local`
- Verify Gmail app password (not regular password)
- Check console logs for SMTP errors

**2. Reset Link Not Working**
- Check `NEXT_PUBLIC_BASE_URL` in environment variables
- Verify token hasn't expired (1 hour limit)
- Check database for token validity

**3. Database Errors**
- Ensure password reset tokens table exists
- Check database connection
- Verify user exists and is active

### Debug Steps

1. **Check Email Configuration:**
```bash
# Test SMTP connection
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: { user: 'your-email@gmail.com', pass: 'your-app-password' }
});
transporter.verify().then(console.log).catch(console.error);
"
```

2. **Check Database:**
```sql
-- Check if tokens table exists
SHOW TABLES LIKE 'password_reset_tokens';

-- Check recent reset tokens
SELECT * FROM password_reset_tokens ORDER BY created_at DESC LIMIT 5;
```

3. **Check Logs:**
- Monitor console logs for errors
- Check email delivery status
- Verify API responses

## Production Considerations

### 1. Security
- Use HTTPS in production
- Implement rate limiting
- Add CAPTCHA for forgot password
- Monitor for abuse

### 2. Email Delivery
- Use professional email service (SendGrid, Mailgun)
- Set up SPF, DKIM, DMARC records
- Monitor email deliverability

### 3. Monitoring
- Log all password reset attempts
- Monitor failed attempts
- Set up alerts for unusual activity

## Files Created/Modified

### New Files:
- `lib/email-service.ts` - Email sending utilities
- `app/api/auth/forgot-password/route.ts` - Forgot password API
- `app/api/auth/reset-password/route.ts` - Reset password API
- `app/reset-password/page.tsx` - Reset password page
- `email-env-example.txt` - Environment variables example

### Modified Files:
- `database-schema-complete.sql` - Added password reset tokens table
- `app/(public)/_components/login.tsx` - Updated forgot password handler

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Test email configuration independently
4. Check database schema and data
5. Review console logs for specific error messages

