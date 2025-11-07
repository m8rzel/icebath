"use client";

import { useIcebaths } from "@/hooks/use-icebaths";
import { calculateStats } from "@/lib/stats";
import { calculateAchievements, calculateXP, calculateLevel } from "@/lib/achievements";
import { getWeeklyChallenges, getMonthlyChallenges } from "@/lib/challenges";
import { AddIcebathDialog } from "@/components/add-icebath-dialog";
import { StatsCards } from "@/components/stats-cards";
import { IcebathList } from "@/components/icebath-list";
import { TemperatureChart } from "@/components/temperature-chart";
import { DurationChart } from "@/components/duration-chart";
import { AchievementsPanel } from "@/components/achievements-panel";
import { LevelCard } from "@/components/level-card";
import { ChallengesPanel } from "@/components/challenges-panel";
import { ExportDialog } from "@/components/export-dialog";
import { ShareButton } from "@/components/share-button";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const { icebaths, isLoading, addIcebath, removeIcebath } = useIcebaths();
  const stats = calculateStats(icebaths);
  const achievements = calculateAchievements(icebaths);
  const xp = calculateXP(icebaths, achievements);
  const level = calculateLevel(xp);
  const weeklyChallenges = getWeeklyChallenges(icebaths);
  const monthlyChallenges = getMonthlyChallenges(icebaths);
  const allChallenges = [...weeklyChallenges, ...monthlyChallenges];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Lade...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Icebath Tracker</h1>
            <p className="text-muted-foreground mt-2">
              Tracke deine Eisbäder und verbessere deine Performance
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <ShareButton stats={stats} />
            <ExportDialog icebaths={icebaths} />
            <AddIcebathDialog onAdd={addIcebath} />
          </div>
        </div>

        {/* Level & Stats Row */}
        <div className="grid gap-4 md:grid-cols-4 md:grid-rows-1">
          <LevelCard level={level} />
          <div className="md:col-span-3 h-full">
            <StatsCards stats={stats} />
          </div>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <TemperatureChart icebaths={icebaths} />
          <DurationChart icebaths={icebaths} />
        </div>

        {/* Gamification Section */}
        <div className="grid gap-4 md:grid-cols-2">
          <ChallengesPanel challenges={allChallenges} />
          <AchievementsPanel achievements={achievements} />
        </div>

        <Separator />

        {/* Icebath List */}
        <IcebathList icebaths={icebaths} onDelete={removeIcebath} />
      </div>
    </div>
  );
}
