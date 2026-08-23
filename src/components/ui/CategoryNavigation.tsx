"use client";

import Link from "next/link";
import { categories } from "@/data/categories";

interface CategoryNavigationProps {
  activeSlug?: string;
  onSelect?: (slug: string) => void;
  mode?: "link" | "filter";
  className?: string;
}

export default function CategoryNavigation({
  activeSlug = "all",
  onSelect,
  mode = "filter",
  className = "",
}: CategoryNavigationProps) {
  const pillClass = (slug: string) =>
    `flex-shrink-0 font-label-sm text-label-sm uppercase tracking-widest px-5 py-2.5 rounded-full border transition-colors ${
      activeSlug === slug
        ? "border-secondary text-primary bg-surface-container-low"
        : "border-outline/20 text-on-surface-variant hover:border-secondary hover:text-primary"
    }`;

  return (
    <div className={`w-full overflow-x-auto no-scrollbar flex items-center gap-3 pb-2 md:pb-0 ${className}`}>
      {mode === "filter" ? (
        <button type="button" onClick={() => onSelect?.("all")} className={pillClass("all")}>
          All
        </button>
      ) : (
        <Link href="/collections" className={pillClass("all")}>
          All
        </Link>
      )}

      {categories.map((cat) =>
        mode === "filter" ? (
          <button
            key={cat.slug}
            type="button"
            onClick={() => onSelect?.(cat.slug)}
            className={pillClass(cat.slug)}
          >
            {cat.name}
          </button>
        ) : (
          <Link key={cat.slug} href={`/category/${cat.slug}`} className={pillClass(cat.slug)}>
            {cat.name}
          </Link>
        )
      )}
    </div>
  );
}
