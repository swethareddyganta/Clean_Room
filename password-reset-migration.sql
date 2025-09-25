-- Password Reset Migration
-- Run this in your MySQL database to add password reset functionality

-- Create password_resets table
CREATE TABLE IF NOT EXISTS password_resets (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  token_hash VARBINARY(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  used TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_password_resets_user_id ON password_resets(user_id);
CREATE INDEX idx_password_resets_expires_at ON password_resets(expires_at);
CREATE INDEX idx_password_resets_used ON password_resets(used);
CREATE INDEX idx_password_resets_token_hash ON password_resets(token_hash);

-- Create rate limiting table for password reset requests
CREATE TABLE IF NOT EXISTS password_reset_rate_limits (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  request_count INT DEFAULT 1,
  first_request_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_request_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  blocked_until TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for rate limiting
CREATE INDEX idx_password_reset_rate_limits_email ON password_reset_rate_limits(email);
CREATE INDEX idx_password_reset_rate_limits_ip ON password_reset_rate_limits(ip_address);
CREATE INDEX idx_password_reset_rate_limits_blocked_until ON password_reset_rate_limits(blocked_until);

-- Clean up expired tokens (run this periodically)
-- DELETE FROM password_resets WHERE expires_at < NOW() AND used = 1;
