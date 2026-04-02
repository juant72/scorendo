import Link from 'next/link';
import { Trophy } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/30 bg-black/50 py-12 mt-auto backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-gradient-pitch">Score</span>
              <span className="text-foreground">ndo</span>
            </span>
          </Link>
          <p className="text-muted-foreground text-sm max-w-sm">
            The premier skill-based prediction competition platform. Predict match outcomes across global tournaments and earn crypto rewards.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm font-semibold">Twitter</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm font-semibold">GitHub</a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-bold mb-4 text-foreground">Platform</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/matches" className="hover:text-primary transition-colors">Matches</Link></li>
            <li><Link href="/contests" className="hover:text-primary transition-colors">Contests</Link></li>
            <li><Link href="/ranking" className="hover:text-primary transition-colors">Leaderboard</Link></li>
            <li><Link href="/dashboard" className="hover:text-primary transition-colors">My Profile</Link></li>
          </ul>
        </div>

        {/* Legals */}
        <div className="col-span-1 md:col-span-1">
          <h4 className="font-bold mb-4 text-foreground">Legal & Help</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
        
      </div>

      {/* Mandatory Option A Legal Disclaimer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 py-8 border-t border-border/10">
        <p className="text-[10px] leading-relaxed text-muted-foreground/60 italic text-center max-w-4xl mx-auto">
          <strong>LEGAL NOTICE:</strong> Scorendo is an independent, skill-based sports prediction platform. This application is 
          <strong> NOT affiliated with, sponsored by, nor endorsed by </strong> 
          any official sports league (including but not limited to FIFA, UEFA, AFA, or La Liga), 
          nor any individual professional sports club or athlete. 
          All team names, competition names, and match data displayed are used for 
          <strong> informational and identification purposes only </strong> (Nominative Fair Use). 
          No official logos or protected trademarks are used to imply a commercial relationship. 
          Users must be of legal age and reside in a jurisdiction where skill-based gaming is permitted.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 border-t border-border/5 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Scorendo Inc. All rights reserved.</p>
        <p className="mt-2 md:mt-0 italic font-medium">Built on Solana ⚡</p>
      </div>
    </footer>
  );
}
