-- Migration: Add is_featured and display_order columns to media table
-- Run this migration to add featured media support

-- Add is_featured column (boolean, default false)
ALTER TABLE media 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Add display_order column (integer, default 0)
ALTER TABLE media 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Set first media of each post as featured (optional - for existing data)
-- This will mark the first media (by created_at) of each post as featured
UPDATE media m1
SET is_featured = TRUE
WHERE m1.id IN (
    SELECT DISTINCT ON (post_id) id
    FROM media
    WHERE is_featured = FALSE OR is_featured IS NULL
    ORDER BY post_id, created_at ASC
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_media_is_featured ON media(is_featured);
CREATE INDEX IF NOT EXISTS idx_media_display_order ON media(display_order);
CREATE INDEX IF NOT EXISTS idx_media_post_featured ON media(post_id, is_featured);

