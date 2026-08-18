import { Product } from "@/types";
import { products } from "@/data/products";

export function searchProducts(query: string): Product[] {
  const term = query.trim().toLowerCase();
  if (!term) return products;

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.categorySlug.toLowerCase().includes(term) ||
      product.code.toLowerCase().includes(term)
  );
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getSimilarProducts(product: Product, limit = 3): Product[] {
  return products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, limit);
}

export function getFeaturedProducts(limit?: number): Product[] {
  const featured = products.filter((p) => p.featured);
  return limit ? featured.slice(0, limit) : featured;
}

export function getNewArrivals(limit?: number): Product[] {
  const arrivals = products.filter((p) => p.newArrival);
  return limit ? arrivals.slice(0, limit) : arrivals;
}

export function filterProducts(options: {
  categorySlug?: string;
  featured?: boolean;
  newArrival?: boolean;
}): Product[] {
  return products.filter((product) => {
    if (options.categorySlug && options.categorySlug !== "all" && product.categorySlug !== options.categorySlug) {
      return false;
    }
    if (options.featured && !product.featured) return false;
    if (options.newArrival && !product.newArrival) return false;
    return true;
  });
}
