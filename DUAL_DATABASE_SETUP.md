# Dual Database Synchronization Setup

## Overview
This setup ensures both local and remote databases are updated simultaneously using transactional synchronization.

## What I've Implemented

### 1. **Transactional Function** (`lib/mysql.ts`)
- Added `executeTransactionalQuery()` function
- Starts transactions on both databases
- Commits both if successful, rolls back both if any fails
- Ensures data consistency across both databases

### 2. **Updated User Actions** (`actions/users-mysql.ts`)
- Critical operations now use `executeTransactionalQuery()`
- User registration, login logging, and profile updates are synchronized
- Both databases will have identical data

## How It Works

### Transaction Flow:
1. **Start Transactions**: Begin transaction on both local and remote DBs
2. **Execute Query**: Run the same SQL on both databases
3. **Commit/Rollback**: 
   - If both succeed → Commit both transactions
   - If either fails → Rollback both transactions

### Error Handling:
- If local DB fails → Remote DB is rolled back
- If remote DB fails → Local DB is rolled back
- Both databases stay in sync

## Environment Configuration

Your `.env.local` is set up with:
```env
USE_DUAL_DB=true
USE_REMOTE_DB=false

# Local Database
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_local_password
MYSQL_DATABASE=cleanroom_db

# Remote Database  
REMOTE_MYSQL_HOST=103.86.177.38
REMOTE_MYSQL_PORT=3306
REMOTE_MYSQL_USER=atsuser
REMOTE_MYSQL_PASSWORD=your_remote_password
REMOTE_MYSQL_DATABASE=cleanroom_db
```

## Next Steps

### 1. **Fill in Database Passwords**
Update `.env.local` with actual passwords:
```bash
# Edit the file
nano .env.local
```

### 2. **Ensure Database Schema Sync**
Both databases need identical schemas:
```sql
-- Run these on both databases
CREATE TABLE user_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE login_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  email VARCHAR(255),
  user_name VARCHAR(255),
  user_role VARCHAR(50),
  ip_address VARCHAR(45),
  user_agent TEXT,
  device_info VARCHAR(255),
  location VARCHAR(255),
  success BOOLEAN,
  failure_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
);
```

### 3. **Test the Setup**
1. Start the dev server: `npm run dev`
2. Try registering a new user
3. Check server logs for "Both transactions committed successfully"
4. Verify data exists in both databases

## Benefits

✅ **Data Consistency**: Both databases always have identical data
✅ **Atomic Operations**: Either both succeed or both fail
✅ **Error Recovery**: Automatic rollback prevents partial updates
✅ **Real-time Sync**: Changes are immediately reflected in both databases

## Troubleshooting

### If Remote DB Fails:
- Check network connectivity: `nc -vz 103.86.177.38 3306`
- Verify credentials in `.env.local`
- Ensure remote DB allows your IP address
- Check MySQL user permissions

### If Schema Mismatch:
- Compare table structures between databases
- Ensure foreign key constraints are identical
- Run schema sync scripts on both databases

### If Transaction Fails:
- Check server logs for specific error messages
- Verify both databases are accessible
- Ensure sufficient permissions for transactions
