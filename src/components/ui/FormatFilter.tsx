"use client";

import { motion, AnimatePresence } from "framer-motion";

export type FormatFilterValue = "all" | "printed" | "digital";
export type DigitalTypeFilterValue = "all" | "pdf" | "video";

interface FormatFilterProps {
  activeFormat: FormatFilterValue;
  activeDigitalType: DigitalTypeFilterValue;
  onFormatChange: (format: FormatFilterValue) => void;
  onDigitalTypeChange: (digitalType: DigitalTypeFilterValue) => void;
  totalResultsCount: number;
  onClearFilters?: () => void;
  isFiltered?: boolean;
}

export default function FormatFilter({
  activeFormat,
  activeDigitalType,
  onFormatChange,
  onDigitalTypeChange,
  totalResultsCount,
  onClearFilters,
  isFiltered = false,
}: FormatFilterProps) {
  // Format result count label
  const getResultCountText = () => {
    if (activeFormat === "printed") {
      return `${totalResultsCount} printed ${totalResultsCount === 1 ? "design" : "designs"}`;
    }
    if (activeFormat === "digital") {
      if (activeDigitalType === "pdf") {
        return `${totalResultsCount} PDF ${totalResultsCount === 1 ? "invitation" : "invitations"}`;
      }
      if (activeDigitalType === "video") {
        return `${totalResultsCount} video ${totalResultsCount === 1 ? "invitation" : "invitations"}`;
      }
      return `${totalResultsCount} digital ${totalResultsCount === 1 ? "invitation" : "invitations"}`;
    }
    return `${totalResultsCount} ${totalResultsCount === 1 ? "design" : "designs"}`;
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Primary Format Filter Segmented Control */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-surface-container-low p-1 border border-outline/10 overflow-x-auto max-w-full no-scrollbar">
          <button
            type="button"
            aria-pressed={activeFormat === "all"}
            onClick={() => onFormatChange("all")}
            className={`px-4 py-2 font-label-sm text-label-sm uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
              activeFormat === "all"
                ? "bg-surface text-primary border border-secondary/40 shadow-sm"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            All
          </button>
          <button
            type="button"
            aria-pressed={activeFormat === "printed"}
            onClick={() => onFormatChange("printed")}
            className={`px-4 py-2 font-label-sm text-label-sm uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
              activeFormat === "printed"
                ? "bg-surface text-primary border border-secondary/40 shadow-sm"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Printed
          </button>
          <button
            type="button"
            aria-pressed={activeFormat === "digital"}
            onClick={() => onFormatChange("digital")}
            className={`px-4 py-2 font-label-sm text-label-sm uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
              activeFormat === "digital"
                ? "bg-primary text-white shadow-sm"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Digital
          </button>
        </div>

        {/* Dynamic Count & Clear Filters */}
        <div className="flex items-center gap-4 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-widest">
          <span>{getResultCountText()}</span>
          {isFiltered && onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-secondary hover:text-primary border-b border-secondary/50 hover:border-primary transition-colors pb-0.5 ml-2"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Animated Secondary Digital Filter */}
      <AnimatePresence>
        {activeFormat === "digital" && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: -8 }}
            animate={{ opacity: 1, height: "auto", marginTop: 0 }}
            exit={{ opacity: 0, height: 0, marginTop: -8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary mr-2 flex-shrink-0">
                Format Type:
              </span>
              <div className="inline-flex items-center gap-1 bg-surface border border-outline/10 p-1">
                <button
                  type="button"
                  aria-pressed={activeDigitalType === "all"}
                  onClick={() => onDigitalTypeChange("all")}
                  className={`px-3 py-1.5 font-label-sm text-label-sm uppercase tracking-widest transition-colors ${
                    activeDigitalType === "all"
                      ? "bg-primary text-white"
                      : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  All Digital
                </button>
                <button
                  type="button"
                  aria-pressed={activeDigitalType === "pdf"}
                  onClick={() => onDigitalTypeChange("pdf")}
                  className={`px-3 py-1.5 font-label-sm text-label-sm uppercase tracking-widest transition-colors ${
                    activeDigitalType === "pdf"
                      ? "bg-primary text-white"
                      : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  PDF
                </button>
                <button
                  type="button"
                  aria-pressed={activeDigitalType === "video"}
                  onClick={() => onDigitalTypeChange("video")}
                  className={`px-3 py-1.5 font-label-sm text-label-sm uppercase tracking-widest transition-colors ${
                    activeDigitalType === "video"
                      ? "bg-primary text-white"
                      : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  Video
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
