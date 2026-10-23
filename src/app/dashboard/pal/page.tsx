'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Navigation,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Play,
  IndianRupee,
  Star,
} from 'lucide-react';
import { useApp } from '@/lib/store';

export default function PalDashboard() {
  const router = useRouter();
  const { currentUser, bookings, palProfiles, acceptWalk, startWalk } = useApp();

  const palName = currentUser?.name || 'Siddharth Nair';
  const myProfile = palProfiles.find((p) => p.user_id === currentUser?.id) || palProfiles[0];

  // Available walks to accept (status: pending)
  const availableWalks = bookings.filter((b) => b.status === 'pending');

  // My accepted or in_progress walks
  const myWalks = bookings.filter(
    (b) => (b.pal_id === currentUser?.id || b.pal_id === myProfile.user_id) && (b.status === 'accepted' || b.status === 'in_progress')
  );

  // Completed walks
  const completedWalks = bookings.filter(
    (b) => (b.pal_id === currentUser?.id || b.pal_id === myProfile.user_id) && b.status === 'completed'
  );

  // Total earnings calculated from completed walks
  const totalEarnings = (myProfile?.total_walks || 0) * 112 + completedWalks.reduce((acc, b) => acc + (b.pal_share || 75), 0);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAccept = (bookingId: string) => {
    acceptWalk(bookingId);
    setToastMessage('Walk accepted! Added to your schedule.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStartWalk = (bookingId: string) => {
    startWalk(bookingId);
    router.push(`/walk/${bookingId}/live`);
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Toast */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white text-xs px-4 py-2.5 rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in">
          <span>🐾 {toastMessage}</span>
          <button onClick={() => setToastMessage(null)}>✕</button>
        </div>
      )}

      {/* Greeting Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#2D2D2D] flex items-center">
            Hey there, {palName.split(' ')[0]} ❤️
          </h1>
          <div className="flex items-center space-x-1.5 text-xs text-brand-muted mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Aadhaar Verified Pet Pal</span>
            <span>•</span>
            <span>{currentUser?.city || 'Bangalore'}</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl shadow-xs font-bold">
          {myProfile?.avatar_letter || 'S'}
        </div>
      </div>

      {/* Stats Row (3 Cards) */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white p-3 rounded-2xl border border-[#F0E4D7] shadow-xs text-center">
          <div className="text-xs text-brand-muted font-medium">Total Walks</div>
          <div className="text-xl font-black text-[#2D2D2D] mt-0.5">
            {(myProfile?.total_walks || 0) + completedWalks.length}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Completed</div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#F0E4D7] shadow-xs text-center">
          <div className="text-xs text-brand-muted font-medium">Earnings</div>
          <div className="text-xl font-black text-[#FF6B35] mt-0.5">₹{totalEarnings}</div>
          <div className="text-[10px] text-gray-500 font-semibold mt-0.5">75% Share</div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#F0E4D7] shadow-xs text-center">
          <div className="text-xs text-brand-muted font-medium">Rating</div>
          <div className="text-xl font-black text-amber-500 mt-0.5 flex items-center justify-center">
            <span>{myProfile?.rating || 4.9}</span>
            <span className="text-xs ml-0.5">⭐</span>
          </div>
          <div className="text-[10px] text-gray-500 font-semibold mt-0.5">Top Rated</div>
        </div>
      </div>

      {/* "My Walks" (Accepted / In Progress) */}
      {myWalks.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-[#2D2D2D] flex items-center">
              <span>My Active Walks</span>
              <span className="ml-1.5 bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold">
                {myWalks.length}
              </span>
            </h2>
          </div>

          <div className="space-y-2.5">
            {myWalks.map((walk) => {
              const isLive = walk.status === 'in_progress';
              return (
                <div
                  key={walk.id}
                  className={`bg-white p-4 rounded-3xl border shadow-xs space-y-3 ${
                    isLive ? 'border-[#FF6B35] ring-2 ring-[#FF6B35]/20 bg-[#FFFBF8]' : 'border-emerald-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-extrabold text-[#2D2D2D]">{walk.pet_name}</span>
                        <span className="text-xs text-gray-500 font-medium">({walk.pet_breed})</span>
                        {isLive && (
                          <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full animate-pulse">
                            LIVE
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-brand-muted flex items-center mt-1">
                        <MapPin className="w-3 h-3 text-[#FF6B35] mr-1 shrink-0" />
                        <span className="truncate">{walk.society_name}</span>
                      </div>
                      <div className="text-xs text-gray-700 font-medium mt-0.5">
                        📅 {walk.date} at {walk.time_slot} • {walk.duration_minutes} mins
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-emerald-600">₹{walk.pal_share}</div>
                      <div className="text-[10px] text-gray-400">Your Earning</div>
                    </div>
                  </div>

                  {walk.pet_special_instructions && (
                    <div className="bg-[#FFF8EE] border border-[#FFE7C4] p-2 rounded-xl text-[11px] text-[#2D2D2D] flex items-start space-x-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{walk.pet_special_instructions}</span>
                    </div>
                  )}

                  <div className="pt-1">
                    {isLive ? (
                      <Link
                        href={`/walk/${walk.id}/live`}
                        className="w-full flex items-center justify-center space-x-2 bg-[#FF6B35] hover:bg-[#E85924] text-white font-extrabold py-2.5 rounded-full text-xs shadow-warm"
                      >
                        <Navigation className="w-3.5 h-3.5 animate-pulse" />
                        <span>View Live Walk 📍</span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleStartWalk(walk.id)}
                        className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded-full text-xs shadow-sm active:scale-98 transition-all"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Start Walk 🚶</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* "Available Walks" Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-[#2D2D2D] flex items-center">
              Available Walks
              <span className="ml-1.5 bg-[#FFEADF] text-[#FF6B35] text-xs px-2 py-0.5 rounded-full">
                {availableWalks.length} new
              </span>
            </h2>
            <p className="text-xs text-brand-muted">Gated societies in your area</p>
          </div>
        </div>

        {availableWalks.length === 0 ? (
          <div className="bg-white p-6 rounded-3xl border border-dashed border-[#E5D5C5] text-center space-y-1.5">
            <div className="text-2xl">🎉</div>
            <p className="text-xs font-semibold text-gray-700">All caught up!</p>
            <p className="text-[11px] text-gray-500">
              No new walk requests right now. New requests will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {availableWalks.map((walk) => (
              <div
                key={walk.id}
                className="bg-white p-4 rounded-3xl border border-[#F0E4D7] shadow-xs space-y-3 transition-all hover:border-[#FF6B35]"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-[#FFEADF] flex items-center justify-center text-xl shrink-0">
                      🐕
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-[#2D2D2D]">{walk.pet_name}</h3>
                      <p className="text-xs text-brand-muted">{walk.pet_breed}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-emerald-600">₹{walk.pal_share}</div>
                    <div className="text-[10px] text-gray-400">Pal Share (75%)</div>
                  </div>
                </div>

                {/* Society and schedule */}
                <div className="space-y-1 bg-[#FFFDFB] p-2.5 rounded-2xl border border-[#F3E8DC] text-xs">
                  <div className="flex items-center text-gray-700 font-medium">
                    <MapPin className="w-3 h-3 text-[#FF6B35] mr-1.5 shrink-0" />
                    <span className="truncate">{walk.society_name}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-[11px]">
                    <Clock className="w-3 h-3 text-gray-400 mr-1.5 shrink-0" />
                    <span>
                      {walk.date} at {walk.time_slot} • {walk.duration_minutes} mins duration
                    </span>
                  </div>
                </div>

                {/* Badges: size, weight, vaccination */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full capitalize">
                    {walk.pet_size} Size
                  </span>
                  <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                    {walk.pet_weight_kg} kg
                  </span>
                  {walk.pet_vaccinated && (
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                      Vaccinated ✓
                    </span>
                  )}
                </div>

                {/* Special instructions */}
                {walk.pet_special_instructions && (
                  <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200">
                    <strong>Note:</strong> {walk.pet_special_instructions}
                  </div>
                )}

                {/* Accept Walk Button */}
                <button
                  onClick={() => handleAccept(walk.id)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded-full shadow-sm text-xs flex items-center justify-center space-x-1.5 active:scale-98 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Accept Walk ✓</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* "Completed" Walks Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#2D2D2D]">Completed Walks</h2>
          <span className="text-xs text-brand-muted">{completedWalks.length} past</span>
        </div>

        <div className="space-y-2">
          {completedWalks.map((walk) => (
            <div
              key={walk.id}
              className="bg-white p-3 rounded-2xl border border-[#F0E4D7] shadow-xs flex items-center justify-between text-xs"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-lg">{walk.reaction_emoji || '🎾'}</span>
                <div>
                  <div className="font-bold text-[#2D2D2D]">{walk.pet_name}</div>
                  <div className="text-[10px] text-brand-muted">
                    {walk.date} • {walk.duration_minutes}m walk
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-emerald-600 text-xs">+₹{walk.pal_share}</span>
                <div className="text-[9px] text-gray-400">Credited</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
