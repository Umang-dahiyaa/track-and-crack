'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useZeroG } from '@/lib/zeroGStore';
import { Shield, Sparkles, Check, ChevronRight, Activity, ArrowRight, Zap } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding } = useZeroG();

  const [step, setStep] = useState<number>(1);
  const [name, setName] = useState<string>('Kai Chen');
  const [callsign, setCallsign] = useState<string>('Astra-1');
  const [sensorLinked, setSensorLinked] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const handleLinkSensors = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setSensorLinked(true);
    }, 1200);
  };

  const handleFinish = () => {
    completeOnboarding(name, callsign);
    router.push('/');
  };

  return (
    <div className="space-y-4 py-2 pb-6">

      {/* STEP PROGRESS BAR */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-mono text-hud-cyan uppercase tracking-wider font-bold">
          Cadet Induction Protocol • Step {step} of 4
        </span>
        <div className="flex space-x-1.5">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-6 bg-hud-cyan shadow-hud-cyan'
                  : s < step
                  ? 'w-3 bg-hud-lime'
                  : 'w-3 bg-slate-800'
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* STEP 1: AIRLOCK WELCOME */}
      {step === 1 && (
        <div className="hud-panel rounded-2xl p-6 text-center space-y-4 shadow-hud-glow">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-hud-cyan/15 border-2 border-hud-cyan flex items-center justify-center text-3xl shadow-hud-cyan animate-pulse">
            🪐
          </div>

          <div>
            <span className="text-[10px] font-mono tracking-widest text-hud-amber font-bold uppercase">
              Orbital Station T-C1 Access
            </span>
            <h1 className="text-xl font-extrabold text-cyan-glow mt-1">
              Welcome to Zero-G
            </h1>
          </div>

          <p className="text-xs text-slate-300 font-mono leading-relaxed text-left bg-space-void/60 p-3.5 rounded-xl border border-slate-800">
            In microgravity, muscles atrophy, bone density decalcifies at 1% per month, and bodily fluids rush cephalad towards the head.
            <br /><br />
            To survive and thrive in deep space, you must <strong>Track</strong> your vitals and <strong>Crack</strong> daily deconditioning limits with physical and neuro-vestibular countermeasures.
          </p>

          <button
            onClick={() => setStep(2)}
            className="w-full py-3 rounded-xl bg-hud-cyan text-space-void font-extrabold text-xs uppercase font-mono tracking-wider hover:bg-cyan-300 transition shadow-hud-cyan flex items-center justify-center gap-2"
          >
            <span>Proceed to Sensor Handshake</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: SENSOR LINKING */}
      {step === 2 && (
        <div className="hud-panel rounded-2xl p-6 space-y-4">
          <div className="text-center">
            <span className="text-[10px] font-mono tracking-widest text-hud-cyan font-bold uppercase">
              Telemetry Hardware Sync
            </span>
            <h2 className="text-lg font-bold text-slate-100 mt-1">
              Link Cadet Biosensors
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Pair your wearable sensors (Apple Watch, Garmin, Oura, or Phone CoreMotion).
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-space-void/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Activity className="w-4 h-4 text-rose-400" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">Cardiac Optical Sensor (PPG)</div>
                  <div className="text-[10px] text-slate-500 font-mono">Pulse wave velocity & resting HR</div>
                </div>
              </div>
              {sensorLinked ? (
                <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> LINKED
                </span>
              ) : (
                <span className="text-xs text-slate-500 font-mono">WAITING</span>
              )}
            </div>

            <div className="p-3 rounded-xl bg-space-void/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Shield className="w-4 h-4 text-hud-cyan" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">Otolith Gyroscope Array</div>
                  <div className="text-[10px] text-slate-500 font-mono">Vestibular motion & posture drift</div>
                </div>
              </div>
              {sensorLinked ? (
                <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> LINKED
                </span>
              ) : (
                <span className="text-xs text-slate-500 font-mono">WAITING</span>
              )}
            </div>
          </div>

          {!sensorLinked ? (
            <button
              onClick={handleLinkSensors}
              disabled={isScanning}
              className="w-full py-3 rounded-xl bg-hud-amber text-space-void font-extrabold text-xs uppercase font-mono tracking-wider hover:bg-amber-300 transition shadow-hud-amber flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <span>Broadcasting Telemetry Handshake...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Initiate Sensor Pairing</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setStep(3)}
              className="w-full py-3 rounded-xl bg-hud-cyan text-space-void font-extrabold text-xs uppercase font-mono tracking-wider hover:bg-cyan-300 transition shadow-hud-cyan flex items-center justify-center gap-2"
            >
              <span>Sensors Locked • Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* STEP 3: CADET DOSSIER */}
      {step === 3 && (
        <div className="hud-panel rounded-2xl p-6 space-y-4">
          <div className="text-center">
            <span className="text-[10px] font-mono tracking-widest text-hud-amber font-bold uppercase">
              Flight Manifest
            </span>
            <h2 className="text-lg font-bold text-slate-100 mt-1">
              Cadet Identification
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Configure your operational callsign for station telemetry.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Cadet Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-space-void border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-hud-cyan"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Operational Callsign</label>
              <input
                type="text"
                value={callsign}
                onChange={(e) => setCallsign(e.target.value)}
                className="w-full bg-space-void border border-slate-800 rounded-xl px-3 py-2 text-hud-amber font-bold focus:outline-none focus:border-hud-amber"
              />
            </div>

            <div className="p-3 bg-space-void/80 rounded-xl border border-slate-800 text-[11px] text-slate-400">
              Assigned Habitat: <strong>ISS-7 Orbital Sector 4</strong><br />
              Initial Gravity Baseline: <strong className="text-hud-cyan">0.58 G (Terrestrial Recruit)</strong>
            </div>
          </div>

          <button
            onClick={() => setStep(4)}
            className="w-full py-3 rounded-xl bg-hud-cyan text-space-void font-extrabold text-xs uppercase font-mono tracking-wider hover:bg-cyan-300 transition shadow-hud-cyan flex items-center justify-center gap-2"
          >
            <span>Lock Dossier & Calibrate Habitat</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 4: FIRST CRACK ROUTINE */}
      {step === 4 && (
        <div className="hud-panel rounded-2xl p-6 text-center space-y-4 shadow-hud-glow">
          <div className="w-14 h-14 mx-auto rounded-full bg-hud-amber/20 border-2 border-hud-amber flex items-center justify-center text-2xl shadow-hud-amber">
            ⚡
          </div>

          <div>
            <span className="text-[10px] font-mono tracking-widest text-hud-amber font-bold uppercase">
              First Countermeasure Protocol
            </span>
            <h2 className="text-lg font-bold text-slate-100 mt-1">
              Crack Your First Micro-G Vector
            </h2>
          </div>

          <p className="text-xs text-slate-300 font-mono leading-relaxed bg-space-void/80 p-3.5 rounded-xl border border-slate-800 text-left">
            Your habitat artificial gravity is standing by at <strong>0.58G</strong>. 
            <br /><br />
            To inject <strong>+0.15G</strong> and achieve orbital lock, consume a 350 mL mineral hydration push and complete 10 deep resistance squats.
          </p>

          <button
            onClick={handleFinish}
            className="w-full py-3.5 rounded-xl bg-hud-lime text-space-void font-extrabold text-xs uppercase font-mono tracking-wider hover:bg-lime-300 transition shadow-hud-lime flex items-center justify-center gap-2 animate-bounce"
          >
            <Zap className="w-4 h-4" />
            <span>EXECUTE FIRST CRACK & ENTER HUD</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
