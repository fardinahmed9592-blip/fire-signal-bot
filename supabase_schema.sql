-- 1. Create the Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'inactive',
    "registrationDate" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT FALSE,
    "has_access" BOOLEAN NOT NULL DEFAULT FALSE,
    "passwordHash" TEXT NOT NULL
);

-- 2. Create the Signals Table
CREATE TABLE IF NOT EXISTS public.signals (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    screenshot TEXT NOT NULL,
    signal TEXT NOT NULL,
    confidence INTEGER NOT NULL,
    "analysisTime" TEXT NOT NULL
);

-- 3. Create the Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    date TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE
);

-- Note: Enable row level security (RLS) is optional. For a simple setup, 
-- you can temporarily disable RLS for these tables or use service role keys.
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.signals DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- Auto-seed Fardin's admin credentials safely
-- Replace with your hashed password (default is bcrypt of 'FireSignal@2026')
INSERT INTO public.users (id, name, email, status, "registrationDate", "isAdmin", "has_access", "passwordHash")
VALUES 
('usr_admin_gmai', 'Fardin Ahmed (gmai)', 'fardinahmed9592@gmai.com', 'approved', '2026-06-13T10:00:00.000Z', TRUE, TRUE, '$2a$10$wNks9D5NqK9YVjREv.Ueeedp3Yc8z/hHstOlyOfe4Jp7BCHH8SzeS'),
('usr_admin_gmail', 'Fardin Ahmed (gmail)', 'fardinahmed9592@gmail.com', 'approved', '2026-06-13T10:00:00.000Z', TRUE, TRUE, '$2a$10$wNks9D5NqK9YVjREv.Ueeedp3Yc8z/hHstOlyOfe4Jp7BCHH8SzeS')
ON CONFLICT (id) DO NOTHING;
