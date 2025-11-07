"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale/de";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Icebath } from "@/types/icebath";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditIcebathDialogProps {
  icebath: Icebath;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, icebath: Omit<Icebath, "id">) => Promise<void>;
}

export function EditIcebathDialog({ icebath, open, onOpenChange, onUpdate }: EditIcebathDialogProps) {
  const [date, setDate] = useState<Date>(new Date(icebath.date));
  const [time, setTime] = useState(() => {
    const icebathDate = new Date(icebath.date);
    const hours = icebathDate.getHours().toString().padStart(2, "0");
    const minutes = icebathDate.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  });
  const [temperature, setTemperature] = useState(icebath.temperature.toString());
  const [minutes, setMinutes] = useState(() => Math.floor(icebath.duration / 60).toString());
  const [seconds, setSeconds] = useState(() => (icebath.duration % 60).toString());
  const [notes, setNotes] = useState(icebath.notes || "");

  // Update form when icebath changes
  useEffect(() => {
    const icebathDate = new Date(icebath.date);
    setDate(icebathDate);
    const hours = icebathDate.getHours().toString().padStart(2, "0");
    const minutes = icebathDate.getMinutes().toString().padStart(2, "0");
    setTime(`${hours}:${minutes}`);
    setTemperature(icebath.temperature.toString());
    setMinutes(Math.floor(icebath.duration / 60).toString());
    setSeconds((icebath.duration % 60).toString());
    setNotes(icebath.notes || "");
  }, [icebath]);

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
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const combinedDate = new Date(year, month, day, hours || 0, minutesFromTime || 0, 0, 0);

    try {
      await onUpdate(icebath.id, {
        date: combinedDate.toISOString(),
        temperature: temp,
        duration: totalDuration,
        notes: notes.trim() || undefined,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update icebath:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Eisbad bearbeiten</DialogTitle>
          <DialogDescription>
            Bearbeite die Details deines Eisbads.
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
            <Label htmlFor="edit-time">Uhrzeit (MEZ/MESZ)</Label>
            <Input
              id="edit-time"
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
            <Label htmlFor="edit-temperature">Temperatur (°C)</Label>
            <Input
              id="edit-temperature"
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
                <Label htmlFor="edit-minutes" className="text-xs text-muted-foreground">Minuten</Label>
                <Input
                  id="edit-minutes"
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
                <Label htmlFor="edit-seconds" className="text-xs text-muted-foreground">Sekunden</Label>
                <Input
                  id="edit-seconds"
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
            <Label htmlFor="edit-notes">Notizen (optional)</Label>
            <Input
              id="edit-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Wie war es?"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit">Speichern</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

