update public.products
set
  production_time = '5 dias corridos',
  updated_at = now()
where production_time is distinct from '5 dias corridos';
