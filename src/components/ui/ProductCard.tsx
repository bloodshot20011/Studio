"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <article className="flex flex-col">
        {/* Image wrapper */}
        <div className="relative overflow-hidden bg-surface-container-low mb-4 aspect-[4/5]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500" />

          {/* View badge */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
            <span className="bg-surface text-primary px-6 py-2 font-label-md text-label-md border border-secondary uppercase tracking-widest text-sm shadow-lg">
              View Design
            </span>
          </div>

          {/* New Arrival badge */}
          {product.newArrival && (
            <div className="absolute top-3 left-3">
              <span className="bg-secondary text-white px-3 py-1 font-label-sm text-label-sm uppercase tracking-widest text-[10px]">
                New
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex justify-between items-start px-1">
          <div className="flex-1 min-w-0 pr-4">
            <span className="block font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-1 truncate">
              {product.category}
            </span>
            <h2 className="font-headline-md text-headline-md text-primary leading-tight group-hover:text-secondary transition-colors duration-300">
              {product.name}
            </h2>
          </div>
          <span className="font-label-sm text-label-sm text-outline flex-shrink-0 mt-1">
            #{product.code}
          </span>
        </div>
      </article>
    </Link>
  );
}
