import { HowItWorks } from '@/components/landing/HowItWorks';
import { TrendingContests } from '@/components/landing/TrendingContests';
import { Hero } from '@/components/landing/Hero';
import { SportSelector } from '@/components/landing/SportSelector';
import { LiveStatsBar } from '@/components/landing/LiveStatsBar';

export default async function HomePage({ searchParams }: { searchParams: Promise<{ sport?: string }> }) {
  const { sport } = await searchParams;

  return (
    <div className="bg-midnight min-h-screen">
      <Hero />
      <LiveStatsBar />
      <SportSelector />
      <TrendingContests sport={sport} />
      <HowItWorks />
    </div>
  );
}

