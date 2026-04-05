// ═══════════════════════════════════════
// Scorendo Constants — Scoring Rules
// ═══════════════════════════════════════

export const SCORING = {
  CORRECT_WINNER: 3,
  EXACT_SCORE_BONUS: 5,
  STREAK_BONUS_PER: 1,      // +1 per consecutive correct
  DRAW_CORRECT_BONUS: 1,    // draws are harder to predict
} as const;

export const PHASE_MULTIPLIERS: Record<string, number> = {
  'group-stage': 1.0,
  'round-of-32': 1.25,
  'round-of-16': 1.5,
  'quarter-finals': 2.0,
  'semi-finals': 2.5,
  'third-place': 2.0,
  'final': 3.0,
} as const;

// ═══════════════════════════════════════
// Contest Types
// ═══════════════════════════════════════

export const CONTEST_TYPE_META = {
  GRAND_TOURNAMENT: {
    label: 'Grand Tournament',
    description: 'Predict all matches across the entire World Cup',
    icon: '🏆',
    color: 'gold',
  },
  PHASE: {
    label: 'Phase Challenge',
    description: 'Compete in a specific tournament phase',
    icon: '📊',
    color: 'pitch',
  },
  GROUP_BATTLE: {
    label: 'Group Battle',
    description: 'Focus on your favorite group',
    icon: '⚔️',
    color: 'match',
  },
  ZONE: {
    label: 'Zone Showdown',
    description: 'Predict matches in a specific host region',
    icon: '🌎',
    color: 'pitch',
  },
  MATCH_DAY: {
    label: 'Match Day',
    description: "Predict today's matches — quick and intense",
    icon: '📅',
    color: 'match',
  },
  WEEKLY: {
    label: 'Weekly Challenge',
    description: "This week's best predictor wins",
    icon: '📆',
    color: 'pitch',
  },
  BRACKET: {
    label: 'Bracket Knockout',
    description: 'Predict the entire knockout bracket',
    icon: '🔥',
    color: 'gold',
  },
} as const;

// ═══════════════════════════════════════
// Contest Tiers
// ═══════════════════════════════════════

export const CONTEST_TIER_META = {
  FREE: { label: 'Open', fee: 0, color: '#00E676', icon: '🟢' },
  MICRO: { label: 'Starter', fee: 0.01, color: '#3B82F6', icon: '🔵' },
  STANDARD: { label: 'Challenger', fee: 0.05, color: '#FFD700', icon: '🟡' },
  PREMIUM: { label: 'Elite', fee: 0.1, color: '#FF6B35', icon: '🟠' },
  VIP: { label: 'Legend', fee: 0.5, color: '#FF4757', icon: '🔴' },
} as const;

// ═══════════════════════════════════════
// Prize Distribution
// ═══════════════════════════════════════

export const PRIZE_DISTRIBUTION = [
  { position: 1, percentage: 30, label: '1st' },
  { position: 2, percentage: 15, label: '2nd' },
  { position: 3, percentage: 10, label: '3rd' },
  { position: 4, percentage: 5, label: '4th' },
  { position: 5, percentage: 5, label: '5th' },
  { position: 6, percentage: 4, label: '6th' },
  { position: 7, percentage: 3, label: '7th' },
  { position: 8, percentage: 3, label: '8th' },
  { position: 9, percentage: 3, label: '9th' },
  { position: 10, percentage: 2, label: '10th' },
] as const;

export const ORG_CUT_PERCENT = 15;
export const RESERVE_PERCENT = 5;
export const WINNERS_PERCENT = 80;

// ═══════════════════════════════════════
// Venue Zones
// ═══════════════════════════════════════

export const ZONE_META = {
  USA_EAST: { label: 'USA East', cities: 'NY, Philadelphia, Miami, Boston, Atlanta' },
  USA_CENTRAL: { label: 'USA Central', cities: 'Dallas, Houston, Kansas City' },
  USA_WEST: { label: 'USA West', cities: 'LA, San Francisco, Seattle' },
  MEXICO: { label: 'Mexico', cities: 'Mexico City, Guadalajara, Monterrey' },
  CANADA: { label: 'Canada', cities: 'Toronto, Vancouver' },
} as const;

// ═══════════════════════════════════════
// Solana / App Config
// ═══════════════════════════════════════

export const SOLANA_NETWORK = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet') as 'devnet' | 'mainnet-beta';
export const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
export const TREASURY_WALLET = process.env.NEXT_PUBLIC_TREASURY_WALLET || '';

export const WORLD_CUP_START = new Date('2026-06-11T00:00:00Z');
export const WORLD_CUP_END = new Date('2026-07-19T00:00:00Z');

export const ADMIN_WALLETS = (process.env.ADMIN_WALLETS || '').split(',').filter(Boolean);

// ═══════════════════════════════════════
// Legal Disclaimers
// ═══════════════════════════════════════

export const LEGAL = {
  FOOTER_DISCLAIMER:
    'Scorendo is a skill-based prediction competition platform. Participation is based on knowledge and analytical skill, not chance. Scorendo is not a gambling, betting, or wagering service. All funds are held in a non-custodial Solana smart contract — Scorendo never has custody of your assets. Void where prohibited by law. You must be 18+ to participate.',
  SKILL_BASED_NOTICE:
    'This is a skill-based competition. Free entry always available.',
} as const;

// ═══════════════════════════════════════
// Sport Arenas Meta
// ═══════════════════════════════════════

export const SPORT_META = {
  football: {
    name: 'Fútbol',
    slug: 'football',
    stats: 'Tournaments & Daily',
    color: 'from-emerald-500/20 to-emerald-900/40',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  motorsports: {
    name: 'Automovilismo',
    slug: 'motorsports',
    stats: 'Full Season & GP',
    color: 'from-red-500/20 to-red-900/40',
    accent: 'text-red-400',
    border: 'border-red-500/20',
  },
  nba: {
    name: 'NBA',
    slug: 'nba',
    stats: 'Playoffs & Dates',
    color: 'from-orange-500/20 to-orange-900/40',
    accent: 'text-orange-400',
    border: 'border-orange-500/20',
  },
  rugby: {
    name: 'Rugby',
    slug: 'rugby',
    stats: 'International Mix',
    color: 'from-amber-700/20 to-amber-900/40',
    accent: 'text-amber-500',
    border: 'border-amber-700/20',
  },
} as const;

export type SportSlug = keyof typeof SPORT_META;

