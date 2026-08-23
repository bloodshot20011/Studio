import { Product, FormatType } from "@/types";
import { products as initialProducts } from "@/data/products";
import { createClient } from "@/lib/supabase/client";

const CATEGORY_PREFIX_MAP: Record<string, string> = {
  wedding: "WED",
  birthday: "BIR",
  "baby-shower": "BAB",
  "griha-pravesh": "GRI",
  "shop-opening": "SHO",
  retirement: "RET",
  "visiting-cards": "VIS",
  "gift-envelopes": "GIF",
  others: "OTH",
};

// Event listener subscribers for real-time reactivity
type ProductsListener = (products: Product[]) => void;
const listeners: Set<ProductsListener> = new Set();
let cachedProducts: Product[] = [];
let isSeeding = false;

export function subscribeProducts(listener: ProductsListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifySubscribers(products: Product[]) {
  cachedProducts = products;
  listeners.forEach((callback) => {
    try {
      callback(products);
    } catch (e) {
      console.error("Error notifying product listener:", e);
    }
  });
}

function generateValidUUID(): string {
  if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Returns current cached products or initial fallbacks synchronously
 */
export function getStoredProducts(): Product[] {
  if (cachedProducts.length > 0) return cachedProducts;
  return initialProducts;
}

/**
 * Auto-seeds initial static catalog into Supabase DB ONCE if database is completely empty.
 */
async function seedInitialProductsIfEmpty(supabase: any) {
  if (isSeeding) return;
  isSeeding = true;

  try {
    const seedRows = initialProducts.map((p) => ({
      id: generateValidUUID(),
      slug: p.slug,
      name: p.name,
      code: p.code,
      category: p.category,
      category_slug: p.categorySlug,
      description: p.description,
      image: p.image,
      gallery: p.gallery || [p.image],
      formats: p.formats.filter((f) => f !== ("pdf" as any)),
      featured: p.featured,
      new_arrival: p.newArrival,
      tags: p.tags || [],
    }));

    const { error } = await supabase.from("products").insert(seedRows);
    if (error) {
      console.warn("Auto-seeding notice:", error.message);
    } else {
      console.log("Successfully seeded initial designs into Supabase DB!");
    }
  } catch (e) {
    console.error("Error seeding initial products:", e);
  } finally {
    isSeeding = false;
  }
}

/**
 * Asynchronously pulls all product rows from Supabase DB as the SINGLE SOURCE OF TRUTH.
 */
export async function syncProductsFromSupabase(): Promise<Product[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetch notice:", error.message || error);
    }

    if (!error && Array.isArray(data)) {
      if (data.length === 0 && !isSeeding) {
        await seedInitialProductsIfEmpty(supabase);
        return syncProductsFromSupabase();
      }

      const dbProducts: Product[] = data.map((item: any) => {
        const rawFormats: FormatType[] = Array.isArray(item.formats)
          ? item.formats.filter((f: string) => f === "printed" || f === "pdf" || f === "video")
          : ["printed"];
        const videoUrl = item.video_url || item.videoUrl || item.digitalAssets?.video || "";

        if (videoUrl && !rawFormats.includes("video")) rawFormats.push("video");

        return {
          id: item.id || generateValidUUID(),
          slug: item.slug || `design-${item.code}`,
          name: item.name,
          code: item.code,
          category: item.category || "Wedding",
          categorySlug: item.category_slug || "wedding",
          description: item.description || "",
          image: item.image,
          gallery: item.gallery || [item.image],
          formats: rawFormats.length > 0 ? rawFormats : ["printed"],
          videoUrl,
          featured: Boolean(item.featured),
          newArrival: Boolean(item.new_arrival),
          tags: item.tags || [],
        };
      });

      notifySubscribers(dbProducts);
      return dbProducts;
    }
  } catch (err) {
    console.warn("Supabase fetch exception:", err);
  }

  notifySubscribers(cachedProducts.length > 0 ? cachedProducts : initialProducts);
  return getStoredProducts();
}

/**
 * Suggests next available design code by category
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
 * Checks if a design code already exists
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
 * Adds a new product directly to Supabase DB as single source of truth.
 */
export async function addProductStore(newProduct: Omit<Product, "id">): Promise<Product> {
  const id = generateValidUUID();
  const fullProduct: Product = { ...newProduct, id };

  const payload: any = {
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
    featured: fullProduct.featured,
    new_arrival: fullProduct.newArrival,
    tags: fullProduct.tags || [],
  };

  if (fullProduct.videoUrl) {
    payload.video_url = fullProduct.videoUrl;
  }

  try {
    const supabase = createClient();

    // 1. Try upserting category into Supabase categories table
    try {
      await supabase.from("categories").upsert([
        {
          slug: fullProduct.categorySlug,
          name: fullProduct.category,
        },
      ]);
    } catch (catErr) {
      console.warn("Category upsert notice:", catErr);
    }

    // 2. Insert into products table
    let { error } = await supabase.from("products").insert([payload]);

    // Fallback if video_url column missing
    if (error && error.message?.includes("video_url")) {
      delete payload.video_url;
      const retry = await supabase.from("products").insert([payload]);
      error = retry.error;
    }

    // Fallback if foreign key constraint (products_category_slug_fkey) fails due to missing category row
    if (error && (error.code === "23503" || error.message?.includes("foreign key constraint"))) {
      console.warn("Category Foreign Key notice, falling back category_slug to 'wedding':", error.message);
      payload.category_slug = "wedding";
      const retryFk = await supabase.from("products").insert([payload]);
      error = retryFk.error;
    }

    // Fallback if duplicate design code (products_code_key 23505) occurs
    if (error && (error.code === "23505" || error.message?.includes("products_code_key") || error.message?.includes("unique constraint"))) {
      console.warn("Duplicate code detected in database, auto-generating next available code...");
      const allDb = await syncProductsFromSupabase();
      const freshSuggested = suggestDesignCodeByCategory(fullProduct.categorySlug, allDb);
      payload.code = freshSuggested;
      fullProduct.code = freshSuggested;
      const retryCode = await supabase.from("products").insert([payload]);
      error = retryCode.error;
    }

    if (error) {
      console.error("Supabase insert error details:", error);
      throw new Error(error.message || "Failed to insert product into Supabase");
    }

    await syncProductsFromSupabase();
  } catch (err: any) {
    console.error("Error adding product:", err);
    throw err;
  }

  return fullProduct;
}

/**
 * Updates an existing product directly in Supabase DB.
 */
export async function updateProductStore(id: string, updatedData: Partial<Product>): Promise<Product[]> {
  const target = cachedProducts.find((p) => p.id === id);
  const code = updatedData.code || target?.code;

  const payload: any = {
    name: updatedData.name,
    code: updatedData.code,
    category: updatedData.category,
    category_slug: updatedData.categorySlug,
    description: updatedData.description,
    image: updatedData.image,
    formats: updatedData.formats,
    featured: updatedData.featured,
    new_arrival: updatedData.newArrival,
    tags: updatedData.tags,
  };

  if (updatedData.videoUrl !== undefined) {
    payload.video_url = updatedData.videoUrl;
  }

  try {
    const supabase = createClient();

    // 1. Try upserting category into Supabase categories table
    if (updatedData.categorySlug && updatedData.category) {
      try {
        await supabase.from("categories").upsert([
          {
            slug: updatedData.categorySlug,
            name: updatedData.category,
          },
        ]);
      } catch (catErr) {
        console.warn("Category upsert notice:", catErr);
      }
    }

    // 2. Update products table
    let query = supabase.from("products").update(payload);
    if (code) {
      query = query.or(`id.eq.${id},code.eq.${code}`);
    } else {
      query = query.eq("id", id);
    }

    let { error } = await query;

    // Fallback if video_url column missing
    if (error && error.message?.includes("video_url")) {
      delete payload.video_url;
      let retryQuery = supabase.from("products").update(payload);
      if (code) {
        retryQuery = retryQuery.or(`id.eq.${id},code.eq.${code}`);
      } else {
        retryQuery = retryQuery.eq("id", id);
      }
      const retry = await retryQuery;
      error = retry.error;
    }

    // Fallback if foreign key constraint (products_category_slug_fkey) fails
    if (error && (error.code === "23503" || error.message?.includes("foreign key constraint"))) {
      console.warn("Category Foreign Key notice, falling back category_slug to 'wedding':", error.message);
      payload.category_slug = "wedding";
      let retryFkQuery = supabase.from("products").update(payload);
      if (code) {
        retryFkQuery = retryFkQuery.or(`id.eq.${id},code.eq.${code}`);
      } else {
        retryFkQuery = retryFkQuery.eq("id", id);
      }
      const retryFk = await retryFkQuery;
      error = retryFk.error;
    }

    if (error) {
      console.error("Supabase update error details:", error);
      throw new Error(error.message || "Failed to update product in Supabase");
    }

    return await syncProductsFromSupabase();
  } catch (err: any) {
    console.error("Error updating product:", err);
    throw err;
  }
}

/**
 * Deletes a product directly from Supabase DB permanently by both ID and Design Code.
 */
export async function deleteProductStore(id: string): Promise<Product[]> {
  try {
    const supabase = createClient();
    const target = cachedProducts.find((p) => p.id === id);
    const code = target?.code || "";

    let query = supabase.from("products").delete();
    if (code) {
      query = query.or(`id.eq.${id},code.eq.${code}`);
    } else {
      query = query.eq("id", id);
    }

    const { error } = await query;

    if (error) {
      console.error("Supabase delete error details:", error);
      throw new Error(error.message || "Failed to delete product from Supabase");
    }

    return await syncProductsFromSupabase();
  } catch (err: any) {
    console.error("Error deleting product:", err);
    throw err;
  }
}
