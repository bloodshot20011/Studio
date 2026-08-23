"use client";

import { motion, AnimatePresence } from "framer-motion";

export type FormatFilterValue = "all" | "printed" | "digital";

interface FormatFilterProps {
  activeFormat: FormatFilterValue;
  onFormatChange: (format: FormatFilterValue) => void;
  totalResultsCount: number;
  onClearFilters?: () => void;
  isFiltered?: boolean;
}

export default function FormatFilter({
  activeFormat,
  onFormatChange,
  totalResultsCount,
  onClearFilters,
  isFiltered = false,
}: FormatFilterProps) {
  const getResultCountText = () => {
    if (activeFormat === "printed") {
      return `${totalResultsCount} printed ${totalResultsCount === 1 ? "design" : "designs"}`;
    }
    if (activeFormat === "digital") {
      return `${totalResultsCount} video ${totalResultsCount === 1 ? "invitation" : "invitations"}`;
    }
    return `${totalResultsCount} ${totalResultsCount === 1 ? "design" : "designs"}`;
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Primary Format Filter Segmented Control */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-surface-container-low p-1 border border-outline/10 overflow-x-auto max-w-full no-scrollbar rounded-xl">
          <button
            type="button"
            aria-pressed={activeFormat === "all"}
            onClick={() => onFormatChange("all")}
            className={`px-4 py-2 font-label-sm text-label-sm uppercase tracking-widest transition-colors rounded-lg ${
              activeFormat === "all"
                ? "bg-primary text-white shadow-sm"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            All Designs
          </button>
          <button
            type="button"
            aria-pressed={activeFormat === "printed"}
            onClick={() => onFormatChange("printed")}
            className={`px-4 py-2 font-label-sm text-label-sm uppercase tracking-widest transition-colors rounded-lg ${
              activeFormat === "printed"
                ? "bg-primary text-white shadow-sm"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Printed Cards
          </button>
          <button
            type="button"
            aria-pressed={activeFormat === "digital"}
            onClick={() => onFormatChange("digital")}
            className={`px-4 py-2 font-label-sm text-label-sm uppercase tracking-widest transition-colors rounded-lg ${
              activeFormat === "digital"
                ? "bg-primary text-white shadow-sm"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Digital Video
          </button>
        </div>

        {/* Results Counter & Clear Filter Button */}
        <div className="flex items-center gap-3">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">
            {getResultCountText()}
          </span>

          {isFiltered && onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="font-label-sm text-xs text-secondary hover:text-primary underline uppercase tracking-widest transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
