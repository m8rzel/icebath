export interface Icebath {
  id: string;
  date: string; // ISO date string
  temperature: number; // in Celsius
  duration: number; // in seconds
  notes?: string;
}

export interface IcebathStats {
  total: number;
  averageTemperature: number;
  averageDuration: number;
  longestDuration: number;
  coldestTemperature: number;
  currentStreak: number;
  longestStreak: number;
}

