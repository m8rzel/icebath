"use client";

import { useIcebaths } from "@/hooks/use-icebaths";
import { useAuth } from "@/hooks/use-auth";
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
import { ActionsMenu } from "@/components/actions-menu";
import { LoginDialog } from "@/components/login-dialog";
import { RegisterDialog } from "@/components/register-dialog";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";

export default function Home() {
  const { user, isLoading: authLoading, login, register, logout } = useAuth();
  const { icebaths, isLoading, error, addIcebath, removeIcebath } = useIcebaths();
  const stats = calculateStats(icebaths);
  const achievements = calculateAchievements(icebaths);
  const xp = calculateXP(icebaths, achievements);
  const level = calculateLevel(xp);
  const weeklyChallenges = getWeeklyChallenges(icebaths);
  const monthlyChallenges = getMonthlyChallenges(icebaths);
  const allChallenges = [...weeklyChallenges, ...monthlyChallenges];

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Lade...</div>
      </div>
    );
  }

  // Show auth screen if not logged in
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Icebath Tracker</h1>
            <p className="text-muted-foreground">
              Melde dich an oder registriere dich, um deine Eisbäder zu tracken
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <LoginDialog onLogin={login} />
            <RegisterDialog onRegister={register} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const isLocalhostError = error.includes("ECONNREFUSED") && error.includes("27017");
    
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md w-full p-6 border border-destructive rounded-lg bg-destructive/10">
          <h2 className="text-xl font-semibold text-destructive mb-2">Fehler beim Laden</h2>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <div className="text-xs text-muted-foreground space-y-2">
            {isLocalhostError ? (
              <>
                <p><strong>MongoDB läuft nicht lokal!</strong></p>
                <p className="font-semibold mt-2">Option 1: MongoDB Atlas (empfohlen)</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Erstelle kostenlosen Account auf <a href="https://www.mongodb.com/cloud/atlas" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">MongoDB Atlas</a></li>
                  <li>Erstelle einen Cluster</li>
                  <li>Kopiere den Connection String</li>
                  <li>Füge ihn in .env.local ein: <code className="bg-muted px-1 rounded">MONGODB_URI=mongodb+srv://...</code></li>
                </ul>
                <p className="font-semibold mt-2">Option 2: Lokale MongoDB starten</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Installiere MongoDB lokal</li>
                  <li>Starte den MongoDB Service</li>
                </ul>
              </>
            ) : (
              <>
                <p><strong>Mögliche Lösungen:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Prüfe ob die .env.local Datei existiert</li>
                  <li>Stelle sicher, dass MONGODB_URI gesetzt ist</li>
                  <li>Prüfe die MongoDB-Verbindung</li>
                  <li>Starte den Server neu nach Änderungen an .env.local</li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Icebath Tracker</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{user.username}</span>
                </div>
              </div>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                Tracke deine Eisbäder und verbessere deine Performance
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <AddIcebathDialog onAdd={addIcebath} />
              <ActionsMenu stats={stats} icebaths={icebaths} onLogout={logout} />
            </div>
          </div>
        </div>

        {/* Level & Stats Row */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-4 items-stretch">
          <LevelCard level={level} />
          <div className="md:col-span-3 flex">
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
