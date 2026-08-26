# Security review

## Architecture and threat model

The public Next.js catalog uses the Supabase anonymous key under RLS. Checkout, Mercado Pago, Resend, and administrative Supabase access execute only in server modules. Shipping uses a fixed server-side rule. Main threats are forged checkout input, replayed payment notifications, privileged action invocation, concurrent stock purchases, and leaked credentials.

## Controls implemented

- Server-only administrative Supabase and Resend clients; `SUPABASE_SECRET_KEY` is preferred, with a legacy service-role fallback.
- Checkout recalculates catalog pricing and shipping on the server, rejects unknown variants, requires a variant when a product has variants, and validates product/color relationships.
- `create_checkout_order` creates order items and atomically reserves stock in PostgreSQL. A rejected/cancelled payment releases that reservation once.
- Mercado Pago webhooks fail closed without a secret, access token, or administrative database client; they use HMAC constant-time comparison and a five-minute timestamp window, query the payment API, validate order reference/preference/value/currency, persist state-aware event idempotency before applying effects, and send an approved-order email once.
- Checkout, shipping quotes, and authentication have best-effort per-instance rate limits. Configure Netlify/WAF rate limiting as the durable production layer.
- Administrative Server Actions explicitly enforce editor/admin or admin-only roles.
- External Mercado Pago calls have bounded timeouts. Standard security headers are set in Next.js.

## Residual risks and go-live checks

Apply `supabase/migrations/20260825_secure_checkout.sql` before deploying: the checkout route depends on its RPC functions. The current in-memory rate limiter is intentionally only a fallback because serverless instances do not share memory. Configure a Netlify edge/WAF rule for persistent abuse protection.

Review existing Storage policies and add a production CSP only after listing every required Mercado Pago asset domain. Verify the Mercado Pago webhook signature format in the production account, set the notification URL to `/api/webhooks/mercado-pago`, and perform approved, rejected, duplicate, and amount-mismatch test payments.

The repository does not yet contain an automated integration-test harness for the Supabase/Mercado Pago flows. Execute the payment scenarios above against a staging project before go-live; a test suite using a disposable Supabase database is the recommended next engineering investment.
