-- MySQL Schema for Clean Room Application
-- Run this in your MySQL database

-- Create user_profiles table
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
);

-- Create login_history table
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
);

-- Create form_submissions table
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
  system VARCHAR(255) NOT NULL,
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
);

-- Create indexes
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_login_history_user_id ON login_history(user_id);
CREATE INDEX idx_login_history_login_time ON login_history(login_time DESC);
CREATE INDEX idx_form_submissions_unique_id ON form_submissions(unique_id);
CREATE INDEX idx_form_submissions_created_at ON form_submissions(created_at);

-- Create views
CREATE OR REPLACE VIEW login_stats AS
SELECT 
  DATE(login_time) as login_date,
  COUNT(*) as total_attempts,
  SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successful_logins,
  SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) as failed_logins,
  ROUND((SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) as success_rate
FROM login_history
GROUP BY DATE(login_time)
ORDER BY login_date DESC;

CREATE OR REPLACE VIEW user_login_summary AS
SELECT 
  up.id,
  up.name,
  up.email,
  up.role,
  up.is_active,
  up.created_at,
  up.last_login,
  COUNT(lh.id) as total_login_attempts,
  SUM(CASE WHEN lh.success = 1 THEN 1 ELSE 0 END) as successful_logins,
  SUM(CASE WHEN lh.success = 0 THEN 1 ELSE 0 END) as failed_logins,
  MAX(lh.login_time) as last_attempt
FROM user_profiles up
LEFT JOIN login_history lh ON up.id = lh.user_id
GROUP BY up.id, up.name, up.email, up.role, up.is_active, up.created_at, up.last_login
ORDER BY up.last_login DESC; 