"use client";

import { useEffect } from "react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/data/location";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-paper px-6 text-center">
      <Logo className="h-10 w-auto" />
      <h1 className="font-display text-2xl text-ink md:text-3xl">Something got dropped.</h1>
      <p className="max-w-sm font-body text-sm text-ink-soft">
        An unexpected error interrupted this page. Try again, or reach us directly.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 font-body text-[13px] font-extrabold uppercase tracking-wider text-ink transition-transform duration-150 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Try again
        </button>
        <Button href={whatsappUrl("Hi, I ran into an issue on your site.")} variant="whatsapp">
          WhatsApp us
        </Button>
      </div>
    </div>
  );
}
