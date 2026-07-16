insert into public.categories (id, name, slug, description, active, display_order)
values
  ('7b53bb5d-e3ca-4f02-bf46-3ec9f67f7ca1', 'Criados-mudos', 'criados-mudos', 'Cinco modelos autorais de criados-mudos em MDF, com leitura minimalista, acabamentos elegantes e presença discreta para quartos sofisticados.', true, 1)
on conflict (id) do nothing;

insert into public.products (
  id, slug, name, sku, category_id, short_description, description, unit_price, pair_price,
  dimensions, weight, materials, warranty, production_time, stock_quantity, track_stock,
  featured, active, display_order, meta_title, meta_description
)
values
  ('1bf09210-1fb5-41db-a9e6-b98511597690', 'firenze-preto', 'Firenze - Preto', 'ATM-FIR-PTO', '7b53bb5d-e3ca-4f02-bf46-3ec9f67f7ca1', 'Criado-mudo com presença marcante, acabamento escuro e desenho limpo.', 'O Firenze - Preto foi pensado para quartos contemporâneos que pedem contraste, elegância e linhas bem resolvidas.', 899.99, 1799.99, 'L 50 x A 50 x P 40 cm', 22.00, 'MDF premium com acabamento fosco e ferragens selecionadas.', '1 ano de garantia.', '10 a 18 dias úteis', 6, true, true, true, 1, 'Firenze - Preto | Atlas Móveis', 'Criado-mudo em MDF com acabamento preto e visual sofisticado.'),
  ('1f38e9b9-7af5-45d6-a4cb-d8d0dcb0dfe8', 'siena-freijo', 'Siena - Freijó', 'ATM-SIE-FRE', '7b53bb5d-e3ca-4f02-bf46-3ec9f67f7ca1', 'Modelo amadeirado com atmosfera acolhedora e leitura editorial.', 'O Siena - Freijó valoriza quartos com tons quentes e materiais naturais.', 899.99, 1799.99, 'L 50 x A 52 x P 40 cm', 22.00, 'MDF de alta densidade com padrão freijó e ferragens premium.', '1 ano de garantia.', '10 a 18 dias úteis', 7, true, true, true, 2, 'Siena - Freijó | Atlas Móveis', 'Criado-mudo amadeirado em MDF com visual elegante e acolhedor.'),
  ('fd8143fb-398e-4fc3-b55a-7b4b71505312', 'oslo-off-white', 'Oslo - Off White', 'ATM-OSL-OWH', '7b53bb5d-e3ca-4f02-bf46-3ec9f67f7ca1', 'Volume sereno e acabamento claro para quartos de atmosfera leve.', 'O Oslo - Off White combina proporções suaves e materialidade clara.', 899.99, 1799.99, 'L 50 x A 50 x P 40 cm', 21.00, 'MDF com acabamento off white e ferragens selecionadas.', '1 ano de garantia.', '10 a 18 dias úteis', 8, true, true, true, 3, 'Oslo - Off White | Atlas Móveis', 'Criado-mudo em MDF com acabamento off white e linhas limpas.'),
  ('2a319092-d3a4-4b4e-bf74-b48badfffd6c', 'aurora-02', 'Aurora 02', 'ATM-AUR-02', '7b53bb5d-e3ca-4f02-bf46-3ec9f67f7ca1', 'Versão mais alta com presença equilibrada e acabamento sofisticado.', 'A Aurora 02 amplia a presença visual da linha com proporção mais alta.', 899.99, 1799.99, 'L 55 x A 55 x P 42 cm', 24.00, 'MDF premium com pintura fosca e ferragens de alto padrão.', '1 ano de garantia.', '10 a 18 dias úteis', 9, true, true, true, 4, 'Aurora 02 | Atlas Móveis', 'Criado-mudo em MDF com proporção ampliada e visual refinado.'),
  ('8eaf3037-8f78-4e33-845d-4cba8ffed8f0', 'aurora-01', 'Aurora 01', 'ATM-AUR-01', '7b53bb5d-e3ca-4f02-bf46-3ec9f67f7ca1', 'Criado-mudo de linhas retas com dois gavetões amplos e elegantes.', 'A Aurora 01 traduz a linguagem essencial da Atlas Móveis em um desenho equilibrado.', 899.99, 1799.99, 'L 50 x A 50 x P 40 cm', 21.00, 'MDF de alta densidade com acabamento fosco e ferragens selecionadas.', '1 ano de garantia.', '10 a 18 dias úteis', 10, true, true, true, 5, 'Aurora 01 | Atlas Móveis', 'Criado-mudo premium em MDF com acabamento claro e desenho minimalista.')
on conflict (id) do nothing;

insert into public.product_colors (id, product_id, name, slug, hex_color, active)
values
  ('08f98535-bb08-4c09-9bf8-c48ce51f2078', '1bf09210-1fb5-41db-a9e6-b98511597690', 'Preto', 'preto', '#1E1C1A', true),
  ('d51ca135-fc22-4cd7-b5ff-7b59c3905390', '1f38e9b9-7af5-45d6-a4cb-d8d0dcb0dfe8', 'Freijó', 'freijo', '#8C6646', true),
  ('de080e29-c1fd-4cf1-a70d-bb08c57d136a', 'fd8143fb-398e-4fc3-b55a-7b4b71505312', 'Off White', 'off-white', '#EAE0D6', true),
  ('84f042b0-7bf1-49ae-bfba-6502c03ea466', '2a319092-d3a4-4b4e-bf74-b48badfffd6c', 'Areia', 'areia', '#D9CCBE', true),
  ('aab99dcf-8db8-407d-9aa8-b57740edf7fa', '8eaf3037-8f78-4e33-845d-4cba8ffed8f0', 'Fendi', 'fendi', '#C7B2A0', true)
on conflict (id) do nothing;

insert into public.product_variants (id, product_id, color_id, sku, name, price_adjustment, stock_quantity, active)
values
  ('640fa8ca-8ce9-44e3-b763-282e0de49781', '1bf09210-1fb5-41db-a9e6-b98511597690', '08f98535-bb08-4c09-9bf8-c48ce51f2078', 'ATM-FIR-PTO-01', 'Padrão', 0, 6, true),
  ('9b7af249-35f7-4f48-9d96-033bc0796ab4', '1f38e9b9-7af5-45d6-a4cb-d8d0dcb0dfe8', 'd51ca135-fc22-4cd7-b5ff-7b59c3905390', 'ATM-SIE-FRE-01', 'Padrão', 0, 7, true),
  ('d17e8f17-fd75-412a-9a3a-9a8be8e20572', 'fd8143fb-398e-4fc3-b55a-7b4b71505312', 'de080e29-c1fd-4cf1-a70d-bb08c57d136a', 'ATM-OSL-OWH-01', 'Padrão', 0, 8, true),
  ('acfe6cdf-271a-48b1-bbb5-72414b46eb78', '2a319092-d3a4-4b4e-bf74-b48badfffd6c', '84f042b0-7bf1-49ae-bfba-6502c03ea466', 'ATM-AUR-02-01', 'Padrão', 0, 9, true),
  ('c4d31bb3-65aa-4c6a-a7c7-d00a80977c89', '8eaf3037-8f78-4e33-845d-4cba8ffed8f0', 'aab99dcf-8db8-407d-9aa8-b57740edf7fa', 'ATM-AUR-01-01', 'Padrão', 0, 10, true)
on conflict (id) do nothing;

insert into public.product_images (id, product_id, variant_id, storage_path, public_url, alt_text, is_primary, display_order)
values
  ('764df436-b503-478b-a647-d54f17af7a30', '1bf09210-1fb5-41db-a9e6-b98511597690', '640fa8ca-8ce9-44e3-b763-282e0de49781', 'products/firenze-preto/cover.png', '/images/products/firenze-preto/cover.png', 'Firenze - Preto', true, 1),
  ('8b8d28a7-b301-4d90-b8ce-fcccd9b85750', '1f38e9b9-7af5-45d6-a4cb-d8d0dcb0dfe8', '9b7af249-35f7-4f48-9d96-033bc0796ab4', 'products/siena-freijo/cover.png', '/images/products/siena-freijo/cover.png', 'Siena - Freijó', true, 1),
  ('d782fe41-9d4c-490f-a242-24ed3cf3d872', 'fd8143fb-398e-4fc3-b55a-7b4b71505312', 'd17e8f17-fd75-412a-9a3a-9a8be8e20572', 'products/oslo-off-white/cover.png', '/images/products/oslo-off-white/cover.png', 'Oslo - Off White', true, 1),
  ('22adb739-3081-48eb-a55d-1ac2d16bd7aa', '2a319092-d3a4-4b4e-bf74-b48badfffd6c', 'acfe6cdf-271a-48b1-bbb5-72414b46eb78', 'products/aurora-02/cover.png', '/images/products/aurora-02/cover.png', 'Aurora 02', true, 1),
  ('4db7fb11-2ec4-4810-a1ba-d2eb99500d26', '8eaf3037-8f78-4e33-845d-4cba8ffed8f0', 'c4d31bb3-65aa-4c6a-a7c7-d00a80977c89', 'products/aurora-01/cover.png', '/images/products/aurora-01/cover.png', 'Aurora 01', true, 1)
on conflict (id) do nothing;
