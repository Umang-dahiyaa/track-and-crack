'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Star,
  GraduationCap,
  MapPin,
  Heart,
  CalendarPlus,
  Search,
  Filter,
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { DogSize } from '@/lib/types';

export default function BrowsePalsPage() {
  const { palProfiles } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'all' | DogSize>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter approved pals
  const filteredPals = palProfiles.filter((pal) => {
    // Only show approved pals in directory
    if (pal.approval_status !== 'approved') return false;

    // Filter by size
    if (selectedFilter !== 'all') {
      if (!pal.preferred_sizes.includes(selectedFilter)) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        pal.name.toLowerCase().includes(q) ||
        pal.college_or_company.toLowerCase().includes(q) ||
        pal.city.toLowerCase().includes(q) ||
        pal.bio.toLowerCase().includes(q)
      );
    }

    return true;
  });

  return (
    <div className="space-y-4 pb-8">
      {/* Title */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center space-x-1 bg-[#FFEADF] text-[#FF6B35] px-3 py-0.5 rounded-full text-xs font-bold">
          <span>🛡️</span>
          <span>Verified Pet Pals Directory</span>
        </div>
        <h1 className="text-xl font-black text-[#2D2D2D]">Meet Pet Pals Near You</h1>
        <p className="text-xs text-brand-muted">
          College students & young professionals with Aadhaar verification and dog care passion
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, college (IIT, Christ...), city..."
          className="w-full bg-white border border-[#E9DCD0] focus:border-[#FF6B35] rounded-2xl pl-10 pr-3.5 py-2.5 text-xs outline-none shadow-xs font-medium"
        />
      </div>

      {/* Filter Chips at Top */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all border ${
            selectedFilter === 'all'
              ? 'bg-[#FF6B35] text-white border-[#FF6B35] shadow-xs'
              : 'bg-white text-gray-700 border-[#E9DCD0] hover:bg-gray-50'
          }`}
        >
          All Pals ({palProfiles.filter((p) => p.approval_status === 'approved').length})
        </button>

        <button
          onClick={() => setSelectedFilter('small')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all border ${
            selectedFilter === 'small'
              ? 'bg-[#FF6B35] text-white border-[#FF6B35] shadow-xs'
              : 'bg-white text-gray-700 border-[#E9DCD0] hover:bg-gray-50'
          }`}
        >
          🐩 Small Dogs
        </button>

        <button
          onClick={() => setSelectedFilter('medium')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all border ${
            selectedFilter === 'medium'
              ? 'bg-[#FF6B35] text-white border-[#FF6B35] shadow-xs'
              : 'bg-white text-gray-700 border-[#E9DCD0] hover:bg-gray-50'
          }`}
        >
          🐕 Medium Dogs
        </button>

        <button
          onClick={() => setSelectedFilter('large')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all border ${
            selectedFilter === 'large'
              ? 'bg-[#FF6B35] text-white border-[#FF6B35] shadow-xs'
              : 'bg-white text-gray-700 border-[#E9DCD0] hover:bg-gray-50'
          }`}
        >
          🦮 Large Dogs
        </button>
      </div>

      {/* Pals List */}
      <div className="space-y-3 pt-1">
        {filteredPals.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-dashed border-[#E5D5C5] text-center space-y-1.5">
            <div className="text-3xl">🔍</div>
            <p className="text-xs font-bold text-gray-700">No matching pals found</p>
            <p className="text-[11px] text-gray-500">Try selecting another filter or city</p>
          </div>
        ) : (
          filteredPals.map((pal) => (
            <div
              key={pal.id}
              className="bg-white p-4 rounded-3xl border border-[#F0E4D7] shadow-xs space-y-3 transition-all hover:border-[#FF6B35]"
            >
              {/* Header: Avatar, Name, College, Verified Badge */}
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF885B] text-white font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
                  {pal.avatar_letter || pal.name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <h3 className="text-sm font-extrabold text-[#2D2D2D] truncate">{pal.name}</h3>
                    {pal.aadhaar_verified && (
                      <span className="text-emerald-600 text-xs shrink-0" title="Aadhaar & Student ID Verified">
                        <ShieldCheck className="w-4 h-4 fill-emerald-100" />
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-gray-600 flex items-center mt-0.5 truncate">
                    <GraduationCap className="w-3 h-3 text-[#FF6B35] mr-1 shrink-0" />
                    <span className="truncate">{pal.college_or_company}</span>
                  </div>

                  <div className="text-[10px] text-brand-muted flex items-center mt-0.5">
                    <MapPin className="w-2.5 h-2.5 mr-0.5 text-gray-400" />
                    <span>{pal.city}</span>
                  </div>
                </div>
              </div>

              {/* Stats Row: Rating, Walks, Experience */}
              <div className="grid grid-cols-3 gap-1.5 bg-[#FFF9F5] p-2 rounded-2xl border border-[#F5E6D8] text-center text-xs">
                <div>
                  <div className="text-amber-500 font-extrabold flex items-center justify-center">
                    <span>{pal.rating}</span>
                    <Star className="w-3 h-3 fill-amber-400 ml-0.5" />
                  </div>
                  <div className="text-[9px] text-gray-500">Rating</div>
                </div>

                <div>
                  <div className="font-extrabold text-[#2D2D2D]">{pal.total_walks}</div>
                  <div className="text-[9px] text-gray-500">Walks Done</div>
                </div>

                <div>
                  <div className="font-extrabold text-emerald-600 capitalize text-[11px]">
                    {pal.experience_level}
                  </div>
                  <div className="text-[9px] text-gray-500">Level</div>
                </div>
              </div>

              {/* Bio quote */}
              <p className="text-xs text-gray-600 italic bg-gray-50/70 p-2.5 rounded-xl border border-gray-100 leading-relaxed">
                &ldquo;{pal.bio}&rdquo;
              </p>

              {/* Preferred size tags and Direct CTA */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex flex-wrap gap-1">
                  {pal.preferred_sizes.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] font-semibold bg-[#FFEADF] text-[#FF6B35] px-2 py-0.5 rounded-full capitalize"
                    >
                      {s} dogs
                    </span>
                  ))}
                </div>

                <Link
                  href={`/book?pal=${pal.user_id}`}
                  className="inline-flex items-center space-x-1 bg-[#FF6B35] hover:bg-[#E85924] text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-xs active:scale-95 transition-all"
                >
                  <CalendarPlus className="w-3 h-3" />
                  <span>Book with {pal.name.split(' ')[0]}</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
