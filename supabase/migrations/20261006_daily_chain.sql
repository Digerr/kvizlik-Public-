-- Optional cloud persistence for the daily chain. Run in Supabase SQL editor.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_chain_day integer DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_chain_completed jsonb DEFAULT '[false,false,false,false,false,false,false]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_chain_date text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_chain_claimed_at text;
