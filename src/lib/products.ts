import { Product, FormatType } from "@/types";
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
      product.code.toLowerCase().includes(term) ||
      product.tags?.some((t) => t.toLowerCase().includes(term))
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

export interface FilterOptions {
  categorySlug?: string;
  format?: "all" | "printed" | "digital";
  digitalType?: "all" | "pdf" | "video";
  featured?: boolean;
  newArrival?: boolean;
}

export function filterProducts(options: FilterOptions): Product[] {
  return products.filter((product) => {
    // Category filter
    if (
      options.categorySlug &&
      options.categorySlug !== "all" &&
      product.categorySlug !== options.categorySlug
    ) {
      return false;
    }

    // Format filter
    if (options.format && options.format !== "all") {
      if (options.format === "printed") {
        if (!product.formats.includes("printed")) return false;
      } else if (options.format === "digital") {
        const hasPdf = product.formats.includes("pdf");
        const hasVideo = product.formats.includes("video");
        
        if (!hasPdf && !hasVideo) return false;

        // Sub-filter for digital type
        if (options.digitalType && options.digitalType !== "all") {
          if (options.digitalType === "pdf" && !hasPdf) return false;
          if (options.digitalType === "video" && !hasVideo) return false;
        }
      }
    }

    if (options.featured && !product.featured) return false;
    if (options.newArrival && !product.newArrival) return false;

    return true;
  });
}
