import { Icebath, IcebathStats } from "@/types/icebath";
import { format, isSameDay, differenceInDays } from "date-fns";

export function calculateStats(icebaths: Icebath[]): IcebathStats {
  if (icebaths.length === 0) {
    return {
      total: 0,
      averageTemperature: 0,
      averageDuration: 0,
      longestDuration: 0,
      coldestTemperature: 0,
      currentStreak: 0,
      longestStreak: 0,
    };
  }

  const total = icebaths.length;
  const averageTemperature =
    icebaths.reduce((sum, ib) => sum + ib.temperature, 0) / total;
  const averageDuration =
    icebaths.reduce((sum, ib) => sum + ib.duration, 0) / total;
  const longestDuration = Math.max(...icebaths.map((ib) => ib.duration));
  const coldestTemperature = Math.min(...icebaths.map((ib) => ib.temperature));

  // Calculate streaks
  const sortedByDate = [...icebaths].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate: Date | null = null;

  for (const ib of sortedByDate.reverse()) {
    const currentDate = new Date(ib.date);
    currentDate.setHours(0, 0, 0, 0);

    if (lastDate === null) {
      lastDate = currentDate;
      tempStreak = 1;
      currentStreak = 1;
      longestStreak = 1;
      continue;
    }

    const daysDiff = differenceInDays(lastDate, currentDate);

    if (daysDiff === 1) {
      tempStreak++;
      if (tempStreak === 1) {
        currentStreak = tempStreak;
      }
    } else if (daysDiff === 0) {
      // Same day, continue streak
      continue;
    } else {
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
      tempStreak = 1;
    }

    lastDate = currentDate;
  }

  if (tempStreak > longestStreak) {
    longestStreak = tempStreak;
  }

  // Check if current streak is still active (within last 2 days)
  const mostRecentDate = new Date(sortedByDate[0]?.date || 0);
  const daysSinceLast = differenceInDays(new Date(), mostRecentDate);
  if (daysSinceLast > 1) {
    currentStreak = 0;
  }

  return {
    total,
    averageTemperature: Math.round(averageTemperature * 10) / 10,
    averageDuration: Math.round(averageDuration),
    longestDuration,
    coldestTemperature,
    currentStreak,
    longestStreak,
  };
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) {
    return `${secs}s`;
  }
  return `${mins}m ${secs}s`;
}

