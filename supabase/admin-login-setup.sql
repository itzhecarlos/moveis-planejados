-- Atlas Moveis - setup de login administrativo
-- Como usar:
-- 1. Crie o usuario em Authentication > Users no painel do Supabase.
-- 2. Rode este arquivo no SQL Editor.
-- 3. No final, troque o e-mail do exemplo e execute o select para liberar o acesso.

begin;

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null check (role in ('admin', 'editor')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and active = true
      and role = 'admin'
  );
$$;

create or replace function public.is_editor_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and active = true
      and role in ('admin', 'editor')
  );
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.is_editor_or_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;
grant execute on function public.is_editor_or_admin() to anon, authenticated, service_role;

drop policy if exists "profile owner reads own profile" on public.profiles;
drop policy if exists "admin reads profiles" on public.profiles;
drop policy if exists "admin inserts profiles" on public.profiles;
drop policy if exists "admin updates profiles" on public.profiles;
drop policy if exists "admin manages profiles" on public.profiles;

create policy "profile owner reads own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy "admin reads profiles"
on public.profiles for select
to authenticated
using (public.is_admin());

create policy "admin inserts profiles"
on public.profiles for insert
to authenticated
with check (public.is_admin());

create policy "admin updates profiles"
on public.profiles for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

grant select on public.profiles to authenticated;
grant insert, update on public.profiles to authenticated;

create or replace function public.create_profile_for_auth_user(
  user_email text,
  user_full_name text default null,
  user_role text default 'admin'
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_user_id uuid;
begin
  if user_role not in ('admin', 'editor') then
    raise exception 'Role invalida. Use admin ou editor.';
  end if;

  select id
  into target_user_id
  from auth.users
  where lower(email) = lower(trim(user_email))
  order by created_at desc
  limit 1;

  if target_user_id is null then
    raise exception 'Usuario nao encontrado em auth.users para o e-mail %', user_email;
  end if;

  insert into public.profiles (id, full_name, role, active)
  values (target_user_id, nullif(trim(user_full_name), ''), user_role, true)
  on conflict (id) do update
  set
    full_name = excluded.full_name,
    role = excluded.role,
    active = true,
    updated_at = now();

  return target_user_id;
end;
$$;

revoke all on function public.create_profile_for_auth_user(text, text, text) from public;
grant execute on function public.create_profile_for_auth_user(text, text, text) to service_role;

commit;

-- Depois de criar o usuario em Authentication > Users, rode um destes exemplos:
-- select public.create_profile_for_auth_user('seu-email@dominio.com', 'Seu Nome', 'admin');
-- select public.create_profile_for_auth_user('editor@dominio.com', 'Nome do Editor', 'editor');
