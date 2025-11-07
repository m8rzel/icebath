import { Icebath } from "@/types/icebath";
import { Achievement } from "@/types/achievements";
import { calculateStats } from "./stats";
import { format, getDay, getHours, getMonth, isWeekend, startOfWeek, endOfWeek, isWithinInterval, differenceInDays } from "date-fns";

const ACHIEVEMENTS: Omit<Achievement, "unlockedAt" | "progress">[] = [
  // ========== STREAK ACHIEVEMENTS ==========
  { id: "streak-1", name: "Erster Tag", description: "1 Tag Streak", icon: "🌱", target: 1, category: "streak" },
  { id: "streak-3", name: "Eisiger Start", description: "3 Tage Streak", icon: "❄️", target: 3, category: "streak" },
  { id: "streak-5", name: "Woche im Anmarsch", description: "5 Tage Streak", icon: "🧊", target: 5, category: "streak" },
  { id: "streak-7", name: "Woche der Kälte", description: "7 Tage Streak", icon: "🏔️", target: 7, category: "streak" },
  { id: "streak-10", name: "Doppelte Woche", description: "10 Tage Streak", icon: "⛄", target: 10, category: "streak" },
  { id: "streak-14", name: "Eisige Disziplin", description: "14 Tage Streak", icon: "❄️❄️", target: 14, category: "streak" },
  { id: "streak-21", name: "Drei Wochen Power", description: "21 Tage Streak", icon: "🔥", target: 21, category: "streak" },
  { id: "streak-30", name: "Polar-Bär", description: "30 Tage Streak", icon: "🐻‍❄️", target: 30, category: "streak" },
  { id: "streak-45", name: "Eisiger Monat+", description: "45 Tage Streak", icon: "🏆", target: 45, category: "streak" },
  { id: "streak-60", name: "Zwei Monate", description: "60 Tage Streak", icon: "💎", target: 60, category: "streak" },
  { id: "streak-90", name: "Quartal der Kälte", description: "90 Tage Streak", icon: "👑", target: 90, category: "streak" },
  { id: "streak-100", name: "Eis-Legende", description: "100 Tage Streak", icon: "🌟", target: 100, category: "streak" },
  { id: "streak-180", name: "Halbjahr", description: "180 Tage Streak", icon: "⭐", target: 180, category: "streak" },
  { id: "streak-365", name: "Jahres-Champion", description: "365 Tage Streak", icon: "🏅", target: 365, category: "streak" },
  
  // ========== DURATION ACHIEVEMENTS ==========
  { id: "duration-30", name: "Halbe Minute", description: "30 Sekunden im Eis", icon: "⏱️", target: 30, category: "duration" },
  { id: "duration-60", name: "Eine Minute", description: "60 Sekunden im Eis", icon: "⏰", target: 60, category: "duration" },
  { id: "duration-90", name: "Minute und Halb", description: "90 Sekunden im Eis", icon: "🧊", target: 90, category: "duration" },
  { id: "duration-120", name: "Zwei Minuten", description: "120 Sekunden im Eis", icon: "❄️", target: 120, category: "duration" },
  { id: "duration-180", name: "Drei Minuten", description: "180 Sekunden im Eis", icon: "⏳", target: 180, category: "duration" },
  { id: "duration-240", name: "Vier Minuten", description: "240 Sekunden im Eis", icon: "🔥", target: 240, category: "duration" },
  { id: "duration-300", name: "5 Minuten Challenge", description: "5 Minuten im Eis", icon: "💪", target: 300, category: "duration" },
  { id: "duration-360", name: "Sechs Minuten", description: "360 Sekunden im Eis", icon: "🏔️", target: 360, category: "duration" },
  { id: "duration-420", name: "Sieben Minuten", description: "420 Sekunden im Eis", icon: "⚡", target: 420, category: "duration" },
  { id: "duration-480", name: "Acht Minuten", description: "480 Sekunden im Eis", icon: "🌊", target: 480, category: "duration" },
  { id: "duration-540", name: "Neun Minuten", description: "540 Sekunden im Eis", icon: "💎", target: 540, category: "duration" },
  { id: "duration-600", name: "Eis-Marathon", description: "10 Minuten im Eis", icon: "👑", target: 600, category: "duration" },
  { id: "duration-900", name: "15 Minuten Titan", description: "15 Minuten im Eis", icon: "🏆", target: 900, category: "duration" },
  { id: "duration-1200", name: "20 Minuten Legende", description: "20 Minuten im Eis", icon: "🌟", target: 1200, category: "duration" },
  
  // ========== TEMPERATURE ACHIEVEMENTS ==========
  { id: "temp-10", name: "Kühles Bad", description: "10°C oder kälter", icon: "🌊", target: 10, category: "temperature" },
  { id: "temp-8", name: "Frisch", description: "8°C oder kälter", icon: "💧", target: 8, category: "temperature" },
  { id: "temp-5", name: "Kalt genug", description: "5°C oder kälter", icon: "🌡️", target: 5, category: "temperature" },
  { id: "temp-4", name: "Eisig", description: "4°C oder kälter", icon: "🧊", target: 4, category: "temperature" },
  { id: "temp-3", name: "Frostig", description: "3°C oder kälter", icon: "❄️", target: 3, category: "temperature" },
  { id: "temp-2", name: "Eiswasser", description: "2°C oder kälter", icon: "🧊❄️", target: 2, category: "temperature" },
  { id: "temp-1", name: "Polar", description: "1°C oder kälter", icon: "⛄", target: 1, category: "temperature" },
  { id: "temp-0", name: "Gefrierpunkt", description: "0°C oder kälter", icon: "🥶", target: 0, category: "temperature" },
  { id: "temp--1", name: "Unter Null", description: "-1°C oder kälter", icon: "❄️❄️", target: -1, category: "temperature" },
  { id: "temp--2", name: "Arktisch", description: "-2°C oder kälter", icon: "🏔️", target: -2, category: "temperature" },
  { id: "temp--5", name: "Sibirisch", description: "-5°C oder kälter", icon: "🐻‍❄️", target: -5, category: "temperature" },
  
  // ========== TOTAL ACHIEVEMENTS ==========
  { id: "total-1", name: "Erster Sprung", description: "1 Eisbad", icon: "🎉", target: 1, category: "total" },
  { id: "total-5", name: "Anfänger", description: "5 Eisbäder", icon: "🌊", target: 5, category: "total" },
  { id: "total-10", name: "Eingeweiht", description: "10 Eisbäder", icon: "🌊🌊", target: 10, category: "total" },
  { id: "total-25", name: "Fortgeschritten", description: "25 Eisbäder", icon: "🌊🌊🌊", target: 25, category: "total" },
  { id: "total-50", name: "Experte", description: "50 Eisbäder", icon: "💪", target: 50, category: "total" },
  { id: "total-75", name: "Profi", description: "75 Eisbäder", icon: "🔥", target: 75, category: "total" },
  { id: "total-100", name: "Meister", description: "100 Eisbäder", icon: "🏆", target: 100, category: "total" },
  { id: "total-150", name: "Veteran", description: "150 Eisbäder", icon: "💎", target: 150, category: "total" },
  { id: "total-200", name: "Champion", description: "200 Eisbäder", icon: "👑", target: 200, category: "total" },
  { id: "total-250", name: "Legende", description: "250 Eisbäder", icon: "🌟", target: 250, category: "total" },
  { id: "total-300", name: "Mythos", description: "300 Eisbäder", icon: "⭐", target: 300, category: "total" },
  { id: "total-400", name: "Unsterblich", description: "400 Eisbäder", icon: "🏅", target: 400, category: "total" },
  { id: "total-500", name: "Ewigkeit", description: "500 Eisbäder", icon: "🌌", target: 500, category: "total" },
  
  // ========== CONSISTENCY ACHIEVEMENTS ==========
  { id: "consistency-week", name: "Tägliche Routine", description: "7 Tage in einer Woche", icon: "📅", target: 7, category: "consistency" },
  { id: "consistency-month", name: "Monat der Disziplin", description: "30 Tage in einem Monat", icon: "📆", target: 30, category: "consistency" },
  { id: "consistency-weekend", name: "Wochenend-Warrior", description: "10 Wochenenden hintereinander", icon: "🎯", target: 10, category: "consistency" },
  { id: "consistency-weekday", name: "Arbeitswoche", description: "5 Werktage in einer Woche", icon: "💼", target: 5, category: "consistency" },
  
  // ========== TIME-BASED ACHIEVEMENTS ==========
  { id: "time-morning", name: "Frühaufsteher", description: "10x vor 8 Uhr morgens", icon: "🌅", target: 10, category: "time" },
  { id: "time-night", name: "Nachtschwärmer", description: "10x nach 22 Uhr", icon: "🌙", target: 10, category: "time" },
  { id: "time-noon", name: "Mittagspause", description: "10x zwischen 12-14 Uhr", icon: "☀️", target: 10, category: "time" },
  { id: "time-dawn", name: "Sonnenaufgang", description: "5x zwischen 5-7 Uhr", icon: "🌄", target: 5, category: "time" },
  
  // ========== EXTREME ACHIEVEMENTS ==========
  { id: "extreme-cold-long", name: "Eisiger Marathon", description: "5+ Minuten bei ≤2°C", icon: "🥶🔥", target: 1, category: "extreme" },
  { id: "extreme-zero-long", name: "Null-Grad-Held", description: "3+ Minuten bei ≤0°C", icon: "❄️💪", target: 1, category: "extreme" },
  { id: "extreme-10min", name: "10 Minuten Club", description: "10+ Minuten im Eis", icon: "⏰👑", target: 1, category: "extreme" },
  { id: "extreme-subzero", name: "Unter Null Champion", description: "2+ Minuten bei <0°C", icon: "🏔️❄️", target: 1, category: "extreme" },
  
  // ========== COMBINATION ACHIEVEMENTS ==========
  { id: "combo-daily-cold", name: "Täglich Kalt", description: "7 Tage Streak bei ≤5°C", icon: "❄️📅", target: 7, category: "combination" },
  { id: "combo-daily-long", name: "Täglich Lang", description: "7 Tage Streak mit 3+ Min", icon: "⏱️📅", target: 7, category: "combination" },
  { id: "combo-cold-long", name: "Kalt & Lang", description: "5 Min bei ≤3°C", icon: "🧊⏰", target: 1, category: "combination" },
  { id: "combo-100-cold", name: "100x Kalt", description: "100x bei ≤5°C", icon: "💯❄️", target: 100, category: "combination" },
  { id: "combo-100-long", name: "100x Lang", description: "100x mit 3+ Minuten", icon: "💯⏱️", target: 100, category: "combination" },
  
  // ========== SEASONAL ACHIEVEMENTS ==========
  { id: "season-winter", name: "Winter-Warrior", description: "50x im Winter", icon: "⛄", target: 50, category: "seasonal" },
  { id: "season-summer", name: "Sommer-Kühler", description: "30x im Sommer", icon: "☀️🧊", target: 30, category: "seasonal" },
  { id: "season-spring", name: "Frühlings-Eis", description: "30x im Frühling", icon: "🌸❄️", target: 30, category: "seasonal" },
  { id: "season-autumn", name: "Herbst-Kälte", description: "30x im Herbst", icon: "🍂🧊", target: 30, category: "seasonal" },
  
  // ========== SPECIAL ACHIEVEMENTS ==========
  { id: "special-first", name: "Erster Sprung", description: "Dein erstes Eisbad", icon: "🎉", target: 1, category: "special" },
  { id: "special-100-streak", name: "Hundert-Tage-Streak", description: "100 Tage ohne Pause", icon: "🔥💯", target: 100, category: "special" },
  { id: "special-365-total", name: "Jahres-Challenge", description: "365 Eisbäder in einem Jahr", icon: "📅👑", target: 365, category: "special" },
  { id: "special-perfect-week", name: "Perfekte Woche", description: "7 Tage, 7 Eisbäder", icon: "✨", target: 7, category: "special" },
  { id: "special-perfect-month", name: "Perfekter Monat", description: "30 Tage, 30 Eisbäder", icon: "💫", target: 30, category: "special" },
  { id: "special-new-year", name: "Neujahrs-Bad", description: "Eisbad am 1. Januar", icon: "🎊", target: 1, category: "special" },
  { id: "special-christmas", name: "Weihnachts-Eis", description: "Eisbad an Weihnachten", icon: "🎄", target: 1, category: "special" },
  { id: "special-birthday", name: "Geburtstags-Bad", description: "Eisbad am Geburtstag", icon: "🎂", target: 1, category: "special" },
  { id: "special-valentine", name: "Valentins-Kälte", description: "Eisbad am Valentinstag", icon: "💝", target: 1, category: "special" },
  { id: "special-halloween", name: "Halloween-Horror", description: "Eisbad an Halloween", icon: "🎃", target: 1, category: "special" },
  
  // ========== ADDITIONAL STREAK ACHIEVEMENTS ==========
  { id: "streak-2", name: "Zweiter Tag", description: "2 Tage Streak", icon: "🌿", target: 2, category: "streak" },
  { id: "streak-15", name: "Zwei Wochen Plus", description: "15 Tage Streak", icon: "❄️❄️❄️", target: 15, category: "streak" },
  { id: "streak-50", name: "50 Tage Power", description: "50 Tage Streak", icon: "💪", target: 50, category: "streak" },
  { id: "streak-120", name: "Vierteljahr", description: "120 Tage Streak", icon: "📅", target: 120, category: "streak" },
  { id: "streak-200", name: "200 Tage", description: "200 Tage Streak", icon: "🔥🔥", target: 200, category: "streak" },
  { id: "streak-500", name: "500 Tage", description: "500 Tage Streak", icon: "🌟⭐", target: 500, category: "streak" },
  
  // ========== ADDITIONAL DURATION ACHIEVEMENTS ==========
  { id: "duration-15", name: "15 Sekunden", description: "15 Sekunden im Eis", icon: "💧", target: 15, category: "duration" },
  { id: "duration-45", name: "45 Sekunden", description: "45 Sekunden im Eis", icon: "🌊", target: 45, category: "duration" },
  { id: "duration-150", name: "2.5 Minuten", description: "150 Sekunden im Eis", icon: "⏱️", target: 150, category: "duration" },
  { id: "duration-210", name: "3.5 Minuten", description: "210 Sekunden im Eis", icon: "🧊", target: 210, category: "duration" },
  { id: "duration-450", name: "7.5 Minuten", description: "450 Sekunden im Eis", icon: "❄️", target: 450, category: "duration" },
  { id: "duration-720", name: "12 Minuten", description: "12 Minuten im Eis", icon: "⏰", target: 720, category: "duration" },
  { id: "duration-1800", name: "30 Minuten Titan", description: "30 Minuten im Eis", icon: "🏔️", target: 1800, category: "duration" },
  
  // ========== ADDITIONAL TEMPERATURE ACHIEVEMENTS ==========
  { id: "temp-12", name: "Erfrischend", description: "12°C oder kälter", icon: "💨", target: 12, category: "temperature" },
  { id: "temp-7", name: "Sehr Kalt", description: "7°C oder kälter", icon: "🌡️", target: 7, category: "temperature" },
  { id: "temp-6", name: "Eiskalt", description: "6°C oder kälter", icon: "🧊", target: 6, category: "temperature" },
  { id: "temp--3", name: "Minus Drei", description: "-3°C oder kälter", icon: "❄️❄️❄️", target: -3, category: "temperature" },
  { id: "temp--10", name: "Sibirische Kälte", description: "-10°C oder kälter", icon: "🏔️❄️", target: -10, category: "temperature" },
  
  // ========== ADDITIONAL TOTAL ACHIEVEMENTS ==========
  { id: "total-2", name: "Zweiter Versuch", description: "2 Eisbäder", icon: "🌊", target: 2, category: "total" },
  { id: "total-3", name: "Dritter Versuch", description: "3 Eisbäder", icon: "🌊🌊", target: 3, category: "total" },
  { id: "total-15", name: "15er Club", description: "15 Eisbäder", icon: "💪", target: 15, category: "total" },
  { id: "total-20", name: "Zwanzig", description: "20 Eisbäder", icon: "🔥", target: 20, category: "total" },
  { id: "total-30", name: "Dreißig", description: "30 Eisbäder", icon: "❄️", target: 30, category: "total" },
  { id: "total-40", name: "Vierzig", description: "40 Eisbäder", icon: "🧊", target: 40, category: "total" },
  { id: "total-60", name: "Sechzig", description: "60 Eisbäder", icon: "⏱️", target: 60, category: "total" },
  { id: "total-80", name: "Achtzig", description: "80 Eisbäder", icon: "💎", target: 80, category: "total" },
  { id: "total-350", name: "350er Club", description: "350 Eisbäder", icon: "⭐", target: 350, category: "total" },
  { id: "total-600", name: "600er Meister", description: "600 Eisbäder", icon: "🏅", target: 600, category: "total" },
  { id: "total-750", name: "750er Legende", description: "750 Eisbäder", icon: "👑", target: 750, category: "total" },
  { id: "total-1000", name: "Tausend", description: "1000 Eisbäder", icon: "🌌", target: 1000, category: "total" },
  
  // ========== MORE CONSISTENCY ACHIEVEMENTS ==========
  { id: "consistency-3weeks", name: "Drei Wochen", description: "21 Tage in 3 Wochen", icon: "📆", target: 21, category: "consistency" },
  { id: "consistency-2months", name: "Zwei Monate", description: "60 Tage in 2 Monaten", icon: "🗓️", target: 60, category: "consistency" },
  { id: "consistency-quarter", name: "Quartal", description: "90 Tage in 3 Monaten", icon: "📅", target: 90, category: "consistency" },
  
  // ========== MORE TIME-BASED ACHIEVEMENTS ==========
  { id: "time-evening", name: "Abend-Routine", description: "20x zwischen 18-22 Uhr", icon: "🌆", target: 20, category: "time" },
  { id: "time-afternoon", name: "Nachmittags-Bad", description: "20x zwischen 14-18 Uhr", icon: "☀️", target: 20, category: "time" },
  { id: "time-midnight", name: "Mitternachts-Eis", description: "5x zwischen 0-2 Uhr", icon: "🌃", target: 5, category: "time" },
  
  // ========== MORE EXTREME ACHIEVEMENTS ==========
  { id: "extreme-15min-cold", name: "15 Min Kalt", description: "15+ Minuten bei ≤3°C", icon: "🥶⏰", target: 1, category: "extreme" },
  { id: "extreme-20min", name: "20 Minuten", description: "20+ Minuten im Eis", icon: "⏰👑", target: 1, category: "extreme" },
  { id: "extreme-subzero-5min", name: "Unter Null 5 Min", description: "5+ Minuten bei <0°C", icon: "❄️💪", target: 1, category: "extreme" },
  
  // ========== MORE COMBINATION ACHIEVEMENTS ==========
  { id: "combo-50-cold-long", name: "50x Kalt & Lang", description: "50x 3+ Min bei ≤5°C", icon: "❄️⏱️", target: 50, category: "combination" },
  { id: "combo-streak-cold", name: "Kalter Streak", description: "30 Tage bei ≤5°C", icon: "❄️🔥", target: 30, category: "combination" },
  { id: "combo-streak-long", name: "Langer Streak", description: "30 Tage mit 3+ Min", icon: "⏱️🔥", target: 30, category: "combination" },
  { id: "combo-200-cold", name: "200x Kalt", description: "200x bei ≤5°C", icon: "💯❄️❄️", target: 200, category: "combination" },
  
  // ========== MORE SEASONAL ACHIEVEMENTS ==========
  { id: "season-winter-extreme", name: "Winter-Extrem", description: "20x im Winter bei ≤2°C", icon: "⛄❄️", target: 20, category: "seasonal" },
  { id: "season-summer-extreme", name: "Sommer-Extrem", description: "15x im Sommer bei ≤5°C", icon: "☀️🧊", target: 15, category: "seasonal" },
  
  // ========== MORE SPECIAL ACHIEVEMENTS ==========
  { id: "special-new-year-eve", name: "Silvester-Eis", description: "Eisbad am 31. Dezember", icon: "🎆", target: 1, category: "special" },
  { id: "special-easter", name: "Oster-Eis", description: "Eisbad an Ostern", icon: "🐰", target: 1, category: "special" },
  { id: "special-new-moon", name: "Neumond-Bad", description: "Eisbad bei Neumond", icon: "🌑", target: 1, category: "special" },
  { id: "special-full-moon", name: "Vollmond-Bad", description: "Eisbad bei Vollmond", icon: "🌕", target: 1, category: "special" },
  { id: "special-1000-total", name: "Tausend-Meister", description: "1000 Eisbäder gesamt", icon: "💯👑", target: 1000, category: "special" },
  { id: "special-365-streak", name: "Jahres-Streak", description: "365 Tage Streak", icon: "📅🔥", target: 365, category: "special" },
];

export function calculateAchievements(icebaths: Icebath[]): Achievement[] {
  const stats = calculateStats(icebaths);
  
  return ACHIEVEMENTS.map((achievement) => {
    let progress = 0;
    let unlockedAt: string | undefined = undefined;
    
    switch (achievement.category) {
      case "streak":
        progress = Math.max(stats.currentStreak, stats.longestStreak);
        if (progress >= achievement.target) {
          const sorted = [...icebaths].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          unlockedAt = sorted[0]?.date;
        }
        break;
        
      case "duration":
        progress = stats.longestDuration;
        if (progress >= achievement.target) {
          const longest = icebaths.find(ib => ib.duration === stats.longestDuration);
          unlockedAt = longest?.date;
        }
        break;
        
      case "temperature":
        progress = stats.coldestTemperature;
        if (progress <= achievement.target) {
          const coldest = icebaths.find(ib => ib.temperature === stats.coldestTemperature);
          unlockedAt = coldest?.date;
        }
        break;
        
      case "total":
        progress = stats.total;
        if (progress >= achievement.target && icebaths.length > 0) {
          unlockedAt = icebaths[0]?.date;
        }
        break;
        
      case "consistency":
        if (achievement.id === "consistency-week") {
          const weekMap = new Map<string, number>();
          icebaths.forEach(ib => {
            const date = new Date(ib.date);
            const weekKey = `${date.getFullYear()}-W${getWeekNumber(date)}`;
            weekMap.set(weekKey, (weekMap.get(weekKey) || 0) + 1);
          });
          const maxInWeek = Math.max(...Array.from(weekMap.values()), 0);
          progress = maxInWeek;
          if (progress >= achievement.target) {
            unlockedAt = icebaths[0]?.date;
          }
        } else if (achievement.id === "consistency-month") {
          const monthMap = new Map<string, number>();
          icebaths.forEach(ib => {
            const date = new Date(ib.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
          });
          const maxInMonth = Math.max(...Array.from(monthMap.values()), 0);
          progress = maxInMonth;
          if (progress >= achievement.target) {
            unlockedAt = icebaths[0]?.date;
          }
        } else if (achievement.id === "consistency-weekend") {
          const weekendStreaks = calculateWeekendStreaks(icebaths);
          progress = weekendStreaks.maxStreak;
          if (progress >= achievement.target) {
            unlockedAt = icebaths[0]?.date;
          }
        } else if (achievement.id === "consistency-weekday") {
          const weekMap = new Map<string, number>();
          icebaths.forEach(ib => {
            const date = new Date(ib.date);
            const day = getDay(date);
            if (day >= 1 && day <= 5) { // Monday to Friday
              const weekKey = `${date.getFullYear()}-W${getWeekNumber(date)}`;
              weekMap.set(weekKey, (weekMap.get(weekKey) || 0) + 1);
            }
          });
          const maxInWeek = Math.max(...Array.from(weekMap.values()), 0);
          progress = maxInWeek;
          if (progress >= achievement.target) {
            unlockedAt = icebaths[0]?.date;
          }
        } else if (achievement.id === "consistency-3weeks") {
          const weekMap = new Map<string, number>();
          icebaths.forEach(ib => {
            const date = new Date(ib.date);
            const weekKey = `${date.getFullYear()}-W${getWeekNumber(date)}`;
            weekMap.set(weekKey, (weekMap.get(weekKey) || 0) + 1);
          });
          const weeks = Array.from(weekMap.values()).sort((a, b) => b - a);
          const top3Weeks = weeks.slice(0, 3);
          progress = top3Weeks.reduce((sum, count) => sum + count, 0);
          if (progress >= achievement.target) {
            unlockedAt = icebaths[0]?.date;
          }
        } else if (achievement.id === "consistency-2months") {
          const monthMap = new Map<string, number>();
          icebaths.forEach(ib => {
            const date = new Date(ib.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
          });
          const months = Array.from(monthMap.values()).sort((a, b) => b - a);
          const top2Months = months.slice(0, 2);
          progress = top2Months.reduce((sum, count) => sum + count, 0);
          if (progress >= achievement.target) {
            unlockedAt = icebaths[0]?.date;
          }
        } else if (achievement.id === "consistency-quarter") {
          const monthMap = new Map<string, number>();
          icebaths.forEach(ib => {
            const date = new Date(ib.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
          });
          const months = Array.from(monthMap.values()).sort((a, b) => b - a);
          const top3Months = months.slice(0, 3);
          progress = top3Months.reduce((sum, count) => sum + count, 0);
          if (progress >= achievement.target) {
            unlockedAt = icebaths[0]?.date;
          }
        }
        break;
        
      case "time":
        if (achievement.id === "time-morning") {
          const morningBaths = icebaths.filter(ib => {
            const hour = getHours(new Date(ib.date));
            return hour < 8;
          }).length;
          progress = morningBaths;
          if (progress >= achievement.target && morningBaths > 0) {
            unlockedAt = icebaths.find(ib => getHours(new Date(ib.date)) < 8)?.date;
          }
        } else if (achievement.id === "time-night") {
          const nightBaths = icebaths.filter(ib => {
            const hour = getHours(new Date(ib.date));
            return hour >= 22;
          }).length;
          progress = nightBaths;
          if (progress >= achievement.target && nightBaths > 0) {
            unlockedAt = icebaths.find(ib => getHours(new Date(ib.date)) >= 22)?.date;
          }
        } else if (achievement.id === "time-noon") {
          const noonBaths = icebaths.filter(ib => {
            const hour = getHours(new Date(ib.date));
            return hour >= 12 && hour < 14;
          }).length;
          progress = noonBaths;
          if (progress >= achievement.target && noonBaths > 0) {
            unlockedAt = icebaths.find(ib => {
              const hour = getHours(new Date(ib.date));
              return hour >= 12 && hour < 14;
            })?.date;
          }
        } else if (achievement.id === "time-dawn") {
          const dawnBaths = icebaths.filter(ib => {
            const hour = getHours(new Date(ib.date));
            return hour >= 5 && hour < 7;
          }).length;
          progress = dawnBaths;
          if (progress >= achievement.target && dawnBaths > 0) {
            unlockedAt = icebaths.find(ib => {
              const hour = getHours(new Date(ib.date));
              return hour >= 5 && hour < 7;
            })?.date;
          }
        } else if (achievement.id === "time-evening") {
          const eveningBaths = icebaths.filter(ib => {
            const hour = getHours(new Date(ib.date));
            return hour >= 18 && hour < 22;
          }).length;
          progress = eveningBaths;
          if (progress >= achievement.target && eveningBaths > 0) {
            unlockedAt = icebaths.find(ib => {
              const hour = getHours(new Date(ib.date));
              return hour >= 18 && hour < 22;
            })?.date;
          }
        } else if (achievement.id === "time-afternoon") {
          const afternoonBaths = icebaths.filter(ib => {
            const hour = getHours(new Date(ib.date));
            return hour >= 14 && hour < 18;
          }).length;
          progress = afternoonBaths;
          if (progress >= achievement.target && afternoonBaths > 0) {
            unlockedAt = icebaths.find(ib => {
              const hour = getHours(new Date(ib.date));
              return hour >= 14 && hour < 18;
            })?.date;
          }
        } else if (achievement.id === "time-midnight") {
          const midnightBaths = icebaths.filter(ib => {
            const hour = getHours(new Date(ib.date));
            return hour >= 0 && hour < 2;
          }).length;
          progress = midnightBaths;
          if (progress >= achievement.target && midnightBaths > 0) {
            unlockedAt = icebaths.find(ib => {
              const hour = getHours(new Date(ib.date));
              return hour >= 0 && hour < 2;
            })?.date;
          }
        }
        break;
        
      case "extreme":
        if (achievement.id === "extreme-cold-long") {
          const extreme = icebaths.find(ib => ib.temperature <= 2 && ib.duration >= 300);
          progress = extreme ? 1 : 0;
          unlockedAt = extreme?.date;
        } else if (achievement.id === "extreme-zero-long") {
          const extreme = icebaths.find(ib => ib.temperature <= 0 && ib.duration >= 180);
          progress = extreme ? 1 : 0;
          unlockedAt = extreme?.date;
        } else if (achievement.id === "extreme-10min") {
          const extreme = icebaths.find(ib => ib.duration >= 600);
          progress = extreme ? 1 : 0;
          unlockedAt = extreme?.date;
        } else if (achievement.id === "extreme-subzero") {
          const extreme = icebaths.find(ib => ib.temperature < 0 && ib.duration >= 120);
          progress = extreme ? 1 : 0;
          unlockedAt = extreme?.date;
        } else if (achievement.id === "extreme-15min-cold") {
          const extreme = icebaths.find(ib => ib.temperature <= 3 && ib.duration >= 900);
          progress = extreme ? 1 : 0;
          unlockedAt = extreme?.date;
        } else if (achievement.id === "extreme-20min") {
          const extreme = icebaths.find(ib => ib.duration >= 1200);
          progress = extreme ? 1 : 0;
          unlockedAt = extreme?.date;
        } else if (achievement.id === "extreme-subzero-5min") {
          const extreme = icebaths.find(ib => ib.temperature < 0 && ib.duration >= 300);
          progress = extreme ? 1 : 0;
          unlockedAt = extreme?.date;
        }
        break;
        
      case "combination":
        if (achievement.id === "combo-daily-cold") {
          progress = calculateColdStreak(icebaths, 5);
          if (progress >= achievement.target) {
            unlockedAt = icebaths[0]?.date;
          }
        } else if (achievement.id === "combo-daily-long") {
          progress = calculateLongStreak(icebaths, 180);
          if (progress >= achievement.target) {
            unlockedAt = icebaths[0]?.date;
          }
        } else if (achievement.id === "combo-cold-long") {
          const combo = icebaths.find(ib => ib.temperature <= 3 && ib.duration >= 300);
          progress = combo ? 1 : 0;
          unlockedAt = combo?.date;
        } else if (achievement.id === "combo-100-cold") {
          const coldBaths = icebaths.filter(ib => ib.temperature <= 5).length;
          progress = coldBaths;
          if (progress >= achievement.target) {
            unlockedAt = icebaths.find(ib => ib.temperature <= 5)?.date;
          }
        } else if (achievement.id === "combo-100-long") {
          const longBaths = icebaths.filter(ib => ib.duration >= 180).length;
          progress = longBaths;
          if (progress >= achievement.target) {
            unlockedAt = icebaths.find(ib => ib.duration >= 180)?.date;
          }
        } else if (achievement.id === "combo-50-cold-long") {
          const comboBaths = icebaths.filter(ib => ib.temperature <= 5 && ib.duration >= 180).length;
          progress = comboBaths;
          if (progress >= achievement.target) {
            unlockedAt = icebaths.find(ib => ib.temperature <= 5 && ib.duration >= 180)?.date;
          }
        } else if (achievement.id === "combo-streak-cold") {
          progress = calculateColdStreak(icebaths, 5);
          if (progress >= achievement.target) {
            unlockedAt = icebaths[0]?.date;
          }
        } else if (achievement.id === "combo-streak-long") {
          progress = calculateLongStreak(icebaths, 180);
          if (progress >= achievement.target) {
            unlockedAt = icebaths[0]?.date;
          }
        } else if (achievement.id === "combo-200-cold") {
          const coldBaths = icebaths.filter(ib => ib.temperature <= 5).length;
          progress = coldBaths;
          if (progress >= achievement.target) {
            unlockedAt = icebaths.find(ib => ib.temperature <= 5)?.date;
          }
        }
        break;
        
      case "seasonal":
        if (achievement.id === "season-winter") {
          const winterBaths = icebaths.filter(ib => {
            const month = getMonth(new Date(ib.date));
            return month >= 11 || month <= 1; // Dec, Jan, Feb
          }).length;
          progress = winterBaths;
          if (progress >= achievement.target) {
            unlockedAt = icebaths.find(ib => {
              const month = getMonth(new Date(ib.date));
              return month >= 11 || month <= 1;
            })?.date;
          }
        } else if (achievement.id === "season-summer") {
          const summerBaths = icebaths.filter(ib => {
            const month = getMonth(new Date(ib.date));
            return month >= 5 && month <= 7; // Jun, Jul, Aug
          }).length;
          progress = summerBaths;
          if (progress >= achievement.target) {
            unlockedAt = icebaths.find(ib => {
              const month = getMonth(new Date(ib.date));
              return month >= 5 && month <= 7;
            })?.date;
          }
        } else if (achievement.id === "season-spring") {
          const springBaths = icebaths.filter(ib => {
            const month = getMonth(new Date(ib.date));
            return month >= 2 && month <= 4; // Mar, Apr, May
          }).length;
          progress = springBaths;
          if (progress >= achievement.target) {
            unlockedAt = icebaths.find(ib => {
              const month = getMonth(new Date(ib.date));
              return month >= 2 && month <= 4;
            })?.date;
          }
        } else if (achievement.id === "season-autumn") {
          const autumnBaths = icebaths.filter(ib => {
            const month = getMonth(new Date(ib.date));
            return month >= 8 && month <= 10; // Sep, Oct, Nov
          }).length;
          progress = autumnBaths;
          if (progress >= achievement.target) {
            unlockedAt = icebaths.find(ib => {
              const month = getMonth(new Date(ib.date));
              return month >= 8 && month <= 10;
            })?.date;
          }
        } else if (achievement.id === "season-winter-extreme") {
          const winterExtreme = icebaths.filter(ib => {
            const month = getMonth(new Date(ib.date));
            return (month >= 11 || month <= 1) && ib.temperature <= 2;
          }).length;
          progress = winterExtreme;
          if (progress >= achievement.target) {
            unlockedAt = icebaths.find(ib => {
              const month = getMonth(new Date(ib.date));
              return (month >= 11 || month <= 1) && ib.temperature <= 2;
            })?.date;
          }
        } else if (achievement.id === "season-summer-extreme") {
          const summerExtreme = icebaths.filter(ib => {
            const month = getMonth(new Date(ib.date));
            return month >= 5 && month <= 7 && ib.temperature <= 5;
          }).length;
          progress = summerExtreme;
          if (progress >= achievement.target) {
            unlockedAt = icebaths.find(ib => {
              const month = getMonth(new Date(ib.date));
              return month >= 5 && month <= 7 && ib.temperature <= 5;
            })?.date;
          }
        }
        break;
        
      case "special":
        if (achievement.id === "special-first") {
          progress = stats.total > 0 ? 1 : 0;
          if (progress >= achievement.target && icebaths.length > 0) {
            const sorted = [...icebaths].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            unlockedAt = sorted[0]?.date;
          }
        } else if (achievement.id === "special-100-streak") {
          progress = stats.longestStreak >= 100 ? 1 : 0;
          if (progress >= achievement.target) {
            unlockedAt = icebaths[0]?.date;
          }
        } else if (achievement.id === "special-365-total") {
          const yearMap = new Map<number, number>();
          icebaths.forEach(ib => {
            const year = new Date(ib.date).getFullYear();
            yearMap.set(year, (yearMap.get(year) || 0) + 1);
          });
          const maxInYear = Math.max(...Array.from(yearMap.values()), 0);
          progress = maxInYear >= 365 ? 1 : 0;
          if (progress >= achievement.target) {
            unlockedAt = icebaths[0]?.date;
          }
        } else if (achievement.id === "special-perfect-week") {
          const weekMap = new Map<string, number>();
          icebaths.forEach(ib => {
            const date = new Date(ib.date);
            const weekKey = `${date.getFullYear()}-W${getWeekNumber(date)}`;
            weekMap.set(weekKey, (weekMap.get(weekKey) || 0) + 1);
          });
          const perfectWeeks = Array.from(weekMap.values()).filter(count => count >= 7).length;
          progress = perfectWeeks;
          if (progress >= achievement.target) {
            unlockedAt = icebaths[0]?.date;
          }
        } else if (achievement.id === "special-perfect-month") {
          const monthMap = new Map<string, number>();
          icebaths.forEach(ib => {
            const date = new Date(ib.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
          });
          const perfectMonths = Array.from(monthMap.values()).filter(count => count >= 30).length;
          progress = perfectMonths;
          if (progress >= achievement.target) {
            unlockedAt = icebaths[0]?.date;
          }
        } else if (achievement.id === "special-new-year") {
          const newYearBath = icebaths.find(ib => {
            const date = new Date(ib.date);
            return date.getMonth() === 0 && date.getDate() === 1;
          });
          progress = newYearBath ? 1 : 0;
          unlockedAt = newYearBath?.date;
        } else if (achievement.id === "special-christmas") {
          const christmasBath = icebaths.find(ib => {
            const date = new Date(ib.date);
            return date.getMonth() === 11 && date.getDate() === 25;
          });
          progress = christmasBath ? 1 : 0;
          unlockedAt = christmasBath?.date;
        } else if (achievement.id === "special-birthday") {
          // This would need user's birthday - simplified for now
          progress = 0;
        } else if (achievement.id === "special-valentine") {
          const valentineBath = icebaths.find(ib => {
            const date = new Date(ib.date);
            return date.getMonth() === 1 && date.getDate() === 14;
          });
          progress = valentineBath ? 1 : 0;
          unlockedAt = valentineBath?.date;
        } else if (achievement.id === "special-halloween") {
          const halloweenBath = icebaths.find(ib => {
            const date = new Date(ib.date);
            return date.getMonth() === 9 && date.getDate() === 31;
          });
          progress = halloweenBath ? 1 : 0;
          unlockedAt = halloweenBath?.date;
        } else if (achievement.id === "special-new-year-eve") {
          const newYearEveBath = icebaths.find(ib => {
            const date = new Date(ib.date);
            return date.getMonth() === 11 && date.getDate() === 31;
          });
          progress = newYearEveBath ? 1 : 0;
          unlockedAt = newYearEveBath?.date;
        } else if (achievement.id === "special-easter") {
          // Simplified - would need proper Easter calculation
          progress = 0;
        } else if (achievement.id === "special-new-moon") {
          // Simplified - would need moon phase calculation
          progress = 0;
        } else if (achievement.id === "special-full-moon") {
          // Simplified - would need moon phase calculation
          progress = 0;
        } else if (achievement.id === "special-1000-total") {
          progress = stats.total >= 1000 ? 1 : 0;
          if (progress >= achievement.target) {
            unlockedAt = icebaths[0]?.date;
          }
        } else if (achievement.id === "special-365-streak") {
          progress = stats.longestStreak >= 365 ? 1 : 0;
          if (progress >= achievement.target) {
            unlockedAt = icebaths[0]?.date;
          }
        }
        break;
    }
    
    return {
      ...achievement,
      progress,
      unlockedAt: progress >= achievement.target ? unlockedAt : undefined,
    };
  });
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function calculateWeekendStreaks(icebaths: Icebath[]): { maxStreak: number } {
  const sorted = [...icebaths].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let maxStreak = 0;
  let currentStreak = 0;
  let lastWeekend: string | null = null;
  
  for (const ib of sorted) {
    const date = new Date(ib.date);
    const day = getDay(date);
    if (day === 0 || day === 6) { // Weekend
      const weekKey = `${date.getFullYear()}-W${getWeekNumber(date)}`;
      if (weekKey !== lastWeekend) {
        currentStreak++;
        lastWeekend = weekKey;
        maxStreak = Math.max(maxStreak, currentStreak);
      }
    } else {
      currentStreak = 0;
      lastWeekend = null;
    }
  }
  
  return { maxStreak };
}

function calculateColdStreak(icebaths: Icebath[], maxTemp: number): number {
  const sorted = [...icebaths].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  let streak = 0;
  
  for (const ib of sorted) {
    if (ib.temperature <= maxTemp) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

function calculateLongStreak(icebaths: Icebath[], minDuration: number): number {
  const sorted = [...icebaths].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  let streak = 0;
  
  for (const ib of sorted) {
    if (ib.duration >= minDuration) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

export function calculateXP(icebaths: Icebath[], achievements: Achievement[]): number {
  let xp = 0;
  
  // XP für jedes Eisbad
  icebaths.forEach(ib => {
    xp += 10; // Base XP
    xp += Math.floor(ib.duration / 10); // 1 XP pro 10 Sekunden
    if (ib.temperature <= 5) xp += 5; // Bonus für kalte Temperaturen
    if (ib.temperature <= 0) xp += 10; // Extra Bonus für 0°C oder kälter
  });
  
  // XP für Achievements
  achievements.forEach(ach => {
    if (ach.unlockedAt) {
      xp += 50; // Base XP für Achievement
      if (ach.category === "streak" && ach.target >= 30) xp += 100;
      if (ach.category === "duration" && ach.target >= 300) xp += 150;
      if (ach.category === "total" && ach.target >= 100) xp += 200;
      if (ach.category === "extreme") xp += 200;
      if (ach.category === "special") xp += 100;
    }
  });
  
  return xp;
}

export function calculateLevel(xp: number): { level: number; xpForNextLevel: number; totalXp: number } {
  const totalXp = xp;
  let level = 1;
  let xpNeeded = 100;
  let remainingXp = xp;
  
  while (remainingXp >= xpNeeded) {
    remainingXp -= xpNeeded;
    level++;
    xpNeeded = Math.floor(100 * Math.pow(1.5, level - 1)); // Exponential growth: 100, 150, 225, 337, ...
  }
  
  return {
    level,
    xpForNextLevel: xpNeeded,
    totalXp,
  };
}
