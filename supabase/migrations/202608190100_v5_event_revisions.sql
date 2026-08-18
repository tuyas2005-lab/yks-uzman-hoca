-- YKS Uzman Hoca V5.0.1
-- Append-only StudyEvent revision ledger for multi-device conflict safety.

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

drop policy if exists "Users can read own event revisions" on public.student_event_revisions;
create policy "Users can read own event revisions"
  on public.student_event_revisions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own event revisions" on public.student_event_revisions;
create policy "Users can insert own event revisions"
  on public.student_event_revisions for insert
  with check (auth.uid() = user_id);

-- Revisions are immutable by design. No UPDATE or DELETE policy is granted to clients.
-- Conflicting feedback from two devices therefore remains auditable instead of being overwritten.
