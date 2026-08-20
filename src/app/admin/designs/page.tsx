"use client";

import { useState } from "react";
import Link from "next/link";
import { products as initialProducts } from "@/data/products";
import { categories } from "@/data/categories";
import { Product, FormatType } from "@/types";

export default function AdminDesignsPage() {
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("all");

  const filteredProducts = productList.filter((product) => {
    // Search query
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase();
      const matches =
        product.name.toLowerCase().includes(term) ||
        product.code.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);
      if (!matches) return false;
    }

    // Category filter
    if (selectedCategory !== "all" && product.categorySlug !== selectedCategory) {
      return false;
    }

    // Format filter
    if (selectedFormat !== "all") {
      if (!product.formats.includes(selectedFormat as FormatType)) return false;
    }

    return true;
  });

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this design?")) {
      setProductList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleToggleFeatured = (id: string) => {
    setProductList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
  };

  return (
    <div className="max-w-container-max mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display-lg-mobile md:font-display-lg text-primary text-display-lg-mobile md:text-display-lg">
            Manage Designs ({filteredProducts.length})
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Browse, search, edit, or feature invitation card designs.
          </p>
        </div>

        <Link href="/admin/designs/new" className="btn-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">add_circle</span>
          Add New Design
        </Link>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-surface-container-low p-4 border border-outline/15 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or code..."
            className="w-full pl-9 pr-4 py-2 bg-surface border border-outline/20 text-sm focus:border-secondary outline-none"
          />
        </div>

        {/* Category & Format Selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="Filter by Category"
            className="px-3 py-2 bg-surface border border-outline/20 font-label-sm text-label-sm uppercase tracking-wider text-primary outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            aria-label="Filter by Format"
            className="px-3 py-2 bg-surface border border-outline/20 font-label-sm text-label-sm uppercase tracking-wider text-primary outline-none cursor-pointer"
          >
            <option value="all">All Formats</option>
            <option value="printed">Printed</option>
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
          </select>

          {(selectedCategory !== "all" || selectedFormat !== "all" || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSelectedFormat("all");
                setSearchQuery("");
              }}
              className="text-secondary font-label-sm text-label-sm uppercase tracking-widest hover:text-primary underline ml-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Designs Table */}
      <div className="bg-surface-container-lowest border border-outline/15 overflow-hidden shadow-sm">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline/15 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  <th className="py-3.5 px-5 font-semibold">Design</th>
                  <th className="py-3.5 px-5 font-semibold">Code</th>
                  <th className="py-3.5 px-5 font-semibold">Category</th>
                  <th className="py-3.5 px-5 font-semibold">Formats</th>
                  <th className="py-3.5 px-5 font-semibold">Featured</th>
                  <th className="py-3.5 px-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md text-on-surface divide-y divide-outline/10">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 bg-surface-container-low border border-outline/20 overflow-hidden flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-headline-md text-sm text-primary block leading-tight">
                            {product.name}
                          </span>
                          <span className="text-xs text-on-surface-variant">
                            {product.tags?.join(", ")}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-label-sm text-label-sm text-outline">
                      #{product.code}
                    </td>
                    <td className="py-3.5 px-5">{product.category}</td>
                    <td className="py-3.5 px-5">
                      <div className="flex flex-wrap gap-1">
                        {product.formats.map((fmt) => (
                          <span
                            key={fmt}
                            className="px-2 py-0.5 text-[10px] font-label-sm uppercase tracking-wider bg-surface border border-outline/20 text-secondary"
                          >
                            {fmt}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(product.id)}
                        className={`px-3 py-1 text-[11px] font-label-sm uppercase tracking-wider border transition-colors ${
                          product.featured
                            ? "bg-secondary text-white border-secondary"
                            : "bg-surface text-on-surface-variant border-outline/30 hover:border-secondary"
                        }`}
                      >
                        {product.featured ? "Yes (Featured)" : "No"}
                      </button>
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-1">
                      <Link
                        href={`/admin/designs/${product.id}/edit`}
                        className="text-on-surface-variant hover:text-primary p-1.5 inline-block"
                        title="Edit Design"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </Link>
                      <Link
                        href={`/product/${product.slug}`}
                        target="_blank"
                        className="text-on-surface-variant hover:text-primary p-1.5 inline-block"
                        title="Preview"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-error hover:text-error-container p-1.5 inline-block"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">search_off</span>
            <p className="font-headline-md text-primary mb-1">No designs found</p>
            <p className="font-body-md text-on-surface-variant">
              Try changing your search terms or filter selection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
