'use client';

import React from 'react';
import ZeroGHeader from './ZeroGHeader';
import ZeroGBottomNav from './ZeroGBottomNav';
import CrackCelebration from './CrackCelebration';

interface ZeroGContainerProps {
  children: React.ReactNode;
  hideNav?: boolean;
  hideHeader?: boolean;
}

export default function ZeroGContainer({
  children,
  hideNav = false,
  hideHeader = false,
}: ZeroGContainerProps) {
  return (
    <div className="min-h-screen bg-space-grid text-slate-100 flex justify-center items-center py-0 md:py-6 px-0 md:px-4">
      <CrackCelebration />

      {/* Cyber Device Frame on Desktop, Natural Mobile Screen on Mobile */}
      <div className="w-full max-w-[500px] min-h-screen md:min-h-[920px] md:max-h-[96vh] bg-space-deep text-slate-100 flex flex-col relative md:rounded-[36px] shadow-2xl overflow-hidden border-0 md:border-[6px] md:border-space-border/80">
        
        {/* Top Camera Notch Simulation on Desktop */}
        <div className="hidden md:flex justify-between items-center h-6 w-full bg-space-void/90 px-6 pt-1 border-b border-space-border/30">
          <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-hud-cyan animate-pulse"></span>
            <span>SAT-LINK 99.8%</span>
          </div>
          <div className="w-20 h-3 bg-black rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-hud-cyan/40"></div>
          </div>
          <div className="text-[10px] font-mono text-hud-lime font-bold">100% PWR</div>
        </div>

        {/* Global App Header */}
        {!hideHeader && <div className="p-3 pb-0"><ZeroGHeader /></div>}

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto pb-24 px-3.5 pt-1 relative">
          {children}
        </main>

        {/* Bottom Navigation */}
        {!hideNav && <ZeroGBottomNav />}

        {/* Bottom Home Indicator Bar on Desktop */}
        <div className="hidden md:flex justify-center items-center h-4 w-full bg-space-deep pb-1">
          <div className="w-32 h-1 bg-hud-cyan/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
