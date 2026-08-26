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
- `SUPABASE_SECRET_KEY` (preferida) ou `SUPABASE_SERVICE_ROLE_KEY` (fallback temporário, apenas servidor)
- `MERCADO_PAGO_ACCESS_TOKEN`
- `MERCADO_PAGO_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `STORE_NOTIFICATION_EMAIL`

## Supabase

1. Crie um projeto no Supabase.
2. Execute `supabase/schema.sql`.
3. Execute `supabase/policies.sql`.
4. Aplique as migrations versionadas em `supabase/migrations/` (incluindo `20260825_secure_checkout.sql`).
5. Execute `supabase/seed.sql`.
5. Crie um usuário no Auth.
6. Promova o usuário a admin inserindo um registro em `public.profiles` com `role = 'admin'`.

## Frete

O projeto usa uma regra fixa calculada no servidor: frete grátis para PR, SC e RS; R$ 149 para os demais estados. A transportadora é definida pela loja após a compra, sem integração obrigatória com Melhor Envio.

## Bucket de imagens

Crie o bucket `product-images` no Supabase Storage e permita upload apenas para `admin` e `editor`.

## Deploy na Netlify

1. Conecte o repositório GitHub ao projeto da Netlify.
2. Configure as variáveis de ambiente.
3. Use o build command `npm run build`.
4. Publique com Node `20`.

## Produção

Configure as credenciais sem o prefixo `NEXT_PUBLIC_`. Em especial, o webhook do Mercado Pago exige `MERCADO_PAGO_WEBHOOK_SECRET`; sem ela o endpoint falha de forma segura. Defina `NEXT_PUBLIC_SITE_URL` como o domínio HTTPS final para gerar `back_urls` e `notification_url` corretos.

### Production Security Checklist

- [ ] RLS e migrations aplicadas
- [ ] `SUPABASE_SECRET_KEY` configurada somente no ambiente server-side
- [ ] `MERCADO_PAGO_WEBHOOK_SECRET` configurado no Mercado Pago e na Netlify
- [ ] domínio HTTPS configurado em `NEXT_PUBLIC_SITE_URL`
- [ ] credenciais de produção do Mercado Pago configuradas
- [ ] primeiro admin criado em `public.profiles`
- [ ] backups e Supabase Security Advisor revisados
- [ ] rate limit/WAF da Netlify habilitado quando disponível
- [ ] typecheck, lint e build executados antes do deploy
