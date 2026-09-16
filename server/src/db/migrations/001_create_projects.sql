CREATE TABLE IF NOT EXISTS projects (
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