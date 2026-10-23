'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { MapPin, Shield, ChevronDown, RotateCcw, UserCheck, Sparkles } from 'lucide-react';
import { useApp } from '@/lib/store';
import { UserRole } from '@/lib/types';

export default function Header() {
  const { currentUser, switchRole, resetToMockData } = useApp();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    setShowRoleMenu(false);
    showToast(`Switched role to: ${role.toUpperCase()}`);
    if (role === 'owner') router.push('/dashboard/owner');
    else if (role === 'pal') router.push('/dashboard/pal');
    else if (role === 'admin') router.push('/admin');
  };

  const handleReset = () => {
    resetToMockData();
    setShowRoleMenu(false);
    showToast('Reset data to initial demo state 🐾');
    router.push('/dashboard/owner');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFF8F0]/95 backdrop-blur-md border-b border-[#F0E2D4] px-4 py-2.5 transition-all">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href={currentUser ? (currentUser.role === 'pal' ? '/dashboard/pal' : currentUser.role === 'admin' ? '/admin' : '/dashboard/owner') : '/'} className="flex items-center space-x-1.5 group">
          <div className="w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
            🐾
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-[#2D2D2D] leading-none block">
              PetPal <span className="text-[#FF6B35]">India</span>
            </span>
            <div className="flex items-center text-[10px] text-brand-muted font-medium mt-0.5">
              <MapPin className="w-2.5 h-2.5 mr-0.5 text-[#FF6B35]" />
              <span>{currentUser?.city || 'Bangalore'}</span>
            </div>
          </div>
        </Link>

        {/* Role Switcher & Profile Badge */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center space-x-1.5 bg-[#FFEADF] hover:bg-[#FFD9C6] text-[#FF6B35] border border-[#FFD2BE] px-2.5 py-1.5 rounded-full text-xs font-semibold shadow-xs transition-colors"
            title="Switch Demo Role"
          >
            <span className="text-sm">
              {currentUser?.role === 'owner' ? '🐕' : currentUser?.role === 'pal' ? '❤️' : '🛡️'}
            </span>
            <span className="capitalize">{currentUser?.role || 'Guest'}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {/* Quick Switch Dropdown */}
          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-muted border-b border-gray-100 flex items-center justify-between">
                <span>Switch Role (Demo)</span>
                <Sparkles className="w-3 h-3 text-[#FF6B35]" />
              </div>

              <div className="py-1 space-y-0.5">
                <button
                  onClick={() => handleRoleSwitch('owner')}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl text-left transition-colors ${
                    currentUser?.role === 'owner'
                      ? 'bg-[#FFEADF] text-[#FF6B35] font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>🐕</span>
                    <div>
                      <div className="font-semibold">Pet Owner</div>
                      <div className="text-[10px] text-gray-500">Vikram (Prestige Habitat)</div>
                    </div>
                  </div>
                  {currentUser?.role === 'owner' && <UserCheck className="w-3.5 h-3.5 text-[#FF6B35]" />}
                </button>

                <button
                  onClick={() => handleRoleSwitch('pal')}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl text-left transition-colors ${
                    currentUser?.role === 'pal'
                      ? 'bg-[#FFEADF] text-[#FF6B35] font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>❤️</span>
                    <div>
                      <div className="font-semibold">Pet Pal (Walker)</div>
                      <div className="text-[10px] text-gray-500">Siddharth (Christ Univ)</div>
                    </div>
                  </div>
                  {currentUser?.role === 'pal' && <UserCheck className="w-3.5 h-3.5 text-[#FF6B35]" />}
                </button>

                <button
                  onClick={() => handleRoleSwitch('admin')}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl text-left transition-colors ${
                    currentUser?.role === 'admin'
                      ? 'bg-[#FFEADF] text-[#FF6B35] font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-semibold">Admin Safety Desk</div>
                      <div className="text-[10px] text-gray-500">Approvals & Operations</div>
                    </div>
                  </div>
                  {currentUser?.role === 'admin' && <UserCheck className="w-3.5 h-3.5 text-[#FF6B35]" />}
                </button>
              </div>

              <div className="pt-1.5 border-t border-gray-100 flex flex-col space-y-1">
                <button
                  onClick={handleReset}
                  className="w-full flex items-center space-x-1.5 px-3 py-1.5 text-[11px] text-gray-500 hover:text-[#FF6B35] hover:bg-gray-50 rounded-lg text-left"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Demo Data</span>
                </button>
                <Link
                  href="/login"
                  onClick={() => setShowRoleMenu(false)}
                  className="w-full text-center px-3 py-1.5 text-[11px] text-gray-600 hover:bg-gray-50 rounded-lg font-medium"
                >
                  Go to OTP Login Page
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Mini Toast notification */}
      {toastMessage && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-[#2D2D2D] text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg font-medium flex items-center space-x-1.5 animate-bounce">
          <span>🐾</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </header>
  );
}
