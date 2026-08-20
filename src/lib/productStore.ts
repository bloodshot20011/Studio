import { Product } from "@/types";
import { products as initialProducts } from "@/data/products";
import { createClient } from "@/lib/supabase/client";

const LOCAL_STORAGE_KEY = "kashvi_cards_products_v2";

/**
 * Reads all products.
 * Priority: LocalStorage (persists client changes instantly) -> Fallback initialProducts.
 */
export function getStoredProducts(): Product[] {
  if (typeof window === "undefined") return initialProducts;
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading stored products:", e);
  }
  return initialProducts;
}

/**
 * Saves products array to localStorage.
 */
export function saveProductsToStorage(productsList: Product[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(productsList));
  } catch (e) {
    console.error("Error saving products:", e);
  }
}

/**
 * Adds a new product to storage and syncs to Supabase.
 */
export async function addProductStore(newProduct: Omit<Product, "id">): Promise<Product> {
  const currentList = getStoredProducts();
  const id = `card-${Date.now()}`;
  const fullProduct: Product = { ...newProduct, id };
  const updatedList = [fullProduct, ...currentList];

  saveProductsToStorage(updatedList);

  // Async sync to Supabase database
  try {
    const supabase = createClient();
    await supabase.from("products").insert([
      {
        slug: fullProduct.slug,
        name: fullProduct.name,
        code: fullProduct.code,
        category: fullProduct.category,
        category_slug: fullProduct.categorySlug,
        description: fullProduct.description,
        image: fullProduct.image,
        gallery: fullProduct.gallery || [fullProduct.image],
        formats: fullProduct.formats,
        featured: fullProduct.featured,
        new_arrival: fullProduct.newArrival,
        tags: fullProduct.tags || [],
      },
    ]);
  } catch (err) {
    console.warn("Supabase insert notice:", err);
  }

  return fullProduct;
}

/**
 * Updates an existing product in storage and syncs to Supabase.
 */
export async function updateProductStore(id: string, updatedData: Partial<Product>): Promise<Product[]> {
  const currentList = getStoredProducts();
  const updatedList = currentList.map((p) => (p.id === id ? { ...p, ...updatedData } : p));

  saveProductsToStorage(updatedList);

  const updatedProduct = updatedList.find((p) => p.id === id);
  if (updatedProduct) {
    try {
      const supabase = createClient();
      await supabase
        .from("products")
        .update({
          name: updatedProduct.name,
          code: updatedProduct.code,
          category: updatedProduct.category,
          category_slug: updatedProduct.categorySlug,
          description: updatedProduct.description,
          image: updatedProduct.image,
          formats: updatedProduct.formats,
          featured: updatedProduct.featured,
          new_arrival: updatedProduct.newArrival,
          tags: updatedProduct.tags,
        })
        .eq("code", updatedProduct.code);
    } catch (err) {
      console.warn("Supabase update notice:", err);
    }
  }

  return updatedList;
}

/**
 * Deletes a product from storage and syncs deletion to Supabase.
 */
export async function deleteProductStore(id: string): Promise<Product[]> {
  const currentList = getStoredProducts();
  const target = currentList.find((p) => p.id === id);
  const updatedList = currentList.filter((p) => p.id !== id);

  saveProductsToStorage(updatedList);

  if (target) {
    try {
      const supabase = createClient();
      await supabase.from("products").delete().eq("code", target.code);
    } catch (err) {
      console.warn("Supabase delete notice:", err);
    }
  }

  return updatedList;
}

/**
 * Resets all product changes back to initial state (optional utility).
 */
export function resetProductsStorage(): Product[] {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
  return initialProducts;
}
