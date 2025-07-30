# MySQL Migration Guide

This guide will help you migrate from Supabase (PostgreSQL) to MySQL.

## Prerequisites

1. **MySQL Server**: Install MySQL Server on your machine
2. **MySQL Client**: Install a MySQL client (MySQL Workbench, phpMyAdmin, or command line)
3. **Node.js**: Ensure you have Node.js installed

## Step 1: Install MySQL Dependencies

The MySQL dependencies have already been installed:
- `mysql2` package is installed in both root and forms directories

## Step 2: Set Up MySQL Database

### 2.1 Install MySQL Server
- **macOS**: `brew install mysql` or download from MySQL website
- **Windows**: Download MySQL Installer from MySQL website
- **Linux**: `sudo apt install mysql-server` (Ubuntu/Debian)

### 2.2 Start MySQL Service
```bash
# macOS
brew services start mysql

# Windows
# MySQL service should start automatically

# Linux
sudo systemctl start mysql
```

### 2.3 Create Database and User
```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE clean_room_db;

-- Create user (optional, for production)
CREATE USER 'cleanroom_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON clean_room_db.* TO 'cleanroom_user'@'localhost';
FLUSH PRIVILEGES;
```

## Step 3: Run Database Schema

### 3.1 Execute MySQL Schema
```bash
# Connect to MySQL and run the schema
mysql -u root -p clean_room_db < mysql-schema.sql
```

Or copy and paste the contents of `mysql-schema.sql` into your MySQL client.

## Step 4: Configure Environment Variables

### 4.1 Create .env.local File
Copy the contents of `mysql-env-example.txt` to `.env.local`:

```env
# MySQL Database Configuration
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=clean_room_db
MYSQL_PORT=3306

# JWT Secret (keep this secret!)
JWT_SECRET=CLEANROOM_SECRET
```

### 4.2 Update with Your Credentials
Replace the placeholder values with your actual MySQL credentials.

## Step 5: Test the Migration

### 5.1 Start Development Server
```bash
npm run dev
```

### 5.2 Visit MySQL Test Page
Go to `http://localhost:3000/mysql-test` to test your MySQL setup.

### 5.3 Test Database Operations
Use the test buttons to verify:
- Environment variables are loaded
- MySQL connection works
- Database operations (insert, select) work

## Step 6: Update Your Application

### 6.1 Switch Database Functions
The following files have been created with MySQL versions:

**Root Application:**
- `lib/mysql.ts` - MySQL connection configuration
- `lib/database-mysql.ts` - MySQL database functions
- `actions/users-mysql.ts` - MySQL user actions

**Forms Application:**
- `forms/lib/mysql.ts` - MySQL connection configuration
- `forms/lib/database-mysql.ts` - MySQL database functions

### 6.2 Update Imports
Replace Supabase imports with MySQL imports:

```typescript
// Old (Supabase)
import { executeQuery } from './mysql'
import { saveFormSubmission } from './database'

// New (MySQL)
import { executeQuery } from './mysql'
import { saveFormSubmission } from './database-mysql'
```

### 6.3 Update User Actions
Replace Supabase user actions with MySQL versions:

```typescript
// Old (Supabase)
import { registerUser, loginUser } from '@/actions/users-enhanced'

// New (MySQL)
import { registerUser, loginUser } from '@/actions/users-mysql'
```

## Step 7: Verify Migration

### 7.1 Test Form Submission
1. Fill out the form in your application
2. Submit the form
3. Check that data is saved to MySQL database

### 7.2 Test User Authentication
1. Register a new user
2. Login with the user
3. Check that login history is recorded

### 7.3 Check Database Tables
Connect to MySQL and verify tables are created:

```sql
USE clean_room_db;
SHOW TABLES;
SELECT * FROM user_profiles;
SELECT * FROM form_submissions;
SELECT * FROM login_history;
```

## Troubleshooting

### Connection Issues
- **Error**: "ECONNREFUSED"
  - **Solution**: Ensure MySQL service is running
  - **Command**: `brew services start mysql` (macOS)

### Authentication Issues
- **Error**: "Access denied for user"
  - **Solution**: Check username/password in `.env.local`
  - **Solution**: Verify user has proper permissions

### Schema Issues
- **Error**: "Table doesn't exist"
  - **Solution**: Run `mysql-schema.sql` in your MySQL database
  - **Solution**: Check database name in environment variables

### Environment Variables
- **Error**: "Environment variables not loaded"
  - **Solution**: Restart development server after updating `.env.local`
  - **Solution**: Check file path and syntax

## Performance Considerations

### Connection Pooling
The MySQL configuration includes connection pooling for better performance:
- `connectionLimit: 10` - Maximum 10 connections
- `queueLimit: 0` - No limit on queued connections

### Indexes
The schema includes indexes for better query performance:
- `idx_form_submissions_unique_id`
- `idx_form_submissions_created_at`
- `idx_login_history_user_id`

## Security Considerations

### Production Setup
1. **Use dedicated MySQL user** (not root)
2. **Set strong passwords**
3. **Enable SSL connections**
4. **Configure firewall rules**
5. **Regular backups**

### Environment Variables
- Keep `.env.local` out of version control
- Use different credentials for development/production
- Rotate JWT secrets regularly

## Rollback Plan

If you need to rollback to Supabase:

1. **Keep Supabase files** as backup
2. **Update imports** back to Supabase versions
3. **Restore environment variables** for Supabase
4. **Test functionality** with Supabase

## Support

If you encounter issues:
1. Check the MySQL test page for detailed error messages
2. Review MySQL logs for connection issues
3. Verify environment variables are loaded correctly
4. Test database operations manually in MySQL client 