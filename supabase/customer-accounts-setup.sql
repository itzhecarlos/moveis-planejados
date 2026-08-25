-- Atlas Moveis - contas de clientes e dados fiscais
-- Rode este arquivo no SQL Editor do Supabase depois do schema base.

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

create table if not exists public.customer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  phone text not null,
  document_type text not null check (document_type in ('cpf', 'cnpj')),
  document_number text not null,
  is_company boolean not null default false,
  legal_name text,
  trade_name text,
  state_registration text,
  municipal_registration text,
  postal_code text not null,
  street text not null,
  number text not null,
  complement text,
  neighborhood text not null,
  city text not null,
  state text not null,
  notes text,
  fiscal_consent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_customer_profiles_email on public.customer_profiles(lower(email));
create unique index if not exists idx_customer_profiles_document_number on public.customer_profiles(document_number);

drop trigger if exists set_customer_profiles_updated_at on public.customer_profiles;
create trigger set_customer_profiles_updated_at
before update on public.customer_profiles
for each row
execute function public.set_updated_at();

alter table public.customer_profiles enable row level security;

drop policy if exists "customer reads own profile" on public.customer_profiles;
drop policy if exists "customer inserts own profile" on public.customer_profiles;
drop policy if exists "customer updates own profile" on public.customer_profiles;
drop policy if exists "admin reads customer profiles" on public.customer_profiles;

create policy "customer reads own profile"
on public.customer_profiles for select
to authenticated
using (id = auth.uid());

create policy "customer inserts own profile"
on public.customer_profiles for insert
to authenticated
with check (id = auth.uid());

create policy "customer updates own profile"
on public.customer_profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "admin reads customer profiles"
on public.customer_profiles for select
to authenticated
using (public.is_editor_or_admin());

grant select, insert, update on public.customer_profiles to authenticated;

alter table public.orders add column if not exists customer_user_id uuid references auth.users(id) on delete set null;
create index if not exists idx_orders_customer_user_id on public.orders(customer_user_id);

commit;
