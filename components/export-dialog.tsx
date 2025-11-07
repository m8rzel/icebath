"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icebath } from "@/types/icebath";
import { exportToCSV, exportToJSON, downloadFile } from "@/lib/export";
import { Download, FileText, FileJson } from "lucide-react";

interface ExportDialogProps {
  icebaths: Icebath[];
}

export function ExportDialog({ icebaths }: ExportDialogProps) {
  const [open, setOpen] = useState(false);

  const handleExportCSV = () => {
    const csv = exportToCSV(icebaths);
    downloadFile(csv, `icebath-export-${new Date().toISOString().split("T")[0]}.csv`, "text/csv");
    setOpen(false);
  };

  const handleExportJSON = () => {
    const json = exportToJSON(icebaths);
    downloadFile(json, `icebath-export-${new Date().toISOString().split("T")[0]}.json`, "application/json");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportieren
        </Button>
      </DialogTrigger>
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
  );
}

