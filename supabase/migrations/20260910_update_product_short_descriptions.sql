update public.products
set
  short_description = case slug
    when 'firenze-preto' then 'Criado-mudo preto em MDF premium, com 2 gavetas e design contemporâneo. Um móvel elegante e funcional para quartos modernos e sofisticados.'
    when 'siena-freijo' then 'Criado-mudo freijó em MDF premium, com 2 gavetas e design contemporâneo. Um móvel elegante e funcional para quartos modernos e sofisticados.'
    when 'oslo-off-white' then 'Criado-mudo off white em MDF premium, com 2 gavetas e design contemporâneo. Um móvel elegante e funcional para quartos modernos e sofisticados.'
    when 'aurora-02' then 'Criado-mudo areia em MDF premium, com 2 gavetas e design contemporâneo. Um móvel elegante e funcional para quartos modernos e sofisticados.'
    when 'aurora-01' then 'Criado-mudo fendi em MDF premium, com 2 gavetas e design contemporâneo. Um móvel elegante e funcional para quartos modernos e sofisticados.'
  end,
  updated_at = now()
where slug in (
  'firenze-preto',
  'siena-freijo',
  'oslo-off-white',
  'aurora-02',
  'aurora-01'
);
