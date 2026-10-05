import Link from "next/link";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

type Variant = "primary" | "secondary" | "outline-dark" | "whatsapp";

const variantClasses: Record<Variant, string> = {
  primary: "bg-accent text-ink",
  secondary: "bg-ink text-paper",
  "outline-dark": "bg-transparent text-stone-text border border-dark-line",
  whatsapp: "bg-[#25D366] text-white",
};

export function Button({
  href,
  variant = "primary",
  children,
  className,
}: {
  href: string;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
}) {
  const isExternal = href.startsWith("http");
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 font-body text-[13px] font-extrabold uppercase tracking-wider transition-transform duration-150 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
    variantClasses[variant],
    className
  );

  const content =
    variant === "whatsapp" ? (
      <>
        <WhatsAppIcon className="h-4 w-4" />
        {children}
      </>
    ) : (
      children
    );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
