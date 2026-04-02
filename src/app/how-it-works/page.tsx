import { Metadata } from 'next';
import { HowItWorks } from '@/components/landing/HowItWorks';

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'Learn the rules and mechanics of Scorendo.',
};

export default function HowItWorksPage() {
  return (
    <div className="pt-10 pb-20">
      <div className="text-center mb-8 px-4">
        <h1 className="text-4xl sm:text-5xl font-black mb-4">
          The <span className="text-gradient-pitch">Mechanics</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Scorendo is a skill-based prediction platform. No luck involved — analyze the matches, make your predictions, and climb the leaderboard.
        </p>
      </div>
      
      {/* Reusing existing mechanics presentation */}
      <HowItWorks />

      <div className="max-w-4xl mx-auto px-4 mt-20">
        <div className="glass p-8 rounded-3xl border border-primary/20 bg-black/40">
          <h3 className="text-2xl font-bold mb-6 text-primary">Points System</h3>
          <ul className="space-y-4 text-muted-foreground leading-relaxed">
             <li className="flex gap-4">
               <span className="font-bold text-white w-20 shrink-0">10 PTS</span>
               <span><strong>Correct Result:</strong> You predict the match winner or draw correctly.</span>
             </li>
             <li className="flex gap-4">
               <span className="font-bold text-white w-20 shrink-0">+5 PTS</span>
               <span><strong>Exact Score:</strong> You predict the precise scoreline (e.g. 2-1).</span>
             </li>
             <li className="flex gap-4">
               <span className="font-bold text-gold w-20 shrink-0">x1.5</span>
               <span><strong>Knockout Multiplier:</strong> Points are multiplied in the Round of 16.</span>
             </li>
             <li className="flex gap-4">
               <span className="font-bold text-gold w-20 shrink-0">x2.0</span>
               <span><strong>Finals Multiplier:</strong> Points are doubled in Quarter-Finals, Semi-Finals, and Final.</span>
             </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
