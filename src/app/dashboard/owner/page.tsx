'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CalendarPlus,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Navigation,
  PlusCircle,
} from 'lucide-react';
import { useApp } from '@/lib/store';

export default function OwnerDashboard() {
  const { currentUser, pets, bookings, subscription, cancelBooking } = useApp();

  const ownerName = currentUser?.name || 'Vikram Malhotra';
  const ownerPets = pets.filter((p) => p.owner_id === currentUser?.id || currentUser?.role === 'owner');

  const upcomingWalks = bookings.filter(
    (b) => b.status === 'pending' || b.status === 'accepted' || b.status === 'in_progress'
  );

  const pastWalks = bookings.filter((b) => b.status === 'completed');

  const [notification, setNotification] = useState<string | null>(null);

  const handleCancel = (bookingId: string) => {
    cancelBooking(bookingId);
    setNotification('Walk booking cancelled.');
    setTimeout(() => setNotification(null), 2500);
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Toast */}
      {notification && (
        <div className="bg-emerald-500 text-white text-xs px-4 py-2 rounded-2xl shadow-md flex items-center justify-between animate-in fade-in">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)}>✕</button>
        </div>
      )}

      {/* Greeting Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#2D2D2D] flex items-center">
            Welcome back, {ownerName.split(' ')[0]} 🐾
          </h1>
          <p className="text-xs text-brand-muted mt-0.5">
            {currentUser?.society_name || 'Prestige Lakeside Habitat'}, {currentUser?.city || 'Bangalore'}
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[#FFEADF] flex items-center justify-center text-xl shadow-xs">
          🐕
        </div>
      </div>

      {/* Stats Row (3 Cards) */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white p-3 rounded-2xl border border-[#F0E4D7] shadow-xs text-center">
          <div className="text-xs text-brand-muted font-medium">My Pets</div>
          <div className="text-xl font-black text-[#2D2D2D] mt-0.5">{ownerPets.length}</div>
          <div className="text-[10px] text-[#FF6B35] font-semibold mt-0.5">Active</div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#F0E4D7] shadow-xs text-center">
          <div className="text-xs text-brand-muted font-medium">Upcoming</div>
          <div className="text-xl font-black text-[#FF6B35] mt-0.5">{upcomingWalks.length}</div>
          <div className="text-[10px] text-amber-600 font-semibold mt-0.5">Scheduled</div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#F0E4D7] shadow-xs text-center">
          <div className="text-xs text-brand-muted font-medium">Completed</div>
          <div className="text-xl font-black text-[#2D2D2D] mt-0.5">{pastWalks.length}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Safe Walks</div>
        </div>
      </div>

      {/* Subscription Banner (Orange Gradient) */}
      <div className="rounded-3xl bg-gradient-to-r from-[#FF6B35] to-[#FF885B] p-4 text-white shadow-warm relative overflow-hidden">
        <div className="absolute -right-4 -bottom-6 text-white/10 text-8xl pointer-events-none">
          🎾
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center space-x-1 bg-white/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-white">
              <Sparkles className="w-3 h-3" />
              <span>{subscription ? subscription.plan_name : 'No Active Plan'}</span>
            </div>
            <h2 className="text-base font-extrabold mt-1">
              {subscription
                ? `${subscription.walks_remaining} of ${subscription.walks_total} Walks Remaining`
                : 'Save 35% with Monthly Companion Plan'}
            </h2>
            <p className="text-[11px] text-white/90 mt-0.5">
              {subscription
                ? `Active until ${subscription.active_until}`
                : 'Guaranteed verified pals & instant booking'}
            </p>
          </div>
          <Link
            href="/subscription"
            className="bg-white text-[#FF6B35] text-xs font-black px-3.5 py-2 rounded-full shadow-sm hover:bg-white/95 shrink-0 active:scale-95 transition-all"
          >
            {subscription ? 'Manage' : 'Get Plan'}
          </Link>
        </div>
      </div>

      {/* Primary Action Button */}
      <Link
        href="/book"
        className="w-full flex items-center justify-center space-x-2 bg-[#FF6B35] hover:bg-[#E85924] text-white font-extrabold py-3.5 px-4 rounded-full shadow-warm text-sm active:scale-98 transition-all"
      >
        <CalendarPlus className="w-4 h-4" />
        <span>Book a Walk 📅</span>
      </Link>

      {/* "My Pets" Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#2D2D2D] flex items-center">
            <span>My Pets</span>
            <span className="ml-1.5 bg-[#FFEADF] text-[#FF6B35] text-xs px-2 py-0.5 rounded-full">
              {ownerPets.length}
            </span>
          </h2>
          <Link href="/profile" className="text-xs text-[#FF6B35] font-bold hover:underline flex items-center">
            <PlusCircle className="w-3.5 h-3.5 mr-1" />
            <span>Add Pet</span>
          </Link>
        </div>

        <div className="space-y-2.5">
          {ownerPets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white p-3.5 rounded-3xl border border-[#F0E4D7] shadow-xs flex flex-col space-y-2"
            >
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFEADF] flex items-center justify-center text-2xl shrink-0">
                  {pet.avatar_emoji || '🐕'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-[#2D2D2D]">{pet.name}</h3>
                    {pet.vaccinated && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 mr-0.5" /> Vaccinated
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-muted">
                    {pet.breed} • {pet.weight_kg} kg • {pet.age_months} months
                  </p>
                </div>
              </div>

              {/* Temperament tags */}
              <div className="flex flex-wrap gap-1 pt-1 border-t border-gray-100">
                {pet.temperament.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold bg-[#FFF9F5] text-gray-700 border border-[#F0E4D7] px-2 py-0.5 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* "Upcoming Walks" Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#2D2D2D]">Upcoming Walks</h2>
          <span className="text-xs text-brand-muted">{upcomingWalks.length} scheduled</span>
        </div>

        {upcomingWalks.length === 0 ? (
          <div className="bg-white p-6 rounded-3xl border border-dashed border-[#E5D5C5] text-center space-y-2">
            <div className="text-3xl">🐾</div>
            <p className="text-xs text-gray-500">No walks booked yet today.</p>
            <Link
              href="/book"
              className="inline-block text-xs font-bold text-[#FF6B35] bg-[#FFEADF] px-3.5 py-1.5 rounded-full hover:bg-[#FFD9C6]"
            >
              Book your first walk
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingWalks.map((walk) => {
              const isLive = walk.status === 'in_progress';
              return (
                <div
                  key={walk.id}
                  className={`bg-white p-3.5 rounded-3xl border transition-all shadow-xs space-y-2.5 ${
                    isLive ? 'border-[#FF6B35] ring-2 ring-[#FF6B35]/20 bg-[#FFFBF8]' : 'border-[#F0E4D7]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-extrabold text-[#2D2D2D]">{walk.pet_name}</span>
                        {isLive && (
                          <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full animate-pulse flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-white mr-1 animate-ping"></span>
                            LIVE NOW
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            walk.status === 'in_progress'
                              ? 'bg-amber-100 text-amber-800'
                              : walk.status === 'accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {walk.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-brand-muted mt-0.5">
                        📅 {walk.date} at {walk.time_slot} • {walk.duration_minutes} mins
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-[#2D2D2D]">₹{walk.cost}</div>
                      <div className="text-[10px] text-gray-400">Total</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                    <div className="flex items-center space-x-1.5 text-gray-700">
                      <span>Pal:</span>
                      <span className="font-bold text-[#2D2D2D]">
                        {walk.pal_name ? walk.pal_name : 'Matching verified pal...'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isLive ? (
                        <Link
                          href={`/walk/${walk.id}/live`}
                          className="flex items-center space-x-1 bg-[#FF6B35] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xs hover:bg-[#E85924]"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>Track GPS</span>
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleCancel(walk.id)}
                          className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* "Past Walks" Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#2D2D2D]">Past Walks</h2>
          <span className="text-xs text-brand-muted">{pastWalks.length} completed</span>
        </div>

        <div className="space-y-2">
          {pastWalks.map((walk) => (
            <div
              key={walk.id}
              className="bg-white p-3 rounded-2xl border border-[#F0E4D7] shadow-xs flex items-center justify-between text-xs"
            >
              <div className="flex items-center space-x-2.5">
                <div className="text-lg">{walk.reaction_emoji || '🐕'}</div>
                <div>
                  <div className="font-bold text-[#2D2D2D]">
                    {walk.pet_name} with {walk.pal_name || 'Pet Pal'}
                  </div>
                  <div className="text-[10px] text-brand-muted">
                    {walk.date} • {walk.duration_minutes} mins • ₹{walk.cost}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Completed ✓
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
