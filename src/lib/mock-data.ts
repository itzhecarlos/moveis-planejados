import type { Category, Product } from "@/types";

export const categories: Category[] = [
  {
    id: "7b53bb5d-e3ca-4f02-bf46-3ec9f67f7ca1",
    name: "Criados-mudos",
    slug: "criados-mudos",
    description:
      "Cinco modelos autorais de criados-mudos em MDF, com leitura minimalista, acabamentos elegantes e presença discreta para quartos sofisticados.",
    active: true,
    displayOrder: 1
  }
];

const colors = [
  { id: "de080e29-c1fd-4cf1-a70d-bb08c57d136a", name: "Off White", slug: "off-white", hexColor: "#EAE0D6", active: true },
  { id: "d51ca135-fc22-4cd7-b5ff-7b59c3905390", name: "Freijó", slug: "freijo", hexColor: "#8C6646", active: true },
  { id: "08f98535-bb08-4c09-9bf8-c48ce51f2078", name: "Preto", slug: "preto", hexColor: "#1E1C1A", active: true },
  { id: "84f042b0-7bf1-49ae-bfba-6502c03ea466", name: "Areia", slug: "areia", hexColor: "#D9CCBE", active: true },
  { id: "aab99dcf-8db8-407d-9aa8-b57740edf7fa", name: "Fendi", slug: "fendi", hexColor: "#C7B2A0", active: true }
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
      id: sku,
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
    id: "1bf09210-1fb5-41db-a9e6-b98511597690",
    slug: "firenze-preto",
    name: "Firenze - Preto",
    sku: "ATM-FIR-PTO",
    categorySlug: "criados-mudos",
    shortDescription: "Criado-mudo com presença marcante, acabamento escuro e desenho limpo.",
    description:
      "O Firenze - Preto foi pensado para quartos contemporâneos que pedem contraste, elegância e linhas bem resolvidas. Seu volume compacto organiza o ambiente com personalidade discreta.",
    unitPrice: 899.99,
    pairPrice: 1799.99,
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
    colors: colors.filter((color) => color.id === "08f98535-bb08-4c09-9bf8-c48ce51f2078"),
    variants: buildVariants("firenze-preto", "08f98535-bb08-4c09-9bf8-c48ce51f2078", "640fa8ca-8ce9-44e3-b763-282e0de49781"),
    images: buildImages("firenze-preto", [
      { file: "cover.png", width: 1254, height: 1254 },
      { file: "01.png", width: 1536, height: 1024 },
      { file: "02.png", width: 1535, height: 1024 },
      { file: "03.jpeg", width: 1280, height: 853 }
    ])
  },
  {
    id: "1f38e9b9-7af5-45d6-a4cb-d8d0dcb0dfe8",
    slug: "siena-freijo",
    name: "Siena - Freijó",
    sku: "ATM-SIE-FRE",
    categorySlug: "criados-mudos",
    shortDescription: "Modelo amadeirado com atmosfera acolhedora e leitura editorial.",
    description:
      "O Siena - Freijó valoriza quartos com tons quentes e materiais naturais. O acabamento amadeirado reforça a sensação de aconchego sem abrir mão de um desenho minimalista.",
    unitPrice: 899.99,
    pairPrice: 1799.99,
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
    colors: colors.filter((color) => color.id === "d51ca135-fc22-4cd7-b5ff-7b59c3905390"),
    variants: buildVariants("siena-freijo", "d51ca135-fc22-4cd7-b5ff-7b59c3905390", "9b7af249-35f7-4f48-9d96-033bc0796ab4"),
    images: buildImages("siena-freijo", [
      { file: "cover.png", width: 1254, height: 1254 },
      { file: "01.png", width: 1536, height: 1024 },
      { file: "02.png", width: 1536, height: 1024 },
      { file: "03.jpeg", width: 1280, height: 853 }
    ])
  },
  {
    id: "fd8143fb-398e-4fc3-b55a-7b4b71505312",
    slug: "oslo-off-white",
    name: "Oslo - Off White",
    sku: "ATM-OSL-OWH",
    categorySlug: "criados-mudos",
    shortDescription: "Volume sereno e acabamento claro para quartos de atmosfera leve.",
    description:
      "O Oslo - Off White combina proporções suaves e materialidade clara, criando uma peça elegante para compor o quarto com luminosidade e discrição.",
    unitPrice: 899.99,
    pairPrice: 1799.99,
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
    colors: colors.filter((color) => color.id === "de080e29-c1fd-4cf1-a70d-bb08c57d136a"),
    variants: buildVariants("oslo-off-white", "de080e29-c1fd-4cf1-a70d-bb08c57d136a", "d17e8f17-fd75-412a-9a3a-9a8be8e20572"),
    images: buildImages("oslo-off-white", [
      { file: "cover.png", width: 1536, height: 1024 },
      { file: "01.png", width: 1536, height: 1024 },
      { file: "02.png", width: 1536, height: 1024 },
      { file: "03.png", width: 1536, height: 1024 }
    ])
  },
  {
    id: "2a319092-d3a4-4b4e-bf74-b48badfffd6c",
    slug: "aurora-02",
    name: "Aurora 02",
    sku: "ATM-AUR-02",
    categorySlug: "criados-mudos",
    shortDescription: "Versão mais alta com presença equilibrada e acabamento sofisticado.",
    description:
      "A Aurora 02 amplia a presença visual da linha com proporção mais alta, mantendo a elegância limpa e a praticidade do uso diário ao lado da cama.",
    unitPrice: 899.99,
    pairPrice: 1799.99,
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
    colors: colors.filter((color) => ["84f042b0-7bf1-49ae-bfba-6502c03ea466", "aab99dcf-8db8-407d-9aa8-b57740edf7fa"].includes(color.id)),
    variants: buildVariants("aurora-02", "84f042b0-7bf1-49ae-bfba-6502c03ea466", "acfe6cdf-271a-48b1-bbb5-72414b46eb78"),
    images: buildImages("aurora-02", [
      { file: "cover.png", width: 1254, height: 1254 },
      { file: "01.png", width: 1536, height: 1024 },
      { file: "02.png", width: 1536, height: 1024 },
      { file: "03.png", width: 1536, height: 1024 }
    ])
  },
  {
    id: "8eaf3037-8f78-4e33-845d-4cba8ffed8f0",
    slug: "aurora-01",
    name: "Aurora 01",
    sku: "ATM-AUR-01",
    categorySlug: "criados-mudos",
    shortDescription: "Criado-mudo de linhas retas com dois gavetões amplos e elegantes.",
    description:
      "A Aurora 01 traduz a linguagem essencial da Atlas Móveis em um desenho equilibrado, com acabamento neutro e visual que conversa com quartos contemporâneos.",
    unitPrice: 899.99,
    pairPrice: 1799.99,
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
    colors: colors.filter((color) => ["84f042b0-7bf1-49ae-bfba-6502c03ea466", "aab99dcf-8db8-407d-9aa8-b57740edf7fa"].includes(color.id)),
    variants: buildVariants("aurora-01", "aab99dcf-8db8-407d-9aa8-b57740edf7fa", "c4d31bb3-65aa-4c6a-a7c7-d00a80977c89"),
    images: buildImages("aurora-01", [
      { file: "cover.png", width: 1254, height: 1254 },
      { file: "01.png", width: 1536, height: 1024 },
      { file: "02.png", width: 1536, height: 1024 },
      { file: "03.png", width: 1536, height: 1024 }
    ])
  }
];
