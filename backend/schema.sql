-- PostgreSQL Schema for SmartBrain

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email TEXT UNIQUE NOT NULL,
    entries BIGINT DEFAULT 0,
    joined TIMESTAMP NOT NULL
);

-- Create login table
CREATE TABLE IF NOT EXISTS login (
    id SERIAL PRIMARY KEY,
    hash VARCHAR(100) NOT NULL,
    email TEXT UNIQUE NOT NULL
);
