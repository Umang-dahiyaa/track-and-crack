'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  ShieldAlert,
  ArrowLeft,
  Flame,
  Footprints,
  Compass,
} from 'lucide-react';
import { useApp } from '@/lib/store';

export default function LiveWalkPage() {
  const params = useParams();
  const router = useRouter();
  const { bookings, completeWalk, currentUser } = useApp();

  const walkId = params?.id as string;
  const currentBooking =
    bookings.find((b) => b.id === walkId) ||
    bookings.find((b) => b.status === 'in_progress') ||
    bookings[0];

  // Timer state
  const [secondsElapsed, setSecondsElapsed] = useState(currentBooking?.walk_seconds || 124);
  const [isActive, setIsActive] = useState(true);

  // Completion Form
  const [reactionEmoji, setReactionEmoji] = useState('🐕');
  const [notes, setNotes] = useState('Great walk around the society gardens! Drank water and did some leash training.');
  const [showSosModal, setShowSosModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCompleteWalk = (e: React.FormEvent) => {
    e.preventDefault();
    completeWalk(currentBooking.id, reactionEmoji, notes, secondsElapsed);
    setIsActive(false);
    setShowSuccessModal(true);
  };

  const emojiOptions = [
    { emoji: '🐕', label: 'Happy' },
    { emoji: '🎾', label: 'Playful' },
    { emoji: '😴', label: 'Tired' },
    { emoji: '⚡', label: 'Energetic' },
  ];

  return (
    <div className="space-y-4 pb-12">
      {/* Top Bar with back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full bg-white border border-[#EFE3D5] text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="inline-flex items-center space-x-1.5 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-black">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span>LIVE WALK TRACKER</span>
        </div>
        <div className="w-8"></div>
      </div>

      {/* Mock Map Area */}
      <div className="relative w-full h-56 rounded-3xl overflow-hidden border-2 border-[#D7E3F0] bg-[#DFF1FF] shadow-inner flex items-center justify-center">
        {/* Map Grid and Gated Society Walkway Pattern */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Mock Society Pathways */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 40 180 Q 120 70 240 130 T 420 50"
            fill="transparent"
            stroke="#93C5FD"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 60 180 Q 130 90 220 120 T 360 80"
            fill="transparent"
            stroke="#FF885B"
            strokeWidth="3"
            strokeDasharray="6 6"
          />
        </svg>

        {/* Society Name Overlay on Map */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-white flex items-center space-x-1.5 text-xs font-bold text-[#2D2D2D]">
          <MapPin className="w-3.5 h-3.5 text-[#FF6B35]" />
          <span>{currentBooking.society_name || 'Prestige Lakeside Habitat'}</span>
        </div>

        {/* Speed / GPS precision badge */}
        <div className="absolute top-3 right-3 bg-[#2D2D2D]/80 backdrop-blur-md text-white px-2 py-1 rounded-full text-[10px] font-semibold flex items-center space-x-1">
          <Compass className="w-3 h-3 text-emerald-400 animate-spin" />
          <span>GPS Active (3m)</span>
        </div>

        {/* Animated Bouncing Orange Dot (GPS Location) */}
        <div className="relative flex items-center justify-center z-10">
          <div className="w-12 h-12 rounded-full bg-[#FF6B35]/20 animate-radar absolute"></div>
          <div className="w-7 h-7 rounded-full bg-[#FF6B35] text-white flex items-center justify-center text-xs font-black shadow-lg animate-bounce border-2 border-white">
            🐾
          </div>
        </div>

        {/* Map Watermark Pin */}
        <div className="absolute bottom-2 right-3 text-[10px] font-semibold text-blue-900/60 bg-white/70 px-2 py-0.5 rounded-md">
          Inner Garden Route
        </div>
      </div>

      {/* Large Timer Display */}
      <div className="bg-white p-4 rounded-3xl border border-[#F0E4D7] shadow-xs text-center space-y-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-brand-muted flex items-center justify-center space-x-1">
          <Clock className="w-3.5 h-3.5 text-[#FF6B35]" />
          <span>Elapsed Walk Time</span>
        </div>
        <div className="text-3xl sm:text-4xl font-mono font-black text-[#2D2D2D] tracking-wider">
          {formatTime(secondsElapsed)}
        </div>
        <div className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center space-x-1">
          <span>Target: {currentBooking.duration_minutes || 60} Minutes</span>
          <span>•</span>
          <span>{Math.round((secondsElapsed / 60) * 18)} steps taken</span>
        </div>
      </div>

      {/* Pet Info Card */}
      <div className="bg-white p-4 rounded-3xl border border-[#F0E4D7] shadow-xs space-y-2.5">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFEADF] flex items-center justify-center text-2xl shrink-0">
            🐕
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#2D2D2D]">{currentBooking.pet_name}</h3>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                {currentBooking.pet_size} ({currentBooking.pet_weight_kg || 28}kg)
              </span>
            </div>
            <p className="text-xs text-brand-muted mt-0.5">
              {currentBooking.pet_breed} • Owner: {currentBooking.owner_name}
            </p>
          </div>
        </div>

        {/* Special instructions with warning icon */}
        <div className="bg-[#FFF8EE] border border-[#FFE7C4] p-2.5 rounded-2xl text-xs text-[#2D2D2D] flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-900">Care Instructions: </span>
            <span>
              {currentBooking.pet_special_instructions ||
                'Keep hydrated, walk on shaded paths, and avoid other dogs if reactive.'}
            </span>
          </div>
        </div>
      </div>

      {/* "Complete Walk" Form */}
      <form onSubmit={handleCompleteWalk} className="bg-white p-4 rounded-3xl border border-[#F0E4D7] shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
          Walk Summary & Mood Report
        </h3>

        {/* Emoji reaction buttons */}
        <div className="space-y-1">
          <label className="text-xs text-brand-muted">How was {currentBooking.pet_name}&apos;s mood?</label>
          <div className="grid grid-cols-4 gap-2 pt-1">
            {emojiOptions.map((opt) => (
              <button
                type="button"
                key={opt.emoji}
                onClick={() => setReactionEmoji(opt.emoji)}
                className={`py-2 px-1 rounded-2xl border text-center transition-all ${
                  reactionEmoji === opt.emoji
                    ? 'bg-[#FFEADF] border-[#FF6B35] scale-105 shadow-xs font-bold'
                    : 'bg-[#FFFBF7] border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="text-xl">{opt.emoji}</div>
                <div className="text-[10px] text-gray-700 mt-0.5">{opt.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Notes textarea */}
        <div className="space-y-1">
          <label className="text-xs text-brand-muted">Walk Notes for Owner</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Poop scooped? Energy level? Water intake?"
            className="w-full bg-[#FFFBF7] border border-[#E9DCD0] focus:border-[#FF6B35] rounded-xl p-2.5 text-xs outline-none text-gray-700"
          />
        </div>

        {/* Complete Walk Button */}
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-full shadow-sm text-xs flex items-center justify-center space-x-1.5 active:scale-98 transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Complete Walk ✓</span>
        </button>
      </form>

      {/* SOS Emergency Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowSosModal(true)}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-300 font-extrabold py-3 rounded-full text-xs flex items-center justify-center space-x-1.5 shadow-xs active:scale-98 transition-all"
        >
          <ShieldAlert className="w-4 h-4 text-red-600" />
          <span>🚨 SOS — Emergency Helpline</span>
        </button>
      </div>

      {/* SOS Alert Modal */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl border-2 border-red-500 animate-in zoom-in-95">
            <div className="flex items-center space-x-2 text-red-600">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-base font-black">PetPal Emergency Assistance</h3>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              If {currentBooking.pet_name} slipped leash, had an injury, or there is an emergency inside{' '}
              <strong>{currentBooking.society_name}</strong>, immediate help is available:
            </p>

            <div className="space-y-2">
              <a
                href="tel:1800123999"
                className="flex items-center justify-between bg-red-600 text-white p-3 rounded-2xl text-xs font-bold shadow-md hover:bg-red-700"
              >
                <span>📞 Call PetPal 24/7 Safety Dispatch</span>
                <span>1800-123-999</span>
              </a>

              <a
                href="tel:9988776655"
                className="flex items-center justify-between bg-gray-100 text-gray-800 p-3 rounded-2xl text-xs font-bold hover:bg-gray-200"
              >
                <span>🏢 Society Main Gate Security</span>
                <span>+91 99887 76655</span>
              </a>

              <a
                href="tel:1800998877"
                className="flex items-center justify-between bg-blue-50 text-blue-800 border border-blue-200 p-3 rounded-2xl text-xs font-bold"
              >
                <span>🏥 24/7 Emergency Vet Clinic</span>
                <span>Near Society</span>
              </a>
            </div>

            <button
              type="button"
              onClick={() => setShowSosModal(false)}
              className="w-full text-center text-xs font-bold text-gray-500 hover:text-gray-700 pt-1"
            >
              Close Alert
            </button>
          </div>
        </div>
      )}

      {/* Completion Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xs w-full p-6 text-center space-y-3 shadow-2xl animate-in zoom-in-95">
            <div className="text-4xl">🎉🐾</div>
            <h3 className="text-base font-black text-[#2D2D2D]">Walk Completed!</h3>
            <p className="text-xs text-brand-muted">
              {currentBooking.pet_name} had a wonderful walk. Report card and notes sent to the owner!
            </p>
            <div className="text-xs font-black text-emerald-600 bg-emerald-50 py-2 rounded-xl">
              ₹{currentBooking.pal_share || 112} Credited to Pal Wallet
            </div>
            <button
              onClick={() => router.push('/dashboard/pal')}
              className="w-full bg-[#FF6B35] text-white font-bold py-2.5 rounded-full text-xs shadow-warm"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
