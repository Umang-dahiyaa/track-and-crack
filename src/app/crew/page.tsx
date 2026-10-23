'use client';

import React, { useState } from 'react';
import { useZeroG } from '@/lib/zeroGStore';
import { Users, Shield, Send, Radio, Award } from 'lucide-react';

export default function CrewPage() {
  const { crew, profile } = useZeroG();
  const [pingSent, setPingSent] = useState<string | null>(null);

  const handleSendPing = (name: string) => {
    setPingSent(`Ping sent to ${name}: "Maintain Hydration & Bone Loading!"`);
    setTimeout(() => setPingSent(null), 3000);
  };

  return (
    <div className="space-y-4 pb-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold font-mono tracking-wider text-cyan-glow uppercase flex items-center gap-2">
            <Users className="w-4 h-4 text-hud-cyan" />
            Station Crew Telemetry
          </h1>
          <p className="text-[11px] text-slate-400 font-mono">HAB-ORBITAL // ISS-7 FLEET CO-OP</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          ALL NODES SYNCED
        </span>
      </div>

      {/* TOAST ALERT */}
      {pingSent && (
        <div className="p-3 bg-hud-cyan/20 border border-hud-cyan rounded-xl text-xs font-mono text-cyan-200 animate-pulse text-center">
          📡 {pingSent}
        </div>
      )}

      {/* STATION CO-OP METRICS */}
      <section className="hud-panel rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-mono font-bold text-slate-200 uppercase flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-hud-lime" />
            Station Deconditioning Shield
          </span>
          <span className="text-xs font-mono font-bold text-hud-lime">94.2% EFFICACY</span>
        </div>

        <div className="w-full bg-space-void rounded-full h-3 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-hud-cyan via-hud-amber to-hud-lime h-3 rounded-full"
            style={{ width: '94.2%' }}
          ></div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
          <div>
            CREW AVERAGE G-SCORE: <strong className="text-hud-cyan">0.87G</strong>
          </div>
          <div className="text-right">
            SURVIVAL STREAK: <strong className="text-slate-100">{profile.flightDays} SOLS</strong>
          </div>
        </div>
      </section>

      {/* CREW ROSTER */}
      <section className="space-y-2.5">
        <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Active Station Specialists
        </div>

        {crew.map((member) => (
          <div
            key={member.id}
            className={`hud-panel rounded-xl p-3.5 flex items-center justify-between transition ${
              member.callsign === 'Astra-1' ? 'border-hud-cyan/60 bg-space-panel/90 shadow-hud-cyan' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{member.avatar}</span>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-slate-100">{member.name}</span>
                  <span className="text-[10px] font-mono text-hud-amber font-semibold">[{member.callsign}]</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {member.role} • HR: <span className="text-slate-200">{member.hr} BPM</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className="text-xs font-extrabold text-cyan-glow font-mono">
                  {member.gScore.toFixed(2)}G
                </div>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                    member.status === 'OPTIMAL'
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                  }`}
                >
                  {member.status}
                </span>
              </div>

              {member.callsign !== 'Astra-1' && (
                <button
                  onClick={() => handleSendPing(member.name)}
                  title="Send Hydration & Morale Ping"
                  className="p-1.5 rounded-lg bg-space-void text-hud-cyan border border-slate-700 hover:border-hud-cyan transition"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* STATION LEADERBOARD ACHIEVEMENTS */}
      <section className="hud-panel rounded-2xl p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Award className="w-4 h-4 text-hud-amber" />
          <span className="text-xs font-mono font-bold text-slate-100 uppercase">Fleet Badges</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
          <div className="p-2 rounded-xl bg-space-void/80 border border-hud-amber/30">
            <div className="text-base mb-0.5">🥇</div>
            <div className="text-hud-amber font-bold">Centrifuge Ace</div>
            <div className="text-slate-500">100+ Tons Lifted</div>
          </div>
          <div className="p-2 rounded-xl bg-space-void/80 border border-hud-cyan/30">
            <div className="text-base mb-0.5">💧</div>
            <div className="text-hud-cyan font-bold">Osmotic Master</div>
            <div className="text-slate-500">30 Sols Hydrated</div>
          </div>
          <div className="p-2 rounded-xl bg-space-void/80 border border-slate-800">
            <div className="text-base mb-0.5">🌌</div>
            <div className="text-slate-300 font-bold">Solar Sleeper</div>
            <div className="text-slate-500">90%+ REM Sync</div>
          </div>
        </div>
      </section>
    </div>
  );
}
