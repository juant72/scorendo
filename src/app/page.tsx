import { Hero } from '@/components/landing/Hero';
import { NetworkFeed } from '@/components/landing/NetworkFeed';

export default async function HomePage() {
  return (
    <div className="bg-[#020814] min-h-screen">
      <Hero />
      <NetworkFeed />
    </div>
  );
}

