'use client';

import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';

interface MobileContainerProps {
  children: React.ReactNode;
  hideNav?: boolean;
  hideHeader?: boolean;
}

export default function MobileContainer({
  children,
  hideNav = false,
  hideHeader = false,
}: MobileContainerProps) {
  return (
    <div className="min-h-screen bg-[#F3ECE4] flex justify-center items-center py-0 md:py-6 px-0 md:px-4">
      {/* Phone Mockup Frame on Desktop, Natural Mobile Screen on Mobile */}
      <div className="w-full max-w-[480px] min-h-screen md:min-h-[920px] md:max-h-[95vh] bg-[#FFF8F0] text-brand-dark flex flex-col relative md:rounded-[36px] shadow-2xl overflow-hidden border-0 md:border-[8px] md:border-[#2D2D2D]/90">
        
        {/* Top Camera Island Notch simulation on Desktop */}
        <div className="hidden md:flex justify-center items-center h-5 w-full bg-[#2D2D2D]/90 pt-1">
          <div className="w-24 h-3.5 bg-black rounded-full flex items-center justify-end px-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse mr-1"></div>
            <div className="w-2 h-2 rounded-full bg-blue-900/60"></div>
          </div>
        </div>

        {/* Global App Header */}
        {!hideHeader && <Header />}

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto pb-24 px-4 pt-3 relative">
          {children}
        </main>

        {/* Bottom Navigation */}
        {!hideNav && <BottomNav />}

        {/* Bottom Home Indicator Bar on Desktop */}
        <div className="hidden md:flex justify-center items-center h-4 w-full bg-[#FFF8F0] pb-1">
          <div className="w-32 h-1 bg-[#2D2D2D]/20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
