'use client';

import React from 'react';
import { Shield } from 'lucide-react';

interface KitConfig {
  main: string;
  accent: string;
  third?: string;
  pattern: 
    | 'SASH' 
    | 'STRIPES' 
    | 'STRIPES_FINE' 
    | 'BANDS' 
    | 'SOLID' 
    | 'CHEVRON' 
    | 'HALVES' 
    | 'CROSS' 
    | 'CHECKERED' 
    | 'HOOPS' 
    | 'PINSTRIPES' 
    | 'GRADIENT' 
    | 'CYBER' 
    | 'SLEEVES_DIFF' 
    | 'DIAGONAL_STRIPES';
  brand?: 
    | 'nike' 
    | 'adidas' 
    | 'puma' 
    | 'umbro' 
    | 'kappa' 
    | 'marathon' 
    | 'macron' 
    | 'joma' 
    | 'newbalance' 
    | 'underarmour' 
    | 'hummel' 
    | 'reebok' 
    | 'tempo' 
    | 'jako';
}

interface TeamConfig extends KitConfig {
  away?: KitConfig;
}

const TEAM_CONFIG: Record<string, TeamConfig> = {
  // ARGENTINE LEAGUE (LPF)
  'RIV': { 
    main: '#FFFFFF', accent: '#EF4444', third: '#1C1917', pattern: 'SASH', brand: 'adidas',
    away: { main: '#1C1917', accent: '#EF4444', third: '#FFFFFF', pattern: 'SASH', brand: 'adidas' }
  },    
  'BOC': { 
    main: '#0B2265', accent: '#FACC15', third: '#FACC15', pattern: 'BANDS', brand: 'adidas',
    away: { main: '#FFFFFF', accent: '#0B2265', third: '#FACC15', pattern: 'BANDS', brand: 'adidas' }
  },   
  'RAC': { 
    main: '#6CABDD', accent: '#FFFFFF', third: '#1E293B', pattern: 'STRIPES', brand: 'kappa',
    away: { main: '#1E293B', accent: '#6CABDD', third: '#FFFFFF', pattern: 'SOLID', brand: 'kappa' }
  }, 
  'IND': { 
    main: '#E30613', accent: '#FFFFFF', third: '#E30613', pattern: 'SOLID', brand: 'puma',
    away: { main: '#FFFFFF', accent: '#E30613', third: '#002855', pattern: 'SOLID', brand: 'puma' }
  },   
  'SLO': { 
    main: '#0F2050', accent: '#DC2626', third: '#FFFFFF', pattern: 'STRIPES', brand: 'nike',
    away: { main: '#FFFFFF', accent: '#0F2050', third: '#DC2626', pattern: 'SOLID', brand: 'nike' }
  }, 
  'TAL': { 
    main: '#FFFFFF', accent: '#0B2265', third: '#0B2265', pattern: 'STRIPES', brand: 'joma',
    away: { main: '#0B2265', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'SOLID', brand: 'joma' }
  },
  'LAN': { 
    main: '#5B0E2D', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'SOLID', brand: 'umbro',
    away: { main: '#FFFFFF', accent: '#5B0E2D', third: '#5B0E2D', pattern: 'SOLID', brand: 'umbro' }
  },
  'NOB': { 
    main: '#D32E2E', accent: '#1A1A1A', third: '#FFFFFF', pattern: 'HALVES', brand: 'adidas',
    away: { main: '#FFFFFF', accent: '#D32E2E', third: '#1A1A1A', pattern: 'SOLID', brand: 'adidas' }
  },
  'VEL': { 
    main: '#FFFFFF', accent: '#004F9F', third: '#004F9F', pattern: 'CHEVRON', brand: 'nike',
    away: { main: '#004F9F', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'CHEVRON', brand: 'nike' }
  },
  'CEN': { 
    main: '#0C2340', accent: '#FED141', third: '#FFFFFF', pattern: 'STRIPES', brand: 'umbro',
    away: { main: '#FFFFFF', accent: '#0C2340', third: '#FED141', pattern: 'SOLID', brand: 'umbro' }
  },
  'EST': { 
    main: '#FFFFFF', accent: '#E30613', third: '#E30613', pattern: 'STRIPES', brand: 'adidas',
    away: { main: '#E30613', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'SOLID', brand: 'adidas' }
  },
  'GIM': { 
    main: '#FFFFFF', accent: '#0A1172', third: '#0A1172', pattern: 'BANDS', brand: 'hummel',
    away: { main: '#0A1172', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'BANDS', brand: 'hummel' }
  },
  'HUR': { 
    main: '#FFFFFF', accent: '#E30613', third: '#FFFFFF', pattern: 'SOLID', brand: 'kappa',
    away: { main: '#E30613', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'SOLID', brand: 'kappa' }
  },
  'ARG_JRS': { 
    main: '#E30613', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'SASH', brand: 'umbro',
    away: { main: '#FFFFFF', accent: '#E30613', third: '#E30613', pattern: 'SASH', brand: 'umbro' }
  },
  'BAN': { 
    main: '#FFFFFF', accent: '#166534', third: '#166534', pattern: 'SASH', brand: 'puma',
    away: { main: '#166534', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'SASH', brand: 'puma' }
  },
  'TIG': { 
    main: '#1E40AF', accent: '#E30613', third: '#E30613', pattern: 'BANDS', brand: 'kappa',
    away: { main: '#FFFFFF', accent: '#1E40AF', third: '#E30613', pattern: 'BANDS', brand: 'kappa' }
  },
  'PLA': { 
    main: '#FFFFFF', accent: '#5C3E35', third: '#5C3E35', pattern: 'BANDS', brand: 'hummel',
    away: { main: '#5C3E35', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'SOLID', brand: 'hummel' }
  },
  'UNI': { 
    main: '#FFFFFF', accent: '#E30613', third: '#E30613', pattern: 'STRIPES', brand: 'kappa',
    away: { main: '#E30613', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'SOLID', brand: 'kappa' }
  },
  'INS': { 
    main: '#FFFFFF', accent: '#E30613', third: '#E30613', pattern: 'STRIPES', brand: 'puma',
    away: { main: '#E30613', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'SOLID', brand: 'puma' }
  },
  'GOD': { 
    main: '#1E40AF', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'STRIPES', brand: 'kappa',
    away: { main: '#FFFFFF', accent: '#1E40AF', third: '#1E40AF', pattern: 'SOLID', brand: 'kappa' }
  },
  'TUC': { 
    main: '#74ACDF', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'STRIPES', brand: 'umbro',
    away: { main: '#0F2050', accent: '#74ACDF', third: '#FFFFFF', pattern: 'SOLID', brand: 'umbro' }
  },
  'SAR': { 
    main: '#166534', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'SOLID', brand: 'puma',
    away: { main: '#FFFFFF', accent: '#166534', third: '#166534', pattern: 'SOLID', brand: 'puma' }
  },
  'BEL_GR': { 
    main: '#75AADB', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'SOLID', brand: 'hummel',
    away: { main: '#0F2050', accent: '#75AADB', third: '#FFFFFF', pattern: 'SOLID', brand: 'hummel' }
  },
  'CCB': { 
    main: '#FFFFFF', accent: '#1C1917', third: '#1C1917', pattern: 'STRIPES', brand: 'umbro',
    away: { main: '#1C1917', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'SOLID', brand: 'umbro' }
  },
  'BAR_CAS': { 
    main: '#FFFFFF', accent: '#E30613', third: '#E30613', pattern: 'STRIPES', brand: 'joma',
    away: { main: '#E30613', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'SOLID', brand: 'joma' }
  },
  'DEF': { 
    main: '#FEE100', accent: '#00875A', third: '#00875A', pattern: 'SOLID', brand: 'kappa',
    away: { main: '#00875A', accent: '#FEE100', third: '#FEE100', pattern: 'SOLID', brand: 'kappa' }
  },
  'RIE': { 
    main: '#1C1917', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'SOLID', brand: 'adidas',
    away: { main: '#FFFFFF', accent: '#1C1917', third: '#1C1917', pattern: 'SOLID', brand: 'adidas' }
  },
  'IRV': { 
    main: '#0F2050', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'SOLID', brand: 'nike',
    away: { main: '#FFFFFF', accent: '#0F2050', third: '#0F2050', pattern: 'SOLID', brand: 'nike' }
  },
  
  // NATIONAL TEAMS (FWC 2026)
  'ARG': { 
    main: '#FFFFFF', accent: '#74ACDF', third: '#FACC15', pattern: 'STRIPES', brand: 'adidas',
    away: { main: '#0F172A', accent: '#38BDF8', third: '#FFFFFF', pattern: 'CYBER', brand: 'adidas' }
  },
  'BRA': { 
    main: '#FDE100', accent: '#009B3A', third: '#009B3A', pattern: 'SOLID', brand: 'nike',
    away: { main: '#002F6C', accent: '#FDE100', third: '#009B3A', pattern: 'SLEEVES_DIFF', brand: 'nike' }
  },
  'MEX': { 
    main: '#006847', accent: '#FFFFFF', third: '#C8102E', pattern: 'CYBER', brand: 'adidas',
    away: { main: '#FFFDF9', accent: '#701A10', third: '#006847', pattern: 'CHEVRON', brand: 'adidas' }
  },
  'USA': { 
    main: '#FFFFFF', accent: '#0A1C2A', third: '#D11919', pattern: 'SOLID', brand: 'nike',
    away: { main: '#0A1C2A', accent: '#D11919', third: '#FFFFFF', pattern: 'HALVES', brand: 'nike' }
  },
  'CAN': { 
    main: '#C8102E', accent: '#FFFFFF', third: '#C8102E', pattern: 'SLEEVES_DIFF', brand: 'nike',
    away: { main: '#FFFFFF', accent: '#C8102E', third: '#D1D5DB', pattern: 'PINSTRIPES', brand: 'nike' }
  },
  'ENG': { 
    main: '#FFFFFF', accent: '#0B1121', third: '#C8102E', pattern: 'SOLID', brand: 'nike',
    away: { main: '#0B1121', accent: '#C8102E', third: '#FFFFFF', pattern: 'SOLID', brand: 'nike' }
  },
  'RSA': { 
    main: '#FFCD00', accent: '#007A48', third: '#FFFFFF', pattern: 'SOLID', brand: 'umbro',
    away: { main: '#007A48', accent: '#FFCD00', third: '#FFFFFF', pattern: 'SOLID', brand: 'umbro' }
  },
  'KOR': { 
    main: '#EE1C25', accent: '#1C1917', third: '#FFFFFF', pattern: 'SOLID', brand: 'nike',
    away: { main: '#111111', accent: '#38BDF8', third: '#F43F5E', pattern: 'CYBER', brand: 'nike' }
  },
  'CZE': { 
    main: '#D21226', accent: '#FFFFFF', third: '#1E40AF', pattern: 'SOLID', brand: 'puma',
    away: { main: '#FFFFFF', accent: '#D21226', third: '#1E40AF', pattern: 'SOLID', brand: 'puma' }
  },
  'SUI': { 
    main: '#D52B1E', accent: '#FFFFFF', third: '#D52B1E', pattern: 'PINSTRIPES', brand: 'puma',
    away: { main: '#FFFFFF', accent: '#D52B1E', third: '#D1D5DB', pattern: 'SOLID', brand: 'puma' }
  },
  'QAT': { 
    main: '#8A1538', accent: '#FFFFFF', third: '#8A1538', pattern: 'SOLID', brand: 'nike',
    away: { main: '#FFFFFF', accent: '#8A1538', third: '#8A1538', pattern: 'SOLID', brand: 'nike' }
  },
  'BIH': { 
    main: '#002F6C', accent: '#FFCD00', third: '#FFFFFF', pattern: 'SOLID', brand: 'puma',
    away: { main: '#FFFFFF', accent: '#002F6C', third: '#FFCD00', pattern: 'SOLID', brand: 'puma' }
  },
  'MAR': { 
    main: '#C1272D', accent: '#006233', third: '#FFD700', pattern: 'SOLID', brand: 'puma',
    away: { main: '#FFFFFF', accent: '#006233', third: '#C1272D', pattern: 'BANDS', brand: 'puma' }
  },
  'HAI': { 
    main: '#002F6C', accent: '#E30613', third: '#FFFFFF', pattern: 'SOLID', brand: 'umbro',
    away: { main: '#FFFFFF', accent: '#002F6C', third: '#E30613', pattern: 'SOLID', brand: 'umbro' }
  },
  'SCO': { 
    main: '#132B4F', accent: '#FFFFFF', third: '#D0E8F5', pattern: 'SOLID', brand: 'adidas',
    away: { main: '#D0E8F5', accent: '#132B4F', third: '#FFFFFF', pattern: 'SOLID', brand: 'adidas' }
  },
  'PAR': { 
    main: '#FFFFFF', accent: '#E30613', third: '#002F6C', pattern: 'STRIPES', brand: 'puma',
    away: { main: '#002F6C', accent: '#FFFFFF', third: '#E30613', pattern: 'SOLID', brand: 'puma' }
  },
  'AUS': { 
    main: '#FFD100', accent: '#008751', third: '#FFFFFF', pattern: 'SOLID', brand: 'nike',
    away: { main: '#0B1E2D', accent: '#34D399', third: '#FFFFFF', pattern: 'SOLID', brand: 'nike' }
  },
  'TUR': { 
    main: '#FFFFFF', accent: '#E30A17', third: '#E30A17', pattern: 'BANDS', brand: 'nike',
    away: { main: '#E30A17', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'SOLID', brand: 'nike' }
  },
  'GER': { 
    main: '#FFFFFF', accent: '#000000', third: '#D52B1E', pattern: 'SOLID', brand: 'adidas',
    away: { main: '#311042', accent: '#D946EF', third: '#FFFFFF', pattern: 'GRADIENT', brand: 'adidas' }
  },
  'ECU': { 
    main: '#FFD100', accent: '#002F6C', third: '#E30613', pattern: 'SLEEVES_DIFF', brand: 'marathon',
    away: { main: '#002F6C', accent: '#FFD100', third: '#FFFFFF', pattern: 'SOLID', brand: 'marathon' }
  },
  'CIV': { 
    main: '#FF8200', accent: '#008751', third: '#FFFFFF', pattern: 'SOLID', brand: 'puma',
    away: { main: '#FFFFFF', accent: '#FF8200', third: '#008751', pattern: 'SOLID', brand: 'puma' }
  },
  'CUR': { 
    main: '#002F6C', accent: '#FFD100', third: '#FFFFFF', pattern: 'SOLID', brand: 'puma',
    away: { main: '#FFFFFF', accent: '#002F6C', third: '#FFD100', pattern: 'SOLID', brand: 'puma' }
  },
  'NED': { 
    main: '#FF4F00', accent: '#FFFFFF', third: '#0F1E36', pattern: 'SOLID', brand: 'nike',
    away: { main: '#0F1E36', accent: '#FF4F00', third: '#FFFFFF', pattern: 'SOLID', brand: 'nike' }
  },
  'JPN': { 
    main: '#002D62', accent: '#38BDF8', third: '#E30613', pattern: 'CYBER', brand: 'adidas',
    away: { main: '#FFFFFF', accent: '#002D62', third: '#E30613', pattern: 'SOLID', brand: 'adidas' }
  },
  'TUN': { 
    main: '#FFFFFF', accent: '#E30613', third: '#E30613', pattern: 'SOLID', brand: 'kappa',
    away: { main: '#E30613', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'SOLID', brand: 'kappa' }
  },
  'SWE': { 
    main: '#FECC00', accent: '#002F6C', third: '#002F6C', pattern: 'SOLID', brand: 'adidas',
    away: { main: '#002F6C', accent: '#FECC00', third: '#FECC00', pattern: 'SOLID', brand: 'adidas' }
  },
  'BEL': { 
    main: '#7C0C2B', accent: '#000000', third: '#FACC15', pattern: 'SOLID', brand: 'adidas',
    away: { main: '#8EBAE6', accent: '#FFFFFF', third: '#451A03', pattern: 'SOLID', brand: 'adidas' }
  },
  'IRN': { 
    main: '#FFFFFF', accent: '#008751', third: '#E30613', pattern: 'SOLID', brand: 'jako',
    away: { main: '#E30613', accent: '#FFFFFF', third: '#008751', pattern: 'SOLID', brand: 'jako' }
  },
  'EGY': { 
    main: '#E30A17', accent: '#FFFFFF', third: '#000000', pattern: 'SOLID', brand: 'puma',
    away: { main: '#FFFFFF', accent: '#E30A17', third: '#000000', pattern: 'SOLID', brand: 'puma' }
  },
  'NZL': { 
    main: '#FFFFFF', accent: '#94A3B8', third: '#000000', pattern: 'SOLID', brand: 'nike',
    away: { main: '#000000', accent: '#FFFFFF', third: '#94A3B8', pattern: 'SOLID', brand: 'nike' }
  },
  'ESP': { 
    main: '#C60B1E', accent: '#FACC15', third: '#002F6C', pattern: 'SOLID', brand: 'adidas',
    away: { main: '#F1F5B4', accent: '#3B82F6', third: '#C60B1E', pattern: 'SOLID', brand: 'adidas' }
  },
  'URU': { 
    main: '#74ACDF', accent: '#FFFFFF', third: '#000000', pattern: 'SOLID', brand: 'nike',
    away: { main: '#FFFFFF', accent: '#74ACDF', third: '#FACC15', pattern: 'SOLID', brand: 'nike' }
  },
  'KSA': { 
    main: '#FFFFFF', accent: '#006C35', third: '#006C35', pattern: 'SOLID', brand: 'adidas',
    away: { main: '#006C35', accent: '#FFFFFF', third: '#FFFFFF', pattern: 'SOLID', brand: 'adidas' }
  },
  'CPV': { 
    main: '#002F6C', accent: '#E30613', third: '#FACC15', pattern: 'SOLID', brand: 'tempo',
    away: { main: '#FFFFFF', accent: '#002F6C', third: '#E30613', pattern: 'SOLID', brand: 'tempo' }
  },
  'FRA': { 
    main: '#0A2240', accent: '#FFFFFF', third: '#E30613', pattern: 'SOLID', brand: 'nike',
    away: { main: '#FFFFFF', accent: '#0A2240', third: '#E30613', pattern: 'PINSTRIPES', brand: 'nike' }
  },
  'SEN': { 
    main: '#FFFFFF', accent: '#008751', third: '#E30613', pattern: 'SOLID', brand: 'puma',
    away: { main: '#008751', accent: '#FFFFFF', third: '#FFD100', pattern: 'SOLID', brand: 'puma' }
  },
  'NOR': { 
    main: '#D21226', accent: '#002F6C', third: '#FFFFFF', pattern: 'HALVES', brand: 'nike',
    away: { main: '#EBF5FB', accent: '#5DADE2', third: '#002F6C', pattern: 'CYBER', brand: 'nike' }
  },
  'IRQ': { 
    main: '#006F3D', accent: '#FFFFFF', third: '#C6A15B', pattern: 'SOLID', brand: 'jako',
    away: { main: '#FFFFFF', accent: '#006F3D', third: '#C6A15B', pattern: 'SOLID', brand: 'jako' }
  },
  'ALG': { 
    main: '#FFFFFF', accent: '#008751', third: '#E30613', pattern: 'SOLID', brand: 'adidas',
    away: { main: '#008751', accent: '#FFFFFF', third: '#E30613', pattern: 'SOLID', brand: 'adidas' }
  },
  'AUT': { 
    main: '#C60B1E', accent: '#FFFFFF', third: '#990000', pattern: 'SOLID', brand: 'puma',
    away: { main: '#FFFFFF', accent: '#C60B1E', third: '#000000', pattern: 'SOLID', brand: 'puma' }
  },
  'JOR': { 
    main: '#E30613', accent: '#FFFFFF', third: '#008751', pattern: 'SOLID', brand: 'jako',
    away: { main: '#FFFFFF', accent: '#E30613', third: '#008751', pattern: 'SOLID', brand: 'jako' }
  },
  'POR': { 
    main: '#C60B1E', accent: '#006233', third: '#FFD700', pattern: 'SOLID', brand: 'nike',
    away: { main: '#F0EFEB', accent: '#38BDF8', third: '#006233', pattern: 'CYBER', brand: 'nike' }
  },
  'COL': { 
    main: '#FFD100', accent: '#002F6C', third: '#E30613', pattern: 'SOLID', brand: 'adidas',
    away: { main: '#0B0D1B', accent: '#FF8200', third: '#E30613', pattern: 'SOLID', brand: 'adidas' }
  },
  'UZB': { 
    main: '#FFFFFF', accent: '#002F6C', third: '#38BDF8', pattern: 'SOLID', brand: 'jako',
    away: { main: '#002F6C', accent: '#FFFFFF', third: '#38BDF8', pattern: 'SOLID', brand: 'jako' }
  },
  'COD': { 
    main: '#0087D1', accent: '#E30613', third: '#FFD100', pattern: 'SASH', brand: 'umbro',
    away: { main: '#FFFFFF', accent: '#0087D1', third: '#E30613', pattern: 'SOLID', brand: 'umbro' }
  },
  'CRO': { 
    main: '#FFFFFF', accent: '#C60B1E', third: '#002F6C', pattern: 'CHECKERED', brand: 'nike',
    away: { main: '#002F6C', accent: '#3B82F6', third: '#FFFFFF', pattern: 'CHECKERED', brand: 'nike' }
  },
  'GHA': { 
    main: '#FFFFFF', accent: '#000000', third: '#E30613', pattern: 'SOLID', brand: 'puma',
    away: { main: '#E30613', accent: '#FFD100', third: '#000000', pattern: 'SOLID', brand: 'puma' }
  },
  'PAN': { 
    main: '#E30613', accent: '#002F6C', third: '#FFFFFF', pattern: 'SOLID', brand: 'reebok',
    away: { main: '#FFFFFF', accent: '#E30613', third: '#002F6C', pattern: 'SOLID', brand: 'reebok' }
  },
  
  // EUROPEAN CLUBS
  'RMA': { 
    main: '#FFFFFF', accent: '#F3F4F6', third: '#FEF08A', pattern: 'SOLID', brand: 'adidas',
    away: { main: '#1C1917', accent: '#FEF08A', third: '#FFFFFF', pattern: 'SOLID', brand: 'adidas' }
  },   
  'MCI': { 
    main: '#7DD3FC', accent: '#38BDF8', third: '#FFFFFF', pattern: 'SOLID', brand: 'puma',
    away: { main: '#0F172A', accent: '#7DD3FC', third: '#FFFFFF', pattern: 'SOLID', brand: 'puma' }
  },   
  'BAR': { 
    main: '#1A365D', accent: '#702459', third: '#FEF08A', pattern: 'STRIPES', brand: 'nike',
    away: { main: '#FFFFFF', accent: '#1A365D', third: '#702459', pattern: 'SOLID', brand: 'nike' }
  }, 
  'LIV': { 
    main: '#DC2626', accent: '#991B1B', third: '#FEF08A', pattern: 'SOLID', brand: 'nike',
    away: { main: '#FFFFFF', accent: '#166534', third: '#DC2626', pattern: 'SOLID', brand: 'nike' }
  },

  // MOTORSPORTS (F1 Teams)
  'RBR': { main: '#0600EF', accent: '#FFEB00', third: '#FFFFFF', pattern: 'SOLID', brand: 'puma' },
  'FER': { main: '#E80020', accent: '#FFFFFF', third: '#000000', pattern: 'SOLID', brand: 'puma' },
  'MER': { main: '#00D2BE', accent: '#FFFFFF', third: '#000000', pattern: 'SOLID', brand: 'puma' },
  'MCL': { main: '#FF8700', accent: '#47C7FC', third: '#000000', pattern: 'SOLID', brand: 'puma' },

  // NBA Teams
  'LAL': { main: '#552583', accent: '#FDB927', third: '#FFFFFF', pattern: 'SOLID', brand: 'nike' },
  'GSW': { main: '#1D428A', accent: '#FFC72C', third: '#FFFFFF', pattern: 'SOLID', brand: 'nike' },
  'CHI': { main: '#CE1141', accent: '#000000', third: '#FFFFFF', pattern: 'SOLID', brand: 'nike' },
  'BOS': { main: '#007A33', accent: '#BA9653', third: '#FFFFFF', pattern: 'SOLID', brand: 'nike' },
  
  'DEFAULT': { main: '#1E293B', accent: '#334155', pattern: 'SOLID' }
};

const isPlaceholderCode = (code: string): boolean => {
  return /^[123][A-L]/.test(code) || /^3[A-Z-]+/.test(code) || /^[WL]\d+$/.test(code);
};

const getPlaceholderConfig = (code: string) => {
  if (code.startsWith('W')) {
    return {
      main: '#050B14', 
      accent: '#06B6D4', 
      third: '#00E676',
      pattern: 'CYBER' as const
    };
  } else if (code.startsWith('L')) {
    return {
      main: '#0B0F19', 
      accent: '#4B5563', 
      third: '#374151',
      pattern: 'SOLID' as const
    };
  } else {
    const isWinner = code.startsWith('1');
    return {
      main: '#050B14',
      accent: isWinner ? '#D946EF' : '#6366F1',
      third: '#FACC15',
      pattern: 'CYBER' as const
    };
  }
};

const getFallbackConfig = (code: string): TeamConfig => {
  if (TEAM_CONFIG[code]) return TEAM_CONFIG[code];
  if (isPlaceholderCode(code)) return getPlaceholderConfig(code) as TeamConfig;
  
  const hash = code.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  const hue = hash % 360;
  
  return {
    main: `hsl(${hue}, 45%, 35%)`,
    accent: `hsl(${hue}, 45%, 55%)`,
    pattern: 'SOLID' as const
  } as TeamConfig;
};

function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  if (hex.startsWith('hsl')) {
    const match = hex.match(/\d+/g);
    if (match) {
      const l = parseInt(match[2]);
      if (l < 30) return { r: 20, g: 20, b: 20 };
      if (l > 75) return { r: 240, g: 240, b: 240 };
      return { r: 128, g: 128, b: 128 };
    }
  }

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function shouldAwayTeamUseAwayKit(homeCode: string, awayCode: string): boolean {
  const homeConfig = getFallbackConfig(homeCode);
  const awayConfig = getFallbackConfig(awayCode);
  
  const homeRgb = hexToRgb(homeConfig.main);
  const awayRgb = hexToRgb(awayConfig.main);
  
  if (!homeRgb || !awayRgb) return false;
  
  // Calculate Euclidean distance in RGB space
  const distance = Math.sqrt(
    Math.pow(homeRgb.r - awayRgb.r, 2) +
    Math.pow(homeRgb.g - awayRgb.g, 2) +
    Math.pow(homeRgb.b - awayRgb.b, 2)
  );
  
  // Distance threshold: if distance is less than 110, they are too similar!
  if (distance < 110) {
    return true;
  }
  
  // Check if both are very light or both are very dark
  const homeBright = (homeRgb.r * 299 + homeRgb.g * 587 + homeRgb.b * 114) / 1000;
  const awayBright = (awayRgb.r * 299 + awayRgb.g * 587 + awayRgb.b * 114) / 1000;
  
  const isHomeLight = homeBright > 175;
  const isAwayLight = awayBright > 175;
  const isHomeDark = homeBright < 80;
  const isAwayDark = awayBright < 80;
  
  if (isHomeLight && isAwayLight) {
    return true; 
  }
  if (isHomeDark && isAwayDark) {
    return true; 
  }
  
  return false;
}

interface TeamBadgeProps {
  name: string;
  code: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hideName?: boolean;
  sport?: 'football' | 'motorsports' | 'nba';
  isAway?: boolean;
  homeCode?: string; 
}

export function TeamBadge({ name, code, size = 'md', hideName = false, sport = 'football', isAway = false, homeCode }: TeamBadgeProps) {
  let config = getFallbackConfig(code);
  
  let useAwayStyle = isAway;
  if (homeCode) {
    useAwayStyle = shouldAwayTeamUseAwayKit(homeCode, code);
  }

  if (useAwayStyle && config.away) {
    config = { ...config, ...config.away };
  } else if (useAwayStyle) {
    const isLight = config.main === '#FFFFFF' || config.main === '#FFFDF9' || config.main === '#F3F4F6' || config.main === '#A2DDFE' || (config.main.startsWith('hsl') && config.main.includes('80%'));
    config = {
      ...config,
      main: isLight 
        ? (config.accent !== '#FFFFFF' && config.accent !== '#ffffff' ? config.accent : '#0F172A') 
        : '#FFFFFF',
      accent: isLight ? '#FFFFFF' : config.main,
      pattern: 'SOLID' as const
    };
  }

  const dimensions = size === 'sm' ? { width: 52, height: 52 } : 
                    size === 'lg' ? { width: 130, height: 130 } : 
                    size === 'xl' ? { width: 180, height: 180 } :
                    { width: 90, height: 90 };

  const logoColor = config.third && config.third !== 'transparent'
    ? config.third
    : (config.main === '#FFFFFF' || config.main === '#FFFDF9' || config.main === '#ffffff' || config.main === '#F3F4F6')
      ? (config.accent !== '#FFFFFF' && config.accent !== '#ffffff' ? config.accent : '#1E293B')
      : '#FFFFFF';

  const kitLabel = useAwayStyle ? 'Away Kit' : 'Home Kit';
  const hasChanged = isAway && useAwayStyle;
  const hoverTitle = `${name} - ${kitLabel}${hasChanged && homeCode ? ' (Changed due to color clash)' : ''}`;

  return (
    <div className="flex flex-col items-center gap-1.5" title={hoverTitle}>
      <div 
        className="relative flex items-center justify-center transition-transform hover:scale-110 duration-500"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl overflow-visible">
          <defs>
            <clipPath id={`badge-mask-${code}-${size}`}>
              {sport === 'football' && (
                <path d="M50,16 C45,16 38,15 36,16 C30,18 26,19 26,19 C26,19 16,22 10,48 C9,50 14,54 18,52 C21,50 24,40 24,38 L24,85 C24,91 30,94 36,94 L64,94 C70,94 76,91 76,85 L76,38 C76,40 79,50 82,52 C86,54 91,50 90,48 C84,22 74,19 74,19 C74,19 70,18 64,16 C62,15 55,16 50,16 Z" />
              )}
              {sport === 'motorsports' && (
                <path d="M50,10 C25,10 15,25 15,50 C15,75 30,90 50,90 C70,90 85,75 85,50 C85,25 75,10 50,10 M25,55 L75,55 L75,65 C75,75 65,80 50,80 C35,80 25,75 25,65 Z" />
              )}
              {sport === 'nba' && (
                <path d="M30,15 L40,15 C45,25 55,25 60,15 L70,15 L75,40 L70,90 L30,90 L25,40 Z" />
              )}
            </clipPath>

            {config.pattern === 'GRADIENT' && (
              <linearGradient id={`grad-${code}-${isAway ? 'away' : 'home'}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={config.main} />
                <stop offset="100%" stopColor={config.accent} />
              </linearGradient>
            )}

            {config.pattern === 'CYBER' && (
              <pattern id={`cyber-${code}-${isAway ? 'away' : 'home'}`} x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                <path d="M 12 0 L 0 0 0 12" fill="none" stroke={config.accent} strokeWidth="0.8" opacity="0.4" />
                <circle cx="6" cy="6" r="1.2" fill={config.third || config.accent} opacity="0.7" />
              </pattern>
            )}
            {sport === 'football' && (
              <clipPath id={`crest-clip-${code}-${size}`}>
                <path d="M63.5,31 L70.5,31 L70.5,34.5 C70.5,37 67,39 67,39 C67,39 63.5,37 63.5,34.5 Z" />
              </clipPath>
            )}
          </defs>
          
          {/* Main Shape with Smooth Curves */}
          {sport === 'football' && (
            <path 
              d="M50,16 C45,16 38,15 36,16 C30,18 26,19 26,19 C26,19 16,22 10,48 C9,50 14,54 18,52 C21,50 24,40 24,38 L24,85 C24,91 30,94 36,94 L64,94 C70,94 76,91 76,85 L76,38 C76,40 79,50 82,52 C86,54 91,50 90,48 C84,22 74,19 74,19 C74,19 70,18 64,16 C62,15 55,16 50,16 Z" 
              fill={config.main} 
              stroke="rgba(255,255,255,0.12)"
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
             {/* Patterns */}
             {config.pattern === 'SASH' && (
                <polygon points="75,0 95,0 25,100 5,100" fill={config.accent} opacity="0.8" />
             )}
             {config.pattern === 'STRIPES' && (
                <g fill={config.accent} opacity="0.85">
                   <rect x="6" y="0" width="12" height="100" />
                   <rect x="25" y="0" width="12" height="100" />
                   <rect x="44" y="0" width="12" height="100" />
                   <rect x="63" y="0" width="12" height="100" />
                   <rect x="82" y="0" width="12" height="100" />
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
             {config.pattern === 'BANDS' && (
                <g fill={config.accent} opacity="0.8">
                   <rect x="0" y="20" width="100" height="18" />
                   <rect x="0" y="55" width="100" height="18" />
                </g>
             )}
             {config.pattern === 'CHEVRON' && (
                <polygon 
                   points="50,60 100,30 100,45 50,75 0,45 0,30" 
                   fill={config.accent} 
                   opacity="0.8" 
                />
             )}
             {config.pattern === 'HALVES' && (
                <rect x="50" y="0" width="50" height="100" fill={config.accent} opacity="0.9" />
             )}
             {config.pattern === 'CROSS' && (
                <g fill={config.accent} opacity="0.8">
                   <rect x="42" y="0" width="16" height="100" />
                   <rect x="0" y="42" width="100" height="16" />
                </g>
             )}
             {config.pattern === 'CHECKERED' && (
                <g fill={config.accent} opacity="0.8">
                   {/* Row 0 */}
                   <rect x="20" y="0" width="20" height="20" />
                   <rect x="60" y="0" width="20" height="20" />
                   {/* Row 1 */}
                   <rect x="0" y="20" width="20" height="20" />
                   <rect x="40" y="20" width="20" height="20" />
                   <rect x="80" y="20" width="20" height="20" />
                   {/* Row 2 */}
                   <rect x="20" y="40" width="20" height="20" />
                   <rect x="60" y="40" width="20" height="20" />
                   {/* Row 3 */}
                   <rect x="0" y="60" width="20" height="20" />
                   <rect x="40" y="60" width="20" height="20" />
                   <rect x="80" y="60" width="20" height="20" />
                   {/* Row 4 */}
                   <rect x="20" y="80" width="20" height="20" />
                   <rect x="60" y="80" width="20" height="20" />
                </g>
             )}

             {config.pattern === 'HOOPS' && (
                <g fill={config.accent} opacity="0.8">
                   <rect x="0" y="22" width="100" height="8" />
                   <rect x="0" y="38" width="100" height="8" />
                   <rect x="0" y="54" width="100" height="8" />
                   <rect x="0" y="70" width="100" height="8" />
                   <rect x="0" y="86" width="100" height="8" />
                </g>
             )}
             {config.pattern === 'PINSTRIPES' && (
                <g opacity="0.6">
                   <rect x="15" y="0" width="1.2" height="100" fill={config.accent} />
                   <rect x="30" y="0" width="1.2" height="100" fill={config.third || config.accent} />
                   <rect x="45" y="0" width="1.2" height="100" fill={config.accent} />
                   <rect x="60" y="0" width="1.2" height="100" fill={config.third || config.accent} />
                   <rect x="75" y="0" width="1.2" height="100" fill={config.accent} />
                   <rect x="90" y="0" width="1.2" height="100" fill={config.third || config.accent} />
                </g>
             )}
             {config.pattern === 'GRADIENT' && (
                <rect x="0" y="0" width="100" height="100" fill={`url(#grad-${code}-${isAway ? 'away' : 'home'})`} />
             )}
             {config.pattern === 'CYBER' && (
                <rect x="0" y="0" width="100" height="100" fill={`url(#cyber-${code}-${isAway ? 'away' : 'home'})`} />
             )}
             {config.pattern === 'SLEEVES_DIFF' && (
                <g fill={config.accent} opacity="0.95">
                   <polygon points="28,18 10,24 10,48 18,52 24,38" />
                   <polygon points="72,18 90,24 90,48 82,52 76,38" />
                </g>
             )}
             {config.pattern === 'DIAGONAL_STRIPES' && (
                <g fill={config.accent} opacity="0.8">
                   <polygon points="0,0 20,0 0,20" />
                   <polygon points="30,0 50,0 0,50 0,30" />
                   <polygon points="60,0 80,0 0,80 0,60" />
                   <polygon points="90,0 100,0 100,10 0,100 0,90" />
                   <polygon points="100,30 100,50 50,100 30,100" />
                   <polygon points="100,60 100,80 80,100 60,100" />
                </g>
             )}
             
             {sport === 'motorsports' && (
                <path d="M25,25 L75,25 L78,45 L22,45 Z" fill="rgba(0,0,0,0.8)" />
             )}
             
             <rect width="100" height="100" fill="url(#jersey-mesh)" className="mix-blend-overlay opacity-30" />

             {/* Brand Logo */}
             {sport === 'football' && config.brand && (
                <>
                   {config.brand === 'nike' && (
                      <path d="M29,34 Q34,36 38,33 Q34,37 31,36 Q29,36 29,35 Z" fill={logoColor} opacity="0.85" />
                   )}
                   {config.brand === 'adidas' && (
                      <g fill={logoColor} opacity="0.85">
                         <rect x="29" y="32.5" width="1.2" height="4" transform="rotate(-25 29 32.5)" />
                         <rect x="31" y="31.5" width="1.2" height="5" transform="rotate(-25 31 31.5)" />
                         <rect x="33" y="30.5" width="1.2" height="6" transform="rotate(-25 33 30.5)" />
                      </g>
                   )}
                   {config.brand === 'puma' && (
                      <path d="M29,35 C30,34 31,32 33,32 C34.5,32 35,32.5 35.5,33 L35,33.8 C34,33 33.5,32.8 33,33.2 C31.8,34 31,35.5 29.5,36 Z" stroke={logoColor} strokeWidth="0.8" fill="none" opacity="0.85" />
                   )}
                   {config.brand === 'umbro' && (
                      <g stroke={logoColor} strokeWidth="0.8" fill="none" opacity="0.85">
                         <polygon points="32,31 35,34 32,37 29,34" />
                         <polygon points="32,32.2 33.8,34 32,35.8 30.2,34" />
                      </g>
                   )}
                   {config.brand === 'kappa' && (
                      <g fill={logoColor} opacity="0.85">
                         <circle cx="30.5" cy="32.2" r="0.7" />
                         <path d="M31.2,32.8 C31.2,32.8 30.4,32.8 30.0,33.4 C29.6,34.0 29.9,34.5 30.3,34.9 C30.7,35.3 31.3,34.9 31.3,34.9 L31.3,32.8" />
                         <circle cx="32.7" cy="32.2" r="0.7" />
                         <path d="M32.0,32.8 C32.0,32.8 32.8,32.8 33.2,33.4 C33.6,34.0 33.3,34.5 32.9,34.9 C32.5,35.3 31.9,34.9 31.9,34.9 L31.9,32.8" />
                      </g>
                   )}
                   {config.brand === 'marathon' && (
                      <path d="M29,35 L31.5,31 L32.5,33.5 L33.5,31 L36,35" fill="none" stroke={logoColor} strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
                   )}
                   {config.brand === 'macron' && (
                      <g fill={logoColor} opacity="0.85">
                         <circle cx="32" cy="31.2" r="0.7" />
                         <path d="M32,32 C31.5,32 30.5,32.5 30.0,33.2 C30.8,33.2 31.5,32.8 32,32.4 C32.5,32.8 33.2,33.2 34.0,33.2 C33.5,32.5 32.5,32 32,32 Z" />
                         <path d="M31.3,33.2 L32,35.8 L32.7,33.2" stroke={logoColor} strokeWidth="0.7" fill="none" />
                      </g>
                   )}
                   {config.brand === 'joma' && (
                      <path d="M29,32.5 C31,33 33,32 35,33 C33,34 31,34.5 29.5,35.5 C31,34.8 32.8,34.8 35,34.2 C33,35 31,35.8 29,36.2" fill="none" stroke={logoColor} strokeWidth="0.8" strokeLinecap="round" opacity="0.85" />
                   )}
                   {config.brand === 'newbalance' && (
                      <g fill={logoColor} opacity="0.85">
                         <path d="M31,31.5 L31,35 L33.5,31.5 L33.5,35" fill="none" stroke={logoColor} strokeWidth="0.8" />
                         <path d="M34,31.5 Q35.5,31.5 35.5,32.5 Q35.5,33.2 34.5,33.2 Q35.8,33.2 35.8,34.2 Q35.8,35 34,35 L33.5,35" fill="none" stroke={logoColor} strokeWidth="0.8" />
                         <line x1="28.5" y1="32" x2="30.5" y2="32" stroke={logoColor} strokeWidth="0.5" />
                         <line x1="28.5" y1="33" x2="30.5" y2="33" stroke={logoColor} strokeWidth="0.5" />
                         <line x1="28.5" y1="34" x2="30.5" y2="34" stroke={logoColor} strokeWidth="0.5" />
                      </g>
                   )}
                   {config.brand === 'underarmour' && (
                      <g stroke={logoColor} strokeWidth="0.8" fill="none" opacity="0.85">
                         <path d="M29.5,31.5 C29.5,34 34.5,34 34.5,31.5" />
                         <path d="M29.5,34.5 C29.5,32 34.5,32 34.5,34.5" />
                      </g>
                   )}
                   {config.brand === 'hummel' && (
                      <g stroke={logoColor} strokeWidth="0.8" fill="none" opacity="0.85">
                         <path d="M29.5,32 L31.5,33.5 L29.5,35" />
                         <path d="M32.5,32 L34.5,33.5 L32.5,35" />
                      </g>
                   )}
                   {config.brand === 'reebok' && (
                      <g stroke={logoColor} strokeWidth="0.8" fill="none" opacity="0.85">
                         <path d="M29,35 L35,31" />
                         <path d="M29,32 L34.5,32.5 L32,35" />
                      </g>
                   )}
                   {config.brand === 'tempo' && (
                      <path d="M29,31 L33,35 L35,32" fill="none" stroke={logoColor} strokeWidth="1" strokeLinecap="round" opacity="0.85" />
                   )}
                   {config.brand === 'jako' && (
                      <g stroke={logoColor} strokeWidth="0.8" fill="none" opacity="0.85">
                         <circle cx="30" cy="33" r="1" fill={logoColor} />
                         <circle cx="34" cy="33" r="1" fill={logoColor} />
                         <path d="M31,33 C31,33 32,31 33,33" />
                      </g>
                   )}
                </>
             )}

             {/* Dynamic Crest Renderer for Key Teams */}
             {sport === 'football' && (
                <g opacity="0.95">
                   {code === 'ARG' && !useAwayStyle ? (
                      /* AFA gold crest */
                      <>
                         <path d="M63.5,31 L70.5,31 L70.5,34.5 C70.5,37 67,39 67,39 C67,39 63.5,37 63.5,34.5 Z" fill="#FACC15" stroke="#FFFFFF" strokeWidth="0.8" />
                         <path d="M66,33 L68,33 M67,33 L67,37" stroke="#1E3A8A" strokeWidth="0.8" />
                      </>
                   ) : code === 'RIV' && !useAwayStyle ? (
                      /* River Plate red sash shield */
                      <>
                         <path d="M63.5,31 L70.5,31 L70.5,34.5 C70.5,37 67,39 67,39 C67,39 63.5,37 63.5,34.5 Z" fill="#FFFFFF" stroke="#EF4444" strokeWidth="0.8" />
                         <line x1="64" y1="32" x2="70" y2="38" stroke="#EF4444" strokeWidth="1" />
                      </>
                   ) : code === 'BOC' && !useAwayStyle ? (
                      /* Boca Juniors gold band shield */
                      <>
                         <path d="M63.5,31 L70.5,31 L70.5,34.5 C70.5,37 67,39 67,39 C67,39 63.5,37 63.5,34.5 Z" fill="#0F2050" stroke="#FFD700" strokeWidth="0.8" />
                         <rect x="64" y="34" width="6.2" height="1.8" fill="#FFD700" />
                      </>
                   ) : code === 'BRA' && !useAwayStyle ? (
                      /* Brazil green/gold shield */
                      <>
                         <path d="M63.5,31 L70.5,31 L70.5,34.5 C70.5,37 67,39 67,39 C67,39 63.5,37 63.5,34.5 Z" fill="#15803D" stroke="#FACC15" strokeWidth="0.8" />
                         <circle cx="67" cy="34" r="1.2" fill="#0F2050" />
                      </>
                   ) : code === 'FRA' && !useAwayStyle ? (
                      /* France rooster crest */
                      <>
                         <path d="M63.5,31 L70.5,31 L70.5,34.5 C70.5,37 67,39 67,39 C67,39 63.5,37 63.5,34.5 Z" fill="#1E3A8A" stroke="#FFFFFF" strokeWidth="0.5" />
                         <path d="M66,35 C66,33 68,33 68,35 C68,36 67,37 67,37" stroke="#FACC15" strokeWidth="1.2" fill="none" />
                      </>
                   ) : code === 'GER' && !useAwayStyle ? (
                      /* Germany eagle crest */
                      <>
                         <circle cx="67" cy="34" r="3.5" fill="#FFFFFF" stroke="#000000" strokeWidth="0.8" />
                         <path d="M65.5,33 L68.5,33 M67,33 L67,36 L66,36 L68,36" stroke="#000000" strokeWidth="0.8" />
                      </>
                   ) : code === 'ENG' && !useAwayStyle ? (
                      /* England Three Lions shield */
                      <>
                         <path d="M63.5,31 L70.5,31 L70.5,34.5 C70.5,37 67,39 67,39 C67,39 63.5,37 63.5,34.5 Z" fill="#FFFFFF" stroke="#0B1121" strokeWidth="0.8" />
                         <line x1="65.2" y1="33" x2="68.8" y2="33" stroke="#0B1121" strokeWidth="0.6" />
                         <line x1="65.2" y1="34.5" x2="68.8" y2="34.5" stroke="#0B1121" strokeWidth="0.6" />
                         <line x1="65.2" y1="36" x2="68.8" y2="36" stroke="#0B1121" strokeWidth="0.6" />
                      </>
                   ) : code === 'ESP' && !useAwayStyle ? (
                      /* Spain red/gold shield */
                      <>
                         <path d="M63.5,31 L70.5,31 L70.5,34.5 C70.5,37 67,39 67,39 C67,39 63.5,37 63.5,34.5 Z" fill="#FACC15" stroke="#DC2626" strokeWidth="0.8" />
                         <rect x="66" y="33" width="2" height="3" fill="#DC2626" />
                      </>
                   ) : code === 'USA' && !useAwayStyle ? (
                      /* USA stripes and blue shield */
                      <>
<path d="M63.5,31 L70.5,31 L70.5,34.5 C70.5,37 67,39 67,39 C67,39 63.5,37 63.5,34.5 Z" fill="#FFFFFF" stroke="#1E3A8A" strokeWidth="0.8" />
                         <rect x="63.9" y="31.4" width="6.2" height="2" fill="#1E3A8A" />
                         <line x1="65.5" y1="33.4" x2="65.5" y2="38.5" stroke="#DC2626" strokeWidth="0.6" />
                         <line x1="68.5" y1="33.4" x2="68.5" y2="38.5" stroke="#DC2626" strokeWidth="0.6" />
                      </>
                   ) : code === 'URU' && !useAwayStyle ? (
                      /* Uruguay crest */
                      <>
                         <path d="M63.5,31 L70.5,31 L70.5,34.5 C70.5,37 67,39 67,39 C67,39 63.5,37 63.5,34.5 Z" fill="#7DD3FC" stroke="#FFFFFF" strokeWidth="0.8" />
                         <line x1="65" y1="33" x2="69" y2="33" stroke="#FFFFFF" strokeWidth="0.6" />
                         <line x1="65" y1="35" x2="69" y2="35" stroke="#FFFFFF" strokeWidth="0.6" />
                      </>
                   ) : code === 'MEX' ? (
                      /* Mexico green circle with gold eagle */
                      <>
                         <circle cx="67" cy="34.5" r="3.5" fill="#006847" stroke="#FFFFFF" strokeWidth="0.5" />
                         <path d="M65.5,34.5 L67,33 L68.5,34.5 L68,36 L66,36 Z" fill="#FACC15" />
                         <circle cx="67" cy="33.8" r="0.5" fill="#FFFFFF" />
                      </>
                   ) : code === 'CAN' ? (
                      /* Canada white circle with red maple leaf */
                      <>
                         <circle cx="67" cy="34.5" r="3.5" fill="#FFFFFF" stroke="#C8102E" strokeWidth="0.5" />
                         <path d="M67,32.2 L67.5,33.5 L69,33.5 L68,34.5 L68.5,36 L67,35 L65.5,36 L66,34.5 L65,33.5 L66.5,33.5 Z" fill="#C8102E" />
                         <line x1="67" y1="35" x2="67" y2="37" stroke="#C8102E" strokeWidth="0.6" />
                      </>
                   ) : code === 'COL' ? (
                      /* Colombia tricolor shield */
                      <>
                         <g clipPath={`url(#crest-clip-${code}-${size})`}>
                            <rect x="63" y="31" width="8" height="4" fill="#FFD100" />
                            <rect x="63" y="35" width="8" height="2" fill="#002F6C" />
                            <rect x="63" y="37" width="8" height="2.5" fill="#C8102E" />
                         </g>
                         <path d="M63.5,31 L70.5,31 L70.5,34.5 C70.5,37 67,39 67,39 C67,39 63.5,37 63.5,34.5 Z" fill="none" stroke="#FFFFFF" strokeWidth="0.6" />
                      </>
                   ) : code === 'POR' ? (
                      /* Portugal red shield with green/white quinas cross details */
                      <>
                         <path d="M63.5,31 L70.5,31 L70.5,34.5 C70.5,37 67,39 67,39 C67,39 63.5,37 63.5,34.5 Z" fill="#C60B1E" stroke="#006233" strokeWidth="0.8" />
                         <rect x="66.4" y="32" width="1.2" height="5" fill="#FFFFFF" />
                         <rect x="64.5" y="33.9" width="5" height="1.2" fill="#FFFFFF" />
                         <circle cx="67" cy="33" r="0.4" fill="#002F6C" />
                         <circle cx="67" cy="34.5" r="0.4" fill="#002F6C" />
                         <circle cx="67" cy="36" r="0.4" fill="#002F6C" />
                         <circle cx="65.5" cy="34.5" r="0.4" fill="#002F6C" />
                         <circle cx="68.5" cy="34.5" r="0.4" fill="#002F6C" />
                      </>
                   ) : code === 'CRO' ? (
                      /* Croatia checkered shield */
                      <>
                         <g clipPath={`url(#crest-clip-${code}-${size})`}>
                            <rect x="63" y="31" width="8" height="9" fill="#FFFFFF" />
                            <rect x="63.5" y="31" width="1.4" height="1.6" fill="#C60B1E" />
                            <rect x="66.3" y="31" width="1.4" height="1.6" fill="#C60B1E" />
                            <rect x="69.1" y="31" width="1.4" height="1.6" fill="#C60B1E" />
                            <rect x="64.9" y="32.6" width="1.4" height="1.6" fill="#C60B1E" />
                            <rect x="67.7" y="32.6" width="1.4" height="1.6" fill="#C60B1E" />
                            <rect x="63.5" y="34.2" width="1.4" height="1.6" fill="#C60B1E" />
                            <rect x="66.3" y="34.2" width="1.4" height="1.6" fill="#C60B1E" />
                            <rect x="69.1" y="34.2" width="1.4" height="1.6" fill="#C60B1E" />
                            <rect x="64.9" y="35.8" width="1.4" height="1.6" fill="#C60B1E" />
                            <rect x="67.7" y="35.8" width="1.4" height="1.6" fill="#C60B1E" />
                            <rect x="63.5" y="37.4" width="1.4" height="1.6" fill="#C60B1E" />
                            <rect x="66.3" y="37.4" width="1.4" height="1.6" fill="#C60B1E" />
                            <rect x="69.1" y="37.4" width="1.4" height="1.6" fill="#C60B1E" />
                         </g>
                         <path d="M63.5,31 L70.5,31 L70.5,34.5 C70.5,37 67,39 67,39 C67,39 63.5,37 63.5,34.5 Z" fill="none" stroke="#FFFFFF" strokeWidth="0.6" />
                      </>
                   ) : code === 'NED' ? (
                      /* Netherlands orange shield with gold lion */
                      <>
                         <path d="M63.5,31 L70.5,31 L70.5,34.5 C70.5,37 67,39 67,39 C67,39 63.5,37 63.5,34.5 Z" fill="#FF4F00" stroke="#FFFFFF" strokeWidth="0.6" />
                         <path d="M66.5,33.5 Q67.5,33 67.5,34 Q68.5,34.5 67.5,35.5 L67.5,37 L66.5,37 C66.5,36 66.8,35.5 66.2,35 Q65.5,34.5 66,34 Z" fill="#FACC15" />
                         <circle cx="67" cy="33.2" r="0.4" fill="#FACC15" />
                      </>
                   ) : code === 'JPN' ? (
                      /* Japan dark blue / red sun circle */
                      <>
                         <circle cx="67" cy="34.5" r="3.5" fill="#002D62" stroke="#FFFFFF" strokeWidth="0.5" />
                         <circle cx="67" cy="34.5" r="1.8" fill="#EE1C25" />
                      </>
                   ) : code === 'RAC' ? (
                      /* Racing Club light blue and white stripes */
                      <>
                         <g clipPath={`url(#crest-clip-${code}-${size})`}>
                            <rect x="63" y="31" width="8" height="9" fill="#FFFFFF" />
                            <rect x="63.5" y="31" width="1.4" height="9" fill="#6CABDD" />
                            <rect x="66.3" y="31" width="1.4" height="9" fill="#6CABDD" />
                            <rect x="69.1" y="31" width="1.4" height="9" fill="#6CABDD" />
                         </g>
                         <path d="M63.5,31 L70.5,31 L70.5,34.5 C70.5,37 67,39 67,39 C67,39 63.5,37 63.5,34.5 Z" fill="none" stroke="#FFFFFF" strokeWidth="0.6" />
                      </>
                   ) : code === 'SLO' ? (
                      /* San Lorenzo blue/red striped shield with white cross details */
                      <>
                         <g clipPath={`url(#crest-clip-${code}-${size})`}>
                            <rect x="63" y="31" width="8" height="9" fill="#0F2050" />
                            <rect x="64.5" y="31" width="1.5" height="9" fill="#DC2626" />
                            <rect x="67.5" y="31" width="1.5" height="9" fill="#DC2626" />
                            <rect x="66.7" y="32.5" width="0.6" height="4" fill="#FFFFFF" />
                            <rect x="65" y="34.2" width="4" height="0.6" fill="#FFFFFF" />
                         </g>
                         <path d="M63.5,31 L70.5,31 L70.5,34.5 C70.5,37 67,39 67,39 C67,39 63.5,37 63.5,34.5 Z" fill="none" stroke="#FFFFFF" strokeWidth="0.6" />
                      </>
                   ) : code === 'NOB' ? (
                      /* Newell's divided red/black shield */
                      <>
                         <g clipPath={`url(#crest-clip-${code}-${size})`}>
                            <rect x="63" y="31" width="4" height="9" fill="#D32E2E" />
                            <rect x="67" y="31" width="4" height="9" fill="#1A1A1A" />
                            <text x="67" y="36.2" fill="#FFFFFF" fontSize="2.8" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">N</text>
                         </g>
                         <path d="M63.5,31 L70.5,31 L70.5,34.5 C70.5,37 67,39 67,39 C67,39 63.5,37 63.5,34.5 Z" fill="none" stroke="#FFFFFF" strokeWidth="0.6" />
                      </>
                   ) : code === 'VEL' ? (
                      /* Velez white shield with blue V */
                      <>
                         <g clipPath={`url(#crest-clip-${code}-${size})`}>
                            <rect x="63" y="31" width="8" height="9" fill="#FFFFFF" />
                            <polygon points="63.5,31.5 65.5,31.5 67,35 68.5,31.5 70.5,31.5 67,38" fill="#004F9F" />
                         </g>
                         <path d="M63.5,31 L70.5,31 L70.5,34.5 C70.5,37 67,39 67,39 C67,39 63.5,37 63.5,34.5 Z" fill="none" stroke="#004F9F" strokeWidth="0.6" />
                      </>
                   ) : code === 'CEN' ? (
                      /* Central navy and yellow stripes */
                      <>
                         <g clipPath={`url(#crest-clip-${code}-${size})`}>
                            <rect x="63" y="31" width="8" height="9" fill="#0C2340" />
                            <rect x="64.5" y="31" width="1.2" height="9" fill="#FED141" />
                            <rect x="67.5" y="31" width="1.2" height="9" fill="#FED141" />
                         </g>
                         <path d="M63.5,31 L70.5,31 L70.5,34.5 C70.5,37 67,39 67,39 C67,39 63.5,37 63.5,34.5 Z" fill="none" stroke="#FED141" strokeWidth="0.6" />
                      </>
                   ) : code === 'EST' ? (
                      /* Estudiantes red and white stripes */
                      <>
                         <g clipPath={`url(#crest-clip-${code}-${size})`}>
                            <rect x="63" y="31" width="8" height="9" fill="#FFFFFF" />
                            <rect x="63.5" y="31" width="1.2" height="9" fill="#E30613" />
                            <rect x="65.9" y="31" width="1.2" height="9" fill="#E30613" />
                            <rect x="68.3" y="31" width="1.2" height="9" fill="#E30613" />
                         </g>
                         <path d="M63.5,31 L70.5,31 L70.5,34.5 C70.5,37 67,39 67,39 C67,39 63.5,37 63.5,34.5 Z" fill="none" stroke="#E30613" strokeWidth="0.6" />
                      </>
                   ) : (
                      /* Standard default shield */
                      <>
                         <path 
                           d="M63.5,31 L70.5,31 L70.5,34.5 C70.5,37 67,39 67,39 C67,39 63.5,37 63.5,34.5 Z" 
                           fill={config.accent} 
                           stroke={config.third && config.third !== 'transparent' ? config.third : '#FACC15'} 
                           strokeWidth="0.8" 
                         />
                         <path 
                           d="M67,32 L67,37" 
                           stroke={config.main} 
                           strokeWidth="0.6" 
                           opacity="0.7" 
                         />
                      </>
                   )}
                </g>
             )}

             {/* Sleeve Cuff Trim */}
             {sport === 'football' && (
                <g fill={config.third && config.third !== 'transparent' ? config.third : config.accent} opacity="0.85">
                   <path d="M10,48 C9,50 14,54 18,52 L17,49 C14,51 10,48 10,48 Z" />
                   <path d="M90,48 C91,50 86,54 82,52 L83,49 C86,51 90,48 90,48 Z" />
                </g>
             )}

             {/* Brand sleeve decorations */}
             {sport === 'football' && (
                <>
                   {config.brand === 'adidas' && (
                      <g stroke={config.third && config.third !== 'transparent' ? config.third : config.accent} strokeWidth="0.6" opacity="0.85" fill="none">
                         {/* Left shoulder stripes */}
                         <path d="M34,16.5 L24,19.5" />
                         <path d="M34.5,17.5 L24.5,20.5" />
                         <path d="M35,18.5 L25,21.5" />
                         {/* Right shoulder stripes */}
                         <path d="M66,16.5 L76,19.5" />
                         <path d="M65.5,17.5 L75.5,20.5" />
                         <path d="M65,18.5 L75,21.5" />
                      </g>
                   )}
                   {config.brand === 'hummel' && (
                      <g stroke={config.third && config.third !== 'transparent' ? config.third : config.accent} strokeWidth="0.8" opacity="0.85" fill="none" strokeLinecap="round" strokeLinejoin="round">
                         {/* Left sleeve chevrons */}
                         <path d="M31,18 L27,19.5 L31,21" />
                         <path d="M26,19.5 L22,21 L26,22.5" />
                         {/* Right sleeve chevrons */}
                         <path d="M69,18 L73,19.5 L69,21" />
                         <path d="M74,19.5 L78,21 L74,22.5" />
                      </g>
                   )}
                   {config.brand === 'nike' && (
                      <g fill={config.third && config.third !== 'transparent' ? config.third : config.accent} opacity="0.85">
                         {/* Aerodynamic contrast panels on sleeves */}
                         <path d="M36,16 C33,18 28,22 28,26 C30,25 34,22 36,16 Z" />
                         <path d="M64,16 C67,18 72,22 72,26 C70,25 66,22 64,16 Z" />
                      </g>
                   )}
                   {config.brand === 'kappa' && (
                      <g fill={config.third && config.third !== 'transparent' ? config.third : config.accent} opacity="0.85">
                         {/* Omini icons down the sleeves */}
                         <circle cx="28" cy="22" r="0.8" />
                         <circle cx="24" cy="27" r="0.8" />
                         <circle cx="20" cy="32" r="0.8" />
                         <circle cx="72" cy="22" r="0.8" />
                         <circle cx="76" cy="27" r="0.8" />
                         <circle cx="80" cy="32" r="0.8" />
                      </g>
                   )}
                   {config.brand === 'umbro' && (
                      <g stroke={config.third && config.third !== 'transparent' ? config.third : config.accent} strokeWidth="0.5" fill="none" opacity="0.85">
                         {/* Left sleeve double diamonds */}
                         <polygon points="28,21 30,22 28,23 26,22" />
                         <polygon points="24,26 26,27 24,28 22,27" />
                         <polygon points="20,31 22,32 20,33 18,32" />
                         {/* Right sleeve double diamonds */}
                         <polygon points="72,21 70,22 72,23 74,22" />
                         <polygon points="76,26 74,27 76,28 78,27" />
                         <polygon points="80,31 78,32 80,33 82,32" />
                      </g>
                   )}
                </>
             )}

             {/* Realistic Fabric Crease Lines */}
             {sport === 'football' && (
                <g fill="none" strokeWidth="0.6" className="mix-blend-overlay">
                   {/* Armpit wrinkles */}
                   <path d="M24,38 Q33,43 38,40" stroke="black" opacity="0.2" />
                   <path d="M76,38 Q67,43 62,40" stroke="black" opacity="0.2" />
                   {/* Shoulder/Sleeve seam creases */}
                   <path d="M36,16 Q28,26 26,19" stroke="white" opacity="0.1" />
                   <path d="M64,16 Q72,26 74,19" stroke="white" opacity="0.1" />
                   {/* Side body wrinkles */}
                   <path d="M24,60 Q34,63 36,65" stroke="black" opacity="0.15" />
                   <path d="M76,60 Q66,63 64,65" stroke="black" opacity="0.15" />
                   {/* Bottom drapery */}
                   <path d="M30,90 Q40,88 50,91" stroke="black" opacity="0.2" />
                   <path d="M50,91 Q60,88 70,90" stroke="black" opacity="0.2" />
                </g>
             )}
          </g>

          {/* Collar Details & Necklines */}
          {sport === 'football' && (
            <>
              {/* Hollow Dark Inner Neck hole */}
              <path 
                d="M36,16 C38,20 44,21 50,21 C56,21 62,20 64,16 C62,14 56,15 50,15 C44,15 38,14 36,16 Z" 
                fill="rgba(0,0,0,0.5)" 
              />
              {/* Outer neck collar trim */}
              <path 
                d="M36,16 C38,22 44,24 50,24 C56,24 62,22 64,16 C62,15 56,16 50,16 C44,16 38,15 36,16 Z" 
                fill={config.third && config.third !== 'transparent' ? config.third : config.accent} 
                className="opacity-95"
              />
            </>
          )}
          {sport === 'nba' && (
            <path 
              d="M30,15 C30,15 40,25 50,25 C60,25 70,15 70,15 L68,13 C68,13 58,22 50,22 C42,22 32,13 32,13 Z" 
              fill={config.accent} 
              className="opacity-60"
            />
          )}

          {/* Gold Stars for WC Winners */}
          {sport === 'football' && ['ARG', 'BRA', 'GER', 'FRA', 'URU', 'ENG', 'ESP'].includes(code) && (
             <g fill="#FACC15" className="opacity-95">
                {code === 'ARG' && (
                   <>
                      <polygon points="62.5,26.5 63.2,27.3 64.3,27.3 63.5,28.0 63.8,29.1 62.9,28.4 62.0,29.1 62.3,28.0 61.5,27.3 62.6,27.3" />
                      <polygon points="66.5,25.0 67.2,25.8 68.3,25.8 67.5,26.5 67.8,27.6 66.9,26.9 66.0,27.6 66.3,26.5 65.5,25.8 66.6,25.8" />
                      <polygon points="70.5,26.5 71.2,27.3 72.3,27.3 71.5,28.0 71.8,29.1 70.9,28.4 70.0,29.1 70.3,28.0 69.5,27.3 70.6,27.3" />
                   </>
                )}
                {code === 'BRA' && (
                   <>
                      <polygon points="60.5,28.0 61.2,28.8 62.3,28.8 61.5,29.5 61.8,30.6 60.9,29.9 60.0,30.6 60.3,29.5 59.5,28.8 60.6,28.8" />
                      <polygon points="63.5,26.2 64.2,27.0 65.3,27.0 64.5,27.7 64.8,28.8 63.9,28.1 63.0,28.8 63.3,27.7 62.5,27.0 63.6,27.0" />
                      <polygon points="66.5,25.0 67.2,25.8 68.3,25.8 67.5,26.5 67.8,27.6 66.9,26.9 66.0,27.6 66.3,26.5 65.5,25.8 66.6,25.8" />
                      <polygon points="69.5,26.2 70.2,27.0 71.3,27.0 70.5,27.7 70.8,28.8 69.9,28.1 69.0,28.8 69.3,27.7 68.5,27.0 69.6,27.0" />
                      <polygon points="72.5,28.0 73.2,28.8 74.3,28.8 73.5,29.5 73.8,30.6 72.9,29.9 72.0,30.6 72.3,29.5 71.5,28.8 72.6,28.8" />
                   </>
                )}
                {code === 'GER' && (
                   <>
                      <polygon points="61.5,26.5 62.2,27.3 63.3,27.3 62.5,28.0 62.8,29.1 61.9,28.4 61.0,29.1 61.3,28.0 60.5,27.3 61.6,27.3" />
                      <polygon points="64.5,25.2 65.2,26.0 66.3,26.0 65.5,26.7 65.8,27.8 64.9,27.1 64.0,27.8 64.3,26.7 63.5,26.0 64.6,26.0" />
                      <polygon points="68.5,25.2 69.2,26.0 70.3,26.0 69.5,26.7 69.8,27.8 68.9,27.1 68.0,27.8 68.3,26.7 67.5,26.0 68.6,26.0" />
                      <polygon points="71.5,26.5 72.2,27.3 73.3,27.3 72.5,28.0 72.8,29.1 71.9,28.4 71.0,29.1 71.3,28.0 70.5,27.3 71.6,27.3" />
                   </>
                )}
                {(code === 'FRA' || code === 'URU') && (
                   <>
                      <polygon points="64.5,25.5 65.2,26.3 66.3,26.3 65.5,27.0 65.8,28.1 64.9,27.4 64.0,28.1 64.3,27.0 63.5,26.3 64.6,26.3" />
                      <polygon points="68.5,25.5 69.2,26.3 70.3,26.3 69.5,27.0 69.8,28.1 68.9,27.4 68.0,28.1 68.3,27.0 67.5,26.3 68.6,26.3" />
                   </>
                )}
                {(code === 'ENG' || code === 'ESP') && (
                   <polygon points="66.5,25.0 67.2,25.8 68.3,25.8 67.5,26.5 67.8,27.6 66.9,26.9 66.0,27.6 66.3,26.5 65.5,25.8 66.6,25.8" />
                )}
             </g>
          )}
          
          {/* Shading / 3D depth overlays */}
          <path d="M50,15 L15,25 L92,50 L50,15" fill="white" className="mix-blend-overlay opacity-10" />
          <path d="M50,16 C45,16 38,15 36,16 C30,18 26,19 26,19 C26,19 16,22 10,48 C9,50 14,54 18,52 C21,50 24,40 24,38 L24,85 C24,91 30,94 36,94 L50,94 Z" fill="black" className="mix-blend-overlay opacity-10" />
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
              <div className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">
                {useAwayStyle ? 'AWAY' : 'HOME'} · {code}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
