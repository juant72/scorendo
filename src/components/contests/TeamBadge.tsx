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
  'RMA': { main: '#FFFFFF', accent: '#F3F4F6', third: '#FEF08A', pattern: 'SOLID' },   
  'MCI': { main: '#7DD3FC', accent: '#38BDF8', third: '#FFFFFF', pattern: 'SOLID' },   
  'BAR': { main: '#1A365D', accent: '#702459', third: '#FEF08A', pattern: 'STRIPES' }, 
  'LIV': { main: '#DC2626', accent: '#991B1B', third: '#FEF08A', pattern: 'SOLID' },   
  
  'DEFAULT': { main: '#1E293B', accent: '#334155', pattern: 'SOLID' }
};

/**
 * Protocol to generate a baseline kit for teams missing from CONFIG
 */
const getFallbackConfig = (code: string) => {
  if (TEAM_CONFIG[code]) return TEAM_CONFIG[code];
  
  // Basic intelligence based on common code patterns
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
}

export function TeamBadge({ name, code, size = 'md', hideName = false }: TeamBadgeProps) {
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
        {/* ... existing SVG content ... */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl overflow-visible">
          {/* Main Jersey Shape - Athletic Athlete Fit Contour */}
          <defs>
            <clipPath id={`jersey-mask-${code}-${size}`}>
              <path d="M50,15 L72,18 L88,28 L94,52 L84,56 L78,42 L78,85 C78,92 72,95 65,95 L35,95 C28,95 22,92 22,85 L22,42 L16,56 L6,52 L12,28 L28,18 Z" />
            </clipPath>
          </defs>
          
          <path 
            d="M50,15 L72,18 L88,28 L94,52 L84,56 L78,42 L78,85 C78,92 72,95 65,95 L35,95 C28,95 22,92 22,85 L22,42 L16,56 L6,52 L12,28 L28,18 Z" 
            fill={config.main} 
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.5"
          />

          <g clipPath={`url(#jersey-mask-${code}-${size})`}>
             {config.pattern === 'SASH' && (
                <polygon points="75,10 85,15 25,90 15,85" fill={config.accent} />
             )}
             {config.pattern === 'STRIPES' && (
                <g fill={config.accent}>
                   <rect x="0" y="0" width="18" height="100" />
                   <rect x="41" y="0" width="18" height="100" />
                   <rect x="82" y="0" width="18" height="100" />
                </g>
             )}
             {config.pattern === 'STRIPES_FINE' && (
                <g fill={config.accent}>
                   <rect x="0" y="0" width="12" height="100" />
                   <rect x="22" y="0" width="12" height="100" />
                   <rect x="44" y="0" width="12" height="100" />
                   <rect x="66" y="0" width="12" height="100" />
                   <rect x="88" y="0" width="12" height="100" />
                </g>
             )}
             {config.pattern === 'BANDS' && (
                <g>
                  <rect x="0" y="42" width="100" height="18" fill={config.accent} />
                  <path d="M84,52 L94,48 L96,52 L86,56 Z" fill={config.accent} />
                  <path d="M16,52 L6,48 L4,52 L14,56 Z" fill={config.accent} />
                </g>
             )}
             {config.pattern === 'CHEVRON' && (
                <polygon points="50,45 100,15 100,28 50,58 0,28 0,15" fill={config.accent} />
             )}
             {config.pattern === 'HALVES' && (
                <rect x="50" y="0" width="50" height="100" fill={config.accent} />
             )}
             
             <rect width="100" height="100" fill="url(#jersey-mesh)" className="mix-blend-overlay opacity-50" />
          </g>

          <path d="M78,40 L78,85" stroke="black" strokeWidth="1.5" opacity="0.15" />
          <path d="M22,40 L22,85" stroke="black" strokeWidth="1.5" opacity="0.15" />
          
          <path 
             d="M35,15 C35,15 42,21 50,21 C58,21 65,15 65,15 L62,13 C62,13 56,18 50,18 C44,18 38,13 38,13 Z" 
             fill={config.third || '#000'} 
             className="opacity-70"
          />
          
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

