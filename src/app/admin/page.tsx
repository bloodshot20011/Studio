"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { getStoredProducts } from "@/lib/productStore";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

  const totalProducts = products.length;
  const weddingCount = products.filter((p) => p.categorySlug === "wedding").length;
  const digitalCount = products.filter(
    (p) => p.formats.includes("pdf") || p.formats.includes("video")
  ).length;
  const newArrivalsCount = products.filter((p) => p.newArrival).length;

  const recentProducts = products.slice(0, 6);

  return (
    <div className="max-w-container-max mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display-lg-mobile md:font-display-lg text-primary text-display-lg-mobile md:text-display-lg">
            Dashboard Overview
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Manage your Kashvi Cards catalogue, formats, and design showcase.
          </p>
        </div>

        <Link href="/admin/designs/new" className="btn-primary flex items-center gap-2 rounded-xl">
          <span className="material-symbols-outlined text-sm">add_circle</span>
          Add New Design
        </Link>
      </div>

      {/* Grid: Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest border border-outline/15 p-5 flex flex-col justify-between rounded-2xl shadow-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            Total Designs
          </span>
          <div className="mt-4 flex items-end justify-between">
            <span className="font-headline-lg text-headline-lg text-primary font-bold">
              {totalProducts}
            </span>
            <span className="material-symbols-outlined text-secondary text-3xl">auto_awesome_mosaic</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline/15 p-5 flex flex-col justify-between rounded-2xl shadow-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            Wedding Cards
          </span>
          <div className="mt-4 flex items-end justify-between">
            <span className="font-headline-lg text-headline-lg text-primary font-bold">
              {weddingCount}
            </span>
            <span className="material-symbols-outlined text-secondary text-3xl">celebration</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline/15 p-5 flex flex-col justify-between rounded-2xl shadow-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            Digital Formats
          </span>
          <div className="mt-4 flex items-end justify-between">
            <span className="font-headline-lg text-headline-lg text-primary font-bold">
              {digitalCount}
            </span>
            <span className="material-symbols-outlined text-secondary text-3xl">devices</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline/15 p-5 flex flex-col justify-between rounded-2xl shadow-sm">
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            New Arrivals
          </span>
          <div className="mt-4 flex items-end justify-between">
            <span className="font-headline-lg text-headline-lg text-primary font-bold">
              {newArrivalsCount}
            </span>
            <span className="material-symbols-outlined text-secondary text-3xl">fiber_new</span>
          </div>
        </div>
      </div>

      {/* Recent Products Table Section */}
      <div className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-headline-md text-headline-md text-primary">Recent Designs</h2>
          <Link
            href="/admin/designs"
            className="font-label-sm text-label-sm text-secondary hover:text-primary uppercase tracking-widest flex items-center gap-1 border-b border-secondary/50 pb-0.5"
          >
            View All ({products.length}) <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="bg-surface-container-lowest border border-outline/15 overflow-hidden shadow-sm rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline/15 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  <th className="py-3.5 px-5 font-semibold">Design</th>
                  <th className="py-3.5 px-5 font-semibold">Code</th>
                  <th className="py-3.5 px-5 font-semibold">Category</th>
                  <th className="py-3.5 px-5 font-semibold">Formats</th>
                  <th className="py-3.5 px-5 font-semibold">Status</th>
                  <th className="py-3.5 px-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md text-on-surface divide-y divide-outline/10">
                {recentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-surface-container-low border border-outline/20 overflow-hidden rounded-lg flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-medium text-primary block leading-tight">
                            {product.name}
                          </span>
                          <span className="text-xs text-on-surface-variant">
                            {product.tags?.slice(0, 2).join(", ")}
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
                            className="px-2 py-0.5 text-[10px] font-label-sm uppercase tracking-wider bg-surface border border-outline/20 text-secondary rounded-md"
                          >
                            {fmt}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      {product.featured ? (
                        <span className="px-2 py-0.5 text-[10px] font-label-sm uppercase tracking-wider bg-secondary/10 text-secondary border border-secondary/30 rounded-md">
                          Featured
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-label-sm uppercase tracking-wider bg-surface-container-low text-on-surface-variant rounded-md">
                          Standard
                        </span>
                      )}
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
                        title="View on site"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
