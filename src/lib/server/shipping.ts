import "server-only";

import { calculateShippingAmount, normalizeBrazilState, roundCurrency } from "@/lib/checkout/pricing";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { MAX_SHIPPING_DELIVERY_DAYS, type ShippingQuote } from "@/lib/shipping/types";
import type { CartItem } from "@/types";

type ShippingProduct = {
  id: string;
  dimensions: string | null;
  weight: number | null;
  insuranceValue: number;
  quantity: number;
};

type ProductShippingRow = {
  id: string;
  dimensions: string | null;
  weight: number | null;
  unit_price: number;
  pair_price: number | null;
  promotional_price: number | null;
};

type MelhorEnvioService = {
  id?: number | string;
  name?: string;
  price?: string | number;
  custom_price?: string | number;
  delivery_time?: number | string;
  custom_delivery_time?: number | string;
  error?: string;
  company?: {
    name?: string;
  };
};

type ViaCepResponse = {
  uf?: string;
  erro?: boolean;
};

type QuoteShippingInput = {
  postalCode: string;
  state: string;
  products: ShippingProduct[];
};

export async function quoteShippingForCart(items: CartItem[], postalCode: string, state: string) {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    throw new Error("O Supabase não está configurado para calcular o frete.");
  }

  const productIds = [...new Set(items.map((item) => item.productId))];
  const { data, error } = await supabase
    .from("products")
    .select("id, dimensions, weight, unit_price, pair_price, promotional_price")
    .in("id", productIds)
    .eq("active", true)
    .is("archived_at", null)
    .is("deleted_at", null);

  if (error) {
    throw new Error("Não foi possível carregar os produtos para calcular o frete.");
  }

  const productMap = new Map(((data as ProductShippingRow[]) || []).map((product) => [product.id, product]));
  const products = items.map((item) => {
    const product = productMap.get(item.productId);

    if (!product) {
      throw new Error("Existe um produto indisponível no carrinho.");
    }

    const physicalQuantity = item.quantity * (item.purchaseType === "pair" ? 2 : 1);
    const purchasePrice =
      item.purchaseType === "pair" && product.pair_price
        ? product.pair_price
        : product.promotional_price || product.unit_price;

    return {
      id: `${product.id}-${item.purchaseType}`,
      dimensions: product.dimensions,
      weight: product.weight,
      insuranceValue: roundCurrency(purchasePrice / (item.purchaseType === "pair" ? 2 : 1)),
      quantity: physicalQuantity
    };
  });

  return quoteShipping({ postalCode, state, products });
}

export async function quoteShipping({
  postalCode,
  state,
  products
}: QuoteShippingInput): Promise<ShippingQuote> {
  const accessToken = process.env.MELHOR_ENVIO_ACCESS_TOKEN?.trim();
  const originPostalCode = onlyDigits(process.env.MELHOR_ENVIO_ORIGIN_POSTAL_CODE || "");
  const destinationPostalCode = onlyDigits(postalCode);

  if (!accessToken || originPostalCode.length !== 8) {
    throw new Error("A cotação do Melhor Envio ainda não foi configurada.");
  }

  if (destinationPostalCode.length !== 8) {
    throw new Error("Informe um CEP válido para calcular o frete.");
  }

  const destinationState = await resolvePostalCodeState(destinationPostalCode);
  const informedState = normalizeBrazilState(state);

  if (destinationState !== informedState) {
    throw new Error(`A UF informada não corresponde ao CEP. Use ${destinationState}.`);
  }

  if (!products.length) {
    throw new Error("O carrinho está vazio.");
  }

  const apiUrl = (process.env.MELHOR_ENVIO_API_URL || "https://sandbox.melhorenvio.com.br").replace(/\/$/, "");
  const userAgent =
    process.env.MELHOR_ENVIO_USER_AGENT?.trim() ||
    "Atlas Moveis (contato@atlasmoveis.com.br)";

  const response = await fetch(`${apiUrl}/api/v2/me/shipment/calculate`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "User-Agent": userAgent
    },
    body: JSON.stringify({
      from: {
        postal_code: originPostalCode
      },
      to: {
        postal_code: destinationPostalCode
      },
      products: products.map((product) => {
        const dimensions = parseDimensions(product.dimensions);

        if (!product.weight || product.weight <= 0) {
          throw new Error(`O peso do produto ${product.id} não está cadastrado.`);
        }

        return {
          id: product.id,
          width: dimensions.width,
          height: dimensions.height,
          length: dimensions.length,
          weight: product.weight,
          insurance_value: product.insuranceValue,
          quantity: product.quantity
        };
      }),
      options: {
        receipt: false,
        own_hand: false
      }
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000)
  });

  if (!response.ok) {
    throw new Error("O Melhor Envio não conseguiu calcular o frete para este CEP.");
  }

  const services = (await response.json()) as MelhorEnvioService[];
  const eligibleServices = services
    .map((service) => {
      const price = toNumber(service.custom_price ?? service.price);
      const deliveryDays = Math.ceil(toNumber(service.custom_delivery_time ?? service.delivery_time));

      return {
        service,
        price,
        deliveryDays
      };
    })
    .filter(
      ({ service, price, deliveryDays }) =>
        !service.error &&
        Number.isFinite(price) &&
        price > 0 &&
        Number.isFinite(deliveryDays) &&
        deliveryDays > 0 &&
        deliveryDays <= MAX_SHIPPING_DELIVERY_DAYS
    )
    .sort((a, b) => a.price - b.price);

  const selected = eligibleServices[0];

  if (!selected) {
    throw new Error("Nenhuma transportadora com entrega em até 15 dias úteis atende este CEP.");
  }

  const quotedAmount = roundCurrency(selected.price);
  const freeShipping = calculateShippingAmount(destinationState) === 0;

  return {
    postalCode: destinationPostalCode,
    destinationState,
    quotedAmount,
    chargedAmount: freeShipping ? 0 : quotedAmount,
    freeShipping,
    deliveryDays: selected.deliveryDays,
    serviceName: selected.service.name || "Entrega",
    carrierName: selected.service.company?.name || "Transportadora",
    source: "melhor-envio"
  };
}

async function resolvePostalCodeState(postalCode: string) {
  const response = await fetch(`https://viacep.com.br/ws/${postalCode}/json/`, {
    headers: {
      Accept: "application/json"
    },
    signal: AbortSignal.timeout(5_000),
    next: {
      revalidate: 86400
    }
  });

  if (!response.ok) {
    throw new Error("Não foi possível validar o CEP informado.");
  }

  const address = (await response.json()) as ViaCepResponse;
  const state = normalizeBrazilState(address.uf || "");

  if (address.erro || state.length !== 2) {
    throw new Error("O CEP informado não foi encontrado.");
  }

  return state;
}

function parseDimensions(value: string | null) {
  const normalized = value?.replace(/,/g, ".") || "";
  const width = readDimension(normalized, "L");
  const height = readDimension(normalized, "A");
  const length = readDimension(normalized, "P");

  if (!width || !height || !length) {
    throw new Error("As dimensões de um produto não estão cadastradas corretamente.");
  }

  return { width, height, length };
}

function readDimension(value: string, label: string) {
  const match = value.match(new RegExp(`(?:^|\\s|x)${label}\\s*(\\d+(?:\\.\\d+)?)`, "i"));
  return match ? Number(match[1]) : 0;
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function toNumber(value: string | number | undefined) {
  return typeof value === "number" ? value : Number.parseFloat(value || "");
}
