'use client';

import React, { useState } from 'react';
import { useZeroG } from '@/lib/zeroGStore';
import { Stethoscope, Send, Bot, User, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'halo' | 'user';
  text: string;
  time: string;
}

export default function DoctorPage() {
  const { heartRate, sleepHours, hydrationMl, stressIndex, gravityScore } = useZeroG();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'halo',
      text: `Cadet, I am HALO-9, your automated orbital flight surgeon. Your current telemetric Gravity Score is ${gravityScore.toFixed(2)}G. Vitals indicate stable cardiac rhythm (${heartRate} BPM) with compensated fluid shifts. How can I assist your acclimation protocol today?`,
      time: '14:02 UTC',
    },
  ]);

  const [inputValue, setInputValue] = useState<string>('');

  const quickPrompts = [
    'Diagnose cephalic fluid pressure',
    'Prescribe anti-atrophy regimen',
    'Analyze my sleep deficit',
    'How do I crack 1.00G today?',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');

    // Generate intelligent AI aerospace medical response based on current vitals
    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();

      if (q.includes('fluid') || q.includes('cephalic')) {
        reply = `Telemetry Assessment: At ${heartRate} BPM and ${hydrationMl} mL fluid level, cephalad venous redistribution is currently nominal. However, zero-G eliminates hydrostatic blood pressure gradients. I recommend 15 minutes of lower-body isometric tension or 20 deep squats to maintain peripheral vascular elasticity.`;
      } else if (q.includes('atrophy') || q.includes('regimen') || q.includes('exercise')) {
        reply = `Prescription for G-Score (${gravityScore.toFixed(2)}G): Complete 3 sets of 12 reps on the ARED Centrifuge rack (heel-strike resistance). Bone osteoblasts require mechanical strain of at least 1.4x body mass to halt osteopenia.`;
      } else if (q.includes('sleep') || q.includes('circadian')) {
        reply = `Circadian Analysis: You logged ${sleepHours.toFixed(1)} hours of rest. While REM cycles were stable, orbital station 90-minute light cycles can degrade melatonin synthesis. Keep your sleep quarters in amber spectrum light for 45 minutes prior to rack time.`;
      } else if (q.includes('1.00g') || q.includes('crack') || q.includes('score')) {
        reply = `To crack 1.00G (Commander Overdrive): You are currently at ${gravityScore.toFixed(2)}G. Complete the remaining daily missions in the HUD: perform the 5-minute Saccadic Vestibular drill and log an additional 350 mL electrolyte bolus.`;
      } else {
        reply = `Diagnostic received. Based on your live telemetry (${gravityScore.toFixed(2)}G, ${heartRate} BPM, HRV: ${stressIndex < 30 ? 'Normal parasympathetic' : 'Elevated sympathetic'}): All primary life support metrics are within tolerable human spaceflight thresholds. Maintain daily ARED physical countermeasures.`;
      }

      const haloReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'halo',
        text: reply,
        time: 'Just now',
      };
      setMessages((prev) => [...prev, haloReply]);
    }, 700);
  };

  return (
    <div className="space-y-4 pb-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold font-mono tracking-wider text-cyan-glow uppercase flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-hud-cyan" />
            HALO-9 Flight Surgeon
          </h1>
          <p className="text-[11px] text-slate-400 font-mono">Autonomous Orbital Medical Diagnostics</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          AI ONLINE
        </span>
      </div>

      {/* QUICK VITALS STRIP */}
      <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono bg-space-void/80 p-2 rounded-xl border border-slate-800">
        <div>
          <span className="text-slate-400">G-SCORE:</span>
          <div className="font-bold text-cyan-glow">{gravityScore.toFixed(2)}G</div>
        </div>
        <div>
          <span className="text-slate-400">PULSE:</span>
          <div className="font-bold text-slate-200">{heartRate} BPM</div>
        </div>
        <div>
          <span className="text-slate-400">SLEEP:</span>
          <div className="font-bold text-indigo-300">{sleepHours.toFixed(1)}h</div>
        </div>
        <div>
          <span className="text-slate-400">STRESS:</span>
          <div className="font-bold text-hud-amber">{stressIndex} IDX</div>
        </div>
      </div>

      {/* CHAT MESSAGES LOG */}
      <div className="hud-panel rounded-2xl p-3.5 space-y-3 min-h-[300px] max-h-[420px] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                msg.sender === 'halo'
                  ? 'bg-hud-cyan/20 text-hud-cyan border border-hud-cyan/40'
                  : 'bg-hud-amber/20 text-hud-amber border border-hud-amber/40'
              }`}
            >
              {msg.sender === 'halo' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>

            <div
              className={`p-3 rounded-2xl text-xs max-w-[82%] leading-relaxed ${
                msg.sender === 'halo'
                  ? 'bg-space-panel/90 text-slate-200 border border-slate-800'
                  : 'bg-hud-cyan/15 text-hud-cyan border border-hud-cyan/30'
              }`}
            >
              {msg.text}
              <div className="text-[9px] font-mono text-slate-500 mt-1 text-right">{msg.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* QUICK PRESET CHIPS */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-space-void border border-slate-800 text-slate-300 hover:text-hud-cyan hover:border-hud-cyan transition whitespace-nowrap flex items-center gap-1 shrink-0"
          >
            <Sparkles className="w-2.5 h-2.5 text-hud-cyan" />
            {prompt}
          </button>
        ))}
      </div>

      {/* INPUT FORM */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Consult flight doctor on vitals or symptoms..."
          className="flex-1 bg-space-void border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-hud-cyan transition"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-hud-cyan text-space-void rounded-xl font-bold hover:bg-cyan-300 transition shadow-hud-cyan"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
