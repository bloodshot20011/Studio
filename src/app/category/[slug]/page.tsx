"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/ui/ProductGrid";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CategoryNavigation from "@/components/ui/CategoryNavigation";
import { categories } from "@/data/categories";
import { getProductsByCategory } from "@/lib/products";

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug as string;

  const category = categories.find((c) => c.slug === categorySlug);
  const categoryProducts = getProductsByCategory(categorySlug);

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

        <section className="py-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center border-b border-outline/10 mb-12">
          <h1 className="font-display-lg-mobile md:font-display-lg text-primary mb-6">
            {category.name} Collection
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            {category.description ||
              `Explore our beautiful collection of ${category.name} designs, crafted with precision and elegance.`}
          </p>
        </section>

        <section className="sticky top-[80px] z-30 bg-surface/95 backdrop-blur-sm border-b border-outline/10 py-4 mb-12">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <CategoryNavigation activeSlug={categorySlug} mode="link" />
          </div>
        </section>

        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
          {categoryProducts.length > 0 ? (
            <ProductGrid products={categoryProducts} />
          ) : (
            <div className="text-center py-20 bg-surface-container-low border border-outline/10">
              <span className="material-symbols-outlined text-4xl text-outline mb-4">inventory_2</span>
              <p className="font-headline-md text-primary mb-2">No designs yet</p>
              <p className="font-body-md text-on-surface-variant max-w-md mx-auto mb-8">
                We are currently crafting new designs for our {category.name} collection. Please check
                back later or explore our other collections.
              </p>
              <Link href="/collections" className="btn-secondary">
                View All Designs
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
