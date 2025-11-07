"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IcebathStats } from "@/types/icebath";
import { formatDuration } from "@/lib/stats";
import { Thermometer, Clock, Trophy, Flame } from "lucide-react";

interface StatsCardsProps {
  stats: IcebathStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 h-full w-full">
      <Card className="h-full flex flex-col bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-amber-900 dark:text-amber-100">Gesamt</CardTitle>
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50">
            <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
          <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">{stats.total}</div>
          <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">Eisbäder insgesamt</p>
        </CardContent>
      </Card>
      
      <Card className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100">Ø Temperatur</CardTitle>
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
            <Thermometer className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
          <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.averageTemperature}°C</div>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
            Kälteste: <span className="font-semibold">{stats.coldestTemperature}°C</span>
          </p>
        </CardContent>
      </Card>
      
      <Card className="h-full flex flex-col bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-purple-900 dark:text-purple-100">Ø Dauer</CardTitle>
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
            <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
          <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
            {formatDuration(stats.averageDuration)}
          </div>
          <p className="text-xs text-purple-700 dark:text-purple-300 mt-2">
            Längste: <span className="font-semibold">{formatDuration(stats.longestDuration)}</span>
          </p>
        </CardContent>
      </Card>
      
      <Card className="h-full flex flex-col bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200 dark:border-red-800 hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-red-900 dark:text-red-100">Streak</CardTitle>
          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50">
            <Flame className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
          <div className="text-3xl font-bold text-red-900 dark:text-red-100">{stats.currentStreak}</div>
          <p className="text-xs text-red-700 dark:text-red-300 mt-2">
            Rekord: <span className="font-semibold">{stats.longestStreak} Tage</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

