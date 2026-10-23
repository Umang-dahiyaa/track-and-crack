'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, CalendarPlus, User, Shield, Navigation, Sparkles } from 'lucide-react';
import { useApp } from '@/lib/store';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  badge?: string;
}

export default function BottomNav() {
  const pathname = usePathname();
  const { currentUser, bookings } = useApp();

  const role = currentUser?.role || 'guest';
  const inProgressWalk = bookings.find((b) => b.status === 'in_progress');

  // Define 4 navigation tabs depending on user role
  let navItems: NavItem[] = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Pals', href: '/browse', icon: Search },
    { label: 'Plans', href: '/subscription', icon: Sparkles },
    { label: 'Login', href: '/login', icon: User },
  ];

  if (role === 'owner') {
    navItems = [
      { label: 'Dashboard', href: '/dashboard/owner', icon: Home },
      { label: 'Pals', href: '/browse', icon: Search },
      { label: 'Book', href: '/book', icon: CalendarPlus, highlight: true },
      { label: 'Profile', href: '/profile', icon: User },
    ];
  } else if (role === 'pal') {
    navItems = [
      { label: 'Dashboard', href: '/dashboard/pal', icon: Home },
      { label: 'Find Pals', href: '/browse', icon: Search },
      {
        label: inProgressWalk ? 'Live Walk' : 'Walks',
        href: inProgressWalk ? `/walk/${inProgressWalk.id}/live` : '/dashboard/pal',
        icon: Navigation,
        badge: inProgressWalk ? 'LIVE' : undefined,
        highlight: Boolean(inProgressWalk),
      },
      { label: 'Profile', href: '/profile', icon: User },
    ];
  } else if (role === 'admin') {
    navItems = [
      { label: 'Admin', href: '/admin', icon: Shield, highlight: true },
      { label: 'Pals', href: '/browse', icon: Search },
      { label: 'Owner View', href: '/dashboard/owner', icon: Home },
      { label: 'Profile', href: '/profile', icon: User },
    ];
  }

  return (
    <nav className="fixed md:absolute bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#F0E2D4] px-3 py-2 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all relative ${
                isActive
                  ? 'text-[#FF6B35] font-bold scale-105'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <div className="relative">
                <div
                  className={`p-1.5 rounded-full transition-colors ${
                    item.highlight
                      ? 'bg-[#FF6B35] text-white shadow-md'
                      : isActive
                      ? 'bg-[#FFEADF]'
                      : 'bg-transparent'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      item.highlight ? 'text-white' : isActive ? 'text-[#FF6B35]' : 'text-gray-500'
                    }`}
                  />
                </div>

                {/* Optional Live Beacon badge */}
                {item.badge && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full animate-pulse border border-white">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[11px] mt-0.5 tracking-tight ${isActive ? 'font-bold' : 'font-normal'}`}>
                {item.label}
              </span>

              {/* Active Indicator dot */}
              {isActive && !item.highlight && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] mt-0.5"></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
