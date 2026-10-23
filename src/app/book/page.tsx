'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Dog,
  UserCheck,
  Shield,
  Star,
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { TIME_SLOTS, WALK_PRICING } from '@/lib/mockData';

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPal = searchParams.get('pal');

  const { currentUser, pets, palProfiles, subscription, createBooking } = useApp();

  const ownerPets = pets.filter((p) => p.owner_id === currentUser?.id || currentUser?.role === 'owner');
  const availablePets = ownerPets.length > 0 ? ownerPets : pets;

  const todayStr = new Date().toISOString().split('T')[0];

  const [selectedPetId, setSelectedPetId] = useState(availablePets[0]?.id || '');
  const [date, setDate] = useState(todayStr);
  const [timeSlot, setTimeSlot] = useState('7AM');
  const [duration, setDuration] = useState<30 | 60 | 90>(60);
  const [selectedPalId, setSelectedPalId] = useState<string>(preselectedPal || 'any');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedPal) {
      setSelectedPalId(preselectedPal);
    }
  }, [preselectedPal]);

  const currentPricing = WALK_PRICING.find((p) => p.duration === duration) || WALK_PRICING[1];
  const approvedPals = palProfiles.filter((p) => p.approval_status === 'approved');

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPetId) return;

    const newBooking = createBooking({
      pet_id: selectedPetId,
      date,
      time_slot: timeSlot,
      duration_minutes: duration,
      pal_id: selectedPalId === 'any' ? undefined : selectedPalId,
    });

    setCreatedBookingId(newBooking.id);
    setIsSuccessModalOpen(true);
  };

  const selectedPet = availablePets.find((p) => p.id === selectedPetId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5 pb-8"
    >
      {/* Title */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center space-x-1 bg-[#FFEADF] text-[#FF6B35] px-3 py-0.5 rounded-full text-xs font-bold">
          <span>📅</span>
          <span>Schedule Dog Walk</span>
        </div>
        <h1 className="text-xl font-black text-[#2D2D2D]">Book a Verified Pet Pal</h1>
        <p className="text-xs text-brand-muted">
          Pals are background checked, Aadhaar verified, and reside in your gated society zone
        </p>
      </div>

      {/* Subscription Callout if active */}
      {subscription && subscription.walks_remaining > 0 && (
        <div className="bg-[#FFF4ED] border border-[#FFD2BE] p-3 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-[#FF6B35]">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>
              <strong>{subscription.plan_name} Active:</strong> {subscription.walks_remaining} walks remaining this month!
            </span>
          </div>
          <span className="bg-[#FF6B35] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            ₹0 Extra
          </span>
        </div>
      )}

      <form onSubmit={handleBookingSubmit} className="space-y-4">
        {/* Step 1: Select Pet */}
        <div className="bg-white p-4 rounded-3xl border border-[#F0E4D7] shadow-xs space-y-2.5">
          <label className="text-xs font-bold text-gray-700 flex items-center space-x-1.5">
            <Dog className="w-4 h-4 text-[#FF6B35]" />
            <span>Select Pet</span>
          </label>

          <select
            value={selectedPetId}
            onChange={(e) => setSelectedPetId(e.target.value)}
            className="w-full bg-[#FFFBF7] border border-[#E9DCD0] focus:border-[#FF6B35] rounded-xl px-3 py-2.5 text-xs font-semibold outline-none text-gray-800"
          >
            {availablePets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.avatar_emoji || '🐕'} {p.name} ({p.breed} • {p.weight_kg}kg)
              </option>
            ))}
          </select>

          {selectedPet && (
            <div className="text-[11px] text-brand-muted bg-gray-50 p-2 rounded-xl flex items-center justify-between">
              <span>{selectedPet.temperament.slice(0, 3).join(', ')}</span>
              <span className="capitalize font-medium text-gray-600">{selectedPet.size} size</span>
            </div>
          )}
        </div>

        {/* Step 2: Date & Time */}
        <div className="bg-white p-4 rounded-3xl border border-[#F0E4D7] shadow-xs space-y-3">
          <label className="text-xs font-bold text-gray-700 flex items-center space-x-1.5">
            <CalendarIcon className="w-4 h-4 text-[#FF6B35]" />
            <span>Date & Preferred Time</span>
          </label>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <span className="text-[11px] text-brand-muted font-medium">Walk Date</span>
              <input
                type="date"
                min={todayStr}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#FFFBF7] border border-[#E9DCD0] focus:border-[#FF6B35] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-brand-muted font-medium">Time Slot</span>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-[#FFFBF7] border border-[#E9DCD0] focus:border-[#FF6B35] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 3: Duration & Pricing */}
        <div className="bg-white p-4 rounded-3xl border border-[#F0E4D7] shadow-xs space-y-2.5">
          <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-[#FF6B35]" />
              <span>Walk Duration</span>
            </div>
            <span className="text-xs font-black text-[#FF6B35]">
              Live: ₹{currentPricing.price}
            </span>
          </label>

          <div className="grid grid-cols-3 gap-2">
            {WALK_PRICING.map((opt) => (
              <button
                type="button"
                key={opt.duration}
                onClick={() => setDuration(opt.duration)}
                className={`py-2.5 px-2 rounded-2xl border text-center transition-all ${
                  duration === opt.duration
                    ? 'bg-[#FFEADF] border-[#FF6B35] text-[#FF6B35] font-black shadow-xs scale-102'
                    : 'bg-[#FFFBF7] border-[#E9DCD0] text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-xs font-bold">{opt.duration} mins</div>
                <div className="text-sm font-extrabold mt-0.5">₹{opt.price}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 4: Choose Pet Pal */}
        <div className="bg-white p-4 rounded-3xl border border-[#F0E4D7] shadow-xs space-y-2.5">
          <label className="text-xs font-bold text-gray-700 flex items-center space-x-1.5">
            <UserCheck className="w-4 h-4 text-[#FF6B35]" />
            <span>Choose Pet Pal</span>
          </label>

          <select
            value={selectedPalId}
            onChange={(e) => setSelectedPalId(e.target.value)}
            className="w-full bg-[#FFFBF7] border border-[#E9DCD0] focus:border-[#FF6B35] rounded-xl px-3 py-2.5 text-xs font-semibold outline-none text-gray-800"
          >
            <option value="any">✨ Any Available Verified Pal (Fastest Match)</option>
            {approvedPals.map((pal) => (
              <option key={pal.id} value={pal.user_id}>
                {pal.name} • ⭐ {pal.rating} ({pal.college_or_company})
              </option>
            ))}
          </select>
          <p className="text-[10px] text-brand-muted">
            All pals carry verified government IDs and have completed safety guidelines.
          </p>
        </div>

        {/* Total Cost Summary Card */}
        <div className="bg-gradient-to-r from-[#FFF8F2] to-[#FFF1E6] p-4 rounded-3xl border border-[#FFDEC9] space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-700">
            <span>Walk Fee ({duration} minutes)</span>
            <span className="font-bold">₹{currentPricing.price}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-700">
            <span>Pet Pal&apos;s Share (75%)</span>
            <span className="text-emerald-700 font-semibold">₹{currentPricing.palShare}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-700">
            <span>Safety, GPS & Support (25%)</span>
            <span className="text-gray-500 font-medium">₹{currentPricing.price - currentPricing.palShare}</span>
          </div>
          <div className="border-t border-[#FFDEC9] pt-2 flex justify-between items-center text-sm font-black text-[#2D2D2D]">
            <span>Total Payable</span>
            <span className="text-[#FF6B35] text-base">
              {subscription && subscription.walks_remaining > 0 ? 'Included in Plan 🎉' : `₹${currentPricing.price}`}
            </span>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          type="submit"
          className="w-full bg-[#FF6B35] hover:bg-[#E85924] text-white font-extrabold py-3.5 rounded-full shadow-warm text-sm flex items-center justify-center space-x-2 active:scale-98 transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Confirm Booking ✓</span>
        </button>
      </form>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-xs w-full p-6 text-center space-y-4 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto">
                🎉
              </div>
              <div>
                <h3 className="text-base font-black text-[#2D2D2D]">Booking Confirmed!</h3>
                <p className="text-xs text-brand-muted mt-1">
                  Your dog walk with {selectedPet?.name} is scheduled for {date} at {timeSlot}.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => router.push('/dashboard/owner')}
                  className="w-full bg-[#FF6B35] text-white font-bold py-2.5 rounded-full text-xs shadow-warm"
                >
                  Go to Owner Dashboard
                </button>
                <button
                  onClick={() => {
                    setIsSuccessModalOpen(false);
                    router.push('/dashboard/pal');
                  }}
                  className="w-full bg-gray-100 text-gray-700 font-bold py-2 rounded-full text-xs hover:bg-gray-200"
                >
                  View as Pet Pal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading Booking Form...</div>}>
      <BookingContent />
    </Suspense>
  );
}
