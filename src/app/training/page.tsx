'use client';

import React, { useState } from 'react';
import { useZeroG } from '@/lib/zeroGStore';
import { Dumbbell, Target, Timer, Flame, CheckCircle2, RotateCcw } from 'lucide-react';

export default function TrainingPage() {
  const { completeMission } = useZeroG();

  // ARED Squat Counter State
  const [squatReps, setSquatReps] = useState<number>(0);
  const [squatSets, setSquatSets] = useState<number>(1);
  const targetReps = 12;

  const handleAddRep = () => {
    setSquatReps((prev) => {
      const next = prev + 1;
      if (next >= targetReps) {
        completeMission('m1');
      }
      return next;
    });
  };

  const handleNextSet = () => {
    setSquatSets((prev) => prev + 1);
    setSquatReps(0);
  };

  // Saccadic Neuro-Vestibular Interactive Calibration Minigame
  const [drillActive, setDrillActive] = useState<boolean>(false);
  const [targetPos, setTargetPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [hits, setHits] = useState<number>(0);
  const [lastLatency, setLastLatency] = useState<number | null>(null);
  const [targetTime, setTargetTime] = useState<number>(0);
  const [drillComplete, setDrillComplete] = useState<boolean>(false);

  const startDrill = () => {
    setHits(0);
    setDrillComplete(false);
    setDrillActive(true);
    spawnTarget();
  };

  const spawnTarget = () => {
    const randomX = Math.floor(Math.random() * 70) + 15; // 15% to 85%
    const randomY = Math.floor(Math.random() * 60) + 20; // 20% to 80%
    setTargetPos({ x: randomX, y: randomY });
    setTargetTime(Date.now());
  };

  const handleTargetClick = () => {
    const latency = Date.now() - targetTime;
    setLastLatency(latency);
    const newHits = hits + 1;
    setHits(newHits);

    if (newHits >= 5) {
      setDrillActive(false);
      setDrillComplete(true);
      completeMission('m3');
    } else {
      spawnTarget();
    }
  };

  return (
    <div className="space-y-4 pb-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold font-mono tracking-wider text-cyan-glow uppercase flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-hud-cyan" />
            Zero-G Training Chamber
          </h1>
          <p className="text-[11px] text-slate-400 font-mono">Anti-Atrophy Resistance & Neuro-Vestibular Drills</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-hud-amber/10 text-hud-amber border border-hud-amber/30">
          CHAMBER 03
        </span>
      </div>

      {/* MODULE 1: ARED CENTRIFUGE RESISTANCE SQUATS */}
      <section className="hud-panel rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div>
            <h2 className="text-xs font-mono font-bold text-slate-100 uppercase flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-hud-rose" />
              ARED Simulated Gravity Squats
            </h2>
            <p className="text-[10px] text-slate-400">Heel-strike mechanical loading against bone demineralization.</p>
          </div>
          <span className="text-xs font-mono font-bold text-hud-lime">SET #{squatSets}</span>
        </div>

        <div className="bg-space-void/90 rounded-xl p-4 border border-slate-800 flex items-center justify-around text-center">
          <div>
            <div className="text-[10px] text-slate-400 font-mono">LOAD EQUIVALENCE</div>
            <div className="text-xl font-extrabold text-hud-cyan font-mono">140 KG</div>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono">REPS LOGGED</div>
            <div className="text-3xl font-extrabold text-amber-glow font-mono">
              {squatReps} <span className="text-sm text-slate-400">/ {targetReps}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAddRep}
            className="flex-1 py-2.5 rounded-xl bg-hud-cyan text-space-void font-bold text-xs uppercase font-mono tracking-wider hover:bg-cyan-300 transition shadow-hud-cyan flex items-center justify-center gap-1.5"
          >
            <span>+1 Rep (Heel Strike)</span>
          </button>
          <button
            onClick={handleNextSet}
            className="px-3 py-2.5 rounded-xl bg-space-panel text-slate-300 border border-slate-700 hover:border-hud-cyan text-xs font-mono transition"
          >
            Next Set
          </button>
        </div>
      </section>

      {/* MODULE 2: INTERACTIVE SACCADIC NEURO-VESTIBULAR CALIBRATION DRILL */}
      <section className="hud-panel rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div>
            <h2 className="text-xs font-mono font-bold text-slate-100 uppercase flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-hud-cyan" />
              Saccadic Ocular Calibration (SAS Drill)
            </h2>
            <p className="text-[10px] text-slate-400">Tracks rapid eye latency to reset floating otolith disorientation.</p>
          </div>
          {lastLatency && (
            <span className="text-xs font-mono text-hud-cyan font-bold">{lastLatency} ms</span>
          )}
        </div>

        {/* Minigame Interactive Viewport */}
        <div className="relative h-44 bg-space-void rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-space-grid opacity-40 pointer-events-none"></div>

          {!drillActive && !drillComplete && (
            <div className="text-center p-4 relative z-10">
              <div className="text-xs text-slate-300 font-mono mb-2">
                Tap the pulsating quantum targeting reticles as fast as possible (5 hits).
              </div>
              <button
                onClick={startDrill}
                className="px-4 py-2 rounded-xl bg-hud-amber text-space-void font-bold text-xs uppercase font-mono tracking-wider hover:bg-amber-300 transition shadow-hud-amber"
              >
                Initiate Saccadic Scan
              </button>
            </div>
          )}

          {drillActive && (
            <>
              <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-400">
                CALIBRATING SACCADES: <span className="text-hud-cyan font-bold">{hits} / 5</span>
              </div>
              <button
                onClick={handleTargetClick}
                style={{ top: `${targetPos.y}%`, left: `${targetPos.x}%` }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-hud-cyan bg-hud-cyan/30 flex items-center justify-center animate-ping hover:scale-125 transition cursor-pointer shadow-hud-cyan"
              >
                <span className="w-3 h-3 bg-hud-cyan rounded-full"></span>
              </button>
            </>
          )}

          {drillComplete && (
            <div className="text-center p-4 relative z-10 space-y-2">
              <div className="flex items-center justify-center space-x-1 text-emerald-400 font-mono text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>CALIBRATION CONFIRMED: 98% VESTIBULAR STABILITY</span>
              </div>
              <div className="text-[10px] font-mono text-slate-300">
                Mean Reaction Latency: <strong className="text-hud-cyan">{lastLatency || 260} ms</strong> • Motion sickness mitigated.
              </div>
              <button
                onClick={startDrill}
                className="px-3 py-1.5 rounded-lg bg-space-panel text-slate-300 border border-slate-700 text-xs font-mono hover:border-hud-cyan flex items-center justify-center gap-1 mx-auto"
              >
                <RotateCcw className="w-3 h-3" />
                Repeat Drill
              </button>
            </div>
          )}
        </div>
      </section>

      {/* MODULE 3: EVA CARDIO THRUSTERS */}
      <section className="hud-panel rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xs font-mono font-bold text-slate-100 uppercase flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-hud-cyan" />
              EVA Aerobic Thruster Routine
            </h2>
            <p className="text-[10px] text-slate-400">Zone 2 steady-state cardiovascular preservation.</p>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            TARGET: 25 MINS
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div className="bg-space-void/60 p-2.5 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[10px]">TIME ACTIVE</div>
            <div className="text-base font-bold text-slate-100">18:42</div>
          </div>
          <div className="bg-space-void/60 p-2.5 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[10px]">AVG HR</div>
            <div className="text-base font-bold text-hud-cyan">132 BPM</div>
          </div>
          <div className="bg-space-void/60 p-2.5 rounded-xl border border-slate-800">
            <div className="text-slate-400 text-[10px]">ENERGY EXP.</div>
            <div className="text-base font-bold text-hud-amber">284 KCAL</div>
          </div>
        </div>
      </section>
    </div>
  );
}
