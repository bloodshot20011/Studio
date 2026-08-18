import { siteConfig } from "@/data/site";

interface CallButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function CallButton({
  className = "",
  children = "Call Us to Discuss",
}: CallButtonProps) {
  return (
    <a
      href={siteConfig.contact.phoneHref}
      className={`w-full bg-transparent text-primary py-4 font-label-md text-label-md border border-secondary hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 ${className}`}
    >
      <span className="material-symbols-outlined text-sm">call</span>
      {children}
    </a>
  );
}
