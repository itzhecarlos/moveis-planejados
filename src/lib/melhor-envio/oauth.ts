import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

const PROVIDER = "melhor-envio";

export function getMelhorEnvioConfig() {
  const clientId = process.env.MELHOR_ENVIO_CLIENT_ID;
  const clientSecret = process.env.MELHOR_ENVIO_CLIENT_SECRET;
  const redirectUri = process.env.MELHOR_ENVIO_REDIRECT_URI;
  const baseUrl = (process.env.MELHOR_ENVIO_API_URL || "https://melhorenvio.com.br").replace(/\/$/, "");

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Configure MELHOR_ENVIO_CLIENT_ID, MELHOR_ENVIO_CLIENT_SECRET e MELHOR_ENVIO_REDIRECT_URI.");
  }
  return { clientId, clientSecret, redirectUri, baseUrl };
}

export async function exchangeMelhorEnvioAuthorizationCode(code: string) {
  const config = getMelhorEnvioConfig();
  const token = await requestToken(config, {
    grant_type: "authorization_code",
    code,
    redirect_uri: config.redirectUri
  });
  await persistToken(token);
}

export async function getMelhorEnvioAccessToken() {
  const supabase = createSupabaseAdminClient();
  if (supabase) {
    const { data } = await supabase
      .from("integration_tokens")
      .select("access_token, refresh_token, expires_at")
      .eq("provider", PROVIDER)
      .maybeSingle();
    if (data) {
      if (new Date(data.expires_at).getTime() > Date.now() + 5 * 60_000) return data.access_token;
      const config = getMelhorEnvioConfig();
      const refreshed = await requestToken(config, { grant_type: "refresh_token", refresh_token: data.refresh_token });
      await persistToken(refreshed);
      return refreshed.access_token;
    }
  }

  return process.env.MELHOR_ENVIO_ACCESS_TOKEN || null;
}

async function requestToken(
  config: ReturnType<typeof getMelhorEnvioConfig>,
  grant: { grant_type: "authorization_code"; code: string; redirect_uri: string } | { grant_type: "refresh_token"; refresh_token: string }
) {
  const response = await fetch(`${config.baseUrl}/oauth/token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": process.env.MELHOR_ENVIO_USER_AGENT || "Atlas Moveis (contato@atlasmoveis.com.br)"
    },
    body: JSON.stringify({ client_id: config.clientId, client_secret: config.clientSecret, ...grant }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000)
  });
  const body = (await response.json().catch(() => null)) as (TokenResponse & { message?: string }) | null;
  if (!response.ok || !body?.access_token || !body.refresh_token || !body.expires_in) {
    console.error("Melhor Envio OAuth token request failed", { status: response.status, message: body?.message });
    throw new Error("Não foi possível autorizar o Melhor Envio.");
  }
  return body;
}

async function persistToken(token: TokenResponse) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("Supabase administrativo não configurado para salvar a autorização.");
  const { error } = await supabase.from("integration_tokens").upsert({
    provider: PROVIDER,
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    expires_at: new Date(Date.now() + token.expires_in * 1000).toISOString(),
    updated_at: new Date().toISOString()
  });
  if (error) {
    console.error("Melhor Envio OAuth token persistence failed", error);
    throw new Error("Não foi possível salvar a autorização do Melhor Envio. Aplique a migration pendente.");
  }
}
