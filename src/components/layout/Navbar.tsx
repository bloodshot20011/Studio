"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "@/data/categories";
import { siteConfig } from "@/data/site";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCategoriesOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setIsCategoriesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "/collections" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isCategoryActive = pathname.startsWith("/category");

  return (
    <>
      {/* High-Contrast Glassmorphism Navigation Bar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-surface/95 backdrop-blur-xl border-b border-outline/15 shadow-md shadow-primary/5"
            : "bg-surface/90 md:bg-surface/75 backdrop-blur-md border-b border-outline/10"
        }`}
      >
        <div
          className={`flex justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto transition-all duration-300 ${
            isScrolled ? "h-16" : "h-20"
          }`}
        >
          {/* Brand Title */}
          <Link
            href="/"
            className="font-headline-md text-headline-md tracking-tighter text-primary flex-shrink-0 font-bold"
          >
            {siteConfig.brand}
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.slice(0, 2).map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`${
                    isActive
                      ? "text-primary border-b-2 border-secondary pb-1 font-semibold"
                      : "text-on-surface-variant hover:text-secondary"
                  } transition-all duration-300 font-label-md text-label-md uppercase tracking-widest`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Categories dropdown */}
            <div className="relative" ref={categoriesRef}>
              <button
                type="button"
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className={`flex items-center gap-1 transition-all duration-300 font-label-md text-label-md uppercase tracking-widest ${
                  isCategoryActive
                    ? "text-primary border-b-2 border-secondary pb-1 font-semibold"
                    : "text-on-surface-variant hover:text-secondary"
                }`}
                aria-expanded={isCategoriesOpen}
                aria-haspopup="true"
              >
                Categories
                <span className="material-symbols-outlined text-[18px]">
                  {isCategoriesOpen ? "expand_less" : "expand_more"}
                </span>
              </button>

              <AnimatePresence>
                {isCategoriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-60 bg-surface/95 backdrop-blur-2xl border border-outline/20 shadow-2xl rounded-2xl py-3 z-50 overflow-hidden"
                  >
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        onClick={() => setIsCategoriesOpen(false)}
                        className="block px-5 py-2.5 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.slice(2).map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`${
                    isActive
                      ? "text-primary border-b-2 border-secondary pb-1 font-semibold"
                      : "text-on-surface-variant hover:text-secondary"
                  } transition-all duration-300 font-label-md text-label-md uppercase tracking-widest`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="text-on-surface-variant hover:text-primary transition-colors duration-300 p-2 rounded-full hover:bg-surface-container-low/60"
              aria-label="Search"
            >
              <span className="material-symbols-outlined">search</span>
            </button>
            <Link href="/collections" className="btn-primary rounded-xl">
              Explore Collection
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="md:hidden flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="text-primary p-2 rounded-lg bg-surface-container-low/80 border border-outline/10 flex items-center justify-center"
              aria-label="Search"
            >
              <span className="material-symbols-outlined text-[22px]">search</span>
            </button>
            <button
              type="button"
              className="text-primary p-2 rounded-lg bg-surface-container-low/80 border border-outline/10 flex items-center justify-center"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-surface/98 backdrop-blur-2xl flex flex-col items-center justify-center overflow-y-auto py-20 px-6"
          >
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 text-primary p-2 rounded-full bg-surface-container-low border border-outline/20"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-[28px]">close</span>
            </button>

            <div className="flex flex-col space-y-6 items-center w-full max-w-sm pt-6">
              <span className="font-label-sm text-xs text-secondary uppercase tracking-widest">
                Navigation
              </span>

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-headline-lg text-headline-lg text-primary hover:text-secondary transition-colors text-center"
                >
                  {link.name}
                </Link>
              ))}

              <div className="w-full border-t border-outline/20 pt-6">
                <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest text-center mb-4">
                  Categories
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-center py-2.5 px-3 font-label-sm text-xs uppercase tracking-widest text-primary border border-outline/20 hover:border-secondary transition-colors rounded-xl bg-surface-container-lowest shadow-sm"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link href="/collections" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary w-full justify-center mt-4 rounded-xl py-3.5">
                Explore Collection
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glassmorphism Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-surface/85 backdrop-blur-2xl flex items-start justify-center pt-24 px-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsSearchOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              className="w-full max-w-2xl bg-surface-container-lowest border border-outline/20 p-6 rounded-2xl shadow-2xl backdrop-blur-xl"
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[28px]">
                  search
                </span>
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search designs, occasions, codes..."
                  className="w-full bg-surface border-b-2 border-secondary py-4 pl-14 pr-10 font-body-lg text-body-lg text-on-surface placeholder:text-outline/50 outline-none rounded-t-xl"
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                  aria-label="Close search"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </form>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {["Wedding", "Birthday", "Mundan", "WED-001", "Digital"].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      router.push(`/search?q=${encodeURIComponent(term)}`);
                      setIsSearchOpen(false);
                    }}
                    className="px-4 py-2 border border-outline/30 font-label-sm text-label-sm text-on-surface-variant hover:border-secondary hover:text-primary transition-colors uppercase tracking-widest rounded-xl bg-surface"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
