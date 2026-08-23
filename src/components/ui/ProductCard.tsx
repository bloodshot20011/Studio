"use client";

import Link from "next/link";
import { Product, FormatType } from "@/types";

function formatBadgeText(formats: FormatType[] = []) {
  const order: FormatType[] = ["printed", "video"];
  const sorted = order.filter((f) => formats.includes(f));
  return sorted.map((f) => f.toUpperCase()).join(" · ");
}

export default function ProductCard({ product }: { product: Product }) {
  const hasVideo = product.formats.includes("video");
  const badgeText = formatBadgeText(product.formats);
  const hoverActionText = hasVideo ? "Preview Video" : "View Design";

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <article className="flex flex-col">
        {/* Image wrapper with smooth rounded corners */}
        <div className="relative overflow-hidden bg-surface-container-low mb-4 aspect-[4/5] rounded-2xl shadow-sm border border-outline/10 group-hover:border-secondary/30 transition-all duration-300">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/15 transition-colors duration-500" />

          {/* Video Play Overlay */}
          {hasVideo && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-surface/85 backdrop-blur-md text-primary flex items-center justify-center shadow-lg border border-secondary/40 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-surface">
                <span className="material-symbols-outlined text-[24px] ml-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
              </div>
            </div>
          )}

          {/* View / Preview action badge */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
            <span className="bg-surface/95 text-primary px-5 py-2 font-label-md text-label-md border border-secondary uppercase tracking-widest text-xs shadow-lg rounded-xl backdrop-blur-md">
              {hoverActionText}
            </span>
          </div>

          {/* Top Badges (New & Formats) */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none">
            {product.newArrival ? (
              <span className="bg-secondary text-white px-2.5 py-0.5 font-label-sm text-label-sm uppercase tracking-widest text-[10px] shadow-sm rounded-md">
                New
              </span>
            ) : (
              <div />
            )}

            {/* Format badge on top right */}
            {badgeText && (
              <span className="bg-surface/90 text-primary border border-outline/30 backdrop-blur-sm px-2.5 py-0.5 font-label-sm text-label-sm uppercase tracking-wider text-[10px] shadow-sm rounded-md">
                {badgeText}
              </span>
            )}
          </div>
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
