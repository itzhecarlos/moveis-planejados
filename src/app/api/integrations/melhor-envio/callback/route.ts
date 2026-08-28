import { NextResponse } from "next/server";

import { exchangeMelhorEnvioAuthorizationCode } from "@/lib/melhor-envio/oauth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expectedState = request.headers.get("cookie")?.match(/(?:^|; )melhor_envio_oauth_state=([^;]+)/)?.[1];

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.json({ error: "Autorização inválida ou expirada." }, { status: 400 });
  }

  try {
    await exchangeMelhorEnvioAuthorizationCode(code);
    const response = NextResponse.redirect(new URL("/admin?melhor_envio=connected", url.origin));
    response.cookies.set("melhor_envio_oauth_state", "", { httpOnly: true, maxAge: 0, path: "/" });
    return response;
  } catch (error) {
    console.error("Melhor Envio authorization callback failed", error);
    const detail = error instanceof Error ? error.message : "Falha desconhecida.";
    return NextResponse.json(
      { error: "Não foi possível concluir a autorização do Melhor Envio.", detail },
      { status: 500 }
    );
  }
}
