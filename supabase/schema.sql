-- =============================================
-- SFR Portfolio — Supabase Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension (already enabled on Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL DEFAULT 'Denis Hain',
  title TEXT NOT NULL DEFAULT 'Full Stack Developer',
  bio TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  github TEXT DEFAULT '',
  linkedin TEXT DEFAULT '',
  portfolio_url TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Public can read profiles
CREATE POLICY "profiles_public_read"
  ON profiles FOR SELECT
  USING (true);

-- Only authenticated owner can write
CREATE POLICY "profiles_owner_write"
  ON profiles FOR ALL
  USING (auth.uid() = user_id);

-- =============================================
-- PROJECTS
-- =============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  tech_stack TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'web',
  url TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_public_read"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "projects_auth_write"
  ON projects FOR ALL
  USING (auth.role() = 'authenticated');

-- =============================================
-- SKILLS
-- =============================================
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  level TEXT DEFAULT 'intermediate' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "skills_public_read"
  ON skills FOR SELECT
  USING (true);

CREATE POLICY "skills_auth_write"
  ON skills FOR ALL
  USING (auth.role() = 'authenticated');

-- =============================================
-- EXPERIENCES
-- =============================================
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  is_current BOOLEAN DEFAULT false,
  description TEXT[] DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "experiences_public_read"
  ON experiences FOR SELECT
  USING (true);

CREATE POLICY "experiences_auth_write"
  ON experiences FOR ALL
  USING (auth.role() = 'authenticated');

-- =============================================
-- TRAININGS
-- =============================================
CREATE TABLE IF NOT EXISTS trainings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  provider TEXT NOT NULL,
  year TEXT,
  certificate_url TEXT DEFAULT '',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "trainings_public_read"
  ON trainings FOR SELECT
  USING (true);

CREATE POLICY "trainings_auth_write"
  ON trainings FOR ALL
  USING (auth.role() = 'authenticated');

-- =============================================
-- Auto-update updated_at trigger
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
