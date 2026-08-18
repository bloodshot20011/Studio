interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`${alignClass} ${className}`}>
      {eyebrow && (
        <span className="block font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-2">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display-lg-mobile text-display-lg-mobile text-primary">{title}</h2>
      {description && (
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-4 max-w-2xl">{description}</p>
      )}
    </div>
  );
}
