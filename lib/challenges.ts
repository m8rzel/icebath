import { Icebath } from "@/types/icebath";
import { Challenge } from "@/types/achievements";
import { calculateStats } from "./stats";
import { format, addDays, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

export function getWeeklyChallenges(icebaths: Icebath[]): Challenge[] {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  
  const thisWeekBaths = icebaths.filter(ib => 
    isWithinInterval(new Date(ib.date), { start: weekStart, end: weekEnd })
  );
  
  const stats = calculateStats(thisWeekBaths);
  
  return [
    {
      id: "weekly-3",
      name: "3x diese Woche",
      description: "Mache 3 Eisbäder diese Woche",
      target: 3,
      current: thisWeekBaths.length,
      deadline: weekEnd.toISOString(),
      reward: 50,
      completed: thisWeekBaths.length >= 3,
    },
    {
      id: "weekly-streak",
      name: "Wochen-Streak",
      description: "Halte deinen Streak diese Woche",
      target: 1,
      current: stats.currentStreak > 0 ? 1 : 0,
      deadline: weekEnd.toISOString(),
      reward: 30,
      completed: stats.currentStreak > 0,
    },
    {
      id: "weekly-duration",
      name: "Länger werden",
      description: "Steigere deine Durchschnittsdauer diese Woche",
      target: 1,
      current: stats.averageDuration > 0 ? 1 : 0,
      deadline: weekEnd.toISOString(),
      reward: 40,
      completed: stats.averageDuration > 0,
    },
  ];
}

export function getMonthlyChallenges(icebaths: Icebath[]): Challenge[] {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  const thisMonthBaths = icebaths.filter(ib => 
    isWithinInterval(new Date(ib.date), { start: monthStart, end: monthEnd })
  );
  
  const stats = calculateStats(thisMonthBaths);
  
  return [
    {
      id: "monthly-10",
      name: "10x diesen Monat",
      description: "Mache 10 Eisbäder diesen Monat",
      target: 10,
      current: thisMonthBaths.length,
      deadline: monthEnd.toISOString(),
      reward: 150,
      completed: thisMonthBaths.length >= 10,
    },
    {
      id: "monthly-20",
      name: "20x diesen Monat",
      description: "Mache 20 Eisbäder diesen Monat",
      target: 20,
      current: thisMonthBaths.length,
      deadline: monthEnd.toISOString(),
      reward: 300,
      completed: thisMonthBaths.length >= 20,
    },
  ];
}

