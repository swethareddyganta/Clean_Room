# Password Reset Test Guide

## Quick Test Steps

### 1. Update Environment Variables
Make sure your `.env.local` file contains:
```env
USE_DUAL_DB=false
USE_REMOTE_DB=true
REMOTE_MYSQL_HOST=103.86.177.38
REMOTE_MYSQL_USER=atsuser
REMOTE_MYSQL_PASSWORD=Root1234!
REMOTE_MYSQL_DATABASE=cleanroom_db
REMOTE_MYSQL_PORT=3306
JWT_SECRET=CLEANROOM_SECRET
```

### 2. Test Password Reset Flow

1. **Start the application**: `npm run dev`
2. **Go to login page**: `http://localhost:3000`
3. **Click "Forgot password?"**
4. **Enter a registered email** (like admin@arrant.com)
5. **Click "Send Reset Instructions"**

### 3. Expected Results

✅ **Success**: You should see "Password reset instructions have been sent to your email address."

❌ **If you get database errors**: The dual database mode is still enabled. Make sure `USE_DUAL_DB=false` in your `.env.local` file.

### 4. Test with Email (Optional)

If you want to test the full flow with email:

1. **Configure email settings** in `.env.local`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

2. **Use a real email address** for testing
3. **Check your email** for the reset link
4. **Click the reset link** to test the full flow

## Troubleshooting

### Database Connection Issues
- Make sure `USE_DUAL_DB=false` in `.env.local`
- Restart the development server after changing environment variables
- Check that the remote database credentials are correct

### Email Issues
- Email configuration is optional for testing
- The password reset will work even without email (you can test the API directly)

### API Testing
You can test the API directly:
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@arrant.com"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Password reset instructions have been sent to your email address."
}
```

## Success Indicators

✅ **No database errors** in console
✅ **API returns success** message
✅ **Application continues to work** normally
✅ **Password reset functionality** is available

The password reset system is now ready to use!

