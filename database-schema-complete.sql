-- Complete Database Schema for Clean Room Application
-- Run this in your MySQL database

-- 1. User Profiles Table (for authentication)
CREATE TABLE IF NOT EXISTS user_profiles (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL
);

-- 2. Form Submissions Table (for storing form data)
CREATE TABLE IF NOT EXISTS form_submissions (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  
  -- Step 1: Customer & Project Details
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
  
  -- Step 2: Technical Specifications
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
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Login History Table (for tracking user logins)
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
  session_duration INT, -- in seconds
  logout_time TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_form_submissions_unique_id ON form_submissions(unique_id);
CREATE INDEX idx_form_submissions_created_at ON form_submissions(created_at);
CREATE INDEX idx_form_submissions_customer_name ON form_submissions(customer_name);
CREATE INDEX idx_form_submissions_project_name ON form_submissions(project_name);
CREATE INDEX idx_login_history_user_id ON login_history(user_id);
CREATE INDEX idx_login_history_login_time ON login_history(login_time DESC);
CREATE INDEX idx_login_history_email ON login_history(email);
CREATE INDEX idx_login_history_success ON login_history(success);

-- Insert default admin user (password: 'password')
INSERT INTO user_profiles (id, email, name, password, role) 
VALUES (UUID(), 'admin@arrant.com', 'Admin User', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON DUPLICATE KEY UPDATE id=id;
