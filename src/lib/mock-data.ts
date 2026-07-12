import type { Category, Product } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-bedside",
    name: "Mesas de cabeceira",
    slug: "mesas-de-cabeceira",
    description:
      "Linhas exclusivas que combinam funcionalidade, beleza e acabamento de alto padrão para o seu quarto.",
    active: true,
    displayOrder: 1
  },
  {
    id: "cat-side",
    name: "Mesas laterais",
    slug: "mesas-laterais",
    description:
      "Peças versáteis que complementam diferentes ambientes com praticidade e sofisticação.",
    active: true,
    displayOrder: 2
  }
];

const neutralColors = [
  { id: "c-sand", name: "Areia", slug: "areia", hexColor: "#D8CABB", active: true },
  { id: "c-fendi", name: "Fendi", slug: "fendi", hexColor: "#C7B4A0", active: true },
  { id: "c-black", name: "Preto", slug: "preto", hexColor: "#1D1B1A", active: true },
  { id: "c-off", name: "Off-white", slug: "off-white", hexColor: "#F5F1EB", active: true },
  { id: "c-wood", name: "Amadeirado", slug: "amadeirado", hexColor: "#8F6545", active: true },
  { id: "c-graphite", name: "Grafite", slug: "grafite", hexColor: "#34302D", active: true },
  { id: "c-light", name: "Cinza-claro", slug: "cinza-claro", hexColor: "#D7D0C8", active: true },
  { id: "c-beige", name: "Bege", slug: "bege", hexColor: "#D9CCBE", active: true },
  { id: "c-nogueira", name: "Nogueira", slug: "nogueira", hexColor: "#6C4935", active: true }
];

function imageSet(productSlug: string, kind: "bedside" | "side"): Product["images"] {
  const base = kind === "bedside" ? "/images/products/bedside" : "/images/products/side";

  return [
    {
      id: `${productSlug}-1`,
      src: `${base}-1.svg`,
      alt: productSlug,
      width: 900,
      height: 1100,
      isPrimary: true
    },
    {
      id: `${productSlug}-2`,
      src: `${base}-2.svg`,
      alt: `${productSlug} em outro ângulo`,
      width: 900,
      height: 1100
    }
  ];
}

function variantSet(productSlug: string, colorIds: string[]) {
  return colorIds.map((colorId, index) => ({
    id: `${productSlug}-var-${index + 1}`,
    name: `Versão ${index + 1}`,
    sku: `${productSlug.toUpperCase()}-${index + 1}`,
    priceAdjustment: 0,
    stockQuantity: 5 + index,
    active: true,
    colorId
  }));
}

export const products: Product[] = [
  {
    id: "prod-aurora-01",
    slug: "aurora-01",
    name: "Aurora 01",
    sku: "ATM-AUR-01",
    categorySlug: "mesas-de-cabeceira",
    shortDescription: "Mesa de cabeceira com linhas retas e dois gavetões amplos.",
    description:
      "A Aurora 01 traduz a linguagem minimalista da Atlas Móveis em uma composição elegante, com estrutura robusta em MDF, puxadores usinados e presença discreta ao lado da cama.",
    unitPrice: 849,
    pairPrice: 1599,
    dimensions: "L 50 x A 50 x P 40 cm",
    weight: 21,
    materials: "MDF de alta densidade com acabamento fosco e ferragens selecionadas.",
    warranty: "1 ano de garantia contra defeitos de fabricação.",
    productionTime: "10 a 18 dias úteis",
    stockQuantity: 9,
    trackStock: true,
    featured: true,
    active: true,
    displayOrder: 1,
    metaTitle: "Aurora 01 | Atlas Móveis",
    metaDescription: "Mesa de cabeceira premium em MDF com acabamento minimalista.",
    colors: neutralColors.filter((color) => ["c-sand", "c-fendi", "c-black"].includes(color.id)),
    variants: variantSet("aurora-01", ["c-sand", "c-fendi", "c-black"]),
    images: imageSet("aurora-01", "bedside")
  },
  {
    id: "prod-oslo-01",
    slug: "oslo-01",
    name: "Oslo 01",
    sku: "ATM-OSL-01",
    categorySlug: "mesas-de-cabeceira",
    shortDescription: "Volume equilibrado com proporções suaves para quartos contemporâneos.",
    description:
      "A Oslo 01 foi criada para compor quartos com leitura mais leve. O desenho uniforme destaca o acabamento acetinado e o tampo ligeiramente recuado.",
    unitPrice: 849,
    pairPrice: 1599,
    dimensions: "L 50 x A 50 x P 40 cm",
    weight: 21,
    materials: "MDF de alta qualidade e trilhos telescópicos.",
    warranty: "1 ano de garantia contra defeitos de fabricação.",
    productionTime: "10 a 18 dias úteis",
    stockQuantity: 11,
    trackStock: true,
    featured: true,
    active: true,
    displayOrder: 2,
    metaTitle: "Oslo 01 | Atlas Móveis",
    metaDescription: "Mesa de cabeceira em MDF com linhas limpas e acabamento elegante.",
    colors: neutralColors.filter((color) => ["c-beige", "c-light", "c-black"].includes(color.id)),
    variants: variantSet("oslo-01", ["c-beige", "c-light", "c-black"]),
    images: imageSet("oslo-01", "bedside")
  },
  {
    id: "prod-siena-01",
    slug: "siena-01",
    name: "Siena 01",
    sku: "ATM-SIE-01",
    categorySlug: "mesas-de-cabeceira",
    shortDescription: "Elegância amadeirada para ambientes de atmosfera acolhedora.",
    description:
      "A Siena 01 valoriza o quarto com presença arquitetônica e leitura calorosa. Ideal para projetos que buscam materialidade nobre sem excessos.",
    unitPrice: 899,
    pairPrice: 1699,
    dimensions: "L 50 x A 52 x P 40 cm",
    weight: 22,
    materials: "MDF amadeirado, ferragens premium e acabamento texturizado.",
    warranty: "1 ano de garantia contra defeitos de fabricação.",
    productionTime: "10 a 18 dias úteis",
    stockQuantity: 6,
    trackStock: true,
    featured: true,
    active: true,
    displayOrder: 3,
    metaTitle: "Siena 01 | Atlas Móveis",
    metaDescription: "Mesa de cabeceira com visual amadeirado e design autoral.",
    colors: neutralColors.filter((color) => ["c-wood", "c-nogueira", "c-black"].includes(color.id)),
    variants: variantSet("siena-01", ["c-wood", "c-nogueira", "c-black"]),
    images: imageSet("siena-01", "bedside")
  },
  {
    id: "prod-firenze-01",
    slug: "firenze-01",
    name: "Firenze 01",
    sku: "ATM-FIR-01",
    categorySlug: "mesas-de-cabeceira",
    shortDescription: "Presença marcante e acabamento sofisticado para composições modernas.",
    description:
      "A Firenze 01 combina geometrias puras, gavetas generosas e tons de alto contraste, criando um apoio noturno com forte caráter visual.",
    unitPrice: 899,
    pairPrice: 1699,
    dimensions: "L 50 x A 50 x P 40 cm",
    weight: 22,
    materials: "MDF premium, pintura UV fosca e ferragens metálicas selecionadas.",
    warranty: "1 ano de garantia contra defeitos de fabricação.",
    productionTime: "10 a 18 dias úteis",
    stockQuantity: 4,
    trackStock: true,
    featured: true,
    active: true,
    displayOrder: 4,
    metaTitle: "Firenze 01 | Atlas Móveis",
    metaDescription: "Mesa de cabeceira premium com opção em grafite e off-white.",
    colors: neutralColors.filter((color) => ["c-black", "c-graphite", "c-off"].includes(color.id)),
    variants: variantSet("firenze-01", ["c-black", "c-graphite", "c-off"]),
    images: imageSet("firenze-01", "bedside")
  },
  {
    id: "prod-aurora-02",
    slug: "aurora-02",
    name: "Aurora 02",
    sku: "ATM-AUR-02",
    categorySlug: "mesas-de-cabeceira",
    shortDescription: "Versão mais alta com imponência equilibrada e acabamento sereno.",
    description:
      "A Aurora 02 mantém a assinatura da linha, ampliando a proporção vertical para projetos que pedem mais presença sem perder leveza.",
    unitPrice: 949,
    pairPrice: 1799,
    dimensions: "L 55 x A 55 x P 42 cm",
    weight: 24,
    materials: "MDF de alta densidade, pintura fosca e puxadores usinados.",
    warranty: "1 ano de garantia contra defeitos de fabricação.",
    productionTime: "10 a 18 dias úteis",
    stockQuantity: 8,
    trackStock: true,
    featured: true,
    active: true,
    displayOrder: 5,
    metaTitle: "Aurora 02 | Atlas Móveis",
    metaDescription: "Mesa de cabeceira com proporção ampliada e visual sofisticado.",
    colors: neutralColors.filter((color) => ["c-sand", "c-fendi", "c-black"].includes(color.id)),
    variants: variantSet("aurora-02", ["c-sand", "c-fendi", "c-black"]),
    images: imageSet("aurora-02", "bedside")
  },
  {
    id: "prod-lateral-oslo",
    slug: "lateral-oslo",
    name: "Lateral Oslo",
    sku: "ATM-LAT-OSL",
    categorySlug: "mesas-laterais",
    shortDescription: "Mesa lateral compacta para sala, quarto ou leitura.",
    description:
      "Peça versátil e prática para composições enxutas, com tampo funcional e base firme em MDF de acabamento refinado.",
    unitPrice: 590,
    dimensions: "L 40 x A 50 x P 35 cm",
    weight: 12,
    materials: "MDF de alta densidade com pintura UV fosca.",
    warranty: "1 ano de garantia contra defeitos de fabricação.",
    productionTime: "10 a 18 dias úteis",
    stockQuantity: 7,
    trackStock: true,
    featured: true,
    active: true,
    displayOrder: 6,
    metaTitle: "Lateral Oslo | Atlas Móveis",
    metaDescription: "Mesa lateral premium em MDF para ambientes elegantes.",
    colors: neutralColors.filter((color) => ["c-sand", "c-beige", "c-black"].includes(color.id)),
    variants: variantSet("lateral-oslo", ["c-sand", "c-beige", "c-black"]),
    images: imageSet("lateral-oslo", "side")
  },
  {
    id: "prod-lateral-siena",
    slug: "lateral-siena",
    name: "Lateral Siena",
    sku: "ATM-LAT-SIE",
    categorySlug: "mesas-laterais",
    shortDescription: "Base escultural com presença acolhedora em tons amadeirados.",
    description:
      "A Lateral Siena foi desenhada para complementar projetos autorais com aquecimento visual, mantendo a leveza da composição.",
    unitPrice: 690,
    dimensions: "L 45 x A 55 x P 35 cm",
    weight: 14,
    materials: "MDF amadeirado e ferragens internas de alta durabilidade.",
    warranty: "1 ano de garantia contra defeitos de fabricação.",
    productionTime: "10 a 18 dias úteis",
    stockQuantity: 6,
    trackStock: true,
    featured: true,
    active: true,
    displayOrder: 7,
    metaTitle: "Lateral Siena | Atlas Móveis",
    metaDescription: "Mesa lateral com acabamento amadeirado e desenho minimalista.",
    colors: neutralColors.filter((color) => ["c-wood", "c-nogueira", "c-black"].includes(color.id)),
    variants: variantSet("lateral-siena", ["c-wood", "c-nogueira", "c-black"]),
    images: imageSet("lateral-siena", "side")
  },
  {
    id: "prod-apoio-firenze",
    slug: "apoio-firenze",
    name: "Apoio Firenze",
    sku: "ATM-APO-FIR",
    categorySlug: "mesas-laterais",
    shortDescription: "Peça de apoio de geometria marcante para composições contemporâneas.",
    description:
      "Com nicho central e visual sólido, o Apoio Firenze entrega funcionalidade e uma leitura elegante para salas e quartos.",
    unitPrice: 790,
    dimensions: "L 40 x A 55 x P 40 cm",
    weight: 15,
    materials: "MDF premium com pintura fosca de alta resistência.",
    warranty: "1 ano de garantia contra defeitos de fabricação.",
    productionTime: "10 a 18 dias úteis",
    stockQuantity: 5,
    trackStock: true,
    featured: true,
    active: true,
    displayOrder: 8,
    metaTitle: "Apoio Firenze | Atlas Móveis",
    metaDescription: "Mesa de apoio em MDF com nicho e linguagem arquitetônica.",
    colors: neutralColors.filter((color) => ["c-sand", "c-off", "c-black"].includes(color.id)),
    variants: variantSet("apoio-firenze", ["c-sand", "c-off", "c-black"]),
    images: imageSet("apoio-firenze", "side")
  },
  {
    id: "prod-lateral-aurora",
    slug: "lateral-aurora",
    name: "Lateral Aurora",
    sku: "ATM-LAT-AUR",
    categorySlug: "mesas-laterais",
    shortDescription: "Apoio leve para composições serenas e funcionais.",
    description:
      "A Lateral Aurora combina tampo generoso, base limpa e proporções equilibradas para servir ao lado do sofá ou da cama com sutileza.",
    unitPrice: 590,
    dimensions: "L 40 x A 50 x P 35 cm",
    weight: 12,
    materials: "MDF premium com acabamento acetinado.",
    warranty: "1 ano de garantia contra defeitos de fabricação.",
    productionTime: "10 a 18 dias úteis",
    stockQuantity: 12,
    trackStock: true,
    featured: true,
    active: true,
    displayOrder: 9,
    metaTitle: "Lateral Aurora | Atlas Móveis",
    metaDescription: "Mesa lateral minimalista para compor salas e quartos.",
    colors: neutralColors.filter((color) => ["c-wood", "c-sand", "c-black"].includes(color.id)),
    variants: variantSet("lateral-aurora", ["c-wood", "c-sand", "c-black"]),
    images: imageSet("lateral-aurora", "side")
  },
  {
    id: "prod-apoio-minimal",
    slug: "apoio-minimal",
    name: "Apoio Minimal",
    sku: "ATM-APO-MIN",
    categorySlug: "mesas-laterais",
    shortDescription: "Peça essencial, versátil e silenciosa para o dia a dia.",
    description:
      "O Apoio Minimal reforça a proposta da marca com uma forma pura, acabamento bem resolvido e uso flexível em vários ambientes.",
    unitPrice: 590,
    dimensions: "L 35 x A 50 x P 35 cm",
    weight: 11,
    materials: "MDF com acabamento fosco suave ao toque.",
    warranty: "1 ano de garantia contra defeitos de fabricação.",
    productionTime: "10 a 18 dias úteis",
    stockQuantity: 13,
    trackStock: true,
    featured: true,
    active: true,
    displayOrder: 10,
    metaTitle: "Apoio Minimal | Atlas Móveis",
    metaDescription: "Mesa de apoio compacta com design limpo e refinado.",
    colors: neutralColors.filter((color) => ["c-sand", "c-off", "c-black"].includes(color.id)),
    variants: variantSet("apoio-minimal", ["c-sand", "c-off", "c-black"]),
    images: imageSet("apoio-minimal", "side")
  }
];
