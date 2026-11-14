-- =============================================================================
-- LUXURY EDITORIAL PRODUCT DISCOVERY WEBSITE - DATABASE SCHEMA & POLICIES
-- PostgreSQL / Supabase Schema
-- =============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. SEQUENCES
-- Safe concurrent generation of sequential article numbers (starts at 1001)
-- -----------------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS article_number_seq START WITH 1001 INCREMENT BY 1;

-- -----------------------------------------------------------------------------
-- 2. PRODUCTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_number INTEGER UNIQUE NOT NULL DEFAULT nextval('article_number_seq'),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    my_take TEXT,
    affiliate_url TEXT NOT NULL,
    image_path TEXT NOT NULL,
    video_url TEXT, -- Hands-on YouTube review or Instagram reel URL
    source_content TEXT, -- Stored context for admin editing; not exposed publicly
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    published_at TIMESTAMPTZ
);

-- Index for public catalogue sorting (published, newest first)
CREATE INDEX IF NOT EXISTS idx_products_published_catalog 
ON public.products (status, published_at DESC NULLS LAST, created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_products_article_number 
ON public.products (article_number);

-- -----------------------------------------------------------------------------
-- 3. SITE SETTINGS TABLE (Single row configuration)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    brand_name TEXT NOT NULL DEFAULT 'MAISON & OBJECT',
    nav_subtitle TEXT DEFAULT 'Editorial Product Discovery',
    tagline TEXT DEFAULT 'A curated journal of exceptional design, craft, and material beauty.',
    home_badge TEXT DEFAULT 'Curated Hardware · Personal Field Notes',
    home_heading TEXT DEFAULT 'The Product Index',
    home_subheading TEXT DEFAULT 'A restrained catalogue of exceptional personal technology, industrial design, and daily tools evaluated for enduring utility and craftsmanship.',
    instagram_handle TEXT DEFAULT '',
    instagram_url TEXT DEFAULT '',
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    about_text TEXT DEFAULT 'Founded as an editorial exploration of craftsmanship and material honesty, we curate timeless objects that elevate everyday life. Every piece featured in our journal is independently selected for its enduring aesthetic and exceptional utility.',
    about_subtitle TEXT DEFAULT 'On the curation of objects that endure.',
    curatorial_principles JSONB DEFAULT '[]'::jsonb,
    affiliate_disclosure TEXT DEFAULT 'Editorial Disclosure: We curate products independently. When you purchase through links featured on this site, we may earn an affiliate commission at no additional cost to you. Historical prices displayed reflect the purchase or observation date and may vary at the retailer.',
    currency_symbol TEXT NOT NULL DEFAULT '₹',
    adsense_client_id TEXT DEFAULT '',
    adsense_slot_id TEXT DEFAULT '',
    adsense_enabled BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Insert default settings row if it doesn't exist
INSERT INTO public.site_settings (id, brand_name, currency_symbol)
VALUES (1, 'MAISON & OBJECT', '₹')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. PRODUCT EVENTS (Analytics ingestion)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'product_view', 'product_card_click', 'buy_button_click')),
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    session_id TEXT NOT NULL,
    referrer TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_product_events_type_created 
ON public.product_events (event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_product_events_product_id 
ON public.product_events (product_id);

CREATE INDEX IF NOT EXISTS idx_product_events_session 
ON public.product_events (session_id);

-- -----------------------------------------------------------------------------
-- 5. AUTOMATIC TIMESTAMP TRIGGER
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER set_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_events ENABLE ROW LEVEL SECURITY;

-- Products Policies:
-- 1. Anonymous and authenticated users can view published products
DROP POLICY IF EXISTS "Public can view published products" ON public.products;
CREATE POLICY "Public can view published products"
    ON public.products
    FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

-- 2. Authenticated users (admin) have full CRUD access
DROP POLICY IF EXISTS "Admins have full access to products" ON public.products;
CREATE POLICY "Admins have full access to products"
    ON public.products
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Site Settings Policies:
-- 1. Anyone can view site settings
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings"
    ON public.site_settings
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 2. Only authenticated admins can update site settings
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
CREATE POLICY "Admins can update site settings"
    ON public.site_settings
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Product Events Policies:
-- 1. Anyone can insert analytics events (protected by server validation)
DROP POLICY IF EXISTS "Anyone can record analytics events" ON public.product_events;
CREATE POLICY "Anyone can record analytics events"
    ON public.product_events
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- 2. Only authenticated admins can read analytics data
DROP POLICY IF EXISTS "Only admins can view analytics" ON public.product_events;
CREATE POLICY "Only admins can view analytics"
    ON public.product_events
    FOR SELECT
    TO authenticated
    USING (true);

-- -----------------------------------------------------------------------------
-- 7. STORAGE BUCKET CONFIGURATION & POLICIES
-- Bucket name: product-images
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS: Public read access for images
DROP POLICY IF EXISTS "Public Access to Product Images" ON storage.objects;
CREATE POLICY "Public Access to Product Images"
    ON storage.objects
    FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'product-images');

-- Storage RLS: Authenticated admin upload/delete access
DROP POLICY IF EXISTS "Admin Upload Product Images" ON storage.objects;
CREATE POLICY "Admin Upload Product Images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin Update Product Images" ON storage.objects;
CREATE POLICY "Admin Update Product Images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin Delete Product Images" ON storage.objects;
CREATE POLICY "Admin Delete Product Images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-images');

-- -----------------------------------------------------------------------------
-- 8. BLOGS & EDITORIAL DISPATCHES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    image_path TEXT, -- Optional photo URL or Supabase storage path
    video_url TEXT, -- Optional YouTube video or Instagram reel URL
    external_link TEXT, -- Optional outbound reference URL
    external_link_label TEXT DEFAULT 'Reference Resource',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_blogs_published 
ON public.blogs (status, published_at DESC NULLS LAST, created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_blogs_slug 
ON public.blogs (slug);

DROP TRIGGER IF EXISTS set_blogs_updated_at ON public.blogs;
CREATE TRIGGER set_blogs_updated_at
    BEFORE UPDATE ON public.blogs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published blogs" ON public.blogs;
CREATE POLICY "Public can view published blogs"
    ON public.blogs
    FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

DROP POLICY IF EXISTS "Admins have full access to blogs" ON public.blogs;
CREATE POLICY "Admins have full access to blogs"
    ON public.blogs
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

