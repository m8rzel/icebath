"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UserLevel } from "@/types/achievements";
import { Star, Zap } from "lucide-react";

interface LevelCardProps {
  level: UserLevel;
}

export function LevelCard({ level }: LevelCardProps) {
  // Calculate XP needed for all previous levels
  let xpForPreviousLevels = 0;
  for (let i = 1; i < level.level; i++) {
    xpForPreviousLevels += Math.floor(100 * Math.pow(1.5, i - 1));
  }
  
  const xpInCurrentLevel = level.totalXp - xpForPreviousLevels;
  const progress = level.xpForNextLevel > 0 
    ? Math.min((xpInCurrentLevel / level.xpForNextLevel) * 100, 100)
    : 100;

  return (
    <Card className="h-full flex flex-col bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 dark:from-yellow-950/20 dark:via-orange-950/20 dark:to-pink-950/20 border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-yellow-900 dark:text-yellow-100">
          <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/50">
            <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
          </div>
          <span className="text-lg font-bold">Level {level.level}</span>
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

