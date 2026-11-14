-- Newsletter sign-ups.
--
--   * Readers never touch the table directly: they call public.subscribe() / public.unsubscribe(),
--     which validate input and can be called with the publishable key. Nobody but authors can read
--     the list, so the form cannot be used to find out whether an address is subscribed.
--   * Authors (app_metadata.role = 'author') read, update and delete rows in /admin/ban-tin.
--   * Single opt-in for now: no email is sent yet. Each row has an unsubscribe token for the links
--     future emails will carry.

create table public.subscribers (
  id bigint generated always as identity primary key,
  email text not null
    constraint subscribers_email_format check (
      char_length(email) between 3 and 254
      and email = lower(email)
      and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    ),
  source text not null default '' constraint subscribers_source_length check (char_length(source) <= 120),
  status text not null default 'subscribed' constraint subscribers_status_known check (status in ('subscribed', 'unsubscribed')),
  unsubscribe_token uuid not null default gen_random_uuid() unique,
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

comment on table public.subscribers is 'Newsletter sign-ups. Written only through public.subscribe() / public.unsubscribe().';

create unique index subscribers_email_key on public.subscribers (email);
create index subscribers_created_at_idx on public.subscribers (created_at desc);

alter table public.subscribers enable row level security;

create policy "Authors can read subscribers" on public.subscribers for select to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'author');
create policy "Authors can update subscribers" on public.subscribers for update to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'author')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'author');
create policy "Authors can delete subscribers" on public.subscribers for delete to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'author');

revoke all on public.subscribers from anon, authenticated;
grant select, update, delete on public.subscribers to authenticated;

-- Sign up (or sign up again after unsubscribing). Returns nothing either way, so callers cannot
-- tell whether the address was already on the list.
create or replace function public.subscribe(p_email text, p_source text default '')
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(btrim(coalesce(p_email, '')));
begin
  if char_length(v_email) not between 3 and 254 or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'invalid email' using errcode = '22023';
  end if;

  -- Crude flood guard for a public endpoint: a personal blog never sees 30 sign-ups a minute.
  if (select count(*) from public.subscribers where created_at > now() - interval '1 minute') >= 30 then
    raise exception 'too many sign-ups, try again later' using errcode = '53400';
  end if;

  insert into public.subscribers (email, source)
  values (v_email, left(coalesce(p_source, ''), 120))
  on conflict (email) do update
    set status = 'subscribed', unsubscribed_at = null
    where public.subscribers.status = 'unsubscribed';
end;
$$;

-- Unsubscribe from a link. True when the token exists (already unsubscribed counts as success).
create or replace function public.unsubscribe(p_token uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.subscribers
    set status = 'unsubscribed', unsubscribed_at = coalesce(unsubscribed_at, now())
    where unsubscribe_token = p_token;
  return found;
end;
$$;

revoke all on function public.subscribe(text, text) from public;
revoke all on function public.unsubscribe(uuid) from public;
grant execute on function public.subscribe(text, text) to anon, authenticated;
grant execute on function public.unsubscribe(uuid) to anon, authenticated;
