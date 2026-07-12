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

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  sku text unique,
  category_id uuid references public.categories(id),
  short_description text,
  description text,
  unit_price numeric(12,2) not null check (unit_price >= 0),
  pair_price numeric(12,2) check (pair_price >= 0),
  promotional_price numeric(12,2) check (promotional_price >= 0),
  dimensions text,
  weight numeric(10,2) check (weight >= 0),
  materials text,
  warranty text,
  production_time text,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  track_stock boolean not null default false,
  featured boolean not null default false,
  active boolean not null default true,
  display_order integer not null default 0,
  meta_title text,
  meta_description text,
  archived_at timestamptz,
  deleted_at timestamptz,
  created_by uuid references public.profiles(id),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_colors (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  slug text not null,
  hex_color text,
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  color_id uuid references public.product_colors(id) on delete set null,
  sku text unique,
  name text not null,
  price_adjustment numeric(12,2) not null default 0 check (price_adjustment >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete set null,
  storage_path text not null,
  public_url text,
  alt_text text,
  is_primary boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_document text not null,
  postal_code text not null,
  street text not null,
  number text not null,
  complement text,
  neighborhood text not null,
  city text not null,
  state text not null,
  notes text,
  subtotal numeric(12,2) not null check (subtotal >= 0),
  shipping numeric(12,2) not null check (shipping >= 0),
  total numeric(12,2) not null check (total >= 0),
  payment_status text not null check (payment_status in ('pending', 'approved', 'rejected', 'cancelled', 'refunded', 'charged_back')),
  fulfillment_status text not null check (fulfillment_status in ('awaiting_payment', 'payment_confirmed', 'in_production', 'ready_for_shipping', 'shipped', 'delivered', 'cancelled')),
  payment_method text,
  mercado_pago_payment_id text,
  mercado_pago_preference_id text,
  email_sent boolean not null default false,
  stock_processed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  variant_id uuid references public.product_variants(id),
  product_name text not null,
  product_sku text,
  variation_name text,
  color_name text,
  purchase_type text not null check (purchase_type in ('unit', 'pair')),
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  total_price numeric(12,2) not null check (total_price >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  provider text not null,
  provider_event_id text unique not null,
  event_type text,
  status text,
  payload jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id),
  variant_id uuid references public.product_variants(id),
  order_id uuid references public.orders(id),
  type text not null check (type in ('sale', 'manual_adjustment', 'cancellation', 'refund', 'stock_entry')),
  quantity integer not null check (quantity > 0),
  previous_stock integer not null check (previous_stock >= 0),
  new_stock integer not null check (new_stock >= 0),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  previous_status text,
  new_status text not null,
  changed_by uuid references public.profiles(id),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  previous_data jsonb,
  new_data jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);

create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_active on public.products(active);
create index if not exists idx_products_archived_at on public.products(archived_at);
create index if not exists idx_product_variants_product_id on public.product_variants(product_id);
create index if not exists idx_product_images_product_id on public.product_images(product_id);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_orders_payment_status on public.orders(payment_status);
create index if not exists idx_orders_fulfillment_status on public.orders(fulfillment_status);
create index if not exists idx_orders_customer_email on public.orders(customer_email);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_payment_events_provider_event_id on public.payment_events(provider_event_id);

create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_categories_updated_at before update on public.categories for each row execute function public.set_updated_at();
create trigger set_products_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger set_product_variants_updated_at before update on public.product_variants for each row execute function public.set_updated_at();
create trigger set_orders_updated_at before update on public.orders for each row execute function public.set_updated_at();
