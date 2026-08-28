import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { requireAdminRole } from "@/lib/auth";
import { getMelhorEnvioConfig } from "@/lib/melhor-envio/oauth";

export async function GET(request: Request) {
  await requireAdminRole();
  const config = getMelhorEnvioConfig();
  const state = randomUUID();
  const authorizationUrl = new URL(`${config.baseUrl}/oauth/authorize`);
  authorizationUrl.searchParams.set("client_id", config.clientId);
  authorizationUrl.searchParams.set("redirect_uri", config.redirectUri);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("state", state);
  authorizationUrl.searchParams.set("scope", "shipping-calculate");

  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set("melhor_envio_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: new URL(request.url).protocol === "https:",
    maxAge: 10 * 60,
    path: "/"
  });
  return response;
}
