export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string; // ISO date string
  progress: number;
  target: number;
  category: "streak" | "duration" | "temperature" | "total" | "special" | "consistency" | "extreme" | "time" | "combination" | "seasonal";
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  target: number;
  current: number;
  deadline?: string; // ISO date string
  reward: number; // XP reward
  completed: boolean;
}

export interface UserLevel {
  level: number;
  xp: number;
  xpForNextLevel: number;
  totalXp: number;
}

