"use client";

import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale/de";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Icebath } from "@/types/icebath";
import { Plus, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddIcebathDialogProps {
  onAdd: (icebath: Omit<Icebath, "id">) => Promise<void>;
}

export function AddIcebathDialog({ onAdd }: AddIcebathDialogProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  });
  const [temperature, setTemperature] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const temp = parseFloat(temperature);
    const mins = parseInt(minutes) || 0;
    const secs = parseInt(seconds) || 0;
    const totalDuration = mins * 60 + secs;

    if (isNaN(temp) || temp <= 0) {
      return;
    }

    if (totalDuration <= 0) {
      return;
    }

    // Kombiniere Datum und Uhrzeit in mitteleuropäischer Zeit
    const [hours, minutesFromTime] = time.split(":").map(Number);
    
    // Erstelle ein Datum mit der lokalen Zeit (MEZ/MESZ)
    // Wir nehmen an, dass die Eingabe bereits in MEZ/MESZ ist
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    // Erstelle ein Date-Objekt mit der lokalen Zeit
    // JavaScript Date verwendet die lokale Zeitzone des Browsers
    const combinedDate = new Date(year, month, day, hours || 0, minutesFromTime || 0, 0, 0);
    
    // Konvertiere zu UTC für die Speicherung, aber behalte die MEZ/MESZ Zeit bei
    // Wir speichern die Zeit als UTC, aber mit der Annahme, dass sie MEZ/MESZ war
    // Das bedeutet: MEZ = UTC+1, MESZ = UTC+2
    // Für die Speicherung verwenden wir die lokale Zeit und lassen MongoDB sie als UTC speichern

    try {
      await onAdd({
        date: combinedDate.toISOString(),
        temperature: temp,
        duration: totalDuration,
        notes: notes.trim() || undefined,
      });

      // Reset form
      const now = new Date();
      setDate(now);
      const hoursStr = now.getHours().toString().padStart(2, "0");
      const minutesStr = now.getMinutes().toString().padStart(2, "0");
      setTime(`${hoursStr}:${minutesStr}`);
      setTemperature("");
      setMinutes("");
      setSeconds("");
      setNotes("");
      setOpen(false);
    } catch (error) {
      // Error wird vom Hook gehandhabt
      console.error("Failed to add icebath:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Eisbad hinzufügen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Neues Eisbad hinzufügen</DialogTitle>
          <DialogDescription>
            Trage die Details deines Eisbads ein.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Datum</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: de }) : "Datum wählen"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Uhrzeit (MEZ/MESZ)</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Mitteleuropäische Zeit (MEZ/MESZ)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperatur (°C)</Label>
            <Input
              id="temperature"
              type="number"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="z.B. 5.0"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Dauer</Label>
            <div className="flex gap-2 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="minutes" className="text-xs text-muted-foreground">Minuten</Label>
                <Input
                  id="minutes"
                  type="number"
                  min="0"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  placeholder="0"
                  className="text-center text-lg"
                />
              </div>
              <div className="pb-2 text-muted-foreground">:</div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="seconds" className="text-xs text-muted-foreground">Sekunden</Label>
                <Input
                  id="seconds"
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || (parseInt(val) >= 0 && parseInt(val) <= 59)) {
                      setSeconds(val);
                    }
                  }}
                  placeholder="0"
                  className="text-center text-lg"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Mindestens 1 Sekunde erforderlich
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notizen (optional)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Wie war es?"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
            <Button type="submit">Hinzufügen</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

