# MySQL Setup for Windows

## Option 1: Install MySQL Server (Recommended)

### 1. Download MySQL Installer
- Go to: https://dev.mysql.com/downloads/installer/
- Download "MySQL Installer for Windows"
- Choose the "mysql-installer-community" version

### 2. Install MySQL
1. Run the installer as Administrator
2. Choose "Developer Default" setup type
3. Follow the installation wizard
4. Set root password to: `Ramana1113` (to match your config)
5. Complete the installation

### 3. Start MySQL Service
```cmd
# Start MySQL service
net start mysql

# Or use Services.msc and start "MySQL80" service
```

### 4. Test Connection
```cmd
# Test connection
mysql -u root -pRamana1113 -e "SELECT 1;"
```

## Option 2: Use XAMPP (Easier)

### 1. Download XAMPP
- Go to: https://www.apachefriends.org/download.html
- Download XAMPP for Windows

### 2. Install and Start
1. Install XAMPP
2. Start XAMPP Control Panel
3. Start MySQL service
4. Set root password in phpMyAdmin

### 3. Create Database
```sql
CREATE DATABASE cleanroom_db;
```

## Option 3: Use Docker (Advanced)

### 1. Install Docker Desktop
- Download from: https://www.docker.com/products/docker-desktop

### 2. Run MySQL Container
```cmd
docker run --name mysql-local -e MYSQL_ROOT_PASSWORD=Ramana1113 -e MYSQL_DATABASE=cleanroom_db -p 3306:3306 -d mysql:8.0
```

## Configuration After Installation

### 1. Update Environment Variables
Create `.env.local` file with:
```env
# Use only remote database for now
USE_DUAL_DB=false
USE_REMOTE_DB=true

# Remote Database (Working)
REMOTE_MYSQL_HOST=103.86.177.38
REMOTE_MYSQL_USER=atsuser
REMOTE_MYSQL_PASSWORD=Root1234!
REMOTE_MYSQL_DATABASE=cleanroom_db
REMOTE_MYSQL_PORT=3306

# Local Database (After MySQL installation)
# MYSQL_HOST=localhost
# MYSQL_USER=root
# MYSQL_PASSWORD=Ramana1113
# MYSQL_DATABASE=cleanroom_db
# MYSQL_PORT=3306
```

### 2. Test the Application
```cmd
npm run dev
```

## Troubleshooting

### Common Issues:
1. **Port 3306 already in use**: Change port in MySQL config
2. **Access denied**: Check username/password
3. **Connection refused**: Ensure MySQL service is running
4. **Socket not found**: Use TCP connection instead of socket

### Quick Fix Commands:
```cmd
# Check if MySQL is running
netstat -an | findstr 3306

# Start MySQL service
net start mysql

# Stop MySQL service
net stop mysql

# Reset MySQL root password
mysqladmin -u root password Ramana1113
```

## Recommended Approach

For now, I recommend using **Option 1** (disable dual database mode) since your remote database is working perfectly. This will:

1. ✅ Fix the immediate error
2. ✅ Allow password reset to work
3. ✅ Use the stable remote database
4. ✅ Avoid local MySQL setup complexity

You can always set up local MySQL later if needed for development.

