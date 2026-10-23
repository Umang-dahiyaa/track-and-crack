'use client';

import React from 'react';
import { useZeroG } from '@/lib/zeroGStore';

export default function CrackCelebration() {
  const { crackActive, lastCrackedReward } = useZeroG();

  if (!crackActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-cyan-950/40 backdrop-blur-sm animate-pulse"></div>

      {/* Kinetic Shockwave Box */}
      <div className="relative z-10 bg-space-deep/95 border-2 border-hud-amber rounded-2xl p-6 shadow-hud-amber text-center transform scale-100 transition-all max-w-xs animate-bounce">
        <div className="text-3xl mb-1">⚡ 💥 🚀</div>
        <div className="text-xs font-mono tracking-widest text-hud-amber font-bold uppercase">
          ORBITAL STASIS CRACKED!
        </div>
        <div className="text-4xl font-extrabold text-amber-glow my-2">
          +{lastCrackedReward ? lastCrackedReward.toFixed(2) : '0.10'}G
        </div>
        <div className="text-xs text-slate-300 font-mono">
          Anti-Atrophy Vector Deployed • Gravitational Resistance Upgraded
        </div>
      </div>
    </div>
  );
}
