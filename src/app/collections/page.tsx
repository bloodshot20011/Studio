"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/ui/ProductGrid";
import ProductCard from "@/components/ui/ProductCard";
import CategoryNavigation from "@/components/ui/CategoryNavigation";
import SectionHeading from "@/components/ui/SectionHeading";
import FormatFilter, { FormatFilterValue, DigitalTypeFilterValue } from "@/components/ui/FormatFilter";
import { useProducts } from "@/lib/useProducts";

function CollectionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read URL query params
  const formatParam = (searchParams.get("format") as FormatFilterValue) || "all";
  const typeParam = (searchParams.get("type") as DigitalTypeFilterValue) || "all";
  const categoryParam = searchParams.get("category") || "all";
  const featuredParam = searchParams.get("featured") === "true";
  const newArrivalParam = searchParams.get("newArrival") === "true";

  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [activeFormat, setActiveFormat] = useState<FormatFilterValue>(formatParam);
  const [activeDigitalType, setActiveDigitalType] = useState<DigitalTypeFilterValue>(typeParam);
  const [showFeatured, setShowFeatured] = useState(featuredParam);
  const [showNewArrivals, setShowNewArrivals] = useState(newArrivalParam);

  // Sync state when URL params change (e.g. browser back/forward or direct navigation)
  useEffect(() => {
    setActiveCategory(searchParams.get("category") || "all");
    setActiveFormat((searchParams.get("format") as FormatFilterValue) || "all");
    setActiveDigitalType((searchParams.get("type") as DigitalTypeFilterValue) || "all");
    setShowFeatured(searchParams.get("featured") === "true");
    setShowNewArrivals(searchParams.get("newArrival") === "true");
  }, [searchParams]);

  // Helper to update URL params cleanly
  const updateQueryParams = (newParams: {
    category?: string;
    format?: FormatFilterValue;
    type?: DigitalTypeFilterValue;
    featured?: boolean;
    newArrival?: boolean;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newParams.category !== undefined) {
      if (newParams.category === "all") params.delete("category");
      else params.set("category", newParams.category);
    }

    if (newParams.format !== undefined) {
      if (newParams.format === "all") {
        params.delete("format");
        params.delete("type");
      } else {
        params.set("format", newParams.format);
        if (newParams.format !== "digital") {
          params.delete("type");
        }
      }
    }

    if (newParams.type !== undefined) {
      if (newParams.type === "all") params.delete("type");
      else params.set("type", newParams.type);
    }

    if (newParams.featured !== undefined) {
      if (!newParams.featured) params.delete("featured");
      else params.set("featured", "true");
    }

    if (newParams.newArrival !== undefined) {
      if (!newParams.newArrival) params.delete("newArrival");
      else params.set("newArrival", "true");
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newUrl, { scroll: false });
  };

  const handleCategorySelect = (categorySlug: string) => {
    setActiveCategory(categorySlug);
    updateQueryParams({ category: categorySlug });
  };

  const handleFormatChange = (format: FormatFilterValue) => {
    setActiveFormat(format);
    if (format !== "digital") {
      setActiveDigitalType("all");
      updateQueryParams({ format, type: "all" });
    } else {
      updateQueryParams({ format });
    }
  };

  const handleDigitalTypeChange = (type: DigitalTypeFilterValue) => {
    setActiveDigitalType(type);
    updateQueryParams({ type });
  };

  const handleClearFilters = () => {
    setActiveCategory("all");
    setActiveFormat("all");
    setActiveDigitalType("all");
    setShowFeatured(false);
    setShowNewArrivals(false);
    router.push(pathname, { scroll: false });
  };

  const isFiltered =
    activeCategory !== "all" ||
    activeFormat !== "all" ||
    activeDigitalType !== "all" ||
    showFeatured ||
    showNewArrivals;

  const allProducts = useProducts();

  const filteredProducts = allProducts.filter((product) => {
    if (activeCategory && activeCategory !== "all" && product.categorySlug !== activeCategory) {
      return false;
    }
    if (activeFormat && activeFormat !== "all") {
      if (activeFormat === "printed" && !product.formats.includes("printed")) return false;
      if (activeFormat === "digital") {
        const hasPdf = product.formats.includes("pdf");
        const hasVideo = product.formats.includes("video");
        if (!hasPdf && !hasVideo) return false;
        if (activeDigitalType === "pdf" && !hasPdf) return false;
        if (activeDigitalType === "video" && !hasVideo) return false;
      }
    }
    if (showFeatured && !product.featured) return false;
    if (showNewArrivals && !product.newArrival) return false;
    return true;
  });

  const featuredProducts = allProducts.filter((p) => p.featured).slice(0, 3);
  const newArrivalProducts = allProducts.filter((p) => p.newArrival).slice(0, 3);
  const showHighlightSections = !isFiltered;

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-[100px]">
        {/* Header Banner */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center">
          <span className="block font-label-md text-label-md text-secondary uppercase tracking-[0.15em] mb-3">
            Designed for Every Occasion
          </span>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-6">
            Kashvi Cards
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Discover our meticulously curated selection of bespoke stationery and fine invitations.
            Available in printed, PDF, and video formats.
          </p>
        </section>

        {/* Sticky Filters Section */}
        <section className="sticky top-[80px] z-40 bg-surface/95 backdrop-blur-sm border-y border-outline/10 py-4 mb-12 shadow-sm">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col gap-6">
            {/* Occasions Category Navigation */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-outline/10 pb-4">
              <CategoryNavigation
                activeSlug={activeCategory}
                onSelect={handleCategorySelect}
                mode="filter"
              />

              <div className="flex items-center gap-6 flex-shrink-0">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={showNewArrivals}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setShowNewArrivals(checked);
                      if (checked) setShowFeatured(false);
                      updateQueryParams({ newArrival: checked, featured: false });
                    }}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                      showNewArrivals ? "border-secondary" : "border-outline group-hover:border-secondary"
                    }`}
                  >
                    {showNewArrivals && <div className="w-2 h-2 bg-secondary" />}
                  </div>
                  <span
                    className={`font-label-sm text-label-sm uppercase tracking-widest ${
                      showNewArrivals ? "text-primary" : "text-on-surface-variant group-hover:text-primary"
                    }`}
                  >
                    New Arrivals
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={showFeatured}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setShowFeatured(checked);
                      if (checked) setShowNewArrivals(false);
                      updateQueryParams({ featured: checked, newArrival: false });
                    }}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 border flex items-center justify-center transition-colors ${
                      showFeatured ? "border-secondary" : "border-outline group-hover:border-secondary"
                    }`}
                  >
                    {showFeatured && <div className="w-2 h-2 bg-secondary" />}
                  </div>
                  <span
                    className={`font-label-sm text-label-sm uppercase tracking-widest ${
                      showFeatured ? "text-primary" : "text-on-surface-variant group-hover:text-primary"
                    }`}
                  >
                    Featured
                  </span>
                </label>
              </div>
            </div>

            {/* Format System Filter (Printed / Digital / PDF / Video) */}
            <FormatFilter
              activeFormat={activeFormat}
              activeDigitalType={activeDigitalType}
              onFormatChange={handleFormatChange}
              onDigitalTypeChange={handleDigitalTypeChange}
              totalResultsCount={filteredProducts.length}
              onClearFilters={handleClearFilters}
              isFiltered={isFiltered}
            />
          </div>
        </section>

        {/* Highlight Curated Sections when no specific filters are applied */}
        {showHighlightSections && (
          <>
            <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
              <div className="flex justify-between items-end mb-10">
                <SectionHeading eyebrow="Curated Selection" title="Featured Designs" />
                <button
                  type="button"
                  onClick={() => {
                    setShowFeatured(true);
                    setShowNewArrivals(false);
                    setActiveCategory("all");
                    updateQueryParams({ featured: true, newArrival: false, category: "all" });
                  }}
                  className="hidden md:flex font-label-md text-label-md uppercase tracking-widest text-primary border-b border-secondary pb-1 hover:text-secondary transition-colors items-center gap-2"
                >
                  View All Featured
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {featuredProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.15 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </section>

            <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
              <div className="flex justify-between items-end mb-10">
                <SectionHeading eyebrow="Just Added" title="New Arrivals" />
                <button
                  type="button"
                  onClick={() => {
                    setShowNewArrivals(true);
                    setShowFeatured(false);
                    setActiveCategory("all");
                    updateQueryParams({ newArrival: true, featured: false, category: "all" });
                  }}
                  className="hidden md:flex font-label-md text-label-md uppercase tracking-widest text-primary border-b border-secondary pb-1 hover:text-secondary transition-colors items-center gap-2"
                >
                  View All New
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                {newArrivalProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.15 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </section>

            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-12">
              <div className="w-full h-[0.5px] bg-outline/20" />
            </div>
          </>
        )}

        {/* Main Filtered Product Grid & Empty State */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
          {showHighlightSections && (
            <SectionHeading
              eyebrow="Full Catalogue"
              title="All Designs"
              className="mb-10"
            />
          )}

          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="text-center py-20 px-6 bg-surface-container-low border border-outline/10 max-w-xl mx-auto">
              <span className="material-symbols-outlined text-4xl text-outline mb-4">inventory_2</span>
              <h3 className="font-headline-md text-headline-md text-primary mb-2">No designs found</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-8">
                Try adjusting your category or format filters to find what you are looking for.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="btn-primary"
                >
                  View All Designs
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleClearFilters();
                    handleFormatChange("digital");
                  }}
                  className="btn-secondary"
                >
                  Explore Digital Invitations
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <CollectionsContent />
    </Suspense>
  );
}
