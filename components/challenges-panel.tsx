"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Challenge } from "@/types/achievements";
import { Target, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale/de";

interface ChallengesPanelProps {
  challenges: Challenge[];
}

export function ChallengesPanel({ challenges }: ChallengesPanelProps) {
  const active = challenges.filter(c => !c.completed);
  const completed = challenges.filter(c => c.completed);

  return (
    <Card className="flex flex-col max-h-[900px] w-full min-w-0">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Challenges
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto flex-1 min-h-0 w-full min-w-0">
        {active.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2">Aktive Challenges</h3>
            <div className="space-y-3">
              {active.map((challenge) => {
                const progress = Math.min((challenge.current / challenge.target) * 100, 100);
                return (
                  <div key={challenge.id} className="p-4 border rounded-lg w-full min-w-0">
                    <div className="flex items-start justify-between mb-2 gap-2 min-w-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-semibold break-words">{challenge.name}</h4>
                          <Badge variant="secondary" className="flex-shrink-0">+{challenge.reward} XP</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground break-words">{challenge.description}</p>
                        {challenge.deadline && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Deadline: {format(new Date(challenge.deadline), "dd.MM.yyyy", { locale: de })}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{challenge.current} / {challenge.target}</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {completed.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              Abgeschlossen
            </h3>
            <div className="space-y-2">
              {completed.map((challenge) => (
                <div
                  key={challenge.id}
                  className="p-3 border rounded-lg bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 w-full min-w-0"
                >
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm break-words">{challenge.name}</div>
                      <div className="text-xs text-muted-foreground break-words">{challenge.description}</div>
                    </div>
                    <Badge variant="outline" className="bg-green-100 dark:bg-green-900 flex-shrink-0">
                      +{challenge.reward} XP
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {challenges.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Keine Challenges verfügbar
          </div>
        )}
      </CardContent>
    </Card>
  );
}

