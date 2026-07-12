# Atlas Móveis

Aplicação de e-commerce em `Next.js + TypeScript + Tailwind + Supabase`, criada para uma loja premium de móveis em MDF com catálogo público, carrinho, checkout, base administrativa e preparação para Mercado Pago, Resend e deploy na Netlify.

## Instalação

```bash
npm install
```

## Desenvolvimento local

```bash
npm run dev
```

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MERCADO_PAGO_ACCESS_TOKEN`
- `MERCADO_PAGO_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `STORE_NOTIFICATION_EMAIL`

## Supabase

1. Crie um projeto no Supabase.
2. Execute `supabase/schema.sql`.
3. Execute `supabase/policies.sql`.
4. Execute `supabase/seed.sql`.
5. Crie um usuário no Auth.
6. Promova o usuário a admin inserindo um registro em `public.profiles` com `role = 'admin'`.

## Bucket de imagens

Crie o bucket `product-images` no Supabase Storage e permita upload apenas para `admin` e `editor`.

## Deploy na Netlify

1. Conecte o repositório GitHub ao projeto da Netlify.
2. Configure as variáveis de ambiente.
3. Use o build command `npm run build`.
4. Publique com Node `20`.
