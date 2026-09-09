-- =============================================
-- Project Images Migration
-- Run this in Supabase SQL Editor AFTER schema.sql
-- =============================================

-- =============================================
-- STEP 1: Create project_images table
-- =============================================
CREATE TABLE IF NOT EXISTS project_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT DEFAULT '',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_images_public_read"
  ON project_images FOR SELECT
  USING (true);

CREATE POLICY "project_images_auth_write"
  ON project_images FOR ALL
  USING (auth.role() = 'authenticated');

-- =============================================
-- STEP 2: Create Storage Bucket (do this in Dashboard)
-- =============================================
-- Go to Supabase Dashboard → Storage → Create a new bucket
-- Bucket name: project-images
-- Public: YES (toggle on)
-- Then add this storage policy via SQL:

INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT DO NOTHING;

-- Allow public to view images
CREATE POLICY "project_images_storage_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

-- Allow authenticated users to upload
CREATE POLICY "project_images_storage_auth_upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-images');

-- Allow authenticated users to delete their uploads
CREATE POLICY "project_images_storage_auth_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-images');
