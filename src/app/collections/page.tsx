"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/ui/ProductGrid";
import ProductCard from "@/components/ui/ProductCard";
import CategoryNavigation from "@/components/ui/CategoryNavigation";
import SectionHeading from "@/components/ui/SectionHeading";
import { filterProducts, getFeaturedProducts, getNewArrivals } from "@/lib/products";

export default function CollectionsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [showFeatured, setShowFeatured] = useState(false);
  const [showNewArrivals, setShowNewArrivals] = useState(false);

  const filteredProducts = filterProducts({
    categorySlug: activeCategory,
    featured: showFeatured || undefined,
    newArrival: showNewArrivals || undefined,
  });

  const featuredProducts = getFeaturedProducts(3);
  const newArrivalProducts = getNewArrivals(3);
  const showHighlightSections = activeCategory === "all" && !showFeatured && !showNewArrivals;

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-[100px]">
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center">
          <span className="block font-label-md text-label-md text-secondary uppercase tracking-[0.15em] mb-4">
            Our Collection
          </span>
          <h1 className="hidden md:block font-display-lg text-display-lg text-primary mb-6">
            Designed for Every Occasion
          </h1>
          <h1 className="md:hidden font-display-lg-mobile text-display-lg-mobile text-primary mb-6">
            Designed for Every Occasion
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Discover our meticulously curated selection of bespoke stationery and fine invitations. Each
            piece represents a harmonious blend of heritage craftsmanship and modern editorial elegance.
          </p>
        </section>

        <section className="sticky top-[80px] z-40 bg-surface/95 backdrop-blur-sm border-y border-outline/10 py-4 mb-12">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row items-center justify-between gap-4">
            <CategoryNavigation
              activeSlug={activeCategory}
              onSelect={setActiveCategory}
              mode="filter"
            />

            <div className="flex items-center gap-6 flex-shrink-0">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={showNewArrivals}
                  onChange={(e) => {
                    setShowNewArrivals(e.target.checked);
                    if (e.target.checked) setShowFeatured(false);
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
                    setShowFeatured(e.target.checked);
                    if (e.target.checked) setShowNewArrivals(false);
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
        </section>

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
            <div className="text-center py-20 bg-surface-container-low border border-outline/10">
              <span className="material-symbols-outlined text-4xl text-outline mb-4">inventory_2</span>
              <p className="font-headline-md text-primary mb-4">No designs found</p>
              <p className="font-body-md text-on-surface-variant mb-8">
                Try adjusting your filters or browse all collections.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory("all");
                  setShowFeatured(false);
                  setShowNewArrivals(false);
                }}
                className="btn-secondary"
              >
                View All Designs
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
