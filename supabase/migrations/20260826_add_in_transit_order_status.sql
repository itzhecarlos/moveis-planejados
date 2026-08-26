alter table public.orders drop constraint if exists orders_fulfillment_status_check;

alter table public.orders
  add constraint orders_fulfillment_status_check
  check (fulfillment_status in (
    'awaiting_payment',
    'payment_confirmed',
    'in_production',
    'ready_for_shipping',
    'shipped',
    'in_transit',
    'delivered',
    'cancelled'
  ));

update public.orders
set fulfillment_status = 'in_production'
where payment_status = 'approved'
  and fulfillment_status = 'payment_confirmed';
