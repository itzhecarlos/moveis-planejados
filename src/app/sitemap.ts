import type { MetadataRoute } from "next";

import { getCategories, getProducts } from "@/lib/catalog";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/produtos",
    "/carrinho",
    "/checkout",
    "/sobre",
    "/contato",
    "/politica-de-privacidade",
    "/politica-de-entrega",
    "/politica-de-trocas",
    "/termos-de-uso"
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: new Date()
    })),
    ...getCategories().map((category) => ({
      url: `${siteConfig.url}/categoria/${category.slug}`,
      lastModified: new Date()
    })),
    ...getProducts().map((product) => ({
      url: `${siteConfig.url}/produto/${product.slug}`,
      lastModified: new Date()
    }))
  ];
}
