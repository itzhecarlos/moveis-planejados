import { Resend } from "resend";

export async function sendApprovedOrderEmail(params: {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  total: string;
}) {
  if (!process.env.RESEND_API_KEY || !process.env.STORE_NOTIFICATION_EMAIL) {
    return { skipped: true };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  return resend.emails.send({
    from: "Atlas Móveis <pedidos@atlasmoveis.com.br>",
    to: [params.customerEmail, process.env.STORE_NOTIFICATION_EMAIL],
    subject: `Pedido ${params.orderNumber} aprovado`,
    html: `<p>Olá, ${params.customerName}.</p><p>Seu pagamento foi aprovado e o pedido <strong>${params.orderNumber}</strong> foi confirmado.</p><p>Total: ${params.total}</p>`
  });
}
