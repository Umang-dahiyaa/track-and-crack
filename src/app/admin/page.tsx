'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  Dog,
  Heart,
  CalendarCheck,
  Activity,
  IndianRupee,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Navigation,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '@/lib/store';

export default function AdminPage() {
  const {
    users,
    pets,
    palProfiles,
    bookings,
    reports,
    approvePal,
    rejectPal,
    resolveReport,
  } = useApp();

  const [notification, setNotification] = useState<string | null>(null);

  // Metric computations
  const totalUsers = users.length;
  const petOwnersCount = users.filter((u) => u.role === 'owner').length;
  const petPalsCount = users.filter((u) => u.role === 'pal').length;
  const totalBookings = bookings.length;
  const activeWalks = bookings.filter((b) => b.status === 'in_progress');
  const platformRevenue = bookings.reduce((sum, b) => sum + (b.cost || 99), 0);

  // Pending pal verifications
  const pendingPals = palProfiles.filter((p) => p.approval_status === 'pending');

  const handleApprove = (profileId: string, palName: string) => {
    approvePal(profileId);
    setNotification(`Approved ${palName} as a verified Pet Pal ✅`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleReject = (profileId: string, palName: string) => {
    rejectPal(profileId);
    setNotification(`Rejected verification for ${palName}.`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleResolveReport = (reportId: string) => {
    resolveReport(reportId);
    setNotification('Report marked as resolved ✓');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-5 pb-10">
      {/* Toast */}
      {notification && (
        <div className="bg-emerald-600 text-white text-xs px-4 py-2 rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)}>✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PetPal Trust & Safety</span>
          </div>
          <h1 className="text-xl font-black text-[#2D2D2D] mt-1">Admin Operations Center</h1>
          <p className="text-xs text-brand-muted">Gated Society Verification & Walk Monitoring</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg shadow-xs">
          🛡️
        </div>
      </div>

      {/* Stats Grid (6 Cards) */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white p-2.5 rounded-2xl border border-[#F0E4D7] shadow-xs text-center">
          <Users className="w-3.5 h-3.5 text-blue-500 mx-auto mb-1" />
          <div className="text-[10px] text-brand-muted">Total Users</div>
          <div className="text-base font-black text-[#2D2D2D]">{totalUsers}</div>
        </div>

        <div className="bg-white p-2.5 rounded-2xl border border-[#F0E4D7] shadow-xs text-center">
          <Dog className="w-3.5 h-3.5 text-[#FF6B35] mx-auto mb-1" />
          <div className="text-[10px] text-brand-muted">Pet Owners</div>
          <div className="text-base font-black text-[#2D2D2D]">{petOwnersCount}</div>
        </div>

        <div className="bg-white p-2.5 rounded-2xl border border-[#F0E4D7] shadow-xs text-center">
          <Heart className="w-3.5 h-3.5 text-rose-500 mx-auto mb-1" />
          <div className="text-[10px] text-brand-muted">Pet Pals</div>
          <div className="text-base font-black text-[#2D2D2D]">{petPalsCount}</div>
        </div>

        <div className="bg-white p-2.5 rounded-2xl border border-[#F0E4D7] shadow-xs text-center">
          <CalendarCheck className="w-3.5 h-3.5 text-indigo-500 mx-auto mb-1" />
          <div className="text-[10px] text-brand-muted">Bookings</div>
          <div className="text-base font-black text-[#2D2D2D]">{totalBookings}</div>
        </div>

        <div className="bg-white p-2.5 rounded-2xl border border-[#F0E4D7] shadow-xs text-center">
          <Activity className="w-3.5 h-3.5 text-amber-500 mx-auto mb-1" />
          <div className="text-[10px] text-brand-muted">Active Walks</div>
          <div className="text-base font-black text-amber-600">{activeWalks.length}</div>
        </div>

        <div className="bg-white p-2.5 rounded-2xl border border-[#F0E4D7] shadow-xs text-center">
          <IndianRupee className="w-3.5 h-3.5 text-emerald-600 mx-auto mb-1" />
          <div className="text-[10px] text-brand-muted">Revenue</div>
          <div className="text-base font-black text-emerald-600">₹{platformRevenue}</div>
        </div>
      </div>

      {/* "Pending Approvals" Table/Cards */}
      <section className="bg-white p-4 rounded-3xl border border-[#F0E4D7] shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center">
            <span>Pending Pet Pal Approvals</span>
            <span className="ml-1.5 bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {pendingPals.length}
            </span>
          </h2>
          <span className="text-[10px] text-brand-muted">College & Aadhaar Check</span>
        </div>

        {pendingPals.length === 0 ? (
          <div className="text-center py-4 text-xs text-gray-500">
            ✓ All pet pal applications have been processed.
          </div>
        ) : (
          <div className="space-y-2.5">
            {pendingPals.map((pal) => (
              <div
                key={pal.id}
                className="bg-[#FFFDFB] p-3 rounded-2xl border border-[#F0E4D7] space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-extrabold text-[#2D2D2D] flex items-center space-x-1.5">
                      <span>{pal.name}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                        Pending Verification
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-600 mt-0.5">{pal.college_or_company}</div>
                    <div className="text-[10px] text-brand-muted mt-0.5">
                      {pal.city} • Exp: {pal.experience_level}
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-gray-600 italic bg-gray-50 p-2 rounded-xl">
                  &ldquo;{pal.bio}&rdquo;
                </p>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => handleApprove(pal.id, pal.name)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded-xl text-xs flex items-center justify-center space-x-1 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Pal ✓</span>
                  </button>
                  <button
                    onClick={() => handleReject(pal.id, pal.name)}
                    className="flex-1 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 font-bold py-1.5 rounded-xl text-xs flex items-center justify-center space-x-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* "Active Walks" Live Monitor */}
      <section className="bg-white p-4 rounded-3xl border border-[#F0E4D7] shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping mr-1.5"></span>
            <span>Active Live Walks</span>
            <span className="ml-1.5 bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {activeWalks.length} live
            </span>
          </h2>
        </div>

        {activeWalks.length === 0 ? (
          <div className="text-center py-4 text-xs text-gray-500">
            No walks currently in progress.
          </div>
        ) : (
          <div className="space-y-2">
            {activeWalks.map((w) => (
              <div
                key={w.id}
                className="bg-[#FFFBF8] p-3 rounded-2xl border border-orange-200 text-xs flex items-center justify-between"
              >
                <div>
                  <div className="font-extrabold text-[#2D2D2D] flex items-center space-x-1.5">
                    <span>{w.pet_name}</span>
                    <span className="text-[10px] text-gray-500 font-normal">
                      with {w.pal_name || 'Assigned Pal'}
                    </span>
                  </div>
                  <div className="text-[10px] text-brand-muted mt-0.5">
                    {w.society_name} • {w.duration_minutes}m target
                  </div>
                </div>

                <Link
                  href={`/walk/${w.id}/live`}
                  className="bg-[#FF6B35] text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center space-x-1 shadow-xs"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Inspect</span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* "Recent Bookings" Ledger */}
      <section className="bg-white p-4 rounded-3xl border border-[#F0E4D7] shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700">Recent Bookings</h2>
          <span className="text-[10px] text-brand-muted">Platform History</span>
        </div>

        <div className="space-y-2">
          {bookings.slice(0, 5).map((b) => (
            <div
              key={b.id}
              className="bg-[#FFFDFB] p-2.5 rounded-2xl border border-gray-100 flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-bold text-[#2D2D2D]">
                  {b.pet_name} <span className="text-gray-400 font-normal">({b.time_slot})</span>
                </div>
                <div className="text-[10px] text-brand-muted">
                  {b.owner_name} → {b.pal_name || 'Unassigned'}
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    b.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : b.status === 'in_progress'
                      ? 'bg-amber-100 text-amber-800'
                      : b.status === 'accepted'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {b.status.replace('_', ' ')}
                </span>
                <div className="text-[10px] font-bold text-gray-700 mt-0.5">₹{b.cost}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* "Open Reports" Section */}
      <section className="bg-white p-4 rounded-3xl border border-[#F0E4D7] shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1 text-amber-600" />
            <span>Open Incident Reports ({reports.filter((r) => r.status === 'open').length})</span>
          </h2>
        </div>

        <div className="space-y-2">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className={`p-3 rounded-2xl border text-xs space-y-1.5 ${
                rep.status === 'open'
                  ? 'bg-amber-50/70 border-amber-200'
                  : 'bg-gray-50 border-gray-200 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#2D2D2D]">{rep.category}</span>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    rep.status === 'open' ? 'bg-amber-200 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {rep.status}
                </span>
              </div>

              <p className="text-[11px] text-gray-700">{rep.details}</p>

              <div className="flex items-center justify-between pt-1 text-[10px] text-brand-muted">
                <span>
                  Filed by {rep.reporter_name} ({rep.society_name})
                </span>
                {rep.status === 'open' && (
                  <button
                    onClick={() => handleResolveReport(rep.id)}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Mark Resolved ✓
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
