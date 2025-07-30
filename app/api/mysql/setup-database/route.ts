import { NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql'

export async function POST() {
  try {
    const results = {
      tables: [] as string[],
      errors: [] as string[]
    }

    // Create user_profiles table
    try {
      await executeQuery(`
        CREATE TABLE IF NOT EXISTS user_profiles (
          id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role ENUM('user', 'admin') DEFAULT 'user',
          is_active BOOLEAN DEFAULT true,
          last_login TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `)
      results.tables.push('user_profiles')
    } catch (error) {
      results.errors.push(`user_profiles: ${error}`)
    }

    // Create form_submissions table
    try {
      await executeQuery(`
        CREATE TABLE IF NOT EXISTS form_submissions (
          id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
          customer_name TEXT NOT NULL,
          customer_address TEXT NOT NULL,
          branch_name TEXT NOT NULL,
          project_name TEXT NOT NULL,
          location TEXT NOT NULL,
          location_data JSON,
          unique_id VARCHAR(255) NOT NULL UNIQUE,
          phone VARCHAR(20),
          email VARCHAR(255),
          other_info TEXT,
          standard VARCHAR(255) NOT NULL,
          classification VARCHAR(255) NOT NULL,
          system_type VARCHAR(255) NOT NULL,
          ac_system VARCHAR(255),
          ventilation_system VARCHAR(255),
          cooling_method VARCHAR(255),
          ventilation_type VARCHAR(255),
          max_temp VARCHAR(50) NOT NULL,
          min_temp VARCHAR(50) NOT NULL,
          max_rh VARCHAR(50) NOT NULL,
          min_rh VARCHAR(50) NOT NULL,
          air_changes VARCHAR(255),
          filters JSON,
          ahu_specs JSON,
          filtration_stages VARCHAR(255),
          static_pressure VARCHAR(255),
          pressure_drop JSON,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `)
      results.tables.push('form_submissions')
    } catch (error) {
      results.errors.push(`form_submissions: ${error}`)
    }

    // Create login_history table
    try {
      await executeQuery(`
        CREATE TABLE IF NOT EXISTS login_history (
          id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
          user_id VARCHAR(36),
          email VARCHAR(255) NOT NULL,
          user_name VARCHAR(255) NOT NULL,
          user_role VARCHAR(50) NOT NULL,
          login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          ip_address VARCHAR(45),
          user_agent TEXT,
          device_info TEXT,
          location VARCHAR(255),
          success BOOLEAN DEFAULT true,
          failure_reason TEXT,
          session_duration INT,
          logout_time TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
        )
      `)
      results.tables.push('login_history')
    } catch (error) {
      results.errors.push(`login_history: ${error}`)
    }

    // Create indexes
    try {
      await executeQuery('CREATE INDEX IF NOT EXISTS idx_form_submissions_unique_id ON form_submissions(unique_id)')
      await executeQuery('CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at)')
      await executeQuery('CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON login_history(user_id)')
      await executeQuery('CREATE INDEX IF NOT EXISTS idx_login_history_login_time ON login_history(login_time DESC)')
      await executeQuery('CREATE INDEX IF NOT EXISTS idx_login_history_email ON login_history(email)')
      await executeQuery('CREATE INDEX IF NOT EXISTS idx_login_history_success ON login_history(success)')
      await executeQuery('CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email)')
    } catch (error) {
      results.errors.push(`indexes: ${error}`)
    }

    // Create views
    try {
      await executeQuery(`
        CREATE OR REPLACE VIEW login_stats AS
        SELECT 
          DATE(login_time) as login_date,
          COUNT(*) as total_logins,
          SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful_logins,
          SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) as failed_logins
        FROM login_history 
        GROUP BY DATE(login_time)
        ORDER BY login_date DESC
      `)
      results.tables.push('login_stats')
    } catch (error) {
      results.errors.push(`login_stats view: ${error}`)
    }

    try {
      await executeQuery(`
        CREATE OR REPLACE VIEW user_login_summary AS
        SELECT 
          u.id,
          u.name,
          u.email,
          u.role,
          u.last_login,
          COUNT(lh.id) as total_logins,
          SUM(CASE WHEN lh.success = 1 THEN 1 ELSE 0 END) as successful_logins,
          SUM(CASE WHEN lh.success = 0 THEN 1 ELSE 0 END) as failed_logins
        FROM user_profiles u
        LEFT JOIN login_history lh ON u.id = lh.user_id
        GROUP BY u.id, u.name, u.email, u.role, u.last_login
        ORDER BY u.last_login DESC
      `)
      results.tables.push('user_login_summary')
    } catch (error) {
      results.errors.push(`user_login_summary view: ${error}`)
    }

    return NextResponse.json({
      success: results.tables.length > 0,
      results,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 