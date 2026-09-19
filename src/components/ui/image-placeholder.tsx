import { cn } from "@/lib/utils";

export function ImagePlaceholder({
  label,
  dark,
  className,
  style,
}: {
  label: string;
  dark?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={cn(
        "relative flex items-center justify-center overflow-hidden border",
        dark
          ? "border-dark-line bg-[repeating-linear-gradient(135deg,#221a10_0_14px,#14110c_14px_28px)]"
          : "border-line bg-[repeating-linear-gradient(135deg,var(--paper-2)_0_14px,var(--paper)_14px_28px)]",
        className
      )}
    >
      <span
        className={cn(
          "absolute top-3 left-3 border px-3 py-2 font-body text-[10px] tracking-wider uppercase",
          dark
            ? "border-dark-line bg-dark/70 text-stone-text"
            : "border-line bg-paper/80 text-ink-soft"
        )}
      >
        {label}
      </span>
    </div>
  );
}
