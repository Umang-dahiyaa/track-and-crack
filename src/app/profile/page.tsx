'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Phone,
  MapPin,
  LogOut,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  Dog,
  Send,
  Sparkles,
  Building,
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { TEMPERAMENT_TAGS } from '@/lib/mockData';
import { DogSize, UserRole } from '@/lib/types';

export default function ProfilePage() {
  const router = useRouter();
  const {
    currentUser,
    pets,
    palProfiles,
    bookings,
    logout,
    switchRole,
    addPet,
    submitReport,
  } = useApp();

  // Add Pet Form State
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetAge, setNewPetAge] = useState(12);
  const [newPetWeight, setNewPetWeight] = useState(15);
  const [newPetSize, setNewPetSize] = useState<DogSize>('medium');
  const [newPetVaccinated, setNewPetVaccinated] = useState(true);
  const [newPetTemperament, setNewPetTemperament] = useState<string[]>(['Friendly', 'Playful']);
  const [newPetSpecial, setNewPetSpecial] = useState('');

  // Report Form State
  const [reportCategory, setReportCategory] = useState('Safety & Conduct');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const ownerPets = pets.filter((p) => p.owner_id === currentUser?.id || currentUser?.role === 'owner');
  const palProfile = palProfiles.find((p) => p.user_id === currentUser?.id);
  const palCompletedWalks = bookings.filter(
    (b) => (b.pal_id === currentUser?.id || b.pal_id === palProfile?.user_id) && b.status === 'completed'
  );

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleRoleQuickSwitch = (role: UserRole) => {
    switchRole(role);
    setNotification(`Switched demo role to ${role.toUpperCase()}`);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleAddPetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName || !newPetBreed) return;

    addPet({
      name: newPetName,
      breed: newPetBreed,
      age_months: Number(newPetAge),
      weight_kg: Number(newPetWeight),
      size: newPetSize,
      vaccinated: newPetVaccinated,
      temperament: newPetTemperament,
      special_instructions: newPetSpecial,
    });

    setShowAddPetModal(false);
    setNewPetName('');
    setNewPetBreed('');
    setNotification('New pet added successfully! 🐾');
    setTimeout(() => setNotification(null), 2500);
  };

  const toggleTemperament = (tag: string) => {
    if (newPetTemperament.includes(tag)) {
      setNewPetTemperament(newPetTemperament.filter((t) => t !== tag));
    } else {
      setNewPetTemperament([...newPetTemperament, tag]);
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDetails.trim()) return;

    submitReport(reportCategory, reportDetails);
    setReportSubmitted(true);
    setReportDetails('');
    setTimeout(() => setReportSubmitted(false), 3500);
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Toast */}
      {notification && (
        <div className="bg-emerald-600 text-white text-xs px-4 py-2 rounded-2xl shadow-md flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* User Info Card */}
      <div className="bg-white p-5 rounded-3xl border border-[#F0E4D7] shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF885B] text-white text-2xl font-bold flex items-center justify-center shadow-warm">
              {currentUser?.avatar || (currentUser?.role === 'pal' ? '❤️' : '🐕')}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-base font-extrabold text-[#2D2D2D]">{currentUser?.name || 'Pet Parent'}</h1>
                {currentUser?.aadhaar_verified && (
                  <span className="text-emerald-600" title="Aadhaar Verified">
                    <ShieldCheck className="w-4 h-4 fill-emerald-100" />
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 flex items-center space-x-1 mt-0.5">
                <Phone className="w-3 h-3 text-gray-400" />
                <span>+91 {currentUser?.phone || '9876543210'}</span>
              </div>
              <div className="text-xs text-brand-muted flex items-center space-x-1 mt-0.5">
                <MapPin className="w-3 h-3 text-[#FF6B35]" />
                <span>
                  {currentUser?.society_name || 'Gated Society'}, {currentUser?.city || 'Bangalore'}
                </span>
              </div>
            </div>
          </div>

          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase bg-[#FFEADF] text-[#FF6B35]">
            {currentUser?.role || 'User'}
          </span>
        </div>

        {/* Aadhaar Verified Badge Banner */}
        <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-2xl flex items-center justify-between text-xs text-emerald-800 font-medium">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Aadhaar & Society Verified Resident</span>
          </div>
          <span className="text-[10px] font-bold bg-white text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-300">
            Active
          </span>
        </div>
      </div>

      {/* Pal Stats (if Pal) */}
      {currentUser?.role === 'pal' && (
        <div className="bg-white p-4 rounded-3xl border border-[#F0E4D7] shadow-xs space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">Pal Walking Metrics</h2>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#FFF9F5] p-2.5 rounded-2xl border border-[#F5E6D8]">
              <div className="text-lg font-black text-[#2D2D2D]">
                {(palProfile?.total_walks || 0) + palCompletedWalks.length}
              </div>
              <div className="text-[10px] text-gray-500">Walks Completed</div>
            </div>
            <div className="bg-[#FFF9F5] p-2.5 rounded-2xl border border-[#F5E6D8]">
              <div className="text-lg font-black text-emerald-600">
                ₹{(palProfile?.total_walks || 0) * 112 + palCompletedWalks.length * 75}
              </div>
              <div className="text-[10px] text-gray-500">Total Earned</div>
            </div>
            <div className="bg-[#FFF9F5] p-2.5 rounded-2xl border border-[#F5E6D8]">
              <div className="text-lg font-black text-amber-500">
                {palProfile?.rating || 4.9} ⭐
              </div>
              <div className="text-[10px] text-gray-500">Average Rating</div>
            </div>
          </div>
        </div>
      )}

      {/* Owner Pets List (if Owner) */}
      {currentUser?.role === 'owner' && (
        <div className="bg-white p-4 rounded-3xl border border-[#F0E4D7] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center">
              <Dog className="w-4 h-4 mr-1.5 text-[#FF6B35]" />
              <span>Registered Pets ({ownerPets.length})</span>
            </h2>
            <button
              onClick={() => setShowAddPetModal(true)}
              className="text-xs font-bold text-[#FF6B35] hover:underline flex items-center space-x-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Another Pet</span>
            </button>
          </div>

          <div className="space-y-2">
            {ownerPets.map((pet) => (
              <div
                key={pet.id}
                className="bg-[#FFFBF7] p-3 rounded-2xl border border-[#F0E4D7] flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="text-xl">{pet.avatar_emoji || '🐕'}</div>
                  <div>
                    <div className="font-bold text-[#2D2D2D]">{pet.name}</div>
                    <div className="text-[11px] text-brand-muted">
                      {pet.breed} • {pet.weight_kg}kg • {pet.age_months}m
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-600 bg-white border border-gray-200 px-2 py-0.5 rounded-full capitalize">
                  {pet.size}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Role Switcher for Demo Evaluator */}
      <div className="bg-white p-4 rounded-3xl border border-[#F0E4D7] shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center">
            <Sparkles className="w-4 h-4 mr-1.5 text-[#FF6B35]" />
            <span>Demo Role Switcher</span>
          </h2>
          <span className="text-[10px] text-brand-muted">Instant testing</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleRoleQuickSwitch('owner')}
            className={`p-2 rounded-2xl text-center text-xs font-bold border transition-all ${
              currentUser?.role === 'owner'
                ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
            }`}
          >
            🐕 Owner
          </button>
          <button
            onClick={() => handleRoleQuickSwitch('pal')}
            className={`p-2 rounded-2xl text-center text-xs font-bold border transition-all ${
              currentUser?.role === 'pal'
                ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
            }`}
          >
            ❤️ Pet Pal
          </button>
          <button
            onClick={() => handleRoleQuickSwitch('admin')}
            className={`p-2 rounded-2xl text-center text-xs font-bold border transition-all ${
              currentUser?.role === 'admin'
                ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
            }`}
          >
            🛡️ Admin
          </button>
        </div>
      </div>

      {/* Report a Problem Form */}
      <div className="bg-white p-4 rounded-3xl border border-[#F0E4D7] shadow-xs space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1.5 text-amber-500" />
          <span>Report a Problem or Feedback</span>
        </h2>

        {reportSubmitted ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-2xl text-center">
            ✓ Report filed! Our safety desk will review it within 2 hours.
          </div>
        ) : (
          <form onSubmit={handleReportSubmit} className="space-y-2.5">
            <div className="space-y-1">
              <label className="text-[11px] text-brand-muted font-medium">Issue Category</label>
              <select
                value={reportCategory}
                onChange={(e) => setReportCategory(e.target.value)}
                className="w-full bg-[#FFFBF7] border border-[#E9DCD0] rounded-xl px-3 py-2 text-xs font-medium outline-none text-gray-700"
              >
                <option value="Society Gate Entry">Society Gate Entry / Visitor Pass</option>
                <option value="Stray Animals or Aggressive Dogs">Stray Dogs / Aggressive Animals in Area</option>
                <option value="Pet Pal Punctuality">Pet Pal Punctuality / Conduct</option>
                <option value="App or GPS Tracking Bug">App or GPS Tracking Glitch</option>
                <option value="General Suggestion">General Suggestion</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-brand-muted font-medium">Description</label>
              <textarea
                rows={2}
                required
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Describe what happened inside your society..."
                className="w-full bg-[#FFFBF7] border border-[#E9DCD0] focus:border-[#FF6B35] rounded-xl p-2 text-xs outline-none text-gray-700"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Report</span>
            </button>
          </form>
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-extrabold py-3 rounded-full text-xs flex items-center justify-center space-x-2 active:scale-98 transition-all"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out</span>
      </button>

      {/* Modal: Add Pet */}
      {showAddPetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-3.5 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="text-sm font-extrabold text-[#2D2D2D] flex items-center">
                <Dog className="w-4 h-4 mr-1 text-[#FF6B35]" />
                <span>Add Another Pet</span>
              </h3>
              <button
                onClick={() => setShowAddPetModal(false)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPetSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Pet Name *</label>
                <input
                  type="text"
                  required
                  value={newPetName}
                  onChange={(e) => setNewPetName(e.target.value)}
                  placeholder="e.g. Bella"
                  className="w-full bg-[#FFFBF7] border border-[#E9DCD0] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Breed *</label>
                <input
                  type="text"
                  required
                  value={newPetBreed}
                  onChange={(e) => setNewPetBreed(e.target.value)}
                  placeholder="e.g. Shih Tzu / Indie"
                  className="w-full bg-[#FFFBF7] border border-[#E9DCD0] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Age (months)</label>
                  <input
                    type="number"
                    min={1}
                    value={newPetAge}
                    onChange={(e) => setNewPetAge(Number(e.target.value))}
                    className="w-full bg-[#FFFBF7] border border-[#E9DCD0] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Weight (kg)</label>
                  <input
                    type="number"
                    min={1}
                    value={newPetWeight}
                    onChange={(e) => setNewPetWeight(Number(e.target.value))}
                    className="w-full bg-[#FFFBF7] border border-[#E9DCD0] rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Size Category</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['small', 'medium', 'large'] as DogSize[]).map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setNewPetSize(s)}
                      className={`py-1.5 text-xs font-bold rounded-xl capitalize border ${
                        newPetSize === s
                          ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Special Instructions</label>
                <textarea
                  rows={2}
                  value={newPetSpecial}
                  onChange={(e) => setNewPetSpecial(e.target.value)}
                  placeholder="Shy near cars, loves biscuits..."
                  className="w-full bg-[#FFFBF7] border border-[#E9DCD0] rounded-xl p-2 text-xs outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#FF6B35] hover:bg-[#E85924] text-white font-bold py-2.5 rounded-full text-xs shadow-warm"
                >
                  Save Pet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
