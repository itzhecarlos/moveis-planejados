-- Standardize the published dimensions: width 50 cm, height 60 cm, depth 45 cm.
update public.products
set dimensions = 'L 50 x A 60 x P 45 cm'
where id in (
  '1bf09210-1fb5-41db-a9e6-b98511597690',
  '1f38e9b9-7af5-45d6-a4cb-d8d0dcb0dfe8',
  'fd8143fb-398e-4fc3-b55a-7b4b71505312',
  '2a319092-d3a4-4b4e-bf74-b48badfffd6c',
  '8eaf3037-8f78-4e33-845d-4cba8ffed8f0'
);
