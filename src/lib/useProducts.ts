"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { getStoredProducts, subscribeProducts, syncProductsFromSupabase } from "@/lib/productStore";

/**
 * Custom React hook that provides reactive product list.
 * Automatically pulls latest products from Supabase DB on mount and updates
 * UI in real-time whenever additions, edits, or deletions occur.
 */
export function useProducts(): Product[] {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // 1. Initial read from local storage / fallback
    const initial = getStoredProducts();
    setProducts(initial);

    // 2. Fetch fresh data from Supabase DB
    syncProductsFromSupabase().then((latest) => {
      if (Array.isArray(latest) && latest.length >= 0) {
        setProducts(latest);
      }
    });

    // 3. Subscribe to real-time store changes
    const unsubscribe = subscribeProducts((updated) => {
      setProducts(updated);
    });

    return () => unsubscribe();
  }, []);

  return products;
}
