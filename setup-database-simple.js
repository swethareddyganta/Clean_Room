// Simple database setup script for Clean Room Application
const fs = require('fs')
const mysql = require('mysql2/promise')

// Load environment variables from .env file
try {
  const envPath = require('path').join(process.cwd(), '.env')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          process.env[key.trim()] = valueParts.join('=').trim()
        }
      }
    })
    console.log('📄 Loaded environment variables from .env file')
  }
} catch (error) {
  console.log('⚠️  Could not load .env file, using process.env')
}

async function setupDatabase() {
  let connection
  
  try {
    console.log('🔧 Setting up Clean Room Database...')
    
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE || 'clean_room_db',
      port: process.env.MYSQL_PORT || 3306
    })

    console.log('✅ Connected to MySQL database')

    // Step 1: Create user_profiles table
    console.log('📝 Creating user_profiles table...')
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL
      )
    `)
    console.log('  ✅ user_profiles table created')

    // Step 2: Create form_submissions table
    console.log('📝 Creating form_submissions table...')
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS form_submissions (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        customer_name VARCHAR(255) NOT NULL,
        customer_address TEXT NOT NULL,
        branch_name VARCHAR(255) NOT NULL,
        project_name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        location_data JSON,
        unique_id VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(50),
        email VARCHAR(255),
        other_info TEXT,
        standard VARCHAR(100) NOT NULL,
        classification VARCHAR(100) NOT NULL,
        system_type VARCHAR(255) NOT NULL,
        ac_system VARCHAR(255),
        ventilation_system VARCHAR(255),
        cooling_method VARCHAR(255),
        ventilation_type VARCHAR(255),
        max_temp VARCHAR(50) NOT NULL,
        min_temp VARCHAR(50) NOT NULL,
        max_rh VARCHAR(50) NOT NULL,
        min_rh VARCHAR(50) NOT NULL,
        air_changes VARCHAR(50),
        filters JSON,
        ahu_specs JSON,
        filtration_stages VARCHAR(100),
        static_pressure VARCHAR(100),
        pressure_drop JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
    console.log('  ✅ form_submissions table created')

    // Step 3: Create login_history table
    console.log('📝 Creating login_history table...')
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS login_history (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id VARCHAR(36),
        email VARCHAR(255) NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        user_role VARCHAR(50) NOT NULL,
        login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        user_agent TEXT,
        device_info VARCHAR(100),
        location VARCHAR(255),
        success BOOLEAN DEFAULT true,
        failure_reason TEXT,
        session_duration INT,
        logout_time TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
      )
    `)
    console.log('  ✅ login_history table created')

    // Step 4: Create password_resets table
    console.log('📝 Creating password_resets table...')
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id VARCHAR(36) NOT NULL,
        token_hash VARBINARY(64) NOT NULL,
        expires_at DATETIME NOT NULL,
        used TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
      )
    `)
    console.log('  ✅ password_resets table created')

    // Step 5: Create password_reset_rate_limits table
    console.log('📝 Creating password_reset_rate_limits table...')
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS password_reset_rate_limits (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        email VARCHAR(255) NOT NULL,
        ip_address VARCHAR(45) NOT NULL,
        request_count INT DEFAULT 1,
        first_request_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_request_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        blocked_until TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('  ✅ password_reset_rate_limits table created')

    // Step 6: Create indexes
    console.log('📝 Creating indexes...')
    const indexes = [
      'CREATE INDEX idx_user_profiles_email ON user_profiles(email)',
      'CREATE INDEX idx_user_profiles_role ON user_profiles(role)',
      'CREATE INDEX idx_form_submissions_unique_id ON form_submissions(unique_id)',
      'CREATE INDEX idx_form_submissions_created_at ON form_submissions(created_at)',
      'CREATE INDEX idx_login_history_user_id ON login_history(user_id)',
      'CREATE INDEX idx_login_history_login_time ON login_history(login_time DESC)',
      'CREATE INDEX idx_password_resets_user_id ON password_resets(user_id)',
      'CREATE INDEX idx_password_resets_expires_at ON password_resets(expires_at)',
      'CREATE INDEX idx_password_resets_used ON password_resets(used)',
      'CREATE INDEX idx_password_reset_rate_limits_email ON password_reset_rate_limits(email)',
      'CREATE INDEX idx_password_reset_rate_limits_ip ON password_reset_rate_limits(ip_address)'
    ]

    for (const indexSql of indexes) {
      try {
        await connection.execute(indexSql)
        console.log(`  ✅ Index created: ${indexSql.split(' ')[2]}`)
      } catch (error) {
        if (error.code === 'ER_DUP_KEYNAME') {
          console.log(`  ⚠️  Index already exists: ${indexSql.split(' ')[2]}`)
        } else {
          console.log(`  ❌ Index creation failed: ${error.message}`)
        }
      }
    }

    // Step 7: Insert default admin user
    console.log('📝 Creating default admin user...')
    try {
      await connection.execute(`
        INSERT INTO user_profiles (id, email, name, password, role) 
        VALUES (UUID(), 'admin@arrant.com', 'Admin User', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
        ON DUPLICATE KEY UPDATE id=id
      `)
      console.log('  ✅ Default admin user created')
    } catch (error) {
      console.log('  ⚠️  Admin user may already exist')
    }

    // Verify tables were created
    console.log('\n🔍 Verifying table creation...')
    const [tables] = await connection.execute('SHOW TABLES')
    
    const expectedTables = [
      'user_profiles',
      'form_submissions', 
      'login_history',
      'password_resets',
      'password_reset_rate_limits'
    ]

    console.log('\n📋 Created tables:')
    tables.forEach(table => {
      const tableName = Object.values(table)[0]
      const isExpected = expectedTables.includes(tableName)
      console.log(`  ${isExpected ? '✅' : '📄'} ${tableName}`)
    })

    // Check if all expected tables exist
    const createdTableNames = tables.map(table => Object.values(table)[0])
    const missingTables = expectedTables.filter(table => !createdTableNames.includes(table))
    
    if (missingTables.length === 0) {
      console.log('\n🎉 Database setup completed successfully!')
      console.log('\n📝 Next steps:')
      console.log('  1. Configure SMTP settings for password reset emails')
      console.log('  2. Test the password reset functionality')
      console.log('  3. Run: npm run dev')
      console.log('\n🔐 Default admin credentials:')
      console.log('  Email: admin@arrant.com')
      console.log('  Password: password')
    } else {
      console.log(`\n⚠️  Missing tables: ${missingTables.join(', ')}`)
    }

  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    console.log('\n💡 Troubleshooting:')
    console.log('  1. Check your MySQL connection settings')
    console.log('  2. Ensure MySQL server is running')
    console.log('  3. Verify database exists')
    console.log('  4. Check environment variables')
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

// Run the setup
setupDatabase()
