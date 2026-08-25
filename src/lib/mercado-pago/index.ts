import "server-only";

import { siteConfig } from "@/lib/site";
import type { PaymentMethod, PurchaseType } from "@/types";

type MercadoPagoPreference = {
  id: string;
  init_point: string;
  sandbox_init_point?: string;
};

type MercadoPagoPayment = {
  id: number | string;
  status?: string;
  external_reference?: string;
  preference_id?: string;
  payment_method_id?: string;
  payment_type_id?: string;
};

type MercadoPagoPreferenceInput = {
  orderNumber: string;
  paymentMethod: PaymentMethod;
  subtotal: number;
  pixDiscount: number;
  shipping: number;
  total: number;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    document: string;
    postalCode: string;
    street: string;
    number: string;
    complement: string | null;
    neighborhood: string;
    city: string;
    state: string;
  };
  items: Array<{
    productId: string;
    title: string;
    description: string;
    sku: string | null;
    quantity: number;
    purchaseType: PurchaseType;
    unitPrice: number;
    total: number;
  }>;
};

export async function createPreference(input: MercadoPagoPreferenceInput): Promise<MercadoPagoPreference> {
  if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    return {
      id: `mock-pref-${input.orderNumber}`,
      init_point: "/pagamento/pendente"
    };
  }

  const siteUrl = siteConfig.url.replace(/\/$/, "");
  const firstName = input.customer.fullName.trim().split(/\s+/)[0] || input.customer.fullName;
  const lastName = input.customer.fullName.trim().split(/\s+/).slice(1).join(" ");
  const phoneDigits = onlyDigits(input.customer.phone);
  const documentDigits = onlyDigits(input.customer.document);
  const postalCodeDigits = onlyDigits(input.customer.postalCode);
  const lineItemDiscountFactor = input.subtotal > 0 ? (input.subtotal - input.pixDiscount) / input.subtotal : 1;

  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      external_reference: input.orderNumber,
      statement_descriptor: "ATLAS MOVEIS",
      notification_url: `${siteUrl}/api/webhooks/mercado-pago`,
      back_urls: {
        success: `${siteUrl}/pagamento/sucesso?pedido=${encodeURIComponent(input.orderNumber)}`,
        pending: `${siteUrl}/pagamento/pendente?pedido=${encodeURIComponent(input.orderNumber)}`,
        failure: `${siteUrl}/pagamento/falha?pedido=${encodeURIComponent(input.orderNumber)}`
      },
      auto_return: "approved",
      payer: {
        name: firstName,
        surname: lastName,
        email: input.customer.email,
        phone: splitBrazilPhone(phoneDigits),
        identification: {
          type: documentDigits.length > 11 ? "CNPJ" : "CPF",
          number: documentDigits
        },
        address: {
          zip_code: postalCodeDigits,
          street_name: input.customer.street,
          street_number: input.customer.number
        }
      },
      items: input.items.map((item) => ({
        id: item.sku || item.productId,
        title: item.title,
        description: `${item.description} - Pedido ${input.orderNumber}`,
        quantity: item.quantity,
        currency_id: "BRL",
        unit_price: roundForMercadoPago(item.unitPrice * lineItemDiscountFactor)
      })),
      shipments: {
        cost: input.shipping,
        free_shipping: input.shipping === 0,
        receiver_address: {
          zip_code: postalCodeDigits,
          street_name: input.customer.street,
          street_number: input.customer.number,
          floor: input.customer.complement || undefined,
          neighborhood: input.customer.neighborhood,
          city_name: input.customer.city,
          state_name: input.customer.state,
          country_name: "Brasil"
        }
      },
      payment_methods: buildPaymentMethods(input.paymentMethod),
      metadata: {
        order_number: input.orderNumber,
        payment_method_selected: input.paymentMethod,
        subtotal: input.subtotal,
        pix_discount: input.pixDiscount,
        shipping: input.shipping,
        total: input.total
      }
    })
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`Falha ao criar preferência do Mercado Pago. ${errorBody}`.trim());
  }

  return (await response.json()) as MercadoPagoPreference;
}

export async function fetchMercadoPagoPayment(paymentId: string): Promise<MercadoPagoPayment> {
  if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    throw new Error("Mercado Pago não configurado.");
  }

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Falha ao consultar pagamento no Mercado Pago.");
  }

  return (await response.json()) as MercadoPagoPayment;
}

function buildPaymentMethods(paymentMethod: PaymentMethod) {
  if (paymentMethod === "pix") {
    return {
      excluded_payment_types: [{ id: "credit_card" }, { id: "debit_card" }, { id: "prepaid_card" }, { id: "ticket" }],
      default_payment_method_id: "pix",
      installments: 1
    };
  }

  return {
    excluded_payment_types: [{ id: "bank_transfer" }, { id: "ticket" }],
    installments: 6
  };
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function splitBrazilPhone(value: string) {
  return {
    area_code: value.slice(0, 2),
    number: value.slice(2)
  };
}

function roundForMercadoPago(value: number) {
  return Number(value.toFixed(2));
}
