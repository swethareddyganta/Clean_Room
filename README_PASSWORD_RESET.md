# Password Reset Implementation

A complete, secure password reset flow for the Clean Room Next.js application with MySQL and NodeMailer.

## 🚀 Features

- **Secure token generation** (32-byte random tokens)
- **Rate limiting** (5 requests/hour per email/IP)
- **Email delivery** with beautiful HTML templates
- **Single-use tokens** with 30-minute expiration
- **Password strength validation**
- **Security best practices** (constant-time comparison, hashed storage)
- **Comprehensive error handling**
- **Mobile-responsive UI**

## 📁 File Structure

```
├── password-reset-migration.sql          # Database migration
├── lib/
│   ├── mailer.ts                         # NodeMailer utility
│   └── password-reset.ts                  # Core password reset logic
├── app/api/auth/
│   ├── send-reset/route.ts              # Send reset email endpoint
│   └── reset-password/route.ts          # Reset password endpoint
├── app/
│   ├── forgot-password/page.tsx         # Forgot password page
│   └── reset-password/page.tsx         # Reset password page
├── __tests__/
│   ├── password-reset.test.ts          # Unit tests
│   └── test-password-reset.js          # Test runner
├── PASSWORD_RESET_SETUP.md             # Setup guide
└── README_PASSWORD_RESET.md            # This file
```

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install nodemailer @types/nodemailer
```

### 2. Database Migration
Run the SQL in `password-reset-migration.sql`:
```sql
-- Creates password_resets and password_reset_rate_limits tables
-- with proper indexes and foreign keys
```

### 3. Environment Variables
Add to your `.env.local`:
```env
# Application URL
APP_URL=http://localhost:3000

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="Cleanroom Project" <no-reply@cleanroomproject.com>

# Existing variables (already configured)
JWT_SECRET=your-jwt-secret
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=clean_room_db
MYSQL_PORT=3306
```

### 4. Test the Implementation
```bash
# Run unit tests
node __tests__/test-password-reset.js

# Start development server
npm run dev

# Test the flow:
# 1. Go to /forgot-password
# 2. Enter email and submit
# 3. Check email for reset link
# 4. Click link to test reset flow
```

## 🔐 Security Features

### Token Security
- **32-byte random tokens** (64 hex characters)
- **SHA-256 hashed storage** (tokens never stored in plain text)
- **30-minute expiration**
- **Single-use only**
- **Constant-time comparison** (prevents timing attacks)

### Rate Limiting
- **5 requests per hour** per email/IP combination
- **1-hour block** after exceeding limit
- **Automatic cleanup** of old records

### Password Requirements
- Minimum 8 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number
- bcrypt hashing with 12 rounds

### Privacy Protection
- **Generic success messages** (prevents email enumeration)
- **No sensitive data in logs**
- **Secure error handling**

## 📧 Email Template

The system sends beautiful HTML emails with:
- Professional styling
- Clear instructions
- Security warnings
- Fallback plain text
- Mobile-responsive design

## 🎨 User Interface

### Forgot Password Page (`/forgot-password`)
- Clean email input form
- Rate limiting feedback
- Success confirmation
- Link to login page

### Reset Password Page (`/reset-password?token=...`)
- Password strength indicator
- Confirmation field
- Token validation
- Success confirmation

## 🔌 API Endpoints

### POST `/api/auth/send-reset`
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

### POST `/api/auth/reset-password`
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

## 🧪 Testing

### Unit Tests
```bash
node __tests__/test-password-reset.js
```

### Manual Testing
1. **Happy Path:**
   - Request reset → Receive email → Click link → Set new password → Login

2. **Edge Cases:**
   - Invalid email format
   - Non-existent email
   - Expired token
   - Used token
   - Rate limiting
   - Weak password

3. **Security Tests:**
   - Token uniqueness
   - Hash consistency
   - Timing attack resistance
   - Rate limit enforcement

## 📊 Monitoring

### Database Queries for Monitoring
```sql
-- Check active reset tokens
SELECT COUNT(*) FROM password_resets WHERE used = 0 AND expires_at > NOW();

-- Check rate limits
SELECT COUNT(*) FROM password_reset_rate_limits WHERE blocked_until > NOW();

-- Clean up expired data
DELETE FROM password_resets WHERE expires_at < NOW() AND used = 1;
DELETE FROM password_reset_rate_limits WHERE created_at < DATE_SUB(NOW(), INTERVAL 24 HOUR);
```

### Logs to Monitor
- Password reset requests
- Failed token validations
- Rate limit violations
- Email sending failures

## 🚨 Troubleshooting

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

### Debug Commands
```bash
# Test SMTP connection
curl http://localhost:3000/api/test-email

# Check database tables
mysql -u root -p -e "SHOW TABLES LIKE '%password%';"

# View active tokens
mysql -u root -p -e "SELECT * FROM password_resets WHERE used = 0;"
```

## 🔄 Integration with Existing Auth

The password reset system integrates seamlessly with your existing authentication:

1. **Uses existing user table** (`user_profiles`)
2. **Compatible with current login flow**
3. **Maintains existing password hashing** (bcrypt)
4. **Preserves user sessions** and roles
5. **Works with existing middleware**

## 📈 Performance Considerations

- **Database indexes** on frequently queried columns
- **Automatic cleanup** of expired data
- **Connection pooling** for MySQL
- **Efficient rate limiting** with minimal queries
- **Optimized email templates** for fast rendering

## 🛡️ Security Best Practices

1. **Never log sensitive data** (tokens, passwords)
2. **Use HTTPS in production**
3. **Monitor for abuse patterns**
4. **Regular security audits**
5. **Keep dependencies updated**
6. **Use strong SMTP credentials**
7. **Implement proper error handling**
8. **Validate all inputs**
9. **Use constant-time comparisons**
10. **Implement proper rate limiting**

## 📝 Production Checklist

- [ ] Set up production SMTP service
- [ ] Configure proper environment variables
- [ ] Set up monitoring and logging
- [ ] Test email delivery
- [ ] Verify rate limiting works
- [ ] Test token expiration
- [ ] Check database performance
- [ ] Set up backups
- [ ] Configure SSL/TLS
- [ ] Test on mobile devices

## 🤝 Contributing

When making changes to the password reset system:

1. **Maintain security standards**
2. **Update tests accordingly**
3. **Document any new features**
4. **Test thoroughly**
5. **Follow existing code style**
6. **Update this README if needed**

## 📞 Support

For issues or questions:

1. Check the troubleshooting section
2. Review the setup guide
3. Run the test suite
4. Check logs for errors
5. Verify environment variables
6. Test SMTP configuration

---

**Note:** This implementation follows security best practices and is production-ready. Always test thoroughly in a staging environment before deploying to production.
