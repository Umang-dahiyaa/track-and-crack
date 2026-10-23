export type UserRole = 'owner' | 'pal' | 'admin';

export type DogSize = 'small' | 'medium' | 'large';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Experienced';

export type BookingStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  aadhaar_verified: boolean;
  college_or_company: string;
  society_name: string;
  city: string;
  is_onboarded: boolean;
  created_at: string;
  avatar?: string;
}

export interface Pet {
  id: string;
  owner_id: string;
  name: string;
  breed: string;
  age_months: number;
  weight_kg: number;
  size: DogSize;
  vaccinated: boolean;
  temperament: string[];
  special_instructions?: string;
  avatar_emoji?: string;
  created_at: string;
}

export interface PetPalProfile {
  id: string;
  user_id: string;
  name: string;
  college_or_company: string;
  city: string;
  preferred_sizes: DogSize[];
  experience_level: ExperienceLevel;
  bio: string;
  rating: number;
  total_walks: number;
  approval_status: 'approved' | 'pending' | 'rejected';
  aadhaar_verified: boolean;
  avatar_letter?: string;
}

export interface Booking {
  id: string;
  pet_id: string;
  pet_name: string;
  pet_breed: string;
  pet_size: DogSize;
  pet_weight_kg: number;
  pet_vaccinated: boolean;
  pet_temperament?: string[];
  pet_special_instructions?: string;
  owner_id: string;
  owner_name: string;
  society_name: string;
  city: string;
  pal_id?: string;
  pal_name?: string;
  date: string; // YYYY-MM-DD
  time_slot: string; // e.g., "7AM", "6PM"
  duration_minutes: 30 | 60 | 90;
  cost: number; // 99, 149, 199
  pal_share: number; // 75% of cost
  status: BookingStatus;
  reaction_emoji?: string; // 🐕, 🎾, 😴, ⚡
  completion_notes?: string;
  walk_seconds?: number;
  created_at: string;
}

export interface SubscriptionPlan {
  id: 'basic' | 'standard' | 'premium';
  name: string;
  price_inr: number;
  walks_count: number;
  duration_per_walk: number;
  is_popular?: boolean;
  features: string[];
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: 'basic' | 'standard' | 'premium';
  plan_name: string;
  walks_total: number;
  walks_remaining: number;
  price_inr: number;
  active_until: string;
}

export interface ProblemReport {
  id: string;
  reporter_id: string;
  reporter_name: string;
  reporter_role: string;
  society_name: string;
  category: string;
  details: string;
  status: 'open' | 'resolved';
  created_at: string;
}
