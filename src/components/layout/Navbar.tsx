"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "@/data/categories";

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
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
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
    { name: "About", href: "/about" },
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
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-surface/95 backdrop-blur-md border-b border-outline/20 shadow-sm"
            : "bg-surface/80 backdrop-blur-sm border-b border-outline/10"
        }`}
      >
        <div
          className={`flex justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto transition-all duration-300 ${
            isScrolled ? "h-16" : "h-20"
          }`}
        >
          <Link
            href="/"
            className="font-headline-md text-headline-md tracking-tighter text-primary flex-shrink-0"
          >
            Studio Shunya
          </Link>

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
                      ? "text-primary border-b-2 border-secondary pb-1"
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
                    ? "text-primary border-b-2 border-secondary pb-1"
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
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-surface border border-outline/20 shadow-lg py-2 z-50"
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
                      ? "text-primary border-b-2 border-secondary pb-1"
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
              className="text-on-surface-variant hover:text-primary transition-colors duration-300"
              aria-label="Search"
            >
              <span className="material-symbols-outlined">search</span>
            </button>
            <Link href="/collections" className="btn-primary">
              Explore Collection
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="text-primary"
              aria-label="Search"
            >
              <span className="material-symbols-outlined">search</span>
            </button>
            <button
              type="button"
              className="text-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              <span className="material-symbols-outlined">
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-surface flex flex-col items-center justify-center overflow-y-auto py-24"
          >
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 text-primary"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-[32px]">close</span>
            </button>

            <div className="flex flex-col space-y-6 items-center w-full max-w-sm px-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="font-display-lg-mobile text-display-lg-mobile text-primary hover:text-secondary transition-colors"
                >
                  {link.name}
                </Link>
              ))}

              <div className="w-full border-t border-outline/20 pt-6">
                <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest text-center mb-4">
                  Categories
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="text-center py-2 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-primary border border-outline/20 hover:border-secondary transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link href="/collections" className="btn-primary w-full justify-center mt-4">
                Explore Collection
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-surface/95 backdrop-blur-md flex items-start justify-center pt-32"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsSearchOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl px-margin-mobile"
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
                  placeholder="Search designs, occasions, design codes..."
                  className="w-full bg-surface border-b-2 border-secondary py-5 pl-14 pr-4 font-body-lg text-body-lg text-on-surface placeholder:text-outline/50 outline-none"
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
              <div className="mt-6 flex flex-wrap gap-3">
                {["Wedding", "Birthday", "Mundan", "WED-001", "Digital"].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      router.push(`/search?q=${encodeURIComponent(term)}`);
                      setIsSearchOpen(false);
                    }}
                    className="px-4 py-2 border border-outline/30 font-label-sm text-label-sm text-on-surface-variant hover:border-secondary hover:text-primary transition-colors uppercase tracking-widest"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <p className="mt-4 font-label-sm text-label-sm text-outline uppercase tracking-widest">
                Popular Searches
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
