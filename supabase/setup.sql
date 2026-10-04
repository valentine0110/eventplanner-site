-- 1. Create the enquiries table
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    partner TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    date TEXT,
    venue TEXT,
    service TEXT,
    guests TEXT,
    budget TEXT,
    message TEXT,
    consent BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- If the table was already created, run these to update it:
ALTER TABLE public.enquiries ALTER COLUMN name DROP NOT NULL;
ALTER TABLE public.enquiries ALTER COLUMN service DROP NOT NULL;
ALTER TABLE public.enquiries ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'New';

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.enquiries;
DROP POLICY IF EXISTS "Allow authenticated reads" ON public.enquiries;
DROP POLICY IF EXISTS "Allow inserts for everyone" ON public.enquiries;
DROP POLICY IF EXISTS "Allow reads" ON public.enquiries;
DROP POLICY IF EXISTS "Allow updates" ON public.enquiries;

-- 3. Create Policy to allow ALL inserts (so anyone can submit the form)
CREATE POLICY "Allow inserts for everyone" ON public.enquiries
    FOR INSERT TO public
    WITH CHECK (true);

-- 4. Create Policy to allow ALL reads
CREATE POLICY "Allow reads" ON public.enquiries
    FOR SELECT TO public
    USING (true);

-- 5. Create Policy to allow ALL updates
CREATE POLICY "Allow updates" ON public.enquiries
    FOR UPDATE TO public
    USING (true);
