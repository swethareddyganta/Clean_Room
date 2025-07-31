-- Login History Tracking Schema for MySQL
-- Run this in your MySQL database

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
  session_duration INT, -- in seconds
  logout_time TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_login_history_user_id ON login_history(user_id);
CREATE INDEX idx_login_history_login_time ON login_history(login_time DESC);
CREATE INDEX idx_login_history_email ON login_history(email);
CREATE INDEX idx_login_history_success ON login_history(success);

-- Create a composite index for common queries
CREATE INDEX idx_login_history_user_time ON login_history(user_id, login_time DESC);

-- Add last_login column to user_profiles if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN last_login TIMESTAMP NULL;

-- Function to automatically update last_login in user_profiles
DELIMITER //
CREATE TRIGGER update_last_login_trigger
AFTER INSERT ON login_history
FOR EACH ROW
BEGIN
  IF NEW.success = true THEN
    UPDATE user_profiles 
    SET last_login = NEW.login_time 
    WHERE id = NEW.user_id;
  END IF;
END//
DELIMITER ;

-- Create login_stats view
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

-- Create user_login_summary view
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