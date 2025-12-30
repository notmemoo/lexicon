-- SQL for Steve's Massage Therapy Supabase Backend

-- 1. Table for Contact Form Inquiries
CREATE TABLE IF NOT EXISTS inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    source TEXT DEFAULT 'contact_form',
    status TEXT DEFAULT 'new', -- 'new', 'contacted', 'booked', 'closed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table for Ad Tracking (UTM parameters)
CREATE TABLE IF NOT EXISTS conversions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    page_path TEXT NOT NULL,
    conversion_type TEXT NOT NULL, -- 'booking_click', 'form_submit', 'phone_click'
    user_id UUID, -- Optional link to auth user if implemented later
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Table for Services (Steve can edit these later)
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price_info TEXT, -- e.g. "$85 / 60 min"
    duration_minutes INTEGER,
    category TEXT, -- 'massage', 'add-on', etc.
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- 5. Policies
-- Inquiries: Only allow insertions from public (anon)
CREATE POLICY "Allow public to insert inquiries" ON inquiries
    FOR INSERT WITH CHECK (true);

-- Conversions: Only allow insertions from public (anon)
CREATE POLICY "Allow public to insert conversions" ON conversions
    FOR INSERT WITH CHECK (true);

-- Services: Allow public to read, but only admin (authenticated) to modify
CREATE POLICY "Allow public to read services" ON services
    FOR SELECT USING (true);



