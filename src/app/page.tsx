import { HowItWorks } from '@/components/landing/HowItWorks';
import { TrendingContests } from '@/components/landing/TrendingContests';

export default async function HomePage({ searchParams }: { searchParams: Promise<{ sport?: string }> }) {
  const { sport } = await searchParams;

  return (
    <div className="bg-midnight min-h-screen">
      <TrendingContests sport={sport} />
      <HowItWorks />
    </div>
  );
}

