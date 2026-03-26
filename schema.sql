-- UCU Innovators Hub Database Schema
-- Run this file to set up the database

CREATE DATABASE IF NOT EXISTS ucu_innovators_hub;
USE ucu_innovators_hub;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'supervisor', 'admin') NOT NULL DEFAULT 'student',
  faculty VARCHAR(100),
  department VARCHAR(100),
  student_number VARCHAR(50),
  profile_picture VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Project Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category_id INT,
  faculty VARCHAR(100),
  department VARCHAR(100),
  year INT,
  technologies VARCHAR(500),
  github_link VARCHAR(300),
  live_demo_link VARCHAR(300),
  document_path VARCHAR(300),
  thumbnail VARCHAR(300),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  rejection_reason TEXT,
  submitted_by INT NOT NULL,
  approved_by INT,
  approved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (submitted_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Project Team Members Table
CREATE TABLE IF NOT EXISTS project_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  role VARCHAR(100) DEFAULT 'Team Member',
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_member (project_id, user_id)
);

-- Comments / Feedback Table
CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  is_supervisor_note BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed: Default Categories
INSERT INTO categories (name, description) VALUES
  ('Software Development', 'Web, mobile, desktop applications'),
  ('Artificial Intelligence', 'ML, AI, data science projects'),
  ('Networking & Security', 'Cybersecurity, network infrastructure'),
  ('IoT & Embedded Systems', 'Hardware + software integration'),
  ('Database Systems', 'Data management solutions'),
  ('UI/UX Design', 'Interface and experience design'),
  ('Research & Innovation', 'Academic research and prototypes')
ON DUPLICATE KEY UPDATE name = name;

-- Seed: Default Admin User (password: Admin@123)
INSERT INTO users (full_name, email, password, role, faculty, department) VALUES
  ('System Administrator', 'admin@ucu.ac.ug', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TieqrAIuf0bkL2mA7dpFh5gJEv5K', 'admin', 'Administration', 'IT')
ON DUPLICATE KEY UPDATE email = email;
