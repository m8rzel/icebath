import { Icebath } from "@/types/icebath";
import { format } from "date-fns";

export function exportToCSV(icebaths: Icebath[]): string {
  const headers = ["Datum", "Uhrzeit", "Temperatur (°C)", "Dauer (Sekunden)", "Dauer (MM:SS)", "Notizen"];
  const rows = icebaths.map(ib => {
    const date = new Date(ib.date);
    const durationMinutes = Math.floor(ib.duration / 60);
    const durationSeconds = ib.duration % 60;
    const durationFormatted = `${durationMinutes.toString().padStart(2, "0")}:${durationSeconds.toString().padStart(2, "0")}`;
    
    return [
      format(date, "dd.MM.yyyy"),
      format(date, "HH:mm"),
      ib.temperature.toString(),
      ib.duration.toString(),
      durationFormatted,
      ib.notes || "",
    ];
  });
  
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(","))
  ].join("\n");
  
  return csvContent;
}

export function exportToJSON(icebaths: Icebath[]): string {
  return JSON.stringify(icebaths, null, 2);
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

