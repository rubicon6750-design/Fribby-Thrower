-- Fribby Thrower global leaderboard setup
-- Run this in Supabase Dashboard > SQL Editor > New query.
-- Uses anonymous Supabase Auth so players don't need to enter an email address.

create table if not exists public.fribby_leaderboard (
  user_id uuid primary key references auth.users(id) on delete cascade,
  player_name text not null check (char_length(player_name) between 2 and 20),
  score bigint not null default 0 check (score >= 0),
  updated_at timestamptz not null default now()
);

alter table public.fribby_leaderboard enable row level security;

-- Public can read rankings. Only an authenticated user can write their own row.
drop policy if exists "Leaderboard is publicly readable" on public.fribby_leaderboard;
create policy "Leaderboard is publicly readable"
  on public.fribby_leaderboard for select
  to anon, authenticated
  using (true);

drop policy if exists "Players can insert their own score" on public.fribby_leaderboard;
create policy "Players can insert their own score"
  on public.fribby_leaderboard for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Players can update their own score" on public.fribby_leaderboard;
create policy "Players can update their own score"
  on public.fribby_leaderboard for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select on public.fribby_leaderboard to anon, authenticated;
grant insert, update on public.fribby_leaderboard to authenticated;
