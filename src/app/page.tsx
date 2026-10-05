import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileFixedCta } from "@/components/layout/mobile-fixed-cta";
import { Hero } from "@/components/sections/hero";
import { TrustStrip } from "@/components/sections/trust-strip";
import { Coach } from "@/components/sections/coach";
import { Method } from "@/components/sections/method";
import { Programs } from "@/components/sections/programs";
import { Schedule } from "@/components/sections/schedule";
import { Classes } from "@/components/sections/classes";
import { Results } from "@/components/sections/results";
import { Gym } from "@/components/sections/gym";
import { Credentials } from "@/components/sections/credentials";
import { Membership } from "@/components/sections/membership";
import { Community } from "@/components/sections/community";
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
    slogan: location.tagline,
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
        <main id="main-content" tabIndex={-1} className="focus:outline-none">
          <Hero />
          <TrustStrip />
          <Coach />
          <Method />
          <Programs />
          <Schedule />
          <Classes />
          <Results />
          <Gym />
          <Credentials />
          <Membership />
          <Community />
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
