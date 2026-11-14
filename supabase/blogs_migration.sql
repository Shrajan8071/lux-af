-- =============================================================================
-- BLOGS & JOURNAL SYSTEM MIGRATION FOR SUPABASE
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard)
-- =============================================================================

-- 1. Create blogs table
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

-- 2. Performance indexes for fast public listing and slug resolution
CREATE INDEX IF NOT EXISTS idx_blogs_published 
ON public.blogs (status, published_at DESC NULLS LAST, created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_blogs_slug 
ON public.blogs (slug);

-- 3. Automatic updated_at trigger (uses existing handle_updated_at function)
DROP TRIGGER IF EXISTS set_blogs_updated_at ON public.blogs;
CREATE TRIGGER set_blogs_updated_at
    BEFORE UPDATE ON public.blogs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policy: Anyone (anon + authenticated) can view published blogs
DROP POLICY IF EXISTS "Public can view published blogs" ON public.blogs;
CREATE POLICY "Public can view published blogs"
    ON public.blogs
    FOR SELECT
    TO anon, authenticated
    USING (status = 'published');

-- 6. RLS Policy: Authenticated admins have full CRUD access
DROP POLICY IF EXISTS "Admins have full access to blogs" ON public.blogs;
CREATE POLICY "Admins have full access to blogs"
    ON public.blogs
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- =============================================================================
-- OPTIONAL SAMPLE SEED BLOG (Run if you want initial sample posts)
-- =============================================================================
INSERT INTO public.blogs (slug, title, excerpt, content, image_path, video_url, external_link, external_link_label, status, published_at)
VALUES 
(
    'the-tactile-weight-of-titanium',
    'The Tactile Weight of Titanium in Modern Personal Hardware',
    'A philosophical exploration into why cold metallurgy, bead-blasted surfaces, and honest material density define the new luxury in daily industrial tools.',
    'There is a quiet authority in density. When you hold an object milled from Grade 5 titanium, the palm registers something fundamentally distinct from injection-molded polymers or anodized aluminum alloys. It is not merely lighter or stronger; it communicates thermal restraint and timeless structural permanence.\n\nIn our contemporary gadget landscape, where obsolescence is engineered into software cycles, the choice of materials has become an aesthetic declaration. When an artisan or manufacturer commits to titanium, they acknowledge that the casing must outlast the digital components housed inside.\n\nFrom watch bezels to smartphone frames and mechanical writing instruments, this material study underscores why restrained industrial craft continues to resonate deeply with collectors and designers alike.',
    'https://images.unsplash.com/photo-1510519138161-58474ebf814b?auto=format&fit=crop&w=1200&q=80',
    null,
    'https://en.wikipedia.org/wiki/Titanium',
    'Metallurgical Reference',
    'published',
    timezone('utc'::text, now())
),
(
    'on-restraint-in-acoustic-design',
    'On Restraint: Why Minimalist Audio Equipment Still Matters',
    'Examining how physical dials, tactile potentiometers, and unadorned anodized enclosures cultivate a more intentional listening discipline.',
    'In an era dominated by touchscreens and haptic glass, analog resistance has become an endangered luxury. The tactile feedback of a weighted brass volume knob—milled to sub-millimeter tolerances and moving through high-viscosity silicone dampening—provides a sensory anchor that digital volume sliders cannot replicate.\n\nAcoustic fidelity is intimately tied to physical discipline. When an amplifier or headphone chassis strips away neon displays and RGB lighting in favor of brushed aluminum and silent switches, it invites the listener to focus on the sound stage rather than the interface.\n\nTrue luxury in audio design is never about adding features; it is about ruthless subtraction until only pure acoustic clarity remains.',
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80',
    null,
    null,
    null,
    'published',
    timezone('utc'::text, now())
)
ON CONFLICT (slug) DO NOTHING;
