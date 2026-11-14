-- =============================================================================
-- EDITORIAL QUEUE & BATCH DRIP-PUBLISHING MIGRATION FOR SUPABASE
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- =============================================================================

-- 1. Safely drop any existing status check constraints on public.blogs
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'public.blogs'::regclass 
          AND contype = 'c' 
          AND conname LIKE '%status%'
    ) LOOP
        EXECUTE 'ALTER TABLE public.blogs DROP CONSTRAINT IF EXISTS ' || quote_ident(r.conname);
    END LOOP;
END $$;

-- 2. Re-add status constraint allowing 'draft', 'published', and 'queued'
ALTER TABLE public.blogs ADD CONSTRAINT blogs_status_check 
    CHECK (status IN ('draft', 'published', 'queued'));

-- 3. Add queue-specific columns to store original dump and explicit queue sequence
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS source_dump TEXT;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS queue_order INT DEFAULT 0;

-- 4. Create performance index for fast retrieval of queued drafts
CREATE INDEX IF NOT EXISTS idx_blogs_queued 
    ON public.blogs (status, queue_order ASC, created_at ASC);
