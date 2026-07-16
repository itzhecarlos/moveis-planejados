import type { Category, Product } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-nightstands",
    name: "Criados-mudos",
    slug: "criados-mudos",
    description:
      "Cinco modelos autorais de criados-mudos em MDF, com leitura minimalista, acabamentos elegantes e presença discreta para quartos sofisticados.",
    active: true,
    displayOrder: 1
  }
];

const colors = [
  { id: "c-off-white", name: "Off White", slug: "off-white", hexColor: "#EAE0D6", active: true },
  { id: "c-freijo", name: "Freijó", slug: "freijo", hexColor: "#8C6646", active: true },
  { id: "c-preto", name: "Preto", slug: "preto", hexColor: "#1E1C1A", active: true },
  { id: "c-areia", name: "Areia", slug: "areia", hexColor: "#D9CCBE", active: true },
  { id: "c-fendi", name: "Fendi", slug: "fendi", hexColor: "#C7B2A0", active: true }
];

function buildImages(slug: string, files: Array<{ file: string; width: number; height: number }>): Product["images"] {
  return files.map((file, index) => ({
    id: `${slug}-${index + 1}`,
    src: `/images/products/${slug}/${file.file}`,
    alt: `${slug} ${index === 0 ? "capa" : `imagem ${index + 1}`}`,
    width: file.width,
    height: file.height,
    isPrimary: index === 0
  }));
}

function buildVariants(slug: string, colorId: string, sku: string) {
  return [
    {
      id: `${slug}-variant-1`,
      name: "Padrão",
      sku,
      priceAdjustment: 0,
      stockQuantity: 8,
      active: true,
      colorId
    }
  ];
}

export const products: Product[] = [
  {
    id: "prod-firenze-preto",
    slug: "firenze-preto",
    name: "Firenze - Preto",
    sku: "ATM-FIR-PTO",
    categorySlug: "criados-mudos",
    shortDescription: "Criado-mudo com presença marcante, acabamento escuro e desenho limpo.",
    description:
      "O Firenze - Preto foi pensado para quartos contemporâneos que pedem contraste, elegância e linhas bem resolvidas. Seu volume compacto organiza o ambiente com personalidade discreta.",
    unitPrice: 899,
    pairPrice: 1699,
    dimensions: "L 50 x A 50 x P 40 cm",
    weight: 22,
    materials: "MDF premium com acabamento fosco e ferragens selecionadas.",
    warranty: "1 ano de garantia contra defeitos de fabricação.",
    productionTime: "10 a 18 dias úteis",
    stockQuantity: 6,
    trackStock: true,
    featured: true,
    active: true,
    displayOrder: 1,
    metaTitle: "Firenze - Preto | Atlas Móveis",
    metaDescription: "Criado-mudo em MDF com acabamento preto e visual sofisticado.",
    colors: colors.filter((color) => color.id === "c-preto"),
    variants: buildVariants("firenze-preto", "c-preto", "ATM-FIR-PTO-01"),
    images: buildImages("firenze-preto", [
      { file: "cover.png", width: 1254, height: 1254 },
      { file: "01.png", width: 1536, height: 1024 },
      { file: "02.png", width: 1535, height: 1024 },
      { file: "03.jpeg", width: 1280, height: 853 }
    ])
  },
  {
    id: "prod-siena-freijo",
    slug: "siena-freijo",
    name: "Siena - Freijó",
    sku: "ATM-SIE-FRE",
    categorySlug: "criados-mudos",
    shortDescription: "Modelo amadeirado com atmosfera acolhedora e leitura editorial.",
    description:
      "O Siena - Freijó valoriza quartos com tons quentes e materiais naturais. O acabamento amadeirado reforça a sensação de aconchego sem abrir mão de um desenho minimalista.",
    unitPrice: 899,
    pairPrice: 1699,
    dimensions: "L 50 x A 52 x P 40 cm",
    weight: 22,
    materials: "MDF de alta densidade com padrão freijó e ferragens premium.",
    warranty: "1 ano de garantia contra defeitos de fabricação.",
    productionTime: "10 a 18 dias úteis",
    stockQuantity: 7,
    trackStock: true,
    featured: true,
    active: true,
    displayOrder: 2,
    metaTitle: "Siena - Freijó | Atlas Móveis",
    metaDescription: "Criado-mudo amadeirado em MDF com visual elegante e acolhedor.",
    colors: colors.filter((color) => color.id === "c-freijo"),
    variants: buildVariants("siena-freijo", "c-freijo", "ATM-SIE-FRE-01"),
    images: buildImages("siena-freijo", [
      { file: "cover.png", width: 1254, height: 1254 },
      { file: "01.png", width: 1536, height: 1024 },
      { file: "02.png", width: 1536, height: 1024 },
      { file: "03.jpeg", width: 1280, height: 853 }
    ])
  },
  {
    id: "prod-oslo-off-white",
    slug: "oslo-off-white",
    name: "Oslo - Off White",
    sku: "ATM-OSL-OWH",
    categorySlug: "criados-mudos",
    shortDescription: "Volume sereno e acabamento claro para quartos de atmosfera leve.",
    description:
      "O Oslo - Off White combina proporções suaves e materialidade clara, criando uma peça elegante para compor o quarto com luminosidade e discrição.",
    unitPrice: 849,
    pairPrice: 1599,
    dimensions: "L 50 x A 50 x P 40 cm",
    weight: 21,
    materials: "MDF com acabamento off white e ferragens selecionadas.",
    warranty: "1 ano de garantia contra defeitos de fabricação.",
    productionTime: "10 a 18 dias úteis",
    stockQuantity: 8,
    trackStock: true,
    featured: true,
    active: true,
    displayOrder: 3,
    metaTitle: "Oslo - Off White | Atlas Móveis",
    metaDescription: "Criado-mudo em MDF com acabamento off white e linhas limpas.",
    colors: colors.filter((color) => color.id === "c-off-white"),
    variants: buildVariants("oslo-off-white", "c-off-white", "ATM-OSL-OWH-01"),
    images: buildImages("oslo-off-white", [
      { file: "cover.png", width: 1536, height: 1024 },
      { file: "01.png", width: 1536, height: 1024 },
      { file: "02.png", width: 1536, height: 1024 },
      { file: "03.png", width: 1536, height: 1024 }
    ])
  },
  {
    id: "prod-aurora-02",
    slug: "aurora-02",
    name: "Aurora 02",
    sku: "ATM-AUR-02",
    categorySlug: "criados-mudos",
    shortDescription: "Versão mais alta com presença equilibrada e acabamento sofisticado.",
    description:
      "A Aurora 02 amplia a presença visual da linha com proporção mais alta, mantendo a elegância limpa e a praticidade do uso diário ao lado da cama.",
    unitPrice: 949,
    pairPrice: 1799,
    dimensions: "L 55 x A 55 x P 42 cm",
    weight: 24,
    materials: "MDF premium com pintura fosca e ferragens de alto padrão.",
    warranty: "1 ano de garantia contra defeitos de fabricação.",
    productionTime: "10 a 18 dias úteis",
    stockQuantity: 9,
    trackStock: true,
    featured: true,
    active: true,
    displayOrder: 4,
    metaTitle: "Aurora 02 | Atlas Móveis",
    metaDescription: "Criado-mudo em MDF com proporção ampliada e visual refinado.",
    colors: colors.filter((color) => ["c-areia", "c-fendi"].includes(color.id)),
    variants: buildVariants("aurora-02", "c-areia", "ATM-AUR-02-01"),
    images: buildImages("aurora-02", [
      { file: "cover.png", width: 1254, height: 1254 },
      { file: "01.png", width: 1536, height: 1024 },
      { file: "02.png", width: 1536, height: 1024 },
      { file: "03.png", width: 1536, height: 1024 }
    ])
  },
  {
    id: "prod-aurora-01",
    slug: "aurora-01",
    name: "Aurora 01",
    sku: "ATM-AUR-01",
    categorySlug: "criados-mudos",
    shortDescription: "Criado-mudo de linhas retas com dois gavetões amplos e elegantes.",
    description:
      "A Aurora 01 traduz a linguagem essencial da Atlas Móveis em um desenho equilibrado, com acabamento neutro e visual que conversa com quartos contemporâneos.",
    unitPrice: 849,
    pairPrice: 1599,
    dimensions: "L 50 x A 50 x P 40 cm",
    weight: 21,
    materials: "MDF de alta densidade com acabamento fosco e ferragens selecionadas.",
    warranty: "1 ano de garantia contra defeitos de fabricação.",
    productionTime: "10 a 18 dias úteis",
    stockQuantity: 10,
    trackStock: true,
    featured: true,
    active: true,
    displayOrder: 5,
    metaTitle: "Aurora 01 | Atlas Móveis",
    metaDescription: "Criado-mudo premium em MDF com acabamento claro e desenho minimalista.",
    colors: colors.filter((color) => ["c-areia", "c-fendi"].includes(color.id)),
    variants: buildVariants("aurora-01", "c-fendi", "ATM-AUR-01-01"),
    images: buildImages("aurora-01", [
      { file: "cover.png", width: 1254, height: 1254 },
      { file: "01.png", width: 1536, height: 1024 },
      { file: "02.png", width: 1536, height: 1024 },
      { file: "03.png", width: 1536, height: 1024 }
    ])
  }
];
