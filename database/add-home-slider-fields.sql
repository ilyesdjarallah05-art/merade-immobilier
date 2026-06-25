-- Run this in Supabase SQL Editor if your properties table already exists.
alter table public.properties add column if not exists hero_featured boolean default false;
alter table public.properties add column if not exists hero_order integer;
