import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant flex-wrap ${className}`}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 && (
              <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
                chevron_right
              </span>
            )}
            {isLast || !item.href ? (
              <span className={`${isLast ? "text-primary truncate max-w-[150px] md:max-w-none" : ""}`}>
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-primary transition-colors">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
