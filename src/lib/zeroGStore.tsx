'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Mission {
  id: string;
  title: string;
  subtitle: string;
  category: 'ARED' | 'OSMOTIC' | 'VESTIBULAR' | 'CHRONO';
  gReward: number;
  completed: boolean;
  duration?: string;
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  callsign: string;
  gScore: number;
  status: 'OPTIMAL' | 'DECONDITIONED' | 'TRAINING';
  hr: number;
  avatar: string;
}

export interface CadetProfile {
  name: string;
  callsign: string;
  cadetId: string;
  rank: string;
  isOnboarded: boolean;
  flightDays: number;
}

interface ZeroGContextType {
  profile: CadetProfile;
  gravityScore: number;
  heartRate: number;
  restingHeartRate: number;
  sleepHours: number;
  sleepEfficiency: number;
  hydrationMl: number;
  hydrationTarget: number;
  stressIndex: number;
  hrvRmssd: number;
  plasmaShift: string;
  missions: Mission[];
  crew: CrewMember[];
  isSimulating: boolean;
  crackActive: boolean;
  lastCrackedReward: number | null;
  toggleSimulation: () => void;
  addHydration: (amount: number) => void;
  completeMission: (id: string) => void;
  setTelemetryParam: (param: 'hr' | 'sleep' | 'hydr' | 'stress', val: number) => void;
  completeOnboarding: (name: string, callsign: string) => void;
  resetTelemetry: () => void;
}

const defaultMissions: Mission[] = [
  {
    id: 'm1',
    title: 'ARED Resistance Squat Load',
    subtitle: '15m High-Load Anti-Osteopenia Centrifuge',
    category: 'ARED',
    gReward: 0.12,
    completed: true,
    duration: '15 mins',
  },
  {
    id: 'm2',
    title: 'Electrolyte Osmosis Push',
    subtitle: '500mL Saline & Mineral Hydration Bolus',
    category: 'OSMOTIC',
    gReward: 0.08,
    completed: true,
    duration: 'Instant',
  },
  {
    id: 'm3',
    title: 'Vestibular Ocular Calibration',
    subtitle: '5m Saccadic Visual Motion Tracking',
    category: 'VESTIBULAR',
    gReward: 0.06,
    completed: false,
    duration: '5 mins',
  },
  {
    id: 'm4',
    title: 'Solar Melatonin Wind-Down',
    subtitle: 'Simulated Orbital Dusk 4-7-8 Breathing',
    category: 'CHRONO',
    gReward: 0.05,
    completed: false,
    duration: '10 mins',
  },
];

const defaultCrew: CrewMember[] = [
  {
    id: 'c1',
    name: 'Cmdr. Sarah Vance',
    role: 'Flight Commander',
    callsign: 'Valkyrie',
    gScore: 1.04,
    status: 'OPTIMAL',
    hr: 68,
    avatar: '👨‍✈️',
  },
  {
    id: 'c2',
    name: 'Dr. Alexei Romanov',
    role: 'Chief Medical Officer',
    callsign: 'Cosmo',
    gScore: 0.95,
    status: 'OPTIMAL',
    hr: 74,
    avatar: '👨‍⚕️',
  },
  {
    id: 'c3',
    name: 'Specialist Kai Chen (You)',
    role: 'EVA Specialist',
    callsign: 'Astra-1',
    gScore: 0.88,
    status: 'OPTIMAL',
    hr: 84,
    avatar: '🧑‍🚀',
  },
  {
    id: 'c4',
    name: 'Cadet Maya Lin',
    role: 'Systems Engineer',
    callsign: 'Nova',
    gScore: 0.62,
    status: 'DECONDITIONED',
    hr: 98,
    avatar: '👩‍🔬',
  },
];

const ZeroGContext = createContext<ZeroGContextType | null>(null);

export function ZeroGProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<CadetProfile>({
    name: 'Kai Chen',
    callsign: 'Astra-1',
    cadetId: 'ISS-7049',
    rank: 'Orbital Specialist',
    isOnboarded: true,
    flightDays: 142,
  });

  const [heartRate, setHeartRate] = useState<number>(84);
  const [restingHeartRate] = useState<number>(62);
  const [sleepHours, setSleepHours] = useState<number>(7.6);
  const [sleepEfficiency] = useState<number>(94);
  const [hydrationMl, setHydrationMl] = useState<number>(2450);
  const [hydrationTarget] = useState<number>(2800);
  const [stressIndex, setStressIndex] = useState<number>(22);
  const [hrvRmssd, setHrvRmssd] = useState<number>(68);
  const [plasmaShift] = useState<string>('COMPENSATED');
  const [missions, setMissions] = useState<Mission[]>(defaultMissions);
  const [crew] = useState<CrewMember[]>(defaultCrew);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [crackActive, setCrackActive] = useState<boolean>(false);
  const [lastCrackedReward, setLastCrackedReward] = useState<number | null>(null);

  // Compute Gravity Score
  const calculateGScore = (hr: number, sleep: number, hydr: number, stress: number, mList: Mission[]) => {
    let hrScore = 1.0;
    if (hr < 60) hrScore = Math.max(0.6, 1.0 - (60 - hr) * 0.02);
    else if (hr > 75) hrScore = Math.max(0.4, 1.0 - (hr - 75) * 0.015);

    const sleepScore = Math.min(1.0, sleep / 8.0);
    const hydrScore = Math.min(1.0, hydr / 2800);
    const stressScore = Math.max(0.1, (100 - stress) / 100);

    const baseG = (hrScore * 0.3 + sleepScore * 0.25 + hydrScore * 0.25 + stressScore * 0.2) * 1.05;

    // Additional boost from completed anti-atrophy missions
    const missionBoost = mList.filter((m) => m.completed).length * 0.04;

    const finalVal = parseFloat(Math.min(1.2, Math.max(0.2, baseG + missionBoost)).toFixed(2));
    return finalVal;
  };

  const [gravityScore, setGravityScore] = useState<number>(() =>
    calculateGScore(84, 7.6, 2450, 22, defaultMissions)
  );

  // Dynamic Gravity recalculation
  useEffect(() => {
    const nextG = calculateGScore(heartRate, sleepHours, hydrationMl, stressIndex, missions);
    setGravityScore(nextG);
  }, [heartRate, sleepHours, hydrationMl, stressIndex, missions]);

  // Live Telemetry Simulation Tick
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setHeartRate((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, +1
        return Math.min(125, Math.max(65, prev + delta));
      });

      setHrvRmssd((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.min(85, Math.max(45, prev + delta));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const toggleSimulation = () => setIsSimulating((prev) => !prev);

  const addHydration = (amount: number) => {
    setHydrationMl((prev) => {
      const nextVal = Math.min(4000, prev + amount);
      triggerCrack(0.04);
      return nextVal;
    });
  };

  const triggerCrack = (reward: number) => {
    setLastCrackedReward(reward);
    setCrackActive(true);
    setTimeout(() => {
      setCrackActive(false);
    }, 2500);
  };

  const completeMission = (id: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === id && !m.completed) {
          triggerCrack(m.gReward);
          return { ...m, completed: true };
        }
        return m;
      })
    );
  };

  const setTelemetryParam = (param: 'hr' | 'sleep' | 'hydr' | 'stress', val: number) => {
    if (param === 'hr') setHeartRate(val);
    if (param === 'sleep') setSleepHours(val);
    if (param === 'hydr') setHydrationMl(val);
    if (param === 'stress') setStressIndex(val);
  };

  const completeOnboarding = (name: string, callsign: string) => {
    setProfile((prev) => ({
      ...prev,
      name: name || 'Specialist Cadence',
      callsign: callsign || 'Solaris-1',
      isOnboarded: true,
    }));
    triggerCrack(0.15);
  };

  const resetTelemetry = () => {
    setHeartRate(84);
    setSleepHours(7.6);
    setHydrationMl(2450);
    setStressIndex(22);
    setMissions(defaultMissions);
  };

  return (
    <ZeroGContext.Provider
      value={{
        profile,
        gravityScore,
        heartRate,
        restingHeartRate,
        sleepHours,
        sleepEfficiency,
        hydrationMl,
        hydrationTarget,
        stressIndex,
        hrvRmssd,
        plasmaShift,
        missions,
        crew,
        isSimulating,
        crackActive,
        lastCrackedReward,
        toggleSimulation,
        addHydration,
        completeMission,
        setTelemetryParam,
        completeOnboarding,
        resetTelemetry,
      }}
    >
      {children}
    </ZeroGContext.Provider>
  );
}

export function useZeroG() {
  const context = useContext(ZeroGContext);
  if (!context) {
    throw new Error('useZeroG must be used within a ZeroGProvider');
  }
  return context;
}
