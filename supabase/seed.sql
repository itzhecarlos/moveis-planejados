insert into public.categories (id, name, slug, description, active, display_order)
values
  ('7b53bb5d-e3ca-4f02-bf46-3ec9f67f7ca1', 'Mesas de cabeceira', 'mesas-de-cabeceira', 'Linhas exclusivas que combinam funcionalidade, beleza e acabamento de alto padrão para o seu quarto.', true, 1),
  ('f219f641-c20c-4329-8d44-b034742062f2', 'Mesas laterais', 'mesas-laterais', 'Peças versáteis que complementam diferentes ambientes com praticidade e sofisticação.', true, 2)
on conflict (id) do nothing;

insert into public.products (
  id, slug, name, sku, category_id, short_description, description, unit_price, pair_price,
  dimensions, weight, materials, warranty, production_time, stock_quantity, track_stock,
  featured, active, display_order, meta_title, meta_description
)
values
  ('8eaf3037-8f78-4e33-845d-4cba8ffed8f0', 'aurora-01', 'Aurora 01', 'ATM-AUR-01', '7b53bb5d-e3ca-4f02-bf46-3ec9f67f7ca1', 'Mesa de cabeceira com linhas retas e dois gavetões amplos.', 'A Aurora 01 traduz a linguagem minimalista da Atlas Móveis em uma composição elegante.', 849.00, 1599.00, 'L 50 x A 50 x P 40 cm', 21.00, 'MDF de alta densidade com acabamento fosco.', '1 ano de garantia.', '10 a 18 dias úteis', 9, true, true, true, 1, 'Aurora 01 | Atlas Móveis', 'Mesa de cabeceira premium em MDF.'),
  ('e399cbfe-76ac-4180-8f6f-cbe5d1724e7f', 'lateral-oslo', 'Lateral Oslo', 'ATM-LAT-OSL', 'f219f641-c20c-4329-8d44-b034742062f2', 'Mesa lateral compacta para sala, quarto ou leitura.', 'Peça versátil e prática para composições enxutas.', 590.00, null, 'L 40 x A 50 x P 35 cm', 12.00, 'MDF de alta densidade com pintura UV fosca.', '1 ano de garantia.', '10 a 18 dias úteis', 7, true, true, true, 2, 'Lateral Oslo | Atlas Móveis', 'Mesa lateral premium em MDF.')
on conflict (id) do nothing;

insert into public.product_colors (id, product_id, name, slug, hex_color, active)
values
  ('df76ff3f-b743-40d7-a39a-b71c0df02d03', '8eaf3037-8f78-4e33-845d-4cba8ffed8f0', 'Areia', 'areia', '#D8CABB', true),
  ('8cb3ad56-b1f1-48d2-81c0-6f120a5f7cd4', 'e399cbfe-76ac-4180-8f6f-cbe5d1724e7f', 'Areia', 'areia', '#D8CABB', true)
on conflict (id) do nothing;

insert into public.product_variants (id, product_id, color_id, sku, name, price_adjustment, stock_quantity, active)
values
  ('c4d31bb3-65aa-4c6a-a7c7-d00a80977c89', '8eaf3037-8f78-4e33-845d-4cba8ffed8f0', 'df76ff3f-b743-40d7-a39a-b71c0df02d03', 'AUR-01-AREIA', 'Versão Areia', 0, 9, true),
  ('6dd0f197-d2c6-4ced-b0fd-e3ed636c7917', 'e399cbfe-76ac-4180-8f6f-cbe5d1724e7f', '8cb3ad56-b1f1-48d2-81c0-6f120a5f7cd4', 'LAT-OSL-AREIA', 'Versão Areia', 0, 7, true)
on conflict (id) do nothing;

insert into public.product_images (id, product_id, variant_id, storage_path, public_url, alt_text, is_primary, display_order)
values
  ('4db7fb11-2ec4-4810-a1ba-d2eb99500d26', '8eaf3037-8f78-4e33-845d-4cba8ffed8f0', 'c4d31bb3-65aa-4c6a-a7c7-d00a80977c89', 'products/aurora-01/hero.webp', '/images/products/bedside-1.svg', 'Aurora 01', true, 1),
  ('2875104f-7458-40d1-a2c4-0957e6d90cb8', 'e399cbfe-76ac-4180-8f6f-cbe5d1724e7f', '6dd0f197-d2c6-4ced-b0fd-e3ed636c7917', 'products/lateral-oslo/hero.webp', '/images/products/side-1.svg', 'Lateral Oslo', true, 1)
on conflict (id) do nothing;
