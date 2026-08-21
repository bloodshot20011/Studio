"use client";

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

  const handleLogout = async () => {
    // 1. Clear admin security cookie
    document.cookie = "kashvi_admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // 2. Sign out of Supabase Auth
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Sign out notice:", e);
    }

    // 3. Redirect to login page
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
      {/* Sidebar Navigation */}
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
                className={`flex items-center gap-3 px-4 py-2.5 rounded font-label-sm text-label-sm uppercase tracking-wider transition-all ${
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
            className="flex items-center gap-3 px-4 py-2.5 rounded font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant hover:bg-surface hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">storefront</span>
            Back to Shop
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded font-label-sm text-label-sm uppercase tracking-wider text-error hover:bg-error-container/40 transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 ml-0 md:ml-64 h-full flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 px-6 bg-surface/90 backdrop-blur-md border-b border-outline/10 flex items-center justify-between z-40 flex-shrink-0">
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/" className="font-headline-md text-primary font-bold">
              {siteConfig.brand}
            </Link>
            <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 uppercase tracking-widest font-label-sm">
              Admin
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
              Management Studio
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/designs/new"
              className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">add</span> Add Design
            </Link>
            
            <button
              type="button"
              onClick={handleLogout}
              className="text-on-surface-variant hover:text-error p-2 transition-colors inline-flex items-center gap-1 font-label-sm text-xs uppercase tracking-wider"
              title="Logout from Admin"
            >
              <span className="material-symbols-outlined text-sm">logout</span> Logout
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-surface">
          {children}
        </main>
      </div>
    </div>
  );
}
