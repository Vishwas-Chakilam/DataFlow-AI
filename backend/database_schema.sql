-- DataFlow AI Database Schema
-- Execute this SQL script to create the database and tables

-- Create database (if it doesn't exist)
CREATE DATABASE IF NOT EXISTS dataflow_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE dataflow_ai;

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datasets table
CREATE TABLE IF NOT EXISTS datasets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type ENUM('csv', 'xlsx', 'xls') NOT NULL,
    row_count INT DEFAULT 0,
    column_count INT DEFAULT 0,
    headers TEXT,  -- JSON array of column names
    status ENUM('uploaded', 'processing', 'processed', 'error') DEFAULT 'uploaded',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data processing workflows table
CREATE TABLE IF NOT EXISTS workflows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dataset_id INT NOT NULL,
    user_id INT NOT NULL,
    workflow_type ENUM('gathering', 'cleaning', 'transformation', 'modeling') NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    input_data TEXT,  -- JSON data
    output_data TEXT,  -- JSON data
    insights TEXT,  -- AI-generated insights
    metadata TEXT,  -- JSON metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_dataset_id (dataset_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Machine Learning Models table
CREATE TABLE IF NOT EXISTS models (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workflow_id INT NULL,
    dataset_id INT NOT NULL,
    user_id INT NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    model_type ENUM('Regression', 'Classification', 'Clustering', 'Time Series') NOT NULL,
    algorithm VARCHAR(100) NOT NULL,  -- e.g., 'Random Forest', 'Linear Regression'
    model_path VARCHAR(500),  -- Path to saved .pkl file
    train_test_split DECIMAL(5,2) DEFAULT 70.00,  -- Train percentage
    accuracy DECIMAL(10,4),
    precision_score DECIMAL(10,4),
    recall_score DECIMAL(10,4),
    f1_score DECIMAL(10,4),
    r2_score DECIMAL(10,4),
    mse DECIMAL(20,4),
    mae DECIMAL(20,4),
    metrics TEXT,  -- JSON with all metrics
    status ENUM('pending', 'training', 'trained', 'failed') DEFAULT 'pending',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    trained_at TIMESTAMP NULL,
    FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE SET NULL,
    FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_dataset_id (dataset_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_model_type (model_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Predictions table
CREATE TABLE IF NOT EXISTS predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    model_id INT NOT NULL,
    user_id INT NOT NULL,
    input_features TEXT NOT NULL,  -- JSON
    prediction_result TEXT,  -- JSON
    confidence_score DECIMAL(10,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_model_id (model_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Visualizations table
CREATE TABLE IF NOT EXISTS visualizations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dataset_id INT NOT NULL,
    model_id INT NULL,
    user_id INT NOT NULL,
    viz_type VARCHAR(50) NOT NULL,  -- 'bar', 'line', 'scatter', 'heatmap', etc.
    title VARCHAR(255),
    data TEXT NOT NULL,  -- JSON chart data
    config TEXT,  -- JSON chart configuration
    image_path VARCHAR(500),  -- Path to saved image if exported
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE CASCADE,
    FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_dataset_id (dataset_id),
    INDEX idx_user_id (user_id),
    INDEX idx_viz_type (viz_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- History/Project sessions table
CREATE TABLE IF NOT EXISTS project_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_name VARCHAR(255) NOT NULL,
    dataset_id INT,
    model_id INT,
    workflow_summary TEXT,  -- JSON summary
    insights TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (dataset_id) REFERENCES datasets(id) ON DELETE SET NULL,
    FOREIGN KEY (model_id) REFERENCES models(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;