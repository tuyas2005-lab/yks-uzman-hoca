-- Tighten Supabase Data API privileges for YKS Uzman Hoca V5 sync tables.

revoke all privileges on table public.student_event_revisions from authenticated;
grant select, insert on table public.student_event_revisions to authenticated;

revoke all privileges on table public.student_state from authenticated;
grant select, insert, update on table public.student_state to authenticated;

revoke all privileges on table public.student_event_revisions from anon;
revoke all privileges on table public.student_state from anon;
