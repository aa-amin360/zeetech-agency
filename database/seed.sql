-- ZeeTech Agency Seed Data

-- 1. Insert Statistics
INSERT INTO statistics (value, prefix, suffix, label, sort_order) VALUES
(150, '', '+', 'COUNTRIES SERVED', 1),
(14, '', '+', 'PROJECTS SHIPPED', 2),
(98, '', '%', 'CLIENT RETENTION', 3),
(5, '', '+', 'YEARS BUILDING', 4);

-- 2. Insert Brands (Row 1: moves Right -> Left, Row 2: moves Left -> Right)
INSERT INTO brands (name, logo_svg, row, sort_order) VALUES
-- Row 1
('Mastlink', 'mastlink', 1, 1),
('inDebted', 'indebted', 1, 2),
('Pentair', 'pentair', 1, 3),
('Telr', 'telr', 1, 4),
('Boon', 'boon', 1, 5),
('MergePoint.ai', 'mergepoint', 1, 6),
-- Row 2
('Axis Solutions', 'axis', 2, 1),
('Goldmark', 'goldmark', 2, 2),
('AeroPulse', 'aeropulse', 2, 3),
('HyperTrack', 'hypertrack', 2, 4),
('Apex Flow', 'apexflow', 2, 5),
('MergePoint Enterprise', 'mergepoint', 2, 6);

-- 3. Insert Projects (Matching the visual cards in the reference)
INSERT INTO projects (title, category, description, client_name, client_role, client_avatar, project_type, duration, bg_color, text_color, image_url, sort_order) VALUES
(
    'Real-Time Dispatch & Telematics Platform',
    'PROJECT 01 // FLEETPULSE GLOBAL',
    'High-throughput real-time telemetry processing interface serving fleet managers across 40+ countries with sub-20ms WebSocket sync.',
    'Avneet Chadha',
    'VP of Product',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'Product Strategy, UI/UX Design & Distributed Systems',
    '3 Months',
    '#FB923C',
    '#0D0D0D',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
    1
),
(
    'Design A Lawyer''s Second Brain',
    'PROJECT 02 // LEXICON INTELLIGENCE',
    'AI-powered case law synthesizer and legal knowledge vault transforming 500-page brief discovery into instantaneous contextual answers.',
    'David Miller',
    'Head of Product AI, Lexicon',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'Full Product Architecture & Design System',
    '4 Months',
    '#A3E635',
    '#0D0D0D',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80',
    2
),
(
    'FinTech Multi-Tenant Banking Console',
    'PROJECT 03 // VERTEX PROTOCOL',
    'Enterprise multi-currency ledger dashboard managing $1.2B quarterly transaction flows with biometric hardware authentication.',
    'Sarah Jenkins',
    'Chief Operating Officer',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'Design System & React Dashboard Engineering',
    '2.5 Months',
    '#38BDF8',
    '#0D0D0D',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
    3
),
(
    'AI Clinical Decision Support Engine',
    'PROJECT 04 // BIOMED SYNAPSE',
    'Contextual clinical assistant integrating diagnostic imagery, medical histories, and drug-interaction models for acute care doctors.',
    'Dr. Aris Thorne',
    'Clinical Director',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    'Interactive Diagnostics UI & Data Viz',
    '5 Months',
    '#C084FC',
    '#0D0D0D',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80',
    4
),
(
    'Autonomous EV Fleet Operations Hub',
    'PROJECT 05 // AEROPULSE MOBILITY',
    'Dynamic route telemetry, state-of-charge scheduling, and predictive maintenance platform for commercial electric van fleets.',
    'Elena Rostova',
    'Head of Fleet Technology',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'Mapbox Integration & Mobile Companion App',
    '3.5 Months',
    '#F472B6',
    '#0D0D0D',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    5
);

-- 4. Insert Testimonials
INSERT INTO testimonials (client_name, client_role, client_company, avatar_url, quote, rating, platform, is_featured, sort_order) VALUES
(
    'Andrew Baker',
    'Founder & CEO',
    'Baker Media Tech',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    'IT''S GREAT THAT I CAN WORK WITH JUST ZEE // TECH TO GET EVERY ASPECT OF WHAT I NEED COMPLETED.',
    5.0,
    'Fiverr',
    TRUE,
    1
),
(
    'Marcus Vance',
    'VP of Engineering',
    'ThreeSides Logistics',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    'ZeeTech Re-Architected Our Entire Telematics Ingestion Pipeline. We Went From Dropping WebSocket Packets During Morning Dispatch Rushes To Handling 50,000 Live Vehicle GPS Streams With 18ms Latency.',
    5.0,
    'Upwork',
    FALSE,
    2
),
(
    'Clara Hessel',
    'Chief Product Officer',
    'Novis Genomics',
    'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80',
    'Their rare combination of bespoke aesthetic direction and rock-solid full-stack architectural discipline made them feel like an integral internal team rather than an agency.',
    5.0,
    'Direct',
    FALSE,
    3
);