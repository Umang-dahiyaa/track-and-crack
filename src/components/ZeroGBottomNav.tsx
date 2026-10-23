'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gauge, Activity, Dumbbell, Users, Stethoscope } from 'lucide-react';

export default function ZeroGBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'HUD', href: '/', icon: Gauge },
    { label: 'Telemetry', href: '/telemetry', icon: Activity },
    { label: 'Training', href: '/training', icon: Dumbbell },
    { label: 'Crew', href: '/crew', icon: Users },
    { label: 'HALO AI', href: '/doctor', icon: Stethoscope },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-space-deep/90 backdrop-blur-xl border-t border-space-border/60 px-3 py-2">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-hud-cyan'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]' : ''}`} />
              <span className="text-[10px] font-mono tracking-wider font-semibold">
                {item.label}
              </span>

              {isActive && (
                <span className="absolute -bottom-1 w-6 h-0.5 bg-hud-cyan rounded-full shadow-hud-cyan"></span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
