"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  className?: string;
  syncUrl?: boolean;
}

export default function SearchBar({
  initialQuery = "",
  placeholder = "Search designs, occasions, design codes...",
  className = "",
  syncUrl = false,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full group ${className}`}>
      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline/60">
        search
      </span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={() => {
          if (syncUrl && query.trim()) {
            router.replace(`/search?q=${encodeURIComponent(query.trim())}`);
          }
        }}
        className="w-full bg-surface-container-low border-0 border-b border-outline/30 focus:ring-0 focus:border-secondary py-4 pl-12 pr-4 font-body-lg text-body-lg text-on-surface placeholder:text-outline/50 transition-colors outline-none"
        placeholder={placeholder}
      />
    </form>
  );
}
