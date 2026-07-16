create or replace function public.is_admin()
returns boolean
language sql
stable
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
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and active = true
      and role in ('admin', 'editor')
  );
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_colors enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payment_events enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.order_status_history enable row level security;
alter table public.admin_audit_logs enable row level security;

alter table public.orders force row level security;
alter table public.order_items force row level security;
alter table public.payment_events force row level security;
alter table public.inventory_movements force row level security;
alter table public.order_status_history force row level security;
alter table public.admin_audit_logs force row level security;

create policy "public categories read active"
on public.categories for select
using (active = true);

create policy "public products read active"
on public.products for select
using (active = true and archived_at is null and deleted_at is null);

create policy "public colors read active"
on public.product_colors for select
using (
  active = true
  and exists (
    select 1 from public.products
    where products.id = product_colors.product_id
      and products.active = true
      and products.archived_at is null
      and products.deleted_at is null
  )
);

create policy "public variants read active"
on public.product_variants for select
using (
  active = true
  and exists (
    select 1 from public.products
    where products.id = product_variants.product_id
      and products.active = true
      and products.archived_at is null
      and products.deleted_at is null
  )
);

create policy "public images read active"
on public.product_images for select
using (
  exists (
    select 1 from public.products
    where products.id = product_images.product_id
      and products.active = true
      and products.archived_at is null
      and products.deleted_at is null
  )
);

create policy "admin manages categories"
on public.categories for all
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

create policy "admin manages products"
on public.products for all
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

create policy "admin manages colors"
on public.product_colors for all
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

create policy "admin manages variants"
on public.product_variants for all
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

create policy "admin manages images"
on public.product_images for all
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

create policy "admin reads orders"
on public.orders for select
using (public.is_editor_or_admin());

create policy "admin updates orders"
on public.orders for update
using (public.is_editor_or_admin())
with check (public.is_editor_or_admin());

create policy "admin reads order items"
on public.order_items for select
using (public.is_editor_or_admin());

create policy "admin reads payment events"
on public.payment_events for select
using (public.is_admin());

create policy "admin reads inventory movements"
on public.inventory_movements for select
using (public.is_editor_or_admin());

create policy "admin manages inventory movements"
on public.inventory_movements for insert
with check (public.is_editor_or_admin());

create policy "admin reads status history"
on public.order_status_history for select
using (public.is_editor_or_admin());

create policy "admin inserts status history"
on public.order_status_history for insert
with check (public.is_editor_or_admin());

create policy "admin reads profiles"
on public.profiles for select
using (public.is_admin());

create policy "admin manages audit"
on public.admin_audit_logs for select
using (public.is_admin());

revoke all on public.orders from anon, authenticated;
revoke all on public.order_items from anon, authenticated;
revoke all on public.payment_events from anon, authenticated;
revoke all on public.inventory_movements from anon, authenticated;
revoke all on public.order_status_history from anon, authenticated;
revoke all on public.admin_audit_logs from anon, authenticated;

grant select on public.categories to anon, authenticated;
grant select on public.products to anon, authenticated;
grant select on public.product_colors to anon, authenticated;
grant select on public.product_variants to anon, authenticated;
grant select on public.product_images to anon, authenticated;
