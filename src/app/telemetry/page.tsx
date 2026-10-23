'use client';

import React, { useState } from 'react';
import { useZeroG } from '@/lib/zeroGStore';
import { Activity, Zap, TrendingUp, AlertTriangle } from 'lucide-react';

export default function TelemetryPage() {
  const { heartRate, sleepHours, hydrationMl, stressIndex, hrvRmssd, gravityScore } = useZeroG();
  const [activeTab, setActiveTab] = useState<'cardiac' | 'sleep' | 'plasma' | 'bone'>('cardiac');

  // Simulated 7-day G-score trend
  const sevenDayLog = [
    { day: 'Sol 136', score: 0.72, status: 'STABLE' },
    { day: 'Sol 137', score: 0.76, status: 'STABLE' },
    { day: 'Sol 138', score: 0.81, status: 'LOCK' },
    { day: 'Sol 139', score: 0.85, status: 'LOCK' },
    { day: 'Sol 140', score: 0.82, status: 'LOCK' },
    { day: 'Sol 141', score: 0.86, status: 'LOCK' },
    { day: 'Sol 142 (Today)', score: gravityScore, status: 'OPTIMAL' },
  ];

  return (
    <div className="space-y-4 pb-4">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold font-mono tracking-wider text-cyan-glow uppercase flex items-center gap-2">
            <Activity className="w-4 h-4 text-hud-cyan" />
            Bio-Telemetry Matrix
          </h1>
          <p className="text-[11px] text-slate-400 font-mono">Real-Time Zero-G Acclimation Telemetry</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-hud-cyan/10 text-hud-cyan border border-hud-cyan/30">
          RESOLUTION: 100 Hz
        </span>
      </div>

      {/* METRIC TABS */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-space-void/80 rounded-xl border border-slate-800">
        {[
          { id: 'cardiac', label: 'Cardiac' },
          { id: 'sleep', label: 'Circadian' },
          { id: 'plasma', label: 'Plasma' },
          { id: 'bone', label: 'Bone Load' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-1.5 text-[11px] font-mono rounded-lg transition text-center ${
              activeTab === tab.id
                ? 'bg-hud-cyan text-space-void font-bold shadow-hud-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: CARDIAC & VASCULAR */}
      {activeTab === 'cardiac' && (
        <div className="space-y-3">
          <div className="hud-panel rounded-2xl p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-xs font-mono font-bold text-slate-200">Arterial Pulse Velocity & HRV Spectrum</span>
                <p className="text-[10px] text-slate-400">Microgravity vascular deconditioning counter-analysis.</p>
              </div>
              <span className="text-xs font-mono font-bold text-hud-cyan">{heartRate} BPM</span>
            </div>

            {/* Live Waveform Container */}
            <div className="h-24 bg-space-void rounded-xl border border-slate-800 p-2 relative flex items-center overflow-hidden">
              <svg className="w-full h-full text-hud-cyan" viewBox="0 0 400 80" fill="none">
                <path
                  d="M 0 40 Q 20 40 30 20 T 50 60 T 70 40 T 110 40 T 120 10 T 130 70 T 140 25 T 160 40 T 220 40 T 230 15 T 240 65 T 250 20 T 270 40 T 330 40 T 340 10 T 350 70 T 360 25 T 380 40 L 400 40"
                  stroke="#00F0FF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-[11px] font-mono">
              <div className="bg-space-void/60 p-2 rounded-lg border border-slate-800/80">
                <div className="text-slate-400 text-[10px]">HRV RMSSD</div>
                <div className="text-emerald-400 font-bold">{hrvRmssd} ms</div>
              </div>
              <div className="bg-space-void/60 p-2 rounded-lg border border-slate-800/80">
                <div className="text-slate-400 text-[10px]">CARDIAC OUTPUT</div>
                <div className="text-hud-cyan font-bold">5.1 L/min</div>
              </div>
              <div className="bg-space-void/60 p-2 rounded-lg border border-slate-800/80">
                <div className="text-slate-400 text-[10px]">PULSE WAVE</div>
                <div className="text-slate-200 font-bold">6.2 m/s</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CIRCADIAN HYPNOGRAM */}
      {activeTab === 'sleep' && (
        <div className="space-y-3">
          <div className="hud-panel rounded-2xl p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-xs font-mono font-bold text-slate-200">Orbital 16x Solar Lock Architecture</span>
                <p className="text-[10px] text-slate-400">Restorative phase breakdown vs. simulated cabin dusk.</p>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-300">{sleepHours.toFixed(1)} hrs</span>
            </div>

            {/* Hypnogram Timeline */}
            <div className="space-y-2 mt-3">
              <div className="text-[10px] font-mono text-slate-400 flex justify-between">
                <span>00:00 (Cabin Dusk)</span>
                <span>04:00 (REM Peak)</span>
                <span>07:30 (Solar Reveille)</span>
              </div>
              <div className="h-10 bg-space-void rounded-xl border border-slate-800 p-1 flex items-center gap-1.5">
                <div className="h-full rounded bg-indigo-950 w-2/12 flex items-center justify-center text-[9px] font-mono text-slate-400">
                  Light
                </div>
                <div className="h-full rounded bg-indigo-600 w-4/12 flex items-center justify-center text-[9px] font-mono text-white font-bold">
                  Deep (2h 15m)
                </div>
                <div className="h-full rounded bg-hud-cyan w-3/12 flex items-center justify-center text-[9px] font-mono text-space-void font-bold">
                  REM (1h 45m)
                </div>
                <div className="h-full rounded bg-indigo-800 w-3/12 flex items-center justify-center text-[9px] font-mono text-slate-300">
                  Light
                </div>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-mono text-indigo-200">
              💡 <strong>Chrono-Guidance:</strong> Melatonin secretion optimal. Next cabin blue-spectrum wash scheduled in 8 hours.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PLASMA FLUID SHIFT */}
      {activeTab === 'plasma' && (
        <div className="space-y-3">
          <div className="hud-panel rounded-2xl p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-xs font-mono font-bold text-slate-200">Cephalic Fluid Redistribution Index</span>
                <p className="text-[10px] text-slate-400">Zero-G shifts ~2L of venous blood toward head and thorax.</p>
              </div>
              <span className="text-xs font-mono font-bold text-hud-lime">COMPENSATED</span>
            </div>

            <div className="my-3 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Total Daily Hydration</span>
                <span className="text-hud-cyan font-bold">{hydrationMl} / 2800 mL</span>
              </div>
              <div className="w-full bg-space-void rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div
                  className="bg-hud-cyan h-2.5 rounded-full"
                  style={{ width: `${Math.min(100, (hydrationMl / 2800) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 flex items-start space-x-2 text-[11px] font-mono text-amber-200">
              <AlertTriangle className="w-4 h-4 text-hud-amber shrink-0 mt-0.5" />
              <div>
                <strong>Fluid Shift Warning:</strong> Plasma volume drops rapidly if mineral electrolytes are neglected. Ensure at least 1.2g sodium chloride intake per 1,000 mL water.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BONE LOAD & ATROPHY */}
      {activeTab === 'bone' && (
        <div className="space-y-3">
          <div className="hud-panel rounded-2xl p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-xs font-mono font-bold text-slate-200">Osteoblast Mechanical Loading</span>
                <p className="text-[10px] text-slate-400">Daily tonnage required to halt bone mineral density loss.</p>
              </div>
              <span className="text-xs font-mono font-bold text-hud-amber">4.2 / 5.0 TONS</span>
            </div>

            <div className="my-3 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Centrifuge Squat & Press Volume</span>
                <span className="text-hud-lime font-bold">84% of Daily Quota</span>
              </div>
              <div className="w-full bg-space-void rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-hud-amber to-hud-lime h-2.5 rounded-full" style={{ width: '84%' }}></div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-space-void/80 border border-slate-800 text-[11px] font-mono text-slate-300">
              🏋️ <strong>ARED Prescription:</strong> Complete 3 additional sets of heavy heel-strike squats in the Training Chamber to hit 100% bone retention quota today.
            </div>
          </div>
        </div>
      )}

      {/* 7-DAY GRAVITY SCORE TELEMETRY HISTORY */}
      <section className="hud-panel rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-hud-cyan" />
            7-Sol Gravitational Trajectory
          </span>
          <span className="text-[10px] font-mono text-slate-400">MISSION LOG</span>
        </div>

        <div className="space-y-2">
          {sevenDayLog.map((log, idx) => (
            <div
              key={idx}
              className="p-2 rounded-xl bg-space-void/60 border border-slate-800/80 flex items-center justify-between text-xs font-mono"
            >
              <span className="text-slate-300">{log.day}</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-space-panel rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-hud-cyan h-2 rounded-full"
                    style={{ width: `${(log.score / 1.1) * 100}%` }}
                  ></div>
                </div>
                <span className="font-extrabold text-cyan-glow w-12 text-right">
                  {log.score.toFixed(2)}G
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
