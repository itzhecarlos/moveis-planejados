-- Apply with `supabase db push` (or the Supabase SQL editor) before deploying
-- the checkout code that calls create_checkout_order.

create or replace function public.create_checkout_order(p_order jsonb, p_items jsonb)
returns table(id uuid, order_number text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_item jsonb;
  v_previous_stock integer;
  v_new_stock integer;
  v_track_stock boolean;
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'checkout must contain items' using errcode = '22023';
  end if;

  insert into public.orders (
    order_number, customer_name, customer_email, customer_phone, customer_document,
    postal_code, street, number, complement, neighborhood, city, state, notes,
    subtotal, pix_discount, shipping, total, payment_status, fulfillment_status,
    payment_method, currency_code, pricing_source, pricing_snapshot, customer_ip,
    customer_user_id, customer_user_agent, stock_processed
  )
  select
    r.order_number, r.customer_name, r.customer_email, r.customer_phone, r.customer_document,
    r.postal_code, r.street, r.number, r.complement, r.neighborhood, r.city, r.state, r.notes,
    r.subtotal, r.pix_discount, r.shipping, r.total, 'pending', 'awaiting_payment',
    r.payment_method, 'BRL', 'supabase', r.pricing_snapshot, r.customer_ip,
    r.customer_user_id, r.customer_user_agent, true
  from jsonb_to_record(p_order) as r(
    order_number text, customer_name text, customer_email text, customer_phone text, customer_document text,
    postal_code text, street text, number text, complement text, neighborhood text, city text, state text, notes text,
    subtotal numeric, pix_discount numeric, shipping numeric, total numeric, payment_method text,
    pricing_snapshot jsonb, customer_ip text, customer_user_id uuid, customer_user_agent text
  )
  returning orders.id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    select track_stock into v_track_stock
    from public.products
    where id = (v_item->>'product_id')::uuid and active = true and archived_at is null and deleted_at is null
    for update;
    if not found then raise exception 'product unavailable' using errcode = 'P0001'; end if;

    if v_track_stock then
      if nullif(v_item->>'variant_id', '') is not null then
        update public.product_variants
        set stock_quantity = stock_quantity - (v_item->>'quantity')::integer
        where id = (v_item->>'variant_id')::uuid
          and product_id = (v_item->>'product_id')::uuid
          and active = true
          and stock_quantity >= (v_item->>'quantity')::integer
        returning stock_quantity + (v_item->>'quantity')::integer, stock_quantity into v_previous_stock, v_new_stock;
      else
        update public.products
        set stock_quantity = stock_quantity - (v_item->>'quantity')::integer
        where id = (v_item->>'product_id')::uuid
          and stock_quantity >= (v_item->>'quantity')::integer
        returning stock_quantity + (v_item->>'quantity')::integer, stock_quantity into v_previous_stock, v_new_stock;
      end if;
      if not found then raise exception 'insufficient stock' using errcode = 'P0001'; end if;

      insert into public.inventory_movements (product_id, variant_id, order_id, type, quantity, previous_stock, new_stock)
      values ((v_item->>'product_id')::uuid, nullif(v_item->>'variant_id', '')::uuid, v_order_id,
        'sale', (v_item->>'quantity')::integer, v_previous_stock, v_new_stock);
    end if;

    insert into public.order_items (
      order_id, product_id, variant_id, product_name, product_sku, variation_name, color_name,
      purchase_type, quantity, unit_price, total_price
    ) values (
      v_order_id, (v_item->>'product_id')::uuid, nullif(v_item->>'variant_id', '')::uuid,
      v_item->>'product_name', v_item->>'product_sku', v_item->>'variation_name', v_item->>'color_name',
      v_item->>'purchase_type', (v_item->>'quantity')::integer, (v_item->>'unit_price')::numeric, (v_item->>'total_price')::numeric
    );
  end loop;

  return query select v_order_id, (p_order->>'order_number');
end;
$$;

revoke all on function public.create_checkout_order(jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.create_checkout_order(jsonb, jsonb) to service_role;

create or replace function public.release_checkout_reservation(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item record;
  v_order public.orders%rowtype;
  v_previous_stock integer;
begin
  select * into v_order from public.orders where id = p_order_id for update;
  if not found or not v_order.stock_processed or v_order.payment_status = 'approved' then return; end if;

  for v_item in select * from public.order_items where order_id = p_order_id
  loop
    if v_item.variant_id is not null then
      update public.product_variants set stock_quantity = stock_quantity + v_item.quantity
      where id = v_item.variant_id returning stock_quantity - v_item.quantity into v_previous_stock;
    else
      update public.products set stock_quantity = stock_quantity + v_item.quantity
      where id = v_item.product_id returning stock_quantity - v_item.quantity into v_previous_stock;
    end if;
    if found then
      insert into public.inventory_movements (product_id, variant_id, order_id, type, quantity, previous_stock, new_stock)
      values (v_item.product_id, v_item.variant_id, p_order_id, 'cancellation', v_item.quantity, v_previous_stock, v_previous_stock + v_item.quantity);
    end if;
  end loop;
  update public.orders set stock_processed = false where id = p_order_id;
end;
$$;

revoke all on function public.release_checkout_reservation(uuid) from public, anon, authenticated;
grant execute on function public.release_checkout_reservation(uuid) to service_role;

create unique index if not exists idx_payment_events_provider_event on public.payment_events(provider, provider_event_id);
create index if not exists idx_orders_order_number on public.orders(order_number);

alter table public.profiles force row level security;
alter table public.customer_profiles force row level security;
