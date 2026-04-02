import { MatchStatus, PredictionOutcome } from '@prisma/client';
import { formatDateShort, getStatusColor, getTeamLogoUrl } from '@/lib/utils';
import { Clock, MapPin, Trophy } from 'lucide-react';

interface TeamProps {
  name: string;
  code: string;
}

interface MatchCardProps {
  matchNumber: number;
  homeTeam: TeamProps;
  awayTeam: TeamProps;
  kickoff: Date;
  status: MatchStatus;
  homeScore?: number | null;
  awayScore?: number | null;
  venueName?: string;
  phaseName: string;
  onClick?: () => void;
  predictedWinner?: PredictionOutcome | null;
  // Visual variations
  variant?: 'default' | 'prediction' | 'compact';
  renderCenter?: React.ReactNode;
}

export function MatchCard({
  matchNumber,
  homeTeam,
  awayTeam,
  kickoff,
  status,
  homeScore,
  awayScore,
  venueName,
  phaseName,
  onClick,
  predictedWinner,
  variant = 'default',
  renderCenter,
}: MatchCardProps) {
  const isFinished = status === MatchStatus.FINISHED;
  const isLive = status === MatchStatus.LIVE;
  
  // Game-like styling logic
  const wrapperClasses = [
    'relative overflow-hidden transition-all duration-300',
    variant === 'compact' ? 'rounded-xl p-3' : 'rounded-2xl p-5',
    'glass border hover:border-primary/40',
    onClick ? 'cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_-10px_rgba(0,230,118,0.2)]' : '',
    isLive ? 'border-primary/50 shadow-[0_0_20px_-5px_rgba(0,230,118,0.2)] glow-green' : 'border-border/30',
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses} onClick={onClick}>
      {/* Background Accent Gradient based on status */}
      {isLive && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50 animate-pulse" />
      )}
      
      {/* Header Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase bg-white/5 px-2 py-0.5 rounded-sm">
            Match {matchNumber}
          </span>
          <span className="text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-wide">
            {phaseName}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5">
          {isLive ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-primary animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              LIVE
            </span>
          ) : (
            <span className={`text-xs font-medium ${getStatusColor(status)}`}>
              {status === MatchStatus.SCHEDULED ? (
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDateShort(kickoff)}</span>
              ) : status}
            </span>
          )}
        </div>
      </div>

      {/* Teams & Score Setup (E-sports style layout) */}
      <div className="flex items-center justify-between relative">
        
        {/* Home Team */}
        <div className={`flex flex-col items-center sm:flex-row sm:gap-4 w-[40%] ${predictedWinner === PredictionOutcome.HOME ? 'scale-105 transition-transform' : ''}`}>
           <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 overflow-hidden flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent shadow-inner
             ${predictedWinner === PredictionOutcome.HOME ? 'border-primary glow-green' : 'border-white/10'}  
           `}>
             <img src={getTeamLogoUrl(homeTeam.code, homeTeam.name)} alt={homeTeam.name} className="h-full w-full object-cover" />
           </div>
           <div className="mt-2 sm:mt-0 text-center sm:text-left">
             <div className="text-sm sm:text-base font-bold text-foreground font-sans line-clamp-1">{homeTeam.name}</div>
             <div className="text-[10px] font-bold tracking-widest text-muted-foreground">{homeTeam.code}</div>
           </div>
        </div>

        {/* Score / VS Divider */}
        <div className="flex flex-col items-center justify-center w-[20%] z-10">
          {renderCenter ? (
            renderCenter
          ) : (isLive || isFinished) ? (
            <div className="flex items-center gap-2 sm:gap-3 bg-black/40 px-3 sm:px-4 py-2 rounded-lg border border-white/5">
              <span className="text-2xl sm:text-3xl font-black text-white tabular-nums drop-shadow-md">{homeScore ?? 0}</span>
              <span className="text-sm font-bold text-muted-foreground/50">-</span>
              <span className="text-2xl sm:text-3xl font-black text-white tabular-nums drop-shadow-md">{awayScore ?? 0}</span>
            </div>
          ) : (
             <div className="text-sm font-black text-muted-foreground/30 italic">VS</div>
          )}
        </div>

        {/* Away Team */}
        <div className={`flex flex-col items-center sm:flex-row-reverse sm:gap-4 w-[40%] ${predictedWinner === PredictionOutcome.AWAY ? 'scale-105 transition-transform' : ''}`}>
           <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 overflow-hidden flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent shadow-inner
             ${predictedWinner === PredictionOutcome.AWAY ? 'border-primary glow-green' : 'border-white/10'}
           `}>
             <img src={getTeamLogoUrl(awayTeam.code, awayTeam.name)} alt={awayTeam.name} className="h-full w-full object-cover" />
           </div>
           <div className="mt-2 sm:mt-0 text-center sm:text-right">
             <div className="text-sm sm:text-base font-bold text-foreground font-sans line-clamp-1">{awayTeam.name}</div>
             <div className="text-[10px] font-bold tracking-widest text-muted-foreground">{awayTeam.code}</div>
           </div>
        </div>
      </div>

      {/* Footer Info */}
      {variant !== 'compact' && (
        <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-muted-foreground">
          {venueName ? (
            <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 opacity-70"/> {venueName}</span>
          ) : <span />}
          
          {predictedWinner && (
             <span className="flex items-center gap-1 text-primary font-bold">
               <Trophy className="h-3 w-3" /> Prediction Lock
             </span>
          )}
        </div>
      )}
    </div>
  );
}
