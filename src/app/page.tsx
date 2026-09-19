import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileFixedCta } from "@/components/layout/mobile-fixed-cta";
import { Hero } from "@/components/sections/hero";
import { TrustStrip } from "@/components/sections/trust-strip";
import { Coach } from "@/components/sections/coach";
import { Method } from "@/components/sections/method";
import { Programs } from "@/components/sections/programs";
import { Schedule } from "@/components/sections/schedule";
import { Results } from "@/components/sections/results";
import { Gym } from "@/components/sections/gym";
import { Credentials } from "@/components/sections/credentials";
import { Testimonial } from "@/components/sections/testimonial";
import { Location } from "@/components/sections/location";
import { FinalCTA } from "@/components/sections/final-cta";
import { coach } from "@/data/coach";
import { location } from "@/data/location";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: location.name,
    // TODO: replace with real address/geo before launch
    address: location.address,
    openingHours: location.hours,
    employee: {
      "@type": "Person",
      name: coach.name,
      jobTitle: coach.title,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative pb-20 md:pb-0">
        <Navbar />
        <main>
          <Hero />
          <TrustStrip />
          <Coach />
          <Method />
          <Programs />
          <Schedule />
          <Results />
          <Gym />
          <Credentials />
          <Testimonial />
          <Location />
          <FinalCTA />
        </main>
        <Footer />
      </div>
      <MobileFixedCta />
    </>
  );
}
