import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { MatchStatus } from '@prisma/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateShort(date: Date | string): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(d)
}

export function getStatusColor(status: MatchStatus): string {
  if (status === MatchStatus.LIVE) return 'text-primary animate-pulse font-bold';
  if (status === MatchStatus.FINISHED) return 'text-muted-foreground line-through';
  return 'text-muted-foreground';
}

const FIFA_TO_ISO: Record<string, string> = {
  ARG: 'ar', BRA: 'br', FRA: 'fr', ENG: 'gb-eng', ESP: 'es', GER: 'de',
  POR: 'pt', ITA: 'it', NED: 'nl', BEL: 'be', USA: 'us', MEX: 'mx',
  CAN: 'ca', URU: 'uy', COL: 'co', CRO: 'hr', MAR: 'ma', JPN: 'jp',
  SEN: 'sn', KOR: 'kr', SUI: 'ch', DEN: 'dk', ECU: 'ec', SRB: 'rs',
  IRN: 'ir', AUS: 'au', AUT: 'at', SWE: 'se', TUR: 'tr', HUN: 'hu',
  WAL: 'gb-wls', POL: 'pl', EGY: 'eg', NGA: 'ng', ALG: 'dz', KSA: 'sa',
  PER: 'pe', CHI: 'cl', VEN: 've', PAR: 'py', CIV: 'ci', GHA: 'gh',
  QAT: 'qa', NZL: 'nz', SCO: 'gb-sct', CZE: 'cz', NOR: 'no', SVK: 'sk'
};

export function getTeamLogoUrl(teamCode: string, teamName: string) {
  const code = teamCode.toUpperCase();
  const iso = FIFA_TO_ISO[code];
  
  if (iso) {
    return `https://flagcdn.com/${iso}.svg`;
  }

  // Define professional team colors
  const colors: Record<string, { primary: string; accent: string }> = {
    'RIV': { primary: '#ff0000', accent: '#ffffff' }, // River: Red/White
    'BOC': { primary: '#0033a0', accent: '#ffda00' }, // Boca: Blue/Yellow
    'RAC': { primary: '#00bcd4', accent: '#ffffff' }, // Racing: Light Blue/White
    'IND': { primary: '#d32f2f', accent: '#ffffff' }, // Independiente: Red/White
    'RMA': { primary: '#ffffff', accent: '#000080' }, // Madrid: White/Blue
    'MCI': { primary: '#6cbbe5', accent: '#ffffff' }, // Man City: Sky Blue
    'BAR': { primary: '#a50044', accent: '#edbb00' }, // Barca: Blaugrana
    'BAY': { primary: '#dc052d', accent: '#ffffff' }, // Bayern: Red
  };

  const scheme = colors[code] || { primary: '#333333', accent: '#666666' };
  
  // High-end Shield SVG (Crest)
  const svg = `
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 4L8 14V30C8 42 16 52 32 58C48 52 56 42 56 30V14L32 4Z" fill="${scheme.primary}" stroke="white" stroke-width="2"/>
      <path d="M32 8L12 16V30C12 40 18 48 32 54C46 48 52 40 52 30V16L32 8Z" fill="${scheme.accent}" opacity="0.3"/>
      <path d="M32 18V46M20 32H44" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
    </svg>
  `.trim().replace(/\s+/g, ' ');

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
