"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Achievement } from "@/types/achievements";
import { Trophy, Lock } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale/de";

interface AchievementsPanelProps {
  achievements: Achievement[];
}

export function AchievementsPanel({ achievements }: AchievementsPanelProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  
  // Sortiere erreichte Achievements nach Datum (neueste zuerst)
  const unlocked = achievements
    .filter(a => a.unlockedAt)
    .sort((a, b) => {
      if (!a.unlockedAt || !b.unlockedAt) return 0;
      return new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime();
    });
  
  const locked = achievements.filter(a => !a.unlockedAt);

  return (
    <>
      <Card className="flex flex-col max-h-[900px]">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievements ({unlocked.length}/{achievements.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 flex flex-col flex-1 min-h-0 overflow-hidden">
          {unlocked.length > 0 && (
            <div className="flex-shrink-0">
              <h3 className="text-sm font-semibold mb-3 text-green-600 dark:text-green-400">
                Freigeschaltet ({unlocked.length})
              </h3>
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-3 pb-4">
                  {unlocked.map((ach) => (
                    <button
                      key={ach.id}
                      onClick={() => setSelectedAchievement(ach)}
                      className="flex-shrink-0 p-4 border rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800 hover:shadow-lg hover:scale-105 transition-all cursor-pointer min-w-[140px] max-w-[140px]"
                    >
                      <div className="text-3xl mb-2 text-center">{ach.icon}</div>
                      <div className="text-sm font-semibold text-center mb-1 text-green-900 dark:text-green-100 line-clamp-2">
                        {ach.name}
                      </div>
                      {ach.unlockedAt && (
                        <div className="text-xs text-center text-green-700 dark:text-green-300 mt-1">
                          {format(new Date(ach.unlockedAt), "dd.MM.yyyy", { locale: de })}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          )}
          
          {locked.length > 0 && (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 flex-shrink-0">
                <Lock className="h-4 w-4" />
                In Arbeit ({locked.length})
              </h3>
              <ScrollArea className="flex-1 min-h-0">
                <div className="space-y-2 pr-4">
                  {locked.map((ach) => {
                    const progress = Math.min((ach.progress / ach.target) * 100, 100);
                    return (
                      <div key={ach.id} className="p-3 border rounded-lg opacity-75 hover:opacity-100 transition-opacity">
                        <div className="flex items-center justify-between mb-2 gap-2">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-xl flex-shrink-0">{ach.icon}</span>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold break-words">{ach.name}</div>
                              <div className="text-xs text-muted-foreground break-words">{ach.description}</div>
                            </div>
                          </div>
                          <Badge variant="outline" className="flex-shrink-0">
                            {ach.progress}/{ach.target}
                          </Badge>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    );
                  })}
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievement Detail Dialog */}
      <Dialog open={!!selectedAchievement} onOpenChange={() => setSelectedAchievement(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="text-4xl">{selectedAchievement?.icon}</span>
              <span>{selectedAchievement?.name}</span>
            </DialogTitle>
            <DialogDescription>{selectedAchievement?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {selectedAchievement?.unlockedAt && (
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
                  Freigeschaltet am
                </div>
                <div className="text-lg text-green-700 dark:text-green-300">
                  {format(new Date(selectedAchievement.unlockedAt), "EEEE, dd. MMMM yyyy 'um' HH:mm", { locale: de })}
                </div>
              </div>
            )}
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm font-semibold mb-2">Kategorie</div>
              <Badge variant="secondary" className="capitalize">
                {selectedAchievement?.category}
              </Badge>
            </div>
            {selectedAchievement && selectedAchievement.progress < selectedAchievement.target && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm font-semibold mb-2">Fortschritt</div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedAchievement.progress} / {selectedAchievement.target}
                  </span>
                  <span className="text-sm font-semibold">
                    {Math.round((selectedAchievement.progress / selectedAchievement.target) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={(selectedAchievement.progress / selectedAchievement.target) * 100} 
                  className="h-2" 
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

