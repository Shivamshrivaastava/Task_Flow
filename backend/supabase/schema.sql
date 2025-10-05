
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Tasks table
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  notes text,
  status text not null default 'todo' check (status in ('todo','in_progress','done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_timestamp on public.tasks;
create trigger set_timestamp
before update on public.tasks
for each row
execute procedure public.set_updated_at();

-- RLS
alter table public.tasks enable row level security;

-- Select only own
drop policy if exists "select_own_tasks" on public.tasks;
create policy "select_own_tasks"
on public.tasks for select
to authenticated
using (auth.uid() = user_id);

-- Insert as self
drop policy if exists "insert_own_tasks" on public.tasks;
create policy "insert_own_tasks"
on public.tasks for insert
to authenticated
with check (auth.uid() = user_id);

-- Update own
drop policy if exists "update_own_tasks" on public.tasks;
create policy "update_own_tasks"
on public.tasks for update
to authenticated
using (auth.uid() = user_id);

-- Delete own
drop policy if exists "delete_own_tasks" on public.tasks;
create policy "delete_own_tasks"
on public.tasks for delete
to authenticated
using (auth.uid() = user_id);
