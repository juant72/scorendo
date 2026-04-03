'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiProps {
  show: boolean;
  onComplete: () => void;
}

export function ConfettiCelebration({ show, onComplete }: ConfettiProps) {
  if (!show) return null;

  // Generate 40 particles
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: 0,
    y: 0,
    tx: (Math.random() - 0.5) * 600,
    ty: (Math.random() - 0.5) * 600 - 100,
    rotation: Math.random() * 360,
    color: i % 2 === 0 ? '#00E676' : '#FFD700', // Primary & Gold
    size: Math.random() * 8 + 4
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] flex items-center justify-center">
      <AnimatePresence onExitComplete={onComplete}>
        {show && (
          <>
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                animate={{ 
                  opacity: [1, 1, 0],
                  scale: [0, 1.5, 0.5],
                  x: p.tx,
                  y: p.ty,
                  rotate: p.rotation
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute"
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  clipPath: p.id % 3 === 0 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none', // Mix triangles and squares
                  borderRadius: p.id % 2 === 0 ? '2px' : '50%'
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
