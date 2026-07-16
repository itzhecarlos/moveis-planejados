export const siteConfig = {
  name: "Atlas Móveis",
  slogan: "Design que organiza. Qualidade que permanece.",
  description:
    "Loja virtual de móveis em MDF com estética editorial, acabamentos premium e atendimento consultivo para todo o Brasil, com frete grátis em PR, SC e RS.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5511999999999",
  email: "contato@atlasmoveis.com.br",
  instagram: "@atlas.moveis"
};

export const navLinks = [
  { href: "/", label: "Início" },
  { href: "/categoria/criados-mudos", label: "Criados-mudos" },
  { href: "/produtos", label: "Todos os produtos" },
  { href: "/sobre", label: "Sobre nós" },
  { href: "/contato", label: "Contato" }
];
