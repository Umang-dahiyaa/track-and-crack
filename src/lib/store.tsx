'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  Pet,
  PetPalProfile,
  Booking,
  UserSubscription,
  ProblemReport,
  UserRole,
  DogSize,
  ExperienceLevel,
  SubscriptionPlan,
} from './types';
import {
  INITIAL_USERS,
  INITIAL_PETS,
  INITIAL_PAL_PROFILES,
  INITIAL_BOOKINGS,
  INITIAL_SUBSCRIPTION,
  INITIAL_REPORTS,
  SUBSCRIPTION_PLANS,
  WALK_PRICING,
} from './mockData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  pets: Pet[];
  palProfiles: PetPalProfile[];
  bookings: Booking[];
  subscription: UserSubscription | null;
  reports: ProblemReport[];
  isLoaded: boolean;

  // Auth & Roles
  loginWithOtp: (phone: string, otp: string, desiredRole?: UserRole) => { success: boolean; user?: User; isNew?: boolean; message?: string };
  logout: () => void;
  switchRole: (role: UserRole) => void;
  setCurrentUser: (user: User | null) => void;

  // Onboarding
  onboardOwner: (data: {
    name: string;
    society_name: string;
    city: string;
    pet: {
      name: string;
      breed: string;
      age_months: number;
      weight_kg: number;
      size: DogSize;
      vaccinated: boolean;
      temperament: string[];
      special_instructions?: string;
    };
  }) => void;

  onboardPal: (data: {
    name: string;
    college_or_company: string;
    city: string;
    preferred_sizes: DogSize[];
    experience_level: ExperienceLevel;
    bio: string;
  }) => void;

  // Pets
  addPet: (pet: {
    name: string;
    breed: string;
    age_months: number;
    weight_kg: number;
    size: DogSize;
    vaccinated: boolean;
    temperament: string[];
    special_instructions?: string;
  }) => Pet;

  // Bookings & Walks
  createBooking: (data: {
    pet_id: string;
    date: string;
    time_slot: string;
    duration_minutes: 30 | 60 | 90;
    pal_id?: string;
  }) => Booking;

  acceptWalk: (bookingId: string) => void;
  startWalk: (bookingId: string) => void;
  completeWalk: (bookingId: string, emoji: string, notes: string, walkSeconds: number) => void;
  cancelBooking: (bookingId: string) => void;

  // Subscription
  subscribeToPlan: (planId: 'basic' | 'standard' | 'premium') => void;

  // Reports
  submitReport: (category: string, details: string, bookingId?: string) => void;
  resolveReport: (reportId: string) => void;

  // Admin Actions
  approvePal: (profileId: string) => void;
  rejectPal: (profileId: string) => void;

  // Reset
  resetToMockData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'petpal_india_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS);
  const [palProfiles, setPalProfiles] = useState<PetPalProfile[]>(INITIAL_PAL_PROFILES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [subscription, setSubscription] = useState<UserSubscription | null>(INITIAL_SUBSCRIPTION);
  const [reports, setReports] = useState<ProblemReport[]>(INITIAL_REPORTS);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(`${STORAGE_KEY_PREFIX}users`);
      const storedPets = localStorage.getItem(`${STORAGE_KEY_PREFIX}pets`);
      const storedPals = localStorage.getItem(`${STORAGE_KEY_PREFIX}pals`);
      const storedBookings = localStorage.getItem(`${STORAGE_KEY_PREFIX}bookings`);
      const storedSub = localStorage.getItem(`${STORAGE_KEY_PREFIX}sub`);
      const storedReports = localStorage.getItem(`${STORAGE_KEY_PREFIX}reports`);
      const storedCurrentUser = localStorage.getItem(`${STORAGE_KEY_PREFIX}current_user`);

      if (storedUsers) setUsers(JSON.parse(storedUsers));
      if (storedPets) setPets(JSON.parse(storedPets));
      if (storedPals) setPalProfiles(JSON.parse(storedPals));
      if (storedBookings) setBookings(JSON.parse(storedBookings));
      if (storedSub) setSubscription(JSON.parse(storedSub));
      if (storedReports) setReports(JSON.parse(storedReports));

      if (storedCurrentUser) {
        setCurrentUserState(JSON.parse(storedCurrentUser));
      } else {
        // Default to Vikram (Owner) for smooth demo preview
        setCurrentUserState(INITIAL_USERS[0]);
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using initial mock data', e);
      setCurrentUserState(INITIAL_USERS[0]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to LocalStorage helpers
  const saveState = (
    newUsers?: User[],
    newPets?: Pet[],
    newPals?: PetPalProfile[],
    newBookings?: Booking[],
    newSub?: UserSubscription | null,
    newReports?: ProblemReport[],
    newCurrentUser?: User | null
  ) => {
    try {
      if (newUsers !== undefined) {
        setUsers(newUsers);
        localStorage.setItem(`${STORAGE_KEY_PREFIX}users`, JSON.stringify(newUsers));
      }
      if (newPets !== undefined) {
        setPets(newPets);
        localStorage.setItem(`${STORAGE_KEY_PREFIX}pets`, JSON.stringify(newPets));
      }
      if (newPals !== undefined) {
        setPalProfiles(newPals);
        localStorage.setItem(`${STORAGE_KEY_PREFIX}pals`, JSON.stringify(newPals));
      }
      if (newBookings !== undefined) {
        setBookings(newBookings);
        localStorage.setItem(`${STORAGE_KEY_PREFIX}bookings`, JSON.stringify(newBookings));
      }
      if (newSub !== undefined) {
        setSubscription(newSub);
        localStorage.setItem(`${STORAGE_KEY_PREFIX}sub`, JSON.stringify(newSub));
      }
      if (newReports !== undefined) {
        setReports(newReports);
        localStorage.setItem(`${STORAGE_KEY_PREFIX}reports`, JSON.stringify(newReports));
      }
      if (newCurrentUser !== undefined) {
        setCurrentUserState(newCurrentUser);
        localStorage.setItem(`${STORAGE_KEY_PREFIX}current_user`, JSON.stringify(newCurrentUser));
      }
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  };

  const setCurrentUser = (user: User | null) => {
    saveState(undefined, undefined, undefined, undefined, undefined, undefined, user);
  };

  const loginWithOtp = (phone: string, otp: string, desiredRole: UserRole = 'owner') => {
    if (otp !== '123456') {
      return { success: false, message: 'Invalid OTP! For demo, use 123456.' };
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const existing = users.find((u) => u.phone.slice(-10) === cleanPhone);

    if (existing) {
      setCurrentUser(existing);
      return { success: true, user: existing, isNew: false };
    }

    // Create a new provisional user
    const newUser: User = {
      id: `user-${Date.now()}`,
      phone: cleanPhone,
      name: desiredRole === 'owner' ? 'Pet Owner' : desiredRole === 'pal' ? 'Pet Pal' : 'Admin User',
      role: desiredRole,
      aadhaar_verified: false,
      college_or_company: '',
      society_name: '',
      city: 'Bangalore',
      is_onboarded: false,
      created_at: new Date().toISOString(),
      avatar: desiredRole === 'owner' ? '🐕' : '❤️',
    };

    const updatedUsers = [...users, newUser];
    saveState(updatedUsers, undefined, undefined, undefined, undefined, undefined, newUser);
    return { success: true, user: newUser, isNew: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRole = (targetRole: UserRole) => {
    // Quick demo switcher: switches to appropriate demo user or updates current role
    if (targetRole === 'owner') {
      const ownerUser = users.find((u) => u.role === 'owner') || INITIAL_USERS[0];
      setCurrentUser(ownerUser);
    } else if (targetRole === 'pal') {
      const palUser = users.find((u) => u.role === 'pal') || INITIAL_USERS[1];
      setCurrentUser(palUser);
    } else if (targetRole === 'admin') {
      const adminUser = users.find((u) => u.role === 'admin') || INITIAL_USERS[6];
      setCurrentUser(adminUser);
    }
  };

  const onboardOwner = ({
    name,
    society_name,
    city,
    pet,
  }: {
    name: string;
    society_name: string;
    city: string;
    pet: {
      name: string;
      breed: string;
      age_months: number;
      weight_kg: number;
      size: DogSize;
      vaccinated: boolean;
      temperament: string[];
      special_instructions?: string;
    };
  }) => {
    const activeUserId = currentUser?.id || `user-${Date.now()}`;
    const updatedUser: User = {
      ...(currentUser || INITIAL_USERS[0]),
      id: activeUserId,
      name,
      society_name,
      city,
      role: 'owner',
      is_onboarded: true,
      aadhaar_verified: true,
    };

    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      owner_id: activeUserId,
      name: pet.name,
      breed: pet.breed,
      age_months: pet.age_months,
      weight_kg: pet.weight_kg,
      size: pet.size,
      vaccinated: pet.vaccinated,
      temperament: pet.temperament,
      special_instructions: pet.special_instructions,
      avatar_emoji: '🐕',
      created_at: new Date().toISOString(),
    };

    const updatedUsers = users.map((u) => (u.id === activeUserId ? updatedUser : u));
    if (!users.some((u) => u.id === activeUserId)) {
      updatedUsers.push(updatedUser);
    }

    const updatedPets = [...pets, newPet];
    saveState(updatedUsers, updatedPets, undefined, undefined, undefined, undefined, updatedUser);
  };

  const onboardPal = ({
    name,
    college_or_company,
    city,
    preferred_sizes,
    experience_level,
    bio,
  }: {
    name: string;
    college_or_company: string;
    city: string;
    preferred_sizes: DogSize[];
    experience_level: ExperienceLevel;
    bio: string;
  }) => {
    const activeUserId = currentUser?.id || `user-pal-${Date.now()}`;
    const updatedUser: User = {
      ...(currentUser || INITIAL_USERS[1]),
      id: activeUserId,
      name,
      college_or_company,
      city,
      role: 'pal',
      is_onboarded: true,
      aadhaar_verified: true,
    };

    const newProfile: PetPalProfile = {
      id: `pal-prof-${Date.now()}`,
      user_id: activeUserId,
      name,
      college_or_company,
      city,
      preferred_sizes,
      experience_level,
      bio,
      rating: 5.0,
      total_walks: 0,
      approval_status: 'approved',
      aadhaar_verified: true,
      avatar_letter: name.charAt(0).toUpperCase() || 'P',
    };

    const updatedUsers = users.map((u) => (u.id === activeUserId ? updatedUser : u));
    if (!users.some((u) => u.id === activeUserId)) {
      updatedUsers.push(updatedUser);
    }

    const updatedPals = [...palProfiles.filter((p) => p.user_id !== activeUserId), newProfile];
    saveState(updatedUsers, undefined, updatedPals, undefined, undefined, undefined, updatedUser);
  };

  const addPet = (petData: {
    name: string;
    breed: string;
    age_months: number;
    weight_kg: number;
    size: DogSize;
    vaccinated: boolean;
    temperament: string[];
    special_instructions?: string;
  }) => {
    const ownerId = currentUser?.id || INITIAL_USERS[0].id;
    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      owner_id: ownerId,
      ...petData,
      avatar_emoji: '🐶',
      created_at: new Date().toISOString(),
    };
    const updated = [...pets, newPet];
    saveState(undefined, updated);
    return newPet;
  };

  const createBooking = ({
    pet_id,
    date,
    time_slot,
    duration_minutes,
    pal_id,
  }: {
    pet_id: string;
    date: string;
    time_slot: string;
    duration_minutes: 30 | 60 | 90;
    pal_id?: string;
  }) => {
    const targetPet = pets.find((p) => p.id === pet_id) || pets[0];
    const pricing = WALK_PRICING.find((p) => p.duration === duration_minutes) || WALK_PRICING[0];
    const targetPal = pal_id ? palProfiles.find((p) => p.user_id === pal_id || p.id === pal_id) : undefined;

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      pet_id: targetPet.id,
      pet_name: targetPet.name,
      pet_breed: targetPet.breed,
      pet_size: targetPet.size,
      pet_weight_kg: targetPet.weight_kg,
      pet_vaccinated: targetPet.vaccinated,
      pet_temperament: targetPet.temperament,
      pet_special_instructions: targetPet.special_instructions,
      owner_id: currentUser?.id || targetPet.owner_id,
      owner_name: currentUser?.name || 'Pet Owner',
      society_name: currentUser?.society_name || 'Gated Community Bangalore',
      city: currentUser?.city || 'Bangalore',
      pal_id: targetPal?.user_id,
      pal_name: targetPal?.name,
      date,
      time_slot,
      duration_minutes,
      cost: pricing.price,
      pal_share: pricing.palShare,
      status: targetPal ? 'accepted' : 'pending',
      created_at: new Date().toISOString(),
    };

    // If owner has active subscription with remaining walks, decrement one
    let updatedSub = subscription;
    if (updatedSub && updatedSub.walks_remaining > 0) {
      updatedSub = {
        ...updatedSub,
        walks_remaining: updatedSub.walks_remaining - 1,
      };
    }

    const updatedBookings = [newBooking, ...bookings];
    saveState(undefined, undefined, undefined, updatedBookings, updatedSub);
    return newBooking;
  };

  const acceptWalk = (bookingId: string) => {
    const palName = currentUser?.name || 'Assigned Pet Pal';
    const palUserId = currentUser?.id || 'user-pal-1';

    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        return {
          ...b,
          pal_id: palUserId,
          pal_name: palName,
          status: 'accepted' as const,
        };
      }
      return b;
    });
    saveState(undefined, undefined, undefined, updated);
  };

  const startWalk = (bookingId: string) => {
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'in_progress' as const,
          walk_seconds: b.walk_seconds || 1,
        };
      }
      return b;
    });
    saveState(undefined, undefined, undefined, updated);
  };

  const completeWalk = (bookingId: string, emoji: string, notes: string, walkSeconds: number) => {
    const updatedBookings = bookings.map((b) => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'completed' as const,
          reaction_emoji: emoji,
          completion_notes: notes,
          walk_seconds: walkSeconds,
        };
      }
      return b;
    });

    // Also increment pal total walks if applicable
    const booking = bookings.find((b) => b.id === bookingId);
    let updatedPals = palProfiles;
    if (booking?.pal_id) {
      updatedPals = palProfiles.map((p) => {
        if (p.user_id === booking.pal_id) {
          return { ...p, total_walks: p.total_walks + 1 };
        }
        return p;
      });
    }

    saveState(undefined, undefined, updatedPals, updatedBookings);
  };

  const cancelBooking = (bookingId: string) => {
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'cancelled' as const,
        };
      }
      return b;
    });
    saveState(undefined, undefined, undefined, updated);
  };

  const subscribeToPlan = (planId: 'basic' | 'standard' | 'premium') => {
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId) || SUBSCRIPTION_PLANS[1];
    const newSub: UserSubscription = {
      id: `sub-${Date.now()}`,
      user_id: currentUser?.id || INITIAL_USERS[0].id,
      plan_id: plan.id,
      plan_name: plan.name,
      walks_total: plan.walks_count,
      walks_remaining: plan.walks_count,
      price_inr: plan.price_inr,
      active_until: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    };
    saveState(undefined, undefined, undefined, undefined, newSub);
  };

  const submitReport = (category: string, details: string, bookingId?: string) => {
    const newReport: ProblemReport = {
      id: `rep-${Date.now()}`,
      reporter_id: currentUser?.id || 'anonymous',
      reporter_name: currentUser?.name || 'Society Member',
      reporter_role: currentUser?.role || 'owner',
      society_name: currentUser?.society_name || 'Bangalore Gated Community',
      category,
      details,
      status: 'open',
      created_at: new Date().toISOString(),
    };
    const updated = [newReport, ...reports];
    saveState(undefined, undefined, undefined, undefined, undefined, updated);
  };

  const resolveReport = (reportId: string) => {
    const updated = reports.map((r) => (r.id === reportId ? { ...r, status: 'resolved' as const } : r));
    saveState(undefined, undefined, undefined, undefined, undefined, updated);
  };

  const approvePal = (profileId: string) => {
    const updated = palProfiles.map((p) => (p.id === profileId ? { ...p, approval_status: 'approved' as const, aadhaar_verified: true } : p));
    saveState(undefined, undefined, updated);
  };

  const rejectPal = (profileId: string) => {
    const updated = palProfiles.map((p) => (p.id === profileId ? { ...p, approval_status: 'rejected' as const } : p));
    saveState(undefined, undefined, updated);
  };

  const resetToMockData = () => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}users`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}pets`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}pals`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}bookings`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}sub`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}reports`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}current_user`);

    setUsers(INITIAL_USERS);
    setPets(INITIAL_PETS);
    setPalProfiles(INITIAL_PAL_PROFILES);
    setBookings(INITIAL_BOOKINGS);
    setSubscription(INITIAL_SUBSCRIPTION);
    setReports(INITIAL_REPORTS);
    setCurrentUserState(INITIAL_USERS[0]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        pets,
        palProfiles,
        bookings,
        subscription,
        reports,
        isLoaded,
        loginWithOtp,
        logout,
        switchRole,
        setCurrentUser,
        onboardOwner,
        onboardPal,
        addPet,
        createBooking,
        acceptWalk,
        startWalk,
        completeWalk,
        cancelBooking,
        subscribeToPlan,
        submitReport,
        resolveReport,
        approvePal,
        rejectPal,
        resetToMockData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
