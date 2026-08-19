-- YKS Uzman Hoca V5 multi-device sync schema.

create table if not exists public.student_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.student_state enable row level security;

grant select, insert, update on table public.student_state to authenticated;
revoke all on table public.student_state from anon;

drop policy if exists "Users can read own student state" on public.student_state;
create policy "Users can read own student state"
  on public.student_state for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own student state" on public.student_state;
create policy "Users can insert own student state"
  on public.student_state for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own student state" on public.student_state;
create policy "Users can update own student state"
  on public.student_state for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create table if not exists public.student_event_revisions (
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id text not null,
  revision_id text not null,
  event_updated_at bigint not null,
  device_id text not null,
  event jsonb not null,
  created_at timestamptz not null default now(),
  primary key (user_id, event_id, revision_id)
);

create index if not exists student_event_revisions_user_event_updated_idx
  on public.student_event_revisions (user_id, event_id, event_updated_at desc);

alter table public.student_event_revisions enable row level security;

grant select, insert on table public.student_event_revisions to authenticated;
revoke all on table public.student_event_revisions from anon;

drop policy if exists "Users can read own event revisions" on public.student_event_revisions;
create policy "Users can read own event revisions"
  on public.student_event_revisions for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own event revisions" on public.student_event_revisions;
create policy "Users can insert own event revisions"
  on public.student_event_revisions for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- Event revisions are immutable from clients by design: no UPDATE or DELETE policies.
