'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useZeroG } from '@/lib/zeroGStore';
import { Radio, RefreshCw, UserCheck, ShieldCheck } from 'lucide-react';

export default function ZeroGHeader() {
  const { profile, isSimulating, toggleSimulation, resetTelemetry } = useZeroG();
  const [timeStr, setTimeStr] = useState<string>('14:08:22 UTC');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeStr(
        now.getUTCHours().toString().padStart(2, '0') +
        ':' +
        now.getUTCMinutes().toString().padStart(2, '0') +
        ':' +
        now.getUTCSeconds().toString().padStart(2, '0') +
        ' UTC'
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="hud-panel rounded-2xl p-3.5 mb-4 border border-space-border/60 shadow-hud-glow">
      <div className="flex items-center justify-between gap-2">
        
        {/* Left: Branding & Vessel Info */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-hud-cyan/15 border border-hud-cyan flex items-center justify-center shadow-hud-cyan">
            <span className="text-lg">🪐</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Link href="/" className="text-base font-extrabold tracking-wider text-cyan-glow uppercase hover:opacity-80 transition">
                Track & Crack
              </Link>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-hud-cyan/10 text-hud-cyan border border-hud-cyan/30">
                ZERO-G
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
              <span>{profile.name}</span>
              <span className="text-hud-amber font-bold">[{profile.callsign}]</span>
              <span className="text-slate-500">•</span>
              <span>{timeStr}</span>
            </p>
          </div>
        </div>

        {/* Right: Telemetry Controls */}
        <div className="flex items-center space-x-2">
          {/* Simulation Toggle */}
          <button
            onClick={toggleSimulation}
            title={isSimulating ? 'Pause live simulation' : 'Resume live simulation'}
            className={`flex items-center space-x-1 text-[11px] font-mono px-2 py-1 rounded-lg border transition ${
              isSimulating
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Radio className={`w-3 h-3 ${isSimulating ? 'animate-pulse text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">{isSimulating ? 'LIVE SYNC' : 'PAUSED'}</span>
          </button>

          {/* Onboarding Restart */}
          <Link
            href="/onboarding"
            title="Launch Cadet Onboarding Flow"
            className="p-1.5 rounded-lg bg-hud-amber/10 text-hud-amber border border-hud-amber/30 hover:bg-hud-amber/20 transition"
          >
            <UserCheck className="w-3.5 h-3.5" />
          </Link>

          {/* Reset Telemetry */}
          <button
            onClick={resetTelemetry}
            title="Reset telemetry baseline"
            className="p-1.5 rounded-lg bg-space-panel text-slate-400 border border-slate-700 hover:text-hud-cyan hover:border-hud-cyan/40 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Secondary Status Bar */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="flex items-center gap-1 text-slate-300">
            <ShieldCheck className="w-3 h-3 text-hud-lime" />
            LIFE SUPPORT: <strong className="text-hud-lime">NOMINAL</strong>
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline">CABIN: 101.3 kPa</span>
        </div>
        <div className="text-hud-cyan">
          FLIGHT DAY <span className="font-bold text-slate-200">#{profile.flightDays}</span>
        </div>
      </div>
    </header>
  );
}
