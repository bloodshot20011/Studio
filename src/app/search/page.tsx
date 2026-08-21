"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/ui/ProductGrid";
import { useProducts } from "@/lib/useProducts";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
    setDebouncedQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      const newSearchParams = new URLSearchParams(searchParams.toString());
      if (query.trim()) {
        newSearchParams.set("q", query.trim());
      } else {
        newSearchParams.delete("q");
      }
      const next = newSearchParams.toString();
      const current = searchParams.toString();
      if (next !== current) {
        router.replace(next ? `/search?${next}` : "/search");
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, router, searchParams]);

  const products = useProducts();
  const term = debouncedQuery.trim().toLowerCase();
  const filteredProducts = !term
    ? products
    : products.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term) ||
          product.categorySlug.toLowerCase().includes(term) ||
          product.code.toLowerCase().includes(term) ||
          product.tags?.some((t) => t.toLowerCase().includes(term))
      );

  return (
    <>
      <header className="mb-gutter max-w-3xl mx-auto text-center pt-8 px-margin-mobile md:px-margin-desktop">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-6">
          Discover Design
        </h1>
        <div className="relative w-full group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline/60">
            search
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-surface-container-low border-0 border-b border-outline/30 focus:ring-0 focus:border-secondary py-4 pl-12 pr-4 font-body-lg text-body-lg text-on-surface placeholder:text-outline/50 transition-colors outline-none"
            placeholder="Search by name, category, or design code (e.g. WED-001)..."
          />
        </div>
        <div className="mt-4 flex justify-center">
          <span className="inline-flex items-center px-3 py-1 border border-secondary font-label-sm text-label-sm text-secondary bg-surface-container-low/50 uppercase tracking-widest">
            {filteredProducts.length} {filteredProducts.length === 1 ? "design" : "designs"} found
          </span>
        </div>
      </header>

      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : debouncedQuery ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-surface-container-low border border-outline/10">
            <span className="material-symbols-outlined text-[48px] text-outline/30 mb-6">search_off</span>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">No designs found</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mb-8">
              We couldn&apos;t find anything matching &ldquo;{debouncedQuery}&rdquo;. Try searching by
              product name, category, or design code.
            </p>
            <Link
              href="/collections"
              className="font-label-md text-label-md px-6 py-3 bg-primary-container text-on-primary border border-secondary hover:bg-primary transition-colors duration-300 uppercase tracking-widest"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <span className="material-symbols-outlined text-[48px] text-outline/30 mb-6">search</span>
            <h2 className="font-headline-md text-headline-md text-primary mb-4">Start Searching</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
              Search our catalogue by product name, occasion, category, or design code.
            </p>
          </div>
        )}
      </section>
    </>
  );
}

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-[100px] flex flex-col min-h-screen">
        <Suspense
          fallback={
            <div className="flex justify-center py-32">
              <span className="material-symbols-outlined animate-spin text-4xl text-secondary">
                refresh
              </span>
            </div>
          }
        >
          <SearchContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
