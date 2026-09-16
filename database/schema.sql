-- ZeeTech Agency Database Schema

-- Drop tables if they already exist
DROP TABLE IF EXISTS statistics CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- 1. Projects Table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    client_name VARCHAR(150) NOT NULL,
    client_role VARCHAR(150) NOT NULL,
    client_avatar TEXT,
    project_type VARCHAR(100) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    bg_color VARCHAR(50) NOT NULL DEFAULT '#FB923C',
    text_color VARCHAR(50) NOT NULL DEFAULT '#0D0D0D',
    image_url TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Clients Table
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    company VARCHAR(150) NOT NULL,
    role VARCHAR(150) NOT NULL,
    image TEXT,
    testimonial TEXT,
    rating DECIMAL(2, 1) DEFAULT 5.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Brands Table (For the two-row Marquee)
CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo_svg TEXT NOT NULL,
    row INT NOT NULL DEFAULT 1 CHECK (row IN (1, 2)),
    sort_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Testimonials Table (Featured & Verified Endorsements)
CREATE TABLE testimonials (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(150) NOT NULL,
    client_role VARCHAR(150) NOT NULL,
    client_company VARCHAR(150) NOT NULL,
    avatar_url TEXT NOT NULL,
    quote TEXT NOT NULL,
    rating DECIMAL(2, 1) DEFAULT 5.0,
    platform VARCHAR(50) DEFAULT 'Fiverr',
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Statistics Table (For Count-up Animations)
CREATE TABLE statistics (
    id SERIAL PRIMARY KEY,
    value INT NOT NULL,
    prefix VARCHAR(10) DEFAULT '',
    suffix VARCHAR(10) DEFAULT '+',
    label VARCHAR(100) NOT NULL,
    sort_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);