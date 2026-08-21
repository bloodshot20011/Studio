import { Product } from "@/types";
import { products as initialProducts } from "@/data/products";
import { createClient } from "@/lib/supabase/client";

const LOCAL_STORAGE_KEY = "kashvi_cards_products_v4";
const DELETED_CODES_KEY = "kashvi_cards_deleted_codes_v4";

const CATEGORY_PREFIX_MAP: Record<string, string> = {
  wedding: "WED",
  birthday: "BIR",
  mundan: "MUN",
  "griha-pravesh": "GRI",
  "shop-opening": "SHO",
  retirement: "RET",
  "visiting-cards": "VIS",
  "letter-pads": "LET",
  "gift-envelopes": "GIF",
};

// Event listener subscribers for real-time reactivity
type ProductsListener = (products: Product[]) => void;
const listeners: Set<ProductsListener> = new Set();

export function subscribeProducts(listener: ProductsListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifySubscribers(products: Product[]) {
  listeners.forEach((callback) => {
    try {
      callback(products);
    } catch (e) {
      console.error("Error notifying product listener:", e);
    }
  });
}

/**
 * Gets array of deleted product codes to prevent initial static fallback from resurrecting deleted cards.
 */
export function getDeletedCodes(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(DELETED_CODES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Records a deleted product code permanently.
 */
export function recordDeletedCode(code: string) {
  if (typeof window === "undefined") return;
  try {
    const current = getDeletedCodes();
    const clean = code.trim().toUpperCase();
    if (!current.includes(clean)) {
      const updated = [...current, clean];
      localStorage.setItem(DELETED_CODES_KEY, JSON.stringify(updated));
    }
  } catch (e) {
    console.error("Error recording deleted code:", e);
  }
}

/**
 * Reads all products.
 * Priority: LocalStorage -> Fallback filtered initialProducts (excluding deleted items).
 * Automatically triggers background sync with Supabase DB so changes cross-sync globally across all devices!
 */
export function getStoredProducts(): Product[] {
  if (typeof window === "undefined") return initialProducts;
  const deletedCodes = getDeletedCodes();
  const cleanInitial = initialProducts.filter(
    (p) => !deletedCodes.includes(p.code.trim().toUpperCase())
  );

  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length >= 0) {
        // Trigger background sync with Supabase DB
        syncProductsFromSupabase();
        return parsed.filter((p: Product) => !deletedCodes.includes(p.code.trim().toUpperCase()));
      }
    }
  } catch (e) {
    console.error("Error reading stored products:", e);
  }

  // Trigger background sync with Supabase DB
  syncProductsFromSupabase();
  return cleanInitial;
}

/**
 * Asynchronously pulls all product rows from Supabase DB to sync changes globally across all devices.
 */
export async function syncProductsFromSupabase(): Promise<Product[]> {
  if (typeof window === "undefined") return initialProducts;
  const deletedCodes = getDeletedCodes();

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });

    if (!error && Array.isArray(data)) {
      const dbProducts: Product[] = data
        .map((item: any) => ({
          id: item.id || `card-${item.code}`,
          slug: item.slug || `design-${item.code}`,
          name: item.name,
          code: item.code,
          category: item.category || "Wedding",
          categorySlug: item.category_slug || "wedding",
          description: item.description || "",
          image: item.image,
          gallery: item.gallery || [item.image],
          formats: item.formats || ["printed"],
          videoUrl: item.video_url || item.videoUrl || item.digitalAssets?.video || "",
          featured: Boolean(item.featured),
          newArrival: Boolean(item.new_arrival),
          tags: item.tags || [],
        }))
        .filter((p) => !deletedCodes.includes(p.code.trim().toUpperCase()));

      // Merge Supabase DB items with initial static catalogue (excluding deleted ones)
      const codeSet = new Set([
        ...dbProducts.map((p) => p.code.trim().toUpperCase()),
        ...deletedCodes,
      ]);

      const fallbackList = initialProducts.filter(
        (p) => !codeSet.has(p.code.trim().toUpperCase())
      );
      const combinedList = [...dbProducts, ...fallbackList];

      saveProductsToStorage(combinedList);
      notifySubscribers(combinedList);
      return combinedList;
    }
  } catch (err) {
    console.warn("Supabase fetch notice:", err);
  }
  return getStoredProducts();
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
 * Suggests the next available design code based on occasion category (e.g. WED-007).
 */
export function suggestDesignCodeByCategory(
  categorySlug: string,
  existingList?: Product[]
): string {
  const products = existingList || getStoredProducts();
  const prefix = CATEGORY_PREFIX_MAP[categorySlug] || "CARD";

  const numbers: number[] = [];
  products.forEach((p) => {
    const cleanCode = p.code.trim().toUpperCase();
    if (cleanCode.startsWith(`${prefix}-`)) {
      const numStr = cleanCode.replace(`${prefix}-`, "");
      const num = parseInt(numStr, 10);
      if (!isNaN(num)) {
        numbers.push(num);
      }
    }
  });

  let nextNum = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  let candidate = `${prefix}-${String(nextNum).padStart(3, "0")}`;

  while (products.some((p) => p.code.trim().toUpperCase() === candidate.toUpperCase())) {
    nextNum++;
    candidate = `${prefix}-${String(nextNum).padStart(3, "0")}`;
  }

  return candidate;
}

/**
 * Checks if a design code already exists.
 * Returns duplicate flag and a suggested alternative code.
 */
export function checkDuplicateDesignCode(
  code: string,
  currentId?: string,
  categorySlug = "wedding"
): { isDuplicate: boolean; suggestedCode: string } {
  const products = getStoredProducts();
  const cleanCode = code.trim().toUpperCase();

  if (!cleanCode) {
    return { isDuplicate: false, suggestedCode: suggestDesignCodeByCategory(categorySlug, products) };
  }

  const isDuplicate = products.some(
    (p) => p.code.trim().toUpperCase() === cleanCode && p.id !== currentId
  );

  const suggestedCode = suggestDesignCodeByCategory(categorySlug, products);

  return {
    isDuplicate,
    suggestedCode,
  };
}

/**
 * Adds a new product to storage and syncs to Supabase DB.
 */
export async function addProductStore(newProduct: Omit<Product, "id">): Promise<Product> {
  const currentList = getStoredProducts();
  const id = `card-${Date.now()}`;
  const fullProduct: Product = { ...newProduct, id };
  const updatedList = [fullProduct, ...currentList];

  saveProductsToStorage(updatedList);
  notifySubscribers(updatedList);

  // Sync to Supabase database
  try {
    const supabase = createClient();
    await supabase.from("products").insert([
      {
        id: fullProduct.id,
        slug: fullProduct.slug,
        name: fullProduct.name,
        code: fullProduct.code,
        category: fullProduct.category,
        category_slug: fullProduct.categorySlug,
        description: fullProduct.description,
        image: fullProduct.image,
        gallery: fullProduct.gallery || [fullProduct.image],
        formats: fullProduct.formats,
        video_url: fullProduct.videoUrl || "",
        featured: fullProduct.featured,
        new_arrival: fullProduct.newArrival,
        tags: fullProduct.tags || [],
      },
    ]);
    // Trigger global re-sync
    syncProductsFromSupabase();
  } catch (err) {
    console.warn("Supabase insert notice:", err);
  }

  return fullProduct;
}

/**
 * Updates an existing product in storage and syncs to Supabase DB.
 */
export async function updateProductStore(id: string, updatedData: Partial<Product>): Promise<Product[]> {
  const currentList = getStoredProducts();
  const updatedList = currentList.map((p) => (p.id === id ? { ...p, ...updatedData } : p));

  saveProductsToStorage(updatedList);
  notifySubscribers(updatedList);

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
          video_url: updatedProduct.videoUrl || "",
          featured: updatedProduct.featured,
          new_arrival: updatedProduct.newArrival,
          tags: updatedProduct.tags,
        })
        .eq("code", updatedProduct.code);

      syncProductsFromSupabase();
    } catch (err) {
      console.warn("Supabase update notice:", err);
    }
  }

  return updatedList;
}

/**
 * Deletes a product from storage and syncs deletion to Supabase DB.
 */
export async function deleteProductStore(id: string): Promise<Product[]> {
  const currentList = getStoredProducts();
  const target = currentList.find((p) => p.id === id);
  const updatedList = currentList.filter((p) => p.id !== id);

  if (target) {
    recordDeletedCode(target.code);
    try {
      const supabase = createClient();
      await supabase.from("products").delete().eq("code", target.code);
    } catch (err) {
      console.warn("Supabase delete notice:", err);
    }
  }

  saveProductsToStorage(updatedList);
  notifySubscribers(updatedList);
  syncProductsFromSupabase();
  return updatedList;
}

/**
 * Resets all product changes back to initial state (optional utility).
 */
export function resetProductsStorage(): Product[] {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(DELETED_CODES_KEY);
  }
  notifySubscribers(initialProducts);
  return initialProducts;
}
