'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 mb-8 overflow-x-auto whitespace-nowrap pb-2 scroll-hide">
      <Link 
        href="/contests" 
        className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
      >
        <Home size={12} />
        Lobby
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={10} className="text-white/20 flex-shrink-0" />
          {item.href ? (
            <Link 
              href={item.href}
              className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
