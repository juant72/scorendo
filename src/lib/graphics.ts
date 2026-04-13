/**
 * ARENA ALLEGORY ENGINE V2.0 (PRAGMATIC)
 * Centralized logic for assigning imagery to contests and competitions.
 * Ensures consistent branding across the platform with robust fallbacks.
 */

type ArenaMedia = {
  banner: string;
  badge: string;
  accent: string;
  color: string;
};

const DEFAULT_IMAGES = {
  FOOTBALL: '/arenas/afa_lpf.png',
  F1: '/arenas/f1_championship.png',
  NBA: 'https://images.unsplash.com/photo-1541339905195-03f4770d4071?q=80&w=2000&auto=format&fit=crop',
  RUGBY: '/stadium_hero.png',
  GENERAL: '/arenas/general_arena.png'
};

const DEFAULT_BADGES = {
  FOOTBALL: '/badge_afa_black.png',
  F1: '/badge_f1_white.png',
  NBA: '/badge_worldcup_black.png',
  GENERAL: '/badge_worldcup_black.png'
};

export function getArenaImagery(item: any): ArenaMedia {
  if (!item) return { banner: DEFAULT_IMAGES.GENERAL, badge: DEFAULT_BADGES.GENERAL, accent: 'text-primary', color: '#00E676' };

  const name = (item.name || '').toLowerCase();
  const slug = (item.slug || '').toLowerCase();
  
  // 1. Identify Sport Context
  const isF1 = name.includes('f1') || name.includes('formula') || name.includes('prix') || name.includes('race') || slug.includes('motor') || slug.includes('f1');
  const isNBA = name.includes('nba') || name.includes('basket') || slug.includes('nba') || slug.includes('basket');
  const isFootball = name.includes('afa') || name.includes('lpf') || name.includes('uefa') || name.includes('champion') || name.includes('cup') || name.includes('league') || slug.includes('football') || slug.includes('soccer') || name.includes('argentina') || name.includes('world cup');
  const isRugby = name.includes('rugby') || slug.includes('rugby') || name.includes('puma') || name.includes('six nation');

  // 2. Determine Banner
  let banner = item.bannerUrl || item.bgImage || item.customLogoUrl;
  
  if (!banner) {
    if (name.includes('monaco')) banner = '/arenas/monaco.png';
    else if (isF1) banner = DEFAULT_IMAGES.F1;
    else if (name.includes('uefa') || name.includes('champion')) banner = '/arenas/uefa.png';
    else if (isFootball) banner = DEFAULT_IMAGES.FOOTBALL;
    else if (isNBA) banner = DEFAULT_IMAGES.NBA;
    else if (isRugby) banner = DEFAULT_IMAGES.RUGBY;
    else banner = DEFAULT_IMAGES.GENERAL;
  }

  // 3. Determine Badge
  let badge = item.logoUrl || item.badgeUrl;
  if (!badge) {
    if (name.includes('afa') || name.includes('lpf') || name.includes('argentina')) badge = '/badge_afa.png';
    else if (name.includes('uefa') || name.includes('champion')) badge = '/badge_euro.png';
    else if (isF1) badge = '/badge_f1_white.png';
    else if (isNBA) badge = '/badge_worldcup.png';
    else if (isFootball) badge = '/badge_worldcup.png';
    else badge = '/badge_worldcup.png';
  }

  // 4. Determine Accents
  let accent = 'text-primary';
  let color = '#00E676';

  if (isF1) { accent = 'text-red-400'; color = '#FF4444'; }
  else if (isNBA) { accent = 'text-orange-400'; color = '#FF7700'; }
  else if (isRugby) { accent = 'text-amber-400'; color = '#C8A240'; }

  return { banner, badge, accent, color };
}
