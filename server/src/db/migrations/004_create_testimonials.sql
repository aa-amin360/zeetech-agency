CREATE TABLE IF NOT EXISTS testimonials (
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