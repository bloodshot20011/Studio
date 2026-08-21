"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/data/site";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    document.cookie = "kashvi_admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Sign out notice:", e);
    }

    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: "dashboard" },
    { name: "All Products", href: "/admin/designs", icon: "inventory_2" },
    { name: "Add New Design", href: "/admin/designs/new", icon: "add_circle" },
    { name: "Customer Enquiries", href: "/admin/enquiries", icon: "contact_support" },
    { name: "View Website", href: "/", icon: "open_in_new" },
  ];

  return (
    <div className="flex h-screen w-full bg-surface text-on-surface overflow-hidden">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col h-full py-6 px-4 border-r border-outline/10 bg-surface-container-low fixed left-0 top-0 w-64 z-50">
        <div className="mb-8 px-2">
          <Link href="/" className="font-headline-lg text-headline-lg font-bold text-primary block">
            {siteConfig.brand}
          </Link>
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block mt-1">
            Admin Dashboard
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-label-sm text-label-sm uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-primary text-white font-semibold shadow-sm"
                    : "text-on-surface-variant hover:bg-surface hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-outline/10 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:bg-surface hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">storefront</span>
            Back to Shop
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-label-sm text-label-sm uppercase tracking-wider text-error hover:bg-error-container/40 transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-surface-container-lowest h-full py-6 px-5 flex flex-col shadow-2xl z-10 border-r border-outline/20">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline/10">
              <div>
                <span className="font-headline-md text-primary font-bold text-lg block">
                  {siteConfig.brand}
                </span>
                <span className="font-label-sm text-[10px] text-secondary uppercase tracking-widest">
                  Admin Navigation
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-on-surface-variant hover:text-primary"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <nav className="flex-1 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-label-sm text-xs uppercase tracking-wider transition-all ${
                      isActive
                        ? "bg-primary text-white font-bold shadow-md"
                        : "text-on-surface hover:bg-surface-container-low"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-outline/10 space-y-2 mt-auto">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-label-sm text-xs uppercase tracking-wider text-on-surface hover:bg-surface-container-low"
              >
                <span className="material-symbols-outlined text-[20px]">storefront</span>
                Back to Shop
              </Link>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-label-sm text-xs uppercase tracking-wider text-error bg-error-container/20 hover:bg-error-container/40 text-left font-bold"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 ml-0 md:ml-64 h-full flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 px-4 md:px-6 bg-surface/95 backdrop-blur-md border-b border-outline/10 flex items-center justify-between z-40 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger Toggle Button for Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-primary hover:bg-surface-container-low rounded-xl flex items-center justify-center border border-outline/20"
              aria-label="Toggle Mobile Admin Menu"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>

            <div className="flex items-center gap-2">
              <Link href="/" className="font-headline-md text-primary font-bold text-base md:text-lg">
                {siteConfig.brand}
              </Link>
              <span className="text-[10px] md:text-xs bg-secondary/10 text-secondary px-2 py-0.5 uppercase tracking-widest font-label-sm rounded">
                Admin
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
              Management Studio
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Link
              href="/admin/designs/new"
              className="btn-primary text-xs py-2 px-3 md:px-4 inline-flex items-center gap-1 rounded-xl"
            >
              <span className="material-symbols-outlined text-sm">add</span> Add Design
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="text-on-surface-variant hover:text-error p-2 transition-colors inline-flex items-center gap-1 font-label-sm text-xs uppercase tracking-wider"
              title="Logout from Admin"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-surface">
          {children}
        </main>
      </div>
    </div>
  );
}
