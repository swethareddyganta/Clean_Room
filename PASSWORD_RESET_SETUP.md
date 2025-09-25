# Password Reset Setup Guide

This guide explains how to set up the password reset functionality for the Clean Room application.

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Application URL (required for reset links)
APP_URL=http://localhost:3000

# SMTP Configuration (required for sending emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Cleanroom Project" <no-reply@cleanroomproject.com>

# JWT Secret (already exists)
JWT_SECRET=your-jwt-secret

# MySQL Configuration (already exists)
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=clean_room_db
MYSQL_PORT=3306
```

## Database Setup

1. **Run the migration**: Execute the SQL in `password-reset-migration.sql` in your MySQL database:
   ```sql
   -- Copy and paste the contents of password-reset-migration.sql
   ```

2. **Verify tables were created**:
   ```sql
   SHOW TABLES LIKE '%password%';
   ```

## SMTP Configuration

### Gmail Setup (Recommended)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use the app password in `SMTP_PASS`

### Other SMTP Providers
- **SendGrid**: Use `smtp.sendgrid.net` as host
- **Mailgun**: Use `smtp.mailgun.org` as host
- **Amazon SES**: Use your SES SMTP endpoint

## Testing the Setup

### 1. Test SMTP Connection
Create a test endpoint to verify email configuration:

```typescript
// app/api/test-email/route.ts
import { mailer } from '@/lib/mailer'

export async function GET() {
  const result = await mailer.testConnection()
  return Response.json(result)
}
```

### 2. Test Password Reset Flow
1. Start your development server: `npm run dev`
2. Navigate to `/forgot-password`
3. Enter a valid email address
4. Check your email for the reset link
5. Click the link to test the reset flow

## Security Features

### Rate Limiting
- **5 requests per hour** per email/IP combination
- **1-hour block** after exceeding limit
- Automatic cleanup of old rate limit records

### Token Security
- **32-byte random tokens** (64 hex characters)
- **SHA-256 hashed storage** (tokens never stored in plain text)
- **30-minute expiration**
- **Single-use tokens**
- **Constant-time comparison** to prevent timing attacks

### Password Requirements
- Minimum 8 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number
- bcrypt hashing with 12 rounds

## API Endpoints

### POST /api/auth/send-reset
**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "If that email exists, we've sent instructions to reset your password."
}
```

### POST /api/auth/reset-password
**Request:**
```json
{
  "token": "abc123...",
  "newPassword": "NewSecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password has been successfully reset."
}
```

## Frontend Pages

### /forgot-password
- Email input form
- Rate limiting feedback
- Success confirmation
- Link to login page

### /reset-password?token=...
- New password form with strength indicator
- Password confirmation
- Token validation
- Success confirmation

## Monitoring and Maintenance

### Cleanup Tasks
The system automatically cleans up:
- Expired tokens (after 30 minutes)
- Used tokens (immediately after use)
- Old rate limit records (after 24 hours)

### Logging
Monitor these logs for security:
- Password reset requests
- Failed token validations
- Rate limit violations
- Email sending failures

## Troubleshooting

### Common Issues

1. **"SMTP connection failed"**
   - Check SMTP credentials
   - Verify 2FA is enabled (for Gmail)
   - Use app password, not regular password

2. **"Rate limit exceeded"**
   - Wait 1 hour or clear rate limit records
   - Check for multiple requests from same IP

3. **"Invalid or expired token"**
   - Tokens expire after 30 minutes
   - Tokens can only be used once
   - Check if user requested multiple resets

4. **Email not received**
   - Check spam folder
   - Verify SMTP configuration
   - Check email address is correct

### Database Queries for Debugging

```sql
-- Check active reset tokens
SELECT * FROM password_resets WHERE used = 0 AND expires_at > NOW();

-- Check rate limits
SELECT * FROM password_reset_rate_limits WHERE blocked_until > NOW();

-- Clean up manually (if needed)
DELETE FROM password_resets WHERE expires_at < NOW();
DELETE FROM password_reset_rate_limits WHERE created_at < DATE_SUB(NOW(), INTERVAL 24 HOUR);
```

## Production Considerations

1. **Use environment-specific SMTP**
2. **Set up proper logging and monitoring**
3. **Configure email templates for your brand**
4. **Set up database backups**
5. **Monitor rate limiting metrics**
6. **Consider using a dedicated email service (SendGrid, Mailgun)**

## Security Best Practices

1. **Never log sensitive data** (tokens, passwords)
2. **Use HTTPS in production**
3. **Monitor for abuse patterns**
4. **Regular security audits**
5. **Keep dependencies updated**
6. **Use strong SMTP credentials**
