import HeroSection from '@/components/HeroSection';
import HomeClientSections from './HomeClientSections';

export default function Home() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Hero Section - Above the fold, load immediately */}
      <HeroSection />

      {/* Client-only sections (defer JS/hydration work) */}
      <HomeClientSections />
    </div>
  );
}
