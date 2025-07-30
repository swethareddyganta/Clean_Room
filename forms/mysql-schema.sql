-- MySQL Schema for Forms Application
-- Run this in your MySQL database

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

-- Create indexes for better performance
CREATE INDEX idx_form_submissions_unique_id ON form_submissions(unique_id);
CREATE INDEX idx_form_submissions_created_at ON form_submissions(created_at);
CREATE INDEX idx_form_submissions_customer_name ON form_submissions(customer_name);
CREATE INDEX idx_form_submissions_project_name ON form_submissions(project_name); 