'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Heart, AlertCircle, Sparkles, Check } from 'lucide-react';
import { useApp } from '@/lib/store';
import { CITIES } from '@/lib/mockData';
import { DogSize, ExperienceLevel } from '@/lib/types';

export default function PalOnboardingPage() {
  const router = useRouter();
  const { onboardPal, currentUser } = useApp();

  const [name, setName] = useState(currentUser?.name || 'Siddharth Nair');
  const [collegeOrCompany, setCollegeOrCompany] = useState('Christ University, Bangalore');
  const [city, setCity] = useState(currentUser?.city || 'Bangalore');
  const [preferredSizes, setPreferredSizes] = useState<DogSize[]>(['medium', 'large']);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Experienced');
  const [bio, setBio] = useState(
    'College student and lifelong dog enthusiast. Miss having a pet while staying in Bangalore; excited to give your pup the happiest walk!'
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleSize = (size: DogSize) => {
    if (preferredSizes.includes(size)) {
      if (preferredSizes.length === 1) return; // Keep at least one
      setPreferredSizes(preferredSizes.filter((s) => s !== size));
    } else {
      setPreferredSizes([...preferredSizes, size]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !collegeOrCompany.trim() || !bio.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    onboardPal({
      name,
      college_or_company: collegeOrCompany,
      city,
      preferred_sizes: preferredSizes,
      experience_level: experienceLevel,
      bio,
    });

    router.push('/dashboard/pal');
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Title */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center space-x-1 bg-amber-100 text-amber-800 px-3 py-0.5 rounded-full text-xs font-bold">
          <span>❤️</span>
          <span>Pet Pal Walker Onboarding</span>
        </div>
        <h1 className="text-xl font-black text-[#2D2D2D]">Turn Your Love For Dogs Into Income</h1>
        <p className="text-xs text-brand-muted">
          Earn 75% per walk, build community trust, and spend time with furry companions
        </p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal details */}
        <div className="bg-white p-4 rounded-3xl border border-[#F0E4D7] shadow-xs space-y-3">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
            <GraduationCap className="w-4 h-4 text-[#FF6B35]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              1. Identity & Affiliation
            </h2>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Your Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Siddharth Nair"
              className="w-full bg-[#FFFBF7] border border-[#E9DCD0] focus:border-[#FF6B35] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">
              College or Company Name *
            </label>
            <input
              type="text"
              required
              value={collegeOrCompany}
              onChange={(e) => setCollegeOrCompany(e.target.value)}
              placeholder="e.g. Christ University / IIT Bombay / Infosys"
              className="w-full bg-[#FFFBF7] border border-[#E9DCD0] focus:border-[#FF6B35] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
            />
            <p className="text-[10px] text-brand-muted">
              Used for society safety verification and trust badges
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Primary City *</label>
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

        {/* Preferences & Experience */}
        <div className="bg-white p-4 rounded-3xl border border-[#F0E4D7] shadow-xs space-y-3">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
            <Heart className="w-4 h-4 text-[#FF6B35]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              2. Walking Preferences
            </h2>
          </div>

          {/* Preferred dog sizes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 block">
              Which dog sizes are you comfortable handling?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['small', 'medium', 'large'] as DogSize[]).map((size) => {
                const isChecked = preferredSizes.includes(size);
                return (
                  <button
                    type="button"
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`py-2 px-1 text-xs font-bold rounded-xl capitalize transition-all border ${
                      isChecked
                        ? 'bg-[#FF6B35] text-white border-[#FF6B35] shadow-xs'
                        : 'bg-[#FFFBF7] text-gray-600 border-[#E9DCD0] hover:bg-gray-100'
                    }`}
                  >
                    {isChecked && '✓ '}
                    {size === 'small' && 'Small'}
                    {size === 'medium' && 'Medium'}
                    {size === 'large' && 'Large'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Experience level dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Dog Handling Experience</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
              className="w-full bg-[#FFFBF7] border border-[#E9DCD0] focus:border-[#FF6B35] rounded-xl px-3 py-2 text-xs font-semibold outline-none text-gray-700"
            >
              <option value="Beginner">Beginner (Comfortable with friendly small dogs)</option>
              <option value="Intermediate">Intermediate (Walked family/friend dogs regularly)</option>
              <option value="Experienced">Experienced (Owned dogs, handled active breeds)</option>
            </select>
          </div>

          {/* Bio textarea */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700">Short Bio / Motivation *</label>
            <textarea
              rows={3}
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Introduce yourself to pet parents, your love for animals, past experience..."
              className="w-full bg-[#FFFBF7] border border-[#E9DCD0] focus:border-[#FF6B35] rounded-xl p-2.5 text-xs outline-none text-gray-700"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#FF6B35] hover:bg-[#E85924] text-white font-extrabold py-3.5 rounded-full shadow-warm text-sm flex items-center justify-center space-x-2 active:scale-98 transition-all"
        >
          <span>Start Walking Dogs! 🐕</span>
        </button>
      </form>
    </div>
  );
}
