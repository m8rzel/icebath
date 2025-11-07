"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IcebathStats } from "@/types/icebath";
import { Share2, Check } from "lucide-react";
import { formatDuration } from "@/lib/stats";

interface ShareButtonProps {
  stats: IcebathStats;
}

export function ShareButton({ stats }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = `❄️ Icebath Tracker Stats ❄️

🏆 Gesamt: ${stats.total} Eisbäder
🌡️ Ø Temperatur: ${stats.averageTemperature}°C
⏱️ Ø Dauer: ${formatDuration(stats.averageDuration)}
🔥 Aktueller Streak: ${stats.currentStreak} Tage
👑 Rekord-Streak: ${stats.longestStreak} Tage

#Icebath #ColdTherapy #WimHof`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Meine Icebath Stats",
          text: text,
        });
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button variant="outline" onClick={handleShare}>
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Kopiert!
        </>
      ) : (
        <>
          <Share2 className="mr-2 h-4 w-4" />
          Teilen
        </>
      )}
    </Button>
  );
}

