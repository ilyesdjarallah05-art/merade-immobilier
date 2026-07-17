-- Add stable per-property translations generated automatically by the admin UI.
-- Safe to run more than once.

alter table public.properties
  add column if not exists translations jsonb default '{}'::jsonb;

alter table public.properties
  alter column currency set default 'Md';

-- Prompt PostgREST to notice the new column even if its notification queue
-- was stale before this migration was applied.
select pg_notification_queue_usage();
notify pgrst, 'reload schema';
