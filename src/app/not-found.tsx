import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { whatsappUrl } from "@/data/location";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-paper px-6 text-center">
      <Logo className="h-10 w-auto" />
      <p className="font-display text-7xl text-ink md:text-8xl">404</p>
      <h1 className="font-display text-2xl text-ink md:text-3xl">This page skipped leg day.</h1>
      <p className="max-w-sm font-body text-sm text-ink-soft">
        The page you&rsquo;re looking for doesn&rsquo;t exist. Head back to the homepage or book a
        session directly.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button href="/">Back home</Button>
        <Button href={whatsappUrl("Hi, I'd like to book a consultation.")} variant="whatsapp">
          WhatsApp us
        </Button>
      </div>
    </div>
  );
}
