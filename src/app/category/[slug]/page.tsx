"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/ui/ProductGrid";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CategoryNavigation from "@/components/ui/CategoryNavigation";
import FormatFilter, { FormatFilterValue, DigitalTypeFilterValue } from "@/components/ui/FormatFilter";
import { categories } from "@/data/categories";
import { useProducts } from "@/lib/useProducts";

function CategoryContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const categorySlug = params.slug as string;
  const category = categories.find((c) => c.slug === categorySlug);

  const formatParam = (searchParams.get("format") as FormatFilterValue) || "all";
  const typeParam = (searchParams.get("type") as DigitalTypeFilterValue) || "all";

  const [activeFormat, setActiveFormat] = useState<FormatFilterValue>(formatParam);
  const [activeDigitalType, setActiveDigitalType] = useState<DigitalTypeFilterValue>(typeParam);

  useEffect(() => {
    setActiveFormat((searchParams.get("format") as FormatFilterValue) || "all");
    setActiveDigitalType((searchParams.get("type") as DigitalTypeFilterValue) || "all");
  }, [searchParams]);

  const updateQueryParams = (newParams: {
    format?: FormatFilterValue;
    type?: DigitalTypeFilterValue;
  }) => {
    const qParams = new URLSearchParams(searchParams.toString());

    if (newParams.format !== undefined) {
      if (newParams.format === "all") {
        qParams.delete("format");
        qParams.delete("type");
      } else {
        qParams.set("format", newParams.format);
        if (newParams.format !== "digital") {
          qParams.delete("type");
        }
      }
    }

    if (newParams.type !== undefined) {
      if (newParams.type === "all") qParams.delete("type");
      else qParams.set("type", newParams.type);
    }

    const queryString = qParams.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newUrl, { scroll: false });
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
    setActiveFormat("all");
    setActiveDigitalType("all");
    router.push(pathname, { scroll: false });
  };

  const isFiltered = activeFormat !== "all" || activeDigitalType !== "all";

  const allProducts = useProducts();

  const categoryProducts = allProducts.filter((product) => {
    if (product.categorySlug !== categorySlug) return false;
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
    return true;
  });

  if (!category) {
    return (
      <>
        <Navbar />
        <main className="flex-grow pt-36 pb-section-gap flex flex-col items-center justify-center min-h-screen">
          <h1 className="font-headline-lg text-primary mb-4">Category Not Found</h1>
          <Link href="/collections" className="btn-primary">
            Back to Collections
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-[100px]">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mt-8 mb-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Collections", href: "/collections" },
              { label: category.name },
            ]}
          />
        </div>

        {/* Hero Category Info */}
        <section className="py-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center border-b border-outline/10 mb-12">
          <h1 className="font-display-lg-mobile md:font-display-lg text-primary mb-6">
            {category.name} Collection
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            {category.description ||
              `Explore our beautiful collection of ${category.name} designs, crafted with precision and elegance.`}
          </p>
        </section>

        {/* Sticky Filters Section */}
        <section className="sticky top-[80px] z-30 bg-surface/95 backdrop-blur-sm border-b border-outline/10 py-4 mb-12 shadow-sm">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col gap-6">
            <CategoryNavigation activeSlug={categorySlug} mode="link" />

            {/* Format System Filter (Printed / Digital / PDF / Video) */}
            <FormatFilter
              activeFormat={activeFormat}
              activeDigitalType={activeDigitalType}
              onFormatChange={handleFormatChange}
              onDigitalTypeChange={handleDigitalTypeChange}
              totalResultsCount={categoryProducts.length}
              onClearFilters={handleClearFilters}
              isFiltered={isFiltered}
            />
          </div>
        </section>

        {/* Product Grid & Empty State */}
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
          {categoryProducts.length > 0 ? (
            <ProductGrid products={categoryProducts} />
          ) : (
            <div className="text-center py-20 px-6 bg-surface-container-low border border-outline/10 max-w-xl mx-auto">
              <span className="material-symbols-outlined text-4xl text-outline mb-4">inventory_2</span>
              <h3 className="font-headline-md text-headline-md text-primary mb-2">No designs found</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mb-8">
                No matching designs found in the {category.name} collection for the selected format filter.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="btn-primary"
                >
                  View All {category.name} Designs
                </button>
                <Link href="/collections" className="btn-secondary">
                  Explore Other Collections
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <CategoryContent />
    </Suspense>
  );
}
