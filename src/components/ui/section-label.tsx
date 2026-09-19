import { cn } from "@/lib/utils";

export function SectionLabel({
  children,
  onDark,
  className,
}: {
  children: React.ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "font-body text-xs font-extrabold uppercase tracking-[0.22em]",
        onDark ? "text-accent" : "text-accent-ink",
        className
      )}
    >
      {children}
    </div>
  );
}
