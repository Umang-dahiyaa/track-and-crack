'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Sparkles, AlertCircle, Dog, Building2 } from 'lucide-react';
import { useApp } from '@/lib/store';
import { CITIES, TEMPERAMENT_TAGS } from '@/lib/mockData';
import { DogSize } from '@/lib/types';

export default function OwnerOnboardingPage() {
  const router = useRouter();
  const { onboardOwner, currentUser } = useApp();

  // Personal Info
  const [name, setName] = useState(currentUser?.name || 'Vikram Malhotra');
  const [societyName, setSocietyName] = useState('Prestige Lakeside Habitat, Varthur');
  const [city, setCity] = useState(currentUser?.city || 'Bangalore');

  // Pet Info
  const [petName, setPetName] = useState('Bruno');
  const [petBreed, setPetBreed] = useState('Golden Retriever');
  const [ageMonths, setAgeMonths] = useState(24);
  const [weightKg, setWeightKg] = useState(28);
  const [size, setSize] = useState<DogSize>('large');
  const [vaccinated, setVaccinated] = useState(true);
  const [temperament, setTemperament] = useState<string[]>([
    'Friendly',
    'Energetic',
    'Loves Kids',
    'Playful',
  ]);
  const [specialInstructions, setSpecialInstructions] = useState(
    'Loves fetch with yellow/green tennis balls. Keep well hydrated!'
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleTemperament = (tag: string) => {
    if (temperament.includes(tag)) {
      setTemperament(temperament.filter((t) => t !== tag));
    } else {
      setTemperament([...temperament, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !societyName.trim() || !petName.trim() || !petBreed.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    onboardOwner({
      name,
      society_name: societyName,
      city,
      pet: {
        name: petName,
        breed: petBreed,
        age_months: Number(ageMonths),
        weight_kg: Number(weightKg),
        size,
        vaccinated,
        temperament,
        special_instructions: specialInstructions,
      },
    });

    router.push('/dashboard/owner');
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Title */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center space-x-1 bg-[#FFEADF] text-[#FF6B35] px-3 py-0.5 rounded-full text-xs font-bold">
          <span>🐕</span>
          <span>Pet Parent Setup</span>
        </div>
        <h1 className="text-xl font-black text-[#2D2D2D]">Tell Us About You & Your Fur Baby</h1>
        <p className="text-xs text-brand-muted">
          Helps verified pet pals provide the safest, most affectionate walk
        </p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Section 1: Personal & Society Details */}
        <div className="bg-white p-4 rounded-3xl border border-[#F0E4D7] shadow-xs space-y-3">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
            <Building2 className="w-4 h-4 text-[#FF6B35]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              1. Your Society & Contact
            </h2>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Your Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vikram Malhotra"
              className="w-full bg-[#FFFBF7] border border-[#E9DCD0] focus:border-[#FF6B35] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Gated Society / Apartment Name *</label>
            <input
              type="text"
              required
              value={societyName}
              onChange={(e) => setSocietyName(e.target.value)}
              placeholder="e.g. Prestige Lakeside Habitat, Tower 4"
              className="w-full bg-[#FFFBF7] border border-[#E9DCD0] focus:border-[#FF6B35] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">City *</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-[#FFFBF7] border border-[#E9DCD0] focus:border-[#FF6B35] rounded-xl px-3 py-2 text-xs font-semibold outline-none text-gray-700"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section 2: Pet Details */}
        <div className="bg-white p-4 rounded-3xl border border-[#F0E4D7] shadow-xs space-y-3">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
            <Dog className="w-4 h-4 text-[#FF6B35]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              2. Dog Profile
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Pet Name *</label>
              <input
                type="text"
                required
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="e.g. Bruno"
                className="w-full bg-[#FFFBF7] border border-[#E9DCD0] focus:border-[#FF6B35] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Breed *</label>
              <input
                type="text"
                required
                value={petBreed}
                onChange={(e) => setPetBreed(e.target.value)}
                placeholder="e.g. Golden Retriever"
                className="w-full bg-[#FFFBF7] border border-[#E9DCD0] focus:border-[#FF6B35] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Age (in months)</label>
              <input
                type="number"
                min={1}
                max={240}
                value={ageMonths}
                onChange={(e) => setAgeMonths(Number(e.target.value))}
                className="w-full bg-[#FFFBF7] border border-[#E9DCD0] focus:border-[#FF6B35] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">Weight (kg)</label>
              <input
                type="number"
                min={1}
                max={100}
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full bg-[#FFFBF7] border border-[#E9DCD0] focus:border-[#FF6B35] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
              />
            </div>
          </div>

          {/* Size Pills */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Dog Size Category</label>
            <div className="grid grid-cols-3 gap-2">
              {(['small', 'medium', 'large'] as DogSize[]).map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSize(s)}
                  className={`py-2 px-1 text-xs font-bold rounded-xl capitalize transition-all border ${
                    size === s
                      ? 'bg-[#FF6B35] text-white border-[#FF6B35] shadow-xs'
                      : 'bg-[#FFFBF7] text-gray-700 border-[#E9DCD0] hover:bg-gray-50'
                  }`}
                >
                  {s === 'small' && '🐩 Small (<10kg)'}
                  {s === 'medium' && '🐕 Medium (10-25kg)'}
                  {s === 'large' && '🦮 Large (25kg+)'}
                </button>
              ))}
            </div>
          </div>

          {/* Vaccinated Toggle */}
          <div className="flex items-center justify-between bg-[#FFFBF7] p-2.5 rounded-xl border border-[#E9DCD0]">
            <div>
              <div className="text-xs font-bold text-gray-800">Fully Vaccinated?</div>
              <div className="text-[11px] text-brand-muted">Rabies & DHPPi shots up to date</div>
            </div>
            <button
              type="button"
              onClick={() => setVaccinated(!vaccinated)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                vaccinated ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  vaccinated ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Temperament Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">
              Temperament & Behavior (Pick all that apply)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TEMPERAMENT_TAGS.map((tag) => {
                const isSelected = temperament.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTemperament(tag)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all font-semibold ${
                      isSelected
                        ? 'bg-[#FF6B35] text-white border-[#FF6B35] shadow-xs'
                        : 'bg-[#FFFBF7] text-gray-600 border-[#E9DCD0] hover:bg-gray-100'
                    }`}
                  >
                    {isSelected && '✓ '}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Instructions */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 block">
              Special Walking Instructions
            </label>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Needs water after 15 mins, avoids stray cats, prefers grassy areas..."
              className="w-full bg-[#FFFBF7] border border-[#E9DCD0] focus:border-[#FF6B35] rounded-xl p-2.5 text-xs outline-none text-gray-700"
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-[#FF6B35] hover:bg-[#E85924] text-white font-extrabold py-3.5 rounded-full shadow-warm text-sm flex items-center justify-center space-x-2 active:scale-98 transition-all"
        >
          <span>Complete Setup 🎉</span>
        </button>
      </form>
    </div>
  );
}
