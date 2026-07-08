-- Run this in the Supabase SQL editor (supabase.com → your project → SQL Editor)

-- 1. Create the lists table
create table if not exists lists (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid references auth.users not null unique,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- 2. Enable Row Level Security
alter table lists enable row level security;

-- 3. Policy: each user can only read and write their own list
create policy "owner access" on lists
  using  (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- (Optional) Auto-update updated_at on every write
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger lists_updated_at
  before update on lists
  for each row execute procedure update_updated_at();
