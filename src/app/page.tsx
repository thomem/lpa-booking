import { HeroSection } from "@/components/home/HeroSection";
import { HighlightsSection } from "@/components/home/HighlightsSection";
import { GallerySection } from "@/components/home/GallerySection";
import { AmenitiesSection } from "@/components/home/AmenitiesSection";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { LocationSection } from "@/components/home/LocationSection";
import { RulesSection } from "@/components/home/RulesSection";
import { ContactSection } from "@/components/home/ContactSection";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { MobileStickyBar } from "@/components/booking/MobileStickyBar";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 py-12">
          <div className="lg:col-span-2 space-y-0">
            <HighlightsSection />
            <GallerySection />
            <AmenitiesSection />
            <ReviewsSection />
            <LocationSection />
            <RulesSection />
            <ContactSection />
          </div>
          <div className="lg:col-span-1">
            <div id="reserver" className="sticky top-24">
              <BookingWidget />
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <MobileStickyBar />
    </main>
  );
}
