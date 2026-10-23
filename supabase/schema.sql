-- =========================================================
-- PetPal India: Database Schema (Supabase / PostgreSQL)
-- Peer-to-Peer Dog Walking & Pet Companionship Marketplace
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'pal', 'admin')),
  aadhaar_verified BOOLEAN DEFAULT false,
  college_or_company TEXT,
  society_name TEXT,
  city TEXT NOT NULL,
  is_onboarded BOOLEAN DEFAULT false,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PETS TABLE
CREATE TABLE IF NOT EXISTS public.pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  breed TEXT NOT NULL,
  age_months INTEGER NOT NULL,
  weight_kg NUMERIC(4,1) NOT NULL,
  size TEXT NOT NULL CHECK (size IN ('small', 'medium', 'large')),
  vaccinated BOOLEAN DEFAULT true,
  temperament TEXT[] DEFAULT '{}',
  special_instructions TEXT,
  avatar_emoji TEXT DEFAULT '🐕',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PET PAL PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.pet_pal_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  preferred_sizes TEXT[] DEFAULT '{"small", "medium"}',
  experience_level TEXT NOT NULL CHECK (experience_level IN ('Beginner', 'Intermediate', 'Experienced')),
  bio TEXT,
  rating NUMERIC(3,2) DEFAULT 5.00,
  total_walks INTEGER DEFAULT 0,
  approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('approved', 'pending', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  pal_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes IN (30, 60, 90)),
  cost NUMERIC(6,2) NOT NULL,
  pal_share NUMERIC(6,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  reaction_emoji TEXT,
  completion_notes TEXT,
  walk_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL CHECK (plan_id IN ('basic', 'standard', 'premium')),
  plan_name TEXT NOT NULL,
  walks_total INTEGER NOT NULL,
  walks_remaining INTEGER NOT NULL,
  price_inr NUMERIC(6,2) NOT NULL,
  active_until DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  details TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);
CREATE INDEX IF NOT EXISTS idx_pets_owner_id ON public.pets(owner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_owner ON public.bookings(owner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_pal ON public.bookings(pal_id);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_pal_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Allow public read & write for demonstration (can be restricted with auth.uid() in production)
CREATE POLICY "Public users read access" ON public.users FOR SELECT USING (true);
CREATE POLICY "Public users insert/update" ON public.users FOR ALL USING (true);

CREATE POLICY "Public pets read access" ON public.pets FOR SELECT USING (true);
CREATE POLICY "Public pets insert/update" ON public.pets FOR ALL USING (true);

CREATE POLICY "Public pals read access" ON public.pet_pal_profiles FOR SELECT USING (true);
CREATE POLICY "Public pals insert/update" ON public.pet_pal_profiles FOR ALL USING (true);

CREATE POLICY "Public bookings access" ON public.bookings FOR ALL USING (true);
CREATE POLICY "Public subscriptions access" ON public.subscriptions FOR ALL USING (true);
CREATE POLICY "Public reports access" ON public.reports FOR ALL USING (true);
