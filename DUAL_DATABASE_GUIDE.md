# Dual Database Configuration Guide

## Overview
Your application now supports **dual database mode** - writing to both local and remote databases simultaneously. This ensures data consistency and provides redundancy.

## Configuration

### Environment Variables
Your `.env` file now contains:

```bash
# Database Selection
USE_DUAL_DB=true  # Enable dual database mode

# Local Database (for development)
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=Ramana1113
MYSQL_DATABASE=cleanroom_db
MYSQL_PORT=3306
MYSQL_SOCKET=/tmp/mysql.sock

# Remote Database (for production)
REMOTE_MYSQL_HOST=103.86.177.38
REMOTE_MYSQL_USER=atsuser
REMOTE_MYSQL_PASSWORD=Root1234!
REMOTE_MYSQL_DATABASE=cleanroom_db
REMOTE_MYSQL_PORT=3306
```

## How It Works

### Dual Database Mode (`USE_DUAL_DB=true`)
- **Every database operation** (INSERT, UPDATE, DELETE) is executed on **both databases**
- **Local database** is used as the primary source for reads
- **Remote database** is kept in sync automatically
- **Error handling**: If one database fails, the operation continues with the other

### Single Database Mode (Legacy)
- `USE_DUAL_DB=false` or unset
- Uses only local database (`USE_REMOTE_DB=false`) or remote database (`USE_REMOTE_DB=true`)

## Benefits

1. **Data Redundancy**: Your data is stored in two places
2. **Automatic Sync**: No manual synchronization needed
3. **Fault Tolerance**: If one database is down, the other continues working
4. **Development Flexibility**: Test locally while keeping production data in sync

## Console Output

When dual database mode is active, you'll see logs like:
```
🔄 Initializing dual database connections...
🔧 Dual MySQL Config: { local: {...}, remote: {...} }
🔄 Executing query on both databases: INSERT INTO user_profiles...
✅ Local database query successful
✅ Remote database query successful
```

## Error Handling

- **Both databases fail**: Returns error with details from both
- **One database fails**: Continues with the working database, logs a warning
- **Local fails, remote succeeds**: ⚠️ Warning logged, operation continues
- **Remote fails, local succeeds**: ⚠️ Warning logged, operation continues

## Switching Modes

### Enable Dual Database Mode
```bash
USE_DUAL_DB=true
```

### Use Only Local Database
```bash
USE_DUAL_DB=false
USE_REMOTE_DB=false
```

### Use Only Remote Database
```bash
USE_DUAL_DB=false
USE_REMOTE_DB=true
```

## Testing

To verify both databases are working:
1. Check the console logs for successful connections to both databases
2. Perform any database operation (login, form submission, etc.)
3. Verify data appears in both databases

## Troubleshooting

### Local Database Issues
- Check if MySQL is running: `brew services list | grep mysql`
- Verify socket file exists: `ls -la /tmp/mysql.sock`
- Test connection: `mysql -u root -pRamana1113 -e "SELECT 1;"`

### Remote Database Issues
- Check network connectivity to `103.86.177.38:3306`
- Verify credentials are correct
- Check if remote MySQL server is running

### Both Databases Failing
- Check environment variables in `.env` file
- Restart your application
- Check console logs for specific error messages
