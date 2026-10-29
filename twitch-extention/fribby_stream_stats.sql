-- Run this in the SQL Editor of the same Supabase project already used by Fribby Thrower.
-- This table stores one public stats record per randomly generated Stream Link Key.
-- Big-number currencies are TEXT so JavaScript BigInt values are not rounded.

create table if not exists public.fribby_stream_stats (
  stream_key text primary key check (length(stream_key) between 8 and 80),
  user_id uuid not null references auth.users(id) on delete cascade,
  fribbies text not null default '0' check (fribbies ~ '^[0-9]+$'),
  mega_fribbies text not null default '0' check (mega_fribbies ~ '^[0-9]+$'),
  ascension_count bigint not null default 0 check (ascension_count >= 0),
  updated_at timestamptz not null default now()
);

alter table public.fribby_stream_stats enable row level security;

grant select on public.fribby_stream_stats to anon, authenticated;
grant insert, update on public.fribby_stream_stats to authenticated;

drop policy if exists "Anyone can read Fribby stream stats" on public.fribby_stream_stats;
create policy "Anyone can read Fribby stream stats"
  on public.fribby_stream_stats for select
  to anon, authenticated
  using (true);

drop policy if exists "Players can publish their own Fribby stream stats" on public.fribby_stream_stats;
create policy "Players can publish their own Fribby stream stats"
  on public.fribby_stream_stats for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Players can update their own Fribby stream stats" on public.fribby_stream_stats;
create policy "Players can update their own Fribby stream stats"
  on public.fribby_stream_stats for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
