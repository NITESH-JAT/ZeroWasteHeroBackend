-- src/db/schema.sql

-- ==========================================
-- ENUMS
-- ==========================================
CREATE TYPE user_role AS ENUM ('CITIZEN', 'NGO', 'WORKER', 'CHAMPION', 'ADMIN');
CREATE TYPE report_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'CLEANED');
CREATE TYPE task_status AS ENUM ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED');
CREATE TYPE campaign_status AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- ==========================================
-- TABLES
-- ==========================================

-- 1. Users Table (Handles all roles)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'CITIZEN',
    green_points INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Reports Table (Waste reported by Citizens)
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT,
    image_url TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    status report_status DEFAULT 'PENDING',
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL, -- Champion who verified
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Campaigns Table (Created by NGOs)
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ngo_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status campaign_status DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tasks Table (Clean-up tasks assigned to Workers)
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status task_status DEFAULT 'OPEN',
    reward_points INTEGER NOT NULL DEFAULT 10,
    proof_image_url TEXT, -- Uploaded by worker when done
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL, -- Champion who verified the cleanup
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Rewards Ledger Table (Gamification History)
CREATE TABLE IF NOT EXISTS rewards_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    points_change INTEGER NOT NULL, -- Can be positive (earned) or negative (spent/redeemed)
    reason VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Scrap Listings Table (For citizens to list scrap for collection)
CREATE TABLE scrap_listings (
    id SERIAL PRIMARY KEY,
    citizen_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'OPEN', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Scrap Bids Table (For workers to bid on scrap collection tasks)
CREATE TABLE scrap_bids (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER REFERENCES scrap_listings(id) ON DELETE CASCADE,
    scrapper_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    proposed_time VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
ALTER TABLE users ADD COLUMN gov_id_url VARCHAR(255);
ALTER TYPE user_role ADD VALUE 'SCRAPPER';
ALTER TABLE scrap_listings ADD COLUMN city VARCHAR(100) NOT NULL DEFAULT 'Unknown';
CREATE TABLE penalties (id SERIAL PRIMARY KEY, user_id UUID, amount NUMERIC, reason TEXT, created_at TIMESTAMP DEFAULT NOW());