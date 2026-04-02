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

export function getFlagUrl(fifaCode: string) {
  const iso = FIFA_TO_ISO[fifaCode.toUpperCase()] || 'un'; // 'un' for unknown/default
  return `https://flagcdn.com/${iso}.svg`;
}
