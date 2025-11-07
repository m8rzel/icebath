"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IcebathStats } from "@/types/icebath";
import { Icebath } from "@/types/icebath";
import { exportToCSV, exportToJSON, downloadFile } from "@/lib/export";
import { formatDuration } from "@/lib/stats";
import { MoreVertical, Share2, Download, LogOut, FileText, FileJson, Check } from "lucide-react";

interface ActionsMenuProps {
  stats: IcebathStats;
  icebaths: Icebath[];
  onLogout: () => void;
}

export function ActionsMenu({ stats, icebaths, onLogout }: ActionsMenuProps) {
  const [exportOpen, setExportOpen] = useState(false);
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

  const handleExportCSV = () => {
    const csv = exportToCSV(icebaths);
    downloadFile(csv, `icebath-export-${new Date().toISOString().split("T")[0]}.csv`, "text/csv");
    setExportOpen(false);
  };

  const handleExportJSON = () => {
    const json = exportToJSON(icebaths);
    downloadFile(json, `icebath-export-${new Date().toISOString().split("T")[0]}.json`, "application/json");
    setExportOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Mehr Optionen</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleShare}>
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
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setExportOpen(true)}>
            <Download className="mr-2 h-4 w-4" />
            Exportieren
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Abmelden
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Daten exportieren</DialogTitle>
            <DialogDescription>
              Wähle ein Format zum Exportieren deiner Eisbad-Daten.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button
              onClick={handleExportCSV}
              className="w-full justify-start"
              variant="outline"
            >
              <FileText className="mr-2 h-4 w-4" />
              Als CSV exportieren
              <span className="ml-auto text-xs text-muted-foreground">
                Excel-kompatibel
              </span>
            </Button>
            <Button
              onClick={handleExportJSON}
              className="w-full justify-start"
              variant="outline"
            >
              <FileJson className="mr-2 h-4 w-4" />
              Als JSON exportieren
              <span className="ml-auto text-xs text-muted-foreground">
                Für Entwickler
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

