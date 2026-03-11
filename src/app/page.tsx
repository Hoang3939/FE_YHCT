import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { HowItWorks } from '@/components/HowItWorks';
import { Features } from '@/components/Features';
import { Library } from '@/components/Library';
import { BottomCTA } from '@/components/BottomCTA';
import { Footer } from '@/components/Footer';

export default function LandingPage() {
  return (
    <main className="w-full min-h-screen bg-[#0b140d] flex justify-center overflow-x-hidden">
      <div className="w-[1440px] flex flex-col items-center relative text-center text-[18px] text-[#00d492] font-['Inter'] shrink-0 pb-[100px]">
        <Header />
        <HeroSection />
        <HowItWorks />
        <Features />
        <Library />
        <BottomCTA />
        <Footer />
      </div>
    </main>
  );
}
