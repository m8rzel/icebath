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
  let mostRecentDate: Date | null = null;

  // Iterate from most recent to oldest
  for (const ib of sortedByDate.reverse()) {
    const currentDate = new Date(ib.date);
    currentDate.setHours(0, 0, 0, 0);

    // Track the most recent date
    if (mostRecentDate === null) {
      mostRecentDate = currentDate;
    }

    if (lastDate === null) {
      lastDate = currentDate;
      tempStreak = 1;
      longestStreak = 1;
      continue;
    }

    const daysDiff = differenceInDays(lastDate, currentDate);

    if (daysDiff === 1) {
      // Consecutive day, continue streak
      tempStreak++;
    } else if (daysDiff === 0) {
      // Same day, continue streak (don't increment)
      continue;
    } else {
      // Gap in streak, save longest streak and reset
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
      tempStreak = 1;
    }

    lastDate = currentDate;
  }

  // Check final tempStreak for longest streak
  if (tempStreak > longestStreak) {
    longestStreak = tempStreak;
  }

  // Calculate current streak (streak starting from most recent date going backwards)
  // sortedByDate is already reversed (newest to oldest) from the previous loop
  if (mostRecentDate) {
    let streakFromRecent = 0;
    let prevDate: Date | null = null;
    
    // Iterate from most recent to oldest, counting consecutive days
    for (const ib of sortedByDate) {
      const currentDate = new Date(ib.date);
      currentDate.setHours(0, 0, 0, 0);
      
      if (prevDate === null) {
        // First iteration: most recent date
        prevDate = currentDate;
        streakFromRecent = 1;
        continue;
      }
      
      const daysDiff = differenceInDays(prevDate, currentDate);
      
      if (daysDiff === 1) {
        // Consecutive day, continue streak
        streakFromRecent++;
        prevDate = currentDate;
      } else if (daysDiff === 0) {
        // Same day (multiple entries), don't increment but continue
        continue;
      } else {
        // Gap found, stop counting current streak
        break;
      }
    }
    
    // Check if streak is still active (most recent date is today or yesterday)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysSinceLast = differenceInDays(today, mostRecentDate);
    
    // Streak is active if last entry was today (0 days) or yesterday (1 day)
    if (daysSinceLast <= 1) {
      currentStreak = streakFromRecent;
    } else {
      currentStreak = 0;
    }
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

