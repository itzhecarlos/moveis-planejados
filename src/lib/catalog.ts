import { categories, products } from "@/lib/mock-data";

export function getCategories() {
  return categories.filter((category) => category.active).sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getProducts() {
  return products.filter((product) => product.active).sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getFeaturedProducts(limit?: number) {
  const featured = getProducts().filter((product) => product.featured);
  return typeof limit === "number" ? featured.slice(0, limit) : featured;
}

export function getProductsByCategory(slug: string) {
  return getProducts().filter((product) => product.categorySlug === slug);
}

export function getCategoryBySlug(slug: string) {
  return getCategories().find((category) => category.slug === slug);
}

export function getProductBySlug(slug: string) {
  return getProducts().find((product) => product.slug === slug);
}

export function getRelatedProducts(slug: string, categorySlug: string) {
  return getProducts()
    .filter((product) => product.slug !== slug && product.categorySlug === categorySlug)
    .slice(0, 4);
}
