"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UserLevel } from "@/types/achievements";
import { Star, Zap, Crown, Trophy, Award } from "lucide-react";

interface LevelCardProps {
  level: UserLevel;
}

function getLevelTitle(level: number): { title: string; icon: React.ReactNode; color: string } {
  if (level >= 100) {
    return { title: "Eis-Legende", icon: <Crown className="h-5 w-5" />, color: "text-purple-600 dark:text-purple-400" };
  } else if (level >= 75) {
    return { title: "Polar-Meister", icon: <Crown className="h-5 w-5" />, color: "text-indigo-600 dark:text-indigo-400" };
  } else if (level >= 50) {
    return { title: "Arktischer Champion", icon: <Trophy className="h-5 w-5" />, color: "text-blue-600 dark:text-blue-400" };
  } else if (level >= 30) {
    return { title: "Eis-Veteran", icon: <Trophy className="h-5 w-5" />, color: "text-cyan-600 dark:text-cyan-400" };
  } else if (level >= 20) {
    return { title: "Kälte-Experte", icon: <Award className="h-5 w-5" />, color: "text-teal-600 dark:text-teal-400" };
  } else if (level >= 10) {
    return { title: "Eis-Enthusiast", icon: <Star className="h-5 w-5" />, color: "text-green-600 dark:text-green-400" };
  } else if (level >= 5) {
    return { title: "Kälte-Anfänger", icon: <Star className="h-5 w-5" />, color: "text-yellow-600 dark:text-yellow-400" };
  } else {
    return { title: "Eis-Neuling", icon: <Star className="h-5 w-5" />, color: "text-orange-600 dark:text-orange-400" };
  }
}

export function LevelCard({ level }: LevelCardProps) {
  // Calculate XP needed for all previous levels
  let xpForPreviousLevels = 0;
  for (let i = 1; i < level.level; i++) {
    let xpForLevel = 0;
    if (i === 1) {
      xpForLevel = 50;
    } else if (i <= 10) {
      xpForLevel = Math.floor(50 * Math.pow(1.5, i - 1));
    } else if (i <= 25) {
      const baseLevel = i - 10;
      xpForLevel = Math.floor(1912 * Math.pow(1.35, baseLevel));
    } else if (i <= 50) {
      const baseLevel = i - 25;
      xpForLevel = Math.floor(1912 * Math.pow(1.35, 15) * Math.pow(1.4, baseLevel));
    } else {
      const baseLevel = i - 50;
      xpForLevel = Math.floor(1912 * Math.pow(1.35, 15) * Math.pow(1.4, 25) * Math.pow(1.25, baseLevel));
    }
    xpForPreviousLevels += xpForLevel;
  }
  
  const xpInCurrentLevel = level.totalXp - xpForPreviousLevels;
  const progress = level.xpForNextLevel > 0 
    ? Math.min((xpInCurrentLevel / level.xpForNextLevel) * 100, 100)
    : 100;
  
  const levelTitle = getLevelTitle(level.level);

  return (
    <Card className="h-full flex flex-col bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 dark:from-yellow-950/20 dark:via-orange-950/20 dark:to-pink-950/20 border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-shadow min-h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-yellow-900 dark:text-yellow-100">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/50">
              <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
            </div>
            <span className="text-lg font-bold">Level {level.level}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm font-semibold ${levelTitle.color}`}>
            {levelTitle.icon}
            <span>{levelTitle.title}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-100/50 dark:bg-yellow-900/30">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">XP</span>
          </div>
          <span className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{level.totalXp.toLocaleString()}</span>
        </div>
        
        {level.xpForNextLevel > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                {xpInCurrentLevel.toLocaleString()} / {level.xpForNextLevel.toLocaleString()} XP
              </span>
              <span className="text-yellow-800 dark:text-yellow-200 font-semibold">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-3 bg-yellow-100 dark:bg-yellow-900/50" />
            <p className="text-xs text-yellow-700 dark:text-yellow-300 text-center font-medium">
              {Math.max(0, level.xpForNextLevel - xpInCurrentLevel).toLocaleString()} XP bis Level {level.level + 1}
            </p>
          </div>
        )}
        
        {level.xpForNextLevel === 0 && (
          <div className="text-center py-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
            <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
              🏆 Maximales Level erreicht!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

