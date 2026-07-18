-- Add stable per-property translations generated automatically by the admin UI.
-- Safe to run more than once.

alter table public.properties
  add column if not exists translations jsonb default '{}'::jsonb;

alter table public.properties
  add column if not exists rental_period text;

alter table public.properties
  alter column currency set default 'Md';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'properties_rental_period_check'
      and conrelid = 'public.properties'::regclass
  ) then
    alter table public.properties
      add constraint properties_rental_period_check
      check (rental_period is null or rental_period in ('night','day','month','year'));
  end if;
end $$;

update public.properties
set rental_period = 'month'
where status = 'rent' and rental_period is null;

-- Prompt PostgREST to notice the new column even if its notification queue
-- was stale before this migration was applied.
select pg_notification_queue_usage();
notify pgrst, 'reload schema';
