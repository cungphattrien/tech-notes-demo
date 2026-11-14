-- Dựng lại vừa đủ "môi trường Supabase" để chạy được migration thật của blog trên Postgres thường:
-- hai vai trò anon và authenticated, và hàm auth.jwt() (trong Supabase nó đọc token của người gọi).
create role anon nologin;
create role authenticated nologin;
grant usage on schema public to anon, authenticated;

create schema auth;
grant usage on schema auth to anon, authenticated;
create function auth.jwt() returns jsonb language sql stable as $$ select '{}'::jsonb $$;
grant execute on function auth.jwt() to anon, authenticated;
