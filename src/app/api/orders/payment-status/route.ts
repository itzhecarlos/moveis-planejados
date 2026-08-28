import { NextResponse } from "next/server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const orderNumber = new URL(request.url).searchParams.get("pedido")?.trim();

  if (!orderNumber) {
    return NextResponse.json({ error: "Pedido não informado." }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Consulta temporariamente indisponível." }, { status: 503 });
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select("payment_status")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error) {
    console.error("Payment status lookup failed", error);
    return NextResponse.json({ error: "Não foi possível consultar o pagamento." }, { status: 500 });
  }
  if (!order) {
    return NextResponse.json({ error: "Pedido não encontrado." }, { status: 404 });
  }

  return NextResponse.json(
    { payment_status: order.payment_status },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
