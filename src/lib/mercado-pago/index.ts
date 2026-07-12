type MercadoPagoPreference = {
  id: string;
  init_point: string;
};

export async function createPreference(orderNumber: string, total: number): Promise<MercadoPagoPreference> {
  if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    return {
      id: `mock-pref-${orderNumber}`,
      init_point: "/pagamento/pendente"
    };
  }

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      external_reference: orderNumber,
      items: [
        {
          title: `Pedido ${orderNumber} - Atlas Móveis`,
          quantity: 1,
          currency_id: "BRL",
          unit_price: total
        }
      ],
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mercado-pago`,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_SITE_URL}/pagamento/sucesso`,
        pending: `${process.env.NEXT_PUBLIC_SITE_URL}/pagamento/pendente`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL}/pagamento/falha`
      }
    })
  });

  if (!response.ok) {
    throw new Error("Falha ao criar preferência do Mercado Pago.");
  }

  return (await response.json()) as MercadoPagoPreference;
}
