'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useZeroG } from '@/lib/zeroGStore';
import { Heart, Moon, Droplets, Brain, CheckCircle2, ChevronRight, Wind, X, Zap } from 'lucide-react';

export default function MissionHud() {
  const {
    gravityScore,
    heartRate,
    sleepHours,
    sleepEfficiency,
    hydrationMl,
    hydrationTarget,
    stressIndex,
    hrvRmssd,
    plasmaShift,
    missions,
    completeMission,
    addHydration,
    setTelemetryParam,
  } = useZeroG();

  const [showBreathingModal, setShowBreathingModal] = useState<boolean>(false);
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Hold (Zero-G)'>('Inhale');
  const [breathingTimer, setBreathingTimer] = useState<number>(4);
  const [showTuner, setShowTuner] = useState<boolean>(false);

  // Breathing interval handler
  const startBreathing = () => {
    setShowBreathingModal(true);
    let count = 4;
    let phaseIdx = 0;
    const phases: Array<'Inhale' | 'Hold' | 'Exhale' | 'Hold (Zero-G)'> = ['Inhale', 'Hold', 'Exhale', 'Hold (Zero-G)'];
    
    const interval = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        phaseIdx = (phaseIdx + 1) % 4;
        setBreathingPhase(phases[phaseIdx]);
        count = 4;
      }
      setBreathingTimer(count);
    }, 1000);

    // Save timer ref to clear when closed
    (window as any).__breathInterval = interval;
  };

  const closeBreathing = () => {
    if ((window as any).__breathInterval) {
      clearInterval((window as any).__breathInterval);
    }
    setShowBreathingModal(false);
  };

  // Tier info based on G-Score
  const getTierInfo = () => {
    if (gravityScore >= 1.0) {
      return {
        label: 'COMMANDER OVERDRIVE',
        colorClass: 'text-hud-lime border-hud-lime/40 bg-hud-lime/10',
        stroke: '#39FF14',
        atrophyMitigation: '99.4% Apex Tolerance',
      };
    }
    if (gravityScore >= 0.85) {
      return {
        label: 'ORBITAL LOCK',
        colorClass: 'text-hud-cyan border-hud-cyan/40 bg-hud-cyan/10',
        stroke: '#00F0FF',
        atrophyMitigation: '92.8% Nominal Retention',
      };
    }
    if (gravityScore >= 0.65) {
      return {
        label: 'MICRO-G STABLE',
        colorClass: 'text-hud-amber border-hud-amber/40 bg-hud-amber/10',
        stroke: '#FFB800',
        atrophyMitigation: '78.2% Moderate Shield',
      };
    }
    return {
      label: 'ATROPHY ALERT',
      colorClass: 'text-hud-rose border-hud-rose/40 bg-hud-rose/10',
      stroke: '#FF2A6D',
      atrophyMitigation: '46.0% Vulnerable to Bone Loss',
    };
  };

  const tier = getTierInfo();

  // Circle arc dash calculations
  // Circumference = 2 * PI * 64 ~= 402
  const ratio = (gravityScore - 0.2) / (1.2 - 0.2);
  const clampedRatio = Math.max(0, Math.min(1, ratio));
  const dashOffset = 402 * (1 - clampedRatio);

  return (
    <div className="space-y-4 pb-4">

      {/* CORE GRAVITY SCORE REACTOR GAUGE */}
      <section className="hud-panel rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden shadow-hud-glow">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-hud-cyan/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-hud-amber/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between w-full mb-1">
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
            Centrifugal Resistance Index
          </span>
          <button
            onClick={() => setShowTuner(!showTuner)}
            className="text-[10px] font-mono px-2 py-0.5 rounded bg-space-panel text-hud-cyan border border-hud-cyan/30 hover:bg-hud-cyan/20 transition flex items-center gap-1"
          >
            <Zap className="w-2.5 h-2.5" />
            {showTuner ? 'Close Tuner' : 'Tune Telemetry'}
          </button>
        </div>

        {/* Central Rotating Rings */}
        <div className="relative w-48 h-48 flex items-center justify-center my-1">
          {/* Outer dotted ring */}
          <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="2" strokeDasharray="4 8" />
          </svg>
          {/* Middle segmented ring */}
          <svg className="absolute inset-0 w-full h-full animate-spin-reverse" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="76" fill="none" stroke="rgba(255, 184, 0, 0.35)" strokeWidth="3" strokeDasharray="16 12 8 12" />
          </svg>
          {/* Progress Arc */}
          <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="64" fill="none" stroke="#0B152E" strokeWidth="9" />
            <circle
              cx="80"
              cy="80"
              r="64"
              fill="none"
              stroke={tier.stroke}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray="402"
              strokeDashoffset={dashOffset}
              className="transition-all duration-700"
            />
          </svg>

          {/* Central Gravity Numbers */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-[10px] text-hud-cyan font-mono tracking-wider font-bold">GRAVITY SCORE</span>
            <div className="flex items-baseline space-x-0.5">
              <span className="text-4xl font-extrabold text-cyan-glow tracking-tight">
                {gravityScore.toFixed(2)}
              </span>
              <span className="text-xl font-bold text-amber-glow">G</span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 mt-1 rounded border tracking-wider ${tier.colorClass}`}>
              {tier.label}
            </span>
          </div>
        </div>

        {/* Reactor Footnote */}
        <div className="w-full mt-2 pt-2.5 border-t border-slate-800/80 flex justify-between items-center text-[11px] font-mono">
          <div className="text-left">
            <div className="text-slate-400">EARTH EQUIVALENCE</div>
            <div className="text-hud-cyan font-bold">{Math.round((gravityScore / 1.0) * 100)}%</div>
          </div>
          <div className="text-right">
            <div className="text-slate-400">ATROPHY MITIGATION</div>
            <div className="text-slate-200 font-semibold">{tier.atrophyMitigation}</div>
          </div>
        </div>
      </section>

      {/* QUICK TUNER DRAWER */}
      {showTuner && (
        <section className="hud-panel rounded-2xl p-4 space-y-3 border-hud-cyan/40 bg-space-panel/90 shadow-hud-cyan">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-hud-cyan uppercase">Interactive Biometric Tuner</span>
            <span className="text-[10px] text-slate-400 font-mono">Simulate Astronaut Stressors</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Heart Rate</span>
                <span className="text-hud-cyan">{heartRate} BPM</span>
              </div>
              <input
                type="range"
                min="50"
                max="140"
                value={heartRate}
                onChange={(e) => setTelemetryParam('hr', parseInt(e.target.value))}
                className="w-full accent-hud-cyan cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Sleep</span>
                <span className="text-indigo-300">{sleepHours.toFixed(1)} hrs</span>
              </div>
              <input
                type="range"
                min="3"
                max="10"
                step="0.2"
                value={sleepHours}
                onChange={(e) => setTelemetryParam('sleep', parseFloat(e.target.value))}
                className="w-full accent-indigo-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Hydration</span>
                <span className="text-hud-cyan">{hydrationMl} mL</span>
              </div>
              <input
                type="range"
                min="800"
                max="3500"
                step="50"
                value={hydrationMl}
                onChange={(e) => setTelemetryParam('hydr', parseInt(e.target.value))}
                className="w-full accent-hud-cyan cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Stress Level</span>
                <span className="text-hud-amber">{stressIndex} IDX</span>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                value={stressIndex}
                onChange={(e) => setTelemetryParam('stress', parseInt(e.target.value))}
                className="w-full accent-hud-amber cursor-pointer"
              />
            </div>
          </div>
        </section>
      )}

      {/* 4-QUADRANT REAL-TIME VITALS GRID */}
      <section className="grid grid-cols-2 gap-3">

        {/* 1. CARDIAC TELEMETRY */}
        <div className="hud-panel rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="p-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/30">
                <Heart className="w-3.5 h-3.5" />
              </span>
              <span className="text-[11px] font-bold text-slate-200">CARDIAC</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              STABLE
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-extrabold text-cyan-glow">{heartRate}</span>
              <span className="text-[10px] text-slate-400 font-mono">BPM</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
              FLUID SHIFT: <span className="text-hud-amber font-bold">{plasmaShift}</span>
            </div>
          </div>

          {/* Animated ECG Line */}
          <div className="h-8 bg-space-void/80 rounded border border-slate-800 p-1 flex items-center overflow-hidden">
            <svg className="w-full h-6 text-hud-cyan" viewBox="0 0 200 40" fill="none">
              <path
                d="M 0 20 L 30 20 L 40 10 L 50 35 L 60 5 L 70 25 L 80 20 L 120 20 L 130 10 L 140 35 L 150 5 L 160 25 L 170 20 L 200 20"
                stroke="#00F0FF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* 2. CIRCADIAN SLEEP */}
        <div className="hud-panel rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="p-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                <Moon className="w-3.5 h-3.5" />
              </span>
              <span className="text-[11px] font-bold text-slate-200">CIRCADIAN</span>
            </div>
            <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
              {sleepEfficiency}% SYNC
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-extrabold text-indigo-300">{sleepHours.toFixed(1)}</span>
              <span className="text-[10px] text-slate-400 font-mono">HOURS</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">
              DEEP REM: <span className="text-hud-cyan font-bold">2h 15m</span>
            </div>
          </div>

          {/* Hypnogram Bars */}
          <div className="h-8 bg-space-void/80 rounded border border-slate-800 p-1.5 flex items-center gap-1">
            <div className="h-full rounded bg-indigo-900/60 w-2/12" title="Light Sleep"></div>
            <div className="h-full rounded bg-indigo-500 w-4/12" title="Deep Sleep"></div>
            <div className="h-full rounded bg-hud-cyan w-3/12" title="REM Cycle"></div>
            <div className="h-full rounded bg-indigo-700 w-3/12" title="Light Cycle"></div>
          </div>
        </div>

        {/* 3. OSMOTIC HYDRATION */}
        <div className="hud-panel rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="p-1 rounded-md bg-hud-cyan/10 text-hud-cyan border border-hud-cyan/30">
                <Droplets className="w-3.5 h-3.5" />
              </span>
              <span className="text-[11px] font-bold text-slate-200">OSMOSIS</span>
            </div>
            <span className="text-[10px] font-mono text-hud-cyan">
              {Math.round((hydrationMl / hydrationTarget) * 100)}%
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-extrabold text-cyan-glow">{hydrationMl.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 font-mono">/ {hydrationTarget} mL</span>
            </div>
            {/* Quick Bolus Buttons */}
            <div className="flex gap-1.5 mt-1">
              <button
                onClick={() => addHydration(250)}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-hud-cyan/15 text-hud-cyan border border-hud-cyan/30 hover:bg-hud-cyan/30 transition flex-1 text-center"
              >
                +250mL
              </button>
              <button
                onClick={() => addHydration(500)}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-hud-cyan/15 text-hud-cyan border border-hud-cyan/30 hover:bg-hud-cyan/30 transition flex-1 text-center"
              >
                +500mL
              </button>
            </div>
          </div>

          {/* Hydration Bar */}
          <div className="w-full bg-space-void rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-cyan-600 to-hud-cyan h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (hydrationMl / hydrationTarget) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* 4. NEURO-VESTIBULAR & STRESS */}
        <div className="hud-panel rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="p-1 rounded-md bg-hud-amber/10 text-hud-amber border border-hud-amber/30">
                <Brain className="w-3.5 h-3.5" />
              </span>
              <span className="text-[11px] font-bold text-slate-200">VESTIBULAR</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">CALM</span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-extrabold text-amber-glow">{stressIndex}</span>
              <span className="text-[10px] text-slate-400 font-mono">/ 100 IDX</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5 flex justify-between items-center">
              <span>HRV: <strong className="text-emerald-400">{hrvRmssd}ms</strong></span>
              <button
                onClick={startBreathing}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-hud-amber/20 text-hud-amber border border-hud-amber/30 hover:bg-hud-amber/30 transition flex items-center gap-1"
              >
                <Wind className="w-2.5 h-2.5" />
                Decompress
              </button>
            </div>
          </div>

          {/* Stress Meter */}
          <div className="w-full bg-space-void rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${stressIndex}%` }}
            ></div>
          </div>
        </div>

      </section>

      {/* DAILY "CRACK THE VOID" MISSIONS */}
      <section className="hud-panel rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xs font-bold font-mono tracking-wider text-amber-glow uppercase flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-hud-amber" />
              Daily "Crack" Missions — Anti-Atrophy
            </h2>
            <p className="text-[11px] text-slate-400">Complete countermeasures to elevate your G-Score.</p>
          </div>
          <span className="text-[10px] font-mono text-hud-cyan bg-hud-cyan/10 px-2 py-0.5 rounded border border-hud-cyan/30">
            BONUS: +0.12G
          </span>
        </div>

        <div className="space-y-2">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className={`p-2.5 rounded-xl border flex items-center justify-between transition ${
                mission.completed
                  ? 'bg-space-void/80 border-emerald-500/30'
                  : 'bg-space-panel/60 border-space-border/60 hover:border-hud-cyan/50'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span className={`p-1 rounded-md text-xs font-mono ${
                  mission.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-hud-cyan/10 text-hud-cyan'
                }`}>
                  {mission.category}
                </span>
                <div>
                  <div className={`text-xs font-semibold ${mission.completed ? 'text-slate-400 line-through' : 'text-slate-100'}`}>
                    {mission.title}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {mission.subtitle} • {mission.duration}
                  </div>
                </div>
              </div>

              {mission.completed ? (
                <div className="flex items-center space-x-1 text-emerald-400 text-xs font-mono font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>CRACKED</span>
                </div>
              ) : (
                <button
                  onClick={() => completeMission(mission.id)}
                  className="text-xs font-mono px-2.5 py-1 rounded-lg bg-hud-amber/20 text-hud-amber border border-hud-amber/40 hover:bg-hud-amber/30 font-bold transition flex items-center gap-1 shadow-hud-amber"
                >
                  <span>CRACK</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SHORTCUT BAR TO TRAINING & DOCTOR */}
      <section className="grid grid-cols-2 gap-3">
        <Link
          href="/training"
          className="hud-panel rounded-xl p-3 flex items-center justify-between hover:border-hud-cyan transition"
        >
          <div>
            <div className="text-xs font-bold text-slate-100">ARED Training Chamber</div>
            <div className="text-[10px] text-slate-400 font-mono">Squats & Saccadic Calibrate</div>
          </div>
          <ChevronRight className="w-4 h-4 text-hud-cyan" />
        </Link>

        <Link
          href="/doctor"
          className="hud-panel rounded-xl p-3 flex items-center justify-between hover:border-hud-amber transition"
        >
          <div>
            <div className="text-xs font-bold text-slate-100">HALO Flight Surgeon</div>
            <div className="text-[10px] text-slate-400 font-mono">AI Biometric Diagnosis</div>
          </div>
          <ChevronRight className="w-4 h-4 text-hud-amber" />
        </Link>
      </section>

      {/* 4-7-8 ORBITAL DECOMPRESSION MODAL */}
      {showBreathingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-void/90 backdrop-blur-md">
          <div className="hud-panel rounded-2xl p-6 max-w-xs w-full text-center relative border-hud-cyan/50 shadow-hud-cyan">
            <button
              onClick={closeBreathing}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-100 p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-[10px] font-mono text-hud-cyan uppercase tracking-widest font-bold">
              Neuro-Vestibular Sync
            </span>
            <h3 className="text-base font-bold text-slate-100 mt-1 mb-4">Orbital Decompression</h3>

            {/* Breathing Animation Circle */}
            <div className="w-36 h-36 mx-auto rounded-full border-2 border-hud-cyan/40 flex flex-col items-center justify-center relative my-2 bg-hud-cyan/5 animate-pulse">
              <span className="text-xs font-mono text-slate-300 font-bold uppercase">{breathingPhase}</span>
              <span className="text-3xl font-extrabold text-cyan-glow mt-1">{breathingTimer}</span>
            </div>

            <p className="text-[11px] text-slate-400 font-mono mt-4">
              Calibrates inner-ear otoliths and down-regulates sympathetic cortisol in microgravity.
            </p>

            <button
              onClick={closeBreathing}
              className="w-full mt-4 py-2 rounded-xl bg-hud-cyan text-space-void font-bold text-xs uppercase tracking-wider hover:bg-cyan-300 transition"
            >
              Complete Decompression
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
