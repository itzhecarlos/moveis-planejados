create table if not exists public.integration_tokens (
  provider text primary key,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  updated_at timestamptz not null default now()
);

alter table public.integration_tokens enable row level security;

revoke all on table public.integration_tokens from anon, authenticated;
