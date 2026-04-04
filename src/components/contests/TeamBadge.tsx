'use client';

import React from 'react';
import { Shield } from 'lucide-react';

const TEAM_CONFIG: Record<string, { main: string, accent: string, third?: string, pattern: 'SASH' | 'STRIPES' | 'STRIPES_FINE' | 'BANDS' | 'SOLID' | 'CHEVRON' | 'HALVES' }> = {
  // ARGENTINE LEAGUE (LPF)
  'RIV': { main: '#FFFFFF', accent: '#EF4444', third: '#D1D5DB', pattern: 'SASH' },    
  'BOC': { main: '#0F2050', accent: '#FFD700', third: '#FFD700', pattern: 'BANDS' },   
  'RAC': { main: '#A2DDFE', accent: '#FFFFFF', third: '#A2DDFE', pattern: 'STRIPES_FINE' }, 
  'IND': { main: '#DC2626', accent: '#991B1B', third: '#7F1D1D', pattern: 'SOLID' },   
  'SLO': { main: '#1E3A8A', accent: '#DC2626', third: '#172554', pattern: 'STRIPES_FINE' }, 
  'TAL': { main: '#FFFFFF', accent: '#0F2050', third: '#0F2050', pattern: 'STRIPES' },
  'LAN': { main: '#7C1D1D', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'SOLID' },
  'NOB': { main: '#EF4444', accent: '#1C1917', third: '#FFFFFF', pattern: 'HALVES' },
  'VEL': { main: '#FFFFFF', accent: '#1E40AF', third: '#1E40AF', pattern: 'CHEVRON' },
  'CEN': { main: '#0F2050', accent: '#FACC15', third: '#FFFFFF', pattern: 'STRIPES_FINE' },
  'EST': { main: '#FFFFFF', accent: '#DC2626', third: '#DC2626', pattern: 'STRIPES_FINE' },
  'GIM': { main: '#FFFFFF', accent: '#0F2050', third: '#0F2050', pattern: 'BANDS' },
  'HUR': { main: '#FFFFFF', accent: '#DC2626', third: '#FFFFFF', pattern: 'SOLID' },
  'ARG_JRS': { main: '#DC2626', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'SASH' },
  'BAN': { main: '#FFFFFF', accent: '#166534', third: '#166534', pattern: 'SASH' },
  'TIG': { main: '#1E40AF', accent: '#DC2626', third: '#DC2626', pattern: 'BANDS' },
  'PLA': { main: '#FFFFFF', accent: '#45322E', third: '#45322E', pattern: 'BANDS' },
  'UNI': { main: '#FFFFFF', accent: '#DC2626', third: '#DC2626', pattern: 'STRIPES_FINE' },
  'INS': { main: '#FFFFFF', accent: '#DC2626', third: '#DC2626', pattern: 'STRIPES_FINE' },
  'GOD': { main: '#1E40AF', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'STRIPES_FINE' },
  'TUC': { main: '#A2DDFE', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'STRIPES_FINE' },
  'SAR': { main: '#166534', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'SOLID' },
  'BEL_GR': { main: '#A2DDFE', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'SOLID' },
  'CCB': { main: '#FFFFFF', accent: '#1C1917', third: '#1C1917', pattern: 'STRIPES_FINE' },
  'BAR_CAS': { main: '#FFFFFF', accent: '#DC2626', third: '#DC2626', pattern: 'STRIPES_FINE' },
  'DEF': { main: '#FACC15', accent: '#166534', third: '#166534', pattern: 'SOLID' },
  'RIE': { main: '#1C1917', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'SOLID' },
  'IRV': { main: '#0F2050', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'SOLID' },
  
  // NATIONAL TEAMS
  'ARG': { main: '#7DD3FC', accent: '#FFFFFF', third: '#3B82F6', pattern: 'STRIPES' },
  'BRA': { main: '#FACC15', accent: '#15803D', third: '#1D4ED8', pattern: 'SOLID' },
  'MEX': { main: '#064E3B', accent: '#FFFFFF', third: '#DC2626', pattern: 'SOLID' },
  'USA': { main: '#FFFFFF', accent: '#1E3A8A', third: '#DC2626', pattern: 'SOLID' },
  'CAN': { main: '#DC2626', accent: '#FFFFFF', third: '#991B1B', pattern: 'SOLID' },
  'ENG': { main: '#FFFFFF', accent: '#0B1121', third: '#94A3B8', pattern: 'SOLID' },
  
  // FWC 2026 / INTERNATIONALS
  'RSA': { main: '#FACC15', accent: '#166534', third: '#000000', pattern: 'BANDS' },
  'KOR': { main: '#DC2626', accent: '#1E40AF', third: '#FFFFFF', pattern: 'SOLID' },
  'CZE': { main: '#FFFFFF', accent: '#DC2626', third: '#1E40AF', pattern: 'SOLID' },
  'SUI': { main: '#DC2626', accent: '#FFFFFF', third: '#B91C1C', pattern: 'SOLID' },
  'QAT': { main: '#701A10', accent: '#FFFFFF', third: '#701A10', pattern: 'SOLID' },
  'BIH': { main: '#1E40AF', accent: '#FACC15', third: '#FFFFFF', pattern: 'SOLID' },
  'MAR': { main: '#DC2626', accent: '#166534', third: '#FACC15', pattern: 'SOLID' },
  'HAI': { main: '#1E40AF', accent: '#DC2626', third: '#FFFFFF', pattern: 'SOLID' },
  'SCO': { main: '#0F172A', accent: '#FFFFFF', third: '#0F172A', pattern: 'SOLID' },
  'PAR': { main: '#FFFFFF', accent: '#DC2626', third: '#1E3A8A', pattern: 'STRIPES_FINE' },
  'AUS': { main: '#FACC15', accent: '#166534', third: '#FFFFFF', pattern: 'SOLID' },
  'TUR': { main: '#DC2626', accent: '#FFFFFF', third: '#B91C1C', pattern: 'SOLID' },
  'GER': { main: '#FFFFFF', accent: '#000000', third: '#DC2626', pattern: 'SOLID' },
  'ECU': { main: '#FACC15', accent: '#1E40AF', third: '#DC2626', pattern: 'SOLID' },
  'CIV': { main: '#F97316', accent: '#15803D', third: '#FFFFFF', pattern: 'SOLID' },
  'CUR': { main: '#1E40AF', accent: '#FACC15', third: '#FFFFFF', pattern: 'SOLID' },
  'NED': { main: '#F97316', accent: '#FFFFFF', third: '#22C55E', pattern: 'SOLID' },
  'JPN': { main: '#1E3A8A', accent: '#FFFFFF', third: '#EF4444', pattern: 'SOLID' },
  'TUN': { main: '#FFFFFF', accent: '#DC2626', third: '#DC2626', pattern: 'SOLID' },
  'SWE': { main: '#FACC15', accent: '#1E40AF', third: '#FFFFFF', pattern: 'SOLID' },
  'BEL': { main: '#B91C1C', accent: '#000000', third: '#FACC15', pattern: 'SOLID' },
  'IRN': { main: '#FFFFFF', accent: '#15803D', third: '#DC2626', pattern: 'SOLID' },
  'EGY': { main: '#DC2626', accent: '#FFFFFF', third: '#000000', pattern: 'SOLID' },
  'NZL': { main: '#000000', accent: '#FFFFFF', third: '#94A3B8', pattern: 'SOLID' },
  'ESP': { main: '#DC2626', accent: '#FACC15', third: '#1E3A8A', pattern: 'SOLID' },
  'URU': { main: '#7DD3FC', accent: '#000000', third: '#FFFFFF', pattern: 'SOLID' },
  'KSA': { main: '#FFFFFF', accent: '#166534', third: '#166534', pattern: 'SOLID' },
  'CPV': { main: '#1E40AF', accent: '#DC2626', third: '#FACC15', pattern: 'SOLID' },
  'FRA': { main: '#1E3A8A', accent: '#FFFFFF', third: '#DC2626', pattern: 'SOLID' },
  'SEN': { main: '#FFFFFF', accent: '#166534', third: '#DC2626', pattern: 'SOLID' },
  'NOR': { main: '#DC2626', accent: '#1E3A8A', third: '#FFFFFF', pattern: 'SOLID' },
  'IRQ': { main: '#FFFFFF', accent: '#166534', third: '#DC2626', pattern: 'SOLID' },
  'ALG': { main: '#FFFFFF', accent: '#166534', third: '#DC2626', pattern: 'SOLID' },
  'AUT': { main: '#DC2626', accent: '#FFFFFF', third: '#B91C1C', pattern: 'SOLID' },
  'JOR': { main: '#FFFFFF', accent: '#DC2626', third: '#166534', pattern: 'SOLID' },
  'POR': { main: '#B91C1C', accent: '#166534', third: '#FACC15', pattern: 'SOLID' },
  'COL': { main: '#FACC15', accent: '#1E3A8A', third: '#DC2626', pattern: 'SOLID' },
  'UZB': { main: '#FFFFFF', accent: '#1E40AF', third: '#1E40AF', pattern: 'SOLID' },
  'COD': { main: '#3B82F6', accent: '#DC2626', third: '#FACC15', pattern: 'SASH' },
  'CRO': { main: '#FFFFFF', accent: '#DC2626', third: '#1E40AF', pattern: 'SOLID' },
  'GHA': { main: '#FFFFFF', accent: '#000000', third: '#DC2626', pattern: 'SOLID' },
  'PAN': { main: '#DC2626', accent: '#1E3A8A', third: '#FFFFFF', pattern: 'SOLID' },
  
  // EUROPEAN CLUBS
  // EUROPEAN CLUBS
  'RMA': { main: '#FFFFFF', accent: '#F3F4F6', third: '#FEF08A', pattern: 'SOLID' },   
  'MCI': { main: '#7DD3FC', accent: '#38BDF8', third: '#FFFFFF', pattern: 'SOLID' },   
  'BAR': { main: '#1A365D', accent: '#702459', third: '#FEF08A', pattern: 'STRIPES' }, 
  'LIV': { main: '#DC2626', accent: '#991B1B', third: '#FEF08A', pattern: 'SOLID' },

  // MOTORSPORTS (F1 Teams)
  'RBR': { main: '#0600EF', accent: '#FFEB00', third: '#FFFFFF', pattern: 'SOLID' },
  'FER': { main: '#E80020', accent: '#FFFFFF', third: '#000000', pattern: 'SOLID' },
  'MER': { main: '#00D2BE', accent: '#FFFFFF', third: '#000000', pattern: 'SOLID' },
  'MCL': { main: '#FF8700', accent: '#47C7FC', third: '#000000', pattern: 'SOLID' },

  // NBA Teams
  'LAL': { main: '#552583', accent: '#FDB927', third: '#FFFFFF', pattern: 'SOLID' },
  'GSW': { main: '#1D428A', accent: '#FFC72C', third: '#FFFFFF', pattern: 'SOLID' },
  'CHI': { main: '#CE1141', accent: '#000000', third: '#FFFFFF', pattern: 'SOLID' },
  'BOS': { main: '#007A33', accent: '#BA9653', third: '#FFFFFF', pattern: 'SOLID' },
  
  'DEFAULT': { main: '#1E293B', accent: '#334155', pattern: 'SOLID' }
};

/**
 * Protocol to generate a baseline kit for teams missing from CONFIG
 */
const getFallbackConfig = (code: string) => {
  if (TEAM_CONFIG[code]) return TEAM_CONFIG[code];
  
  const hash = code.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  const hue = hash % 360;
  
  return {
    main: `hsl(${hue}, 45%, 35%)`,
    accent: `hsl(${hue}, 45%, 55%)`,
    pattern: 'SOLID' as const
  };
};

interface TeamBadgeProps {
  name: string;
  code: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hideName?: boolean;
  sport?: 'football' | 'motorsports' | 'nba';
}

export function TeamBadge({ name, code, size = 'md', hideName = false, sport = 'football' }: TeamBadgeProps) {
  const config = getFallbackConfig(code);
  const dimensions = size === 'sm' ? { width: 52, height: 52 } : 
                    size === 'lg' ? { width: 130, height: 130 } : 
                    size === 'xl' ? { width: 180, height: 180 } :
                    { width: 90, height: 90 };

  return (
    <div className="flex flex-col items-center gap-1.5" title={name}>
      <div 
        className="relative flex items-center justify-center transition-transform hover:scale-110 duration-500"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl overflow-visible">
          <defs>
            <clipPath id={`badge-mask-${code}-${size}`}>
              {sport === 'football' && (
                <path d="M50,15 L72,18 L88,28 L94,52 L84,56 L78,42 L78,85 C78,92 72,95 65,95 L35,95 C28,95 22,92 22,85 L22,42 L16,56 L6,52 L12,28 L28,18 Z" />
              )}
              {sport === 'motorsports' && (
                <path d="M50,10 C25,10 15,25 15,50 C15,75 30,90 50,90 C70,90 85,75 85,50 C85,25 75,10 50,10 M25,55 L75,55 L75,65 C75,75 65,80 50,80 C35,80 25,75 25,65 Z" />
              )}
              {sport === 'nba' && (
                <path d="M30,15 L40,15 C45,25 55,25 60,15 L70,15 L75,40 L70,90 L30,90 L25,40 Z" />
              )}
            </clipPath>
          </defs>
          
          {/* Main Shape */}
          {sport === 'football' && (
            <path 
              d="M50,15 L72,18 L88,28 L94,52 L84,56 L78,42 L78,85 C78,92 72,95 65,95 L35,95 C28,95 22,92 22,85 L22,42 L16,56 L6,52 L12,28 L28,18 Z" 
              fill={config.main} 
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.5"
            />
          )}
          {sport === 'motorsports' && (
            <path 
              d="M50,10 C25,10 15,25 15,50 C15,75 30,90 50,90 C70,90 85,75 85,50 C85,25 75,10 50,10" 
              fill={config.main} 
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
          )}
          {sport === 'nba' && (
            <path 
              d="M30,15 L40,15 C45,25 55,25 60,15 L70,15 L75,40 L70,90 L30,90 L25,40 Z" 
              fill={config.main} 
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.5"
            />
          )}

          <g clipPath={`url(#badge-mask-${code}-${size})`}>
             {/* Patterns (Shared logic) */}
             {config.pattern === 'SASH' && (
                <polygon points="75,0 95,0 25,100 5,100" fill={config.accent} opacity="0.8" />
             )}
             {config.pattern === 'STRIPES' && (
                <g fill={config.accent} opacity="0.8">
                   <rect x="0" y="0" width="18" height="100" />
                   <rect x="41" y="0" width="18" height="100" />
                   <rect x="82" y="0" width="18" height="100" />
                </g>
             )}
             {config.pattern === 'STRIPES_FINE' && (
                <g fill={config.accent} opacity="0.6">
                   <rect x="0" y="0" width="10" height="100" />
                   <rect x="25" y="0" width="10" height="100" />
                   <rect x="50" y="0" width="10" height="100" />
                   <rect x="75" y="0" width="10" height="100" />
                </g>
             )}
             
             {/* Motorsports Special: Visor */}
             {sport === 'motorsports' && (
                <path d="M25,25 L75,25 L78,45 L22,45 Z" fill="rgba(0,0,0,0.8)" />
             )}
             
             <rect width="100" height="100" fill="url(#jersey-mesh)" className="mix-blend-overlay opacity-30" />
          </g>

          {/* Details & Necklines per sport */}
          {sport === 'football' && (
            <path 
              d="M35,15 C35,15 42,21 50,21 C58,21 65,15 65,15 L62,13 C62,13 56,18 50,18 C44,18 38,13 38,13 Z" 
              fill={config.third || '#000'} 
              className="opacity-40"
            />
          )}
          {sport === 'nba' && (
            <path 
              d="M30,15 C30,15 40,25 50,25 C60,25 70,15 70,15 L68,13 C68,13 58,22 50,22 C42,22 32,13 32,13 Z" 
              fill={config.accent} 
              className="opacity-60"
            />
          )}

          
          <path d="M50,15 L15,25 L92,50 L50,15" fill="white" className="mix-blend-overlay opacity-10" />
        </svg>
      </div>
      
      {!hideName && size !== 'sm' && (
        <div className="mt-4 text-center">
           <h4 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-tighter leading-none group-hover:text-primary transition-all duration-300 drop-shadow-md">
              {name}
           </h4>
           <div className="flex items-center justify-center gap-1.5 mt-3 opacity-60">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.main }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.accent }} />
              <div className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">{code} ARENA</div>
           </div>
        </div>
      )}
    </div>
  );
}

