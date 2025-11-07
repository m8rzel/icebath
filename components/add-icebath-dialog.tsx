"use client";

import { useState } from "react";
import { format } from "date-fns";
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
import { Icebath } from "@/types/icebath";
import { Plus } from "lucide-react";

interface AddIcebathDialogProps {
  onAdd: (icebath: Omit<Icebath, "id">) => void;
}

export function AddIcebathDialog({ onAdd }: AddIcebathDialogProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [temperature, setTemperature] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const temp = parseFloat(temperature);
    const dur = parseInt(duration);

    if (isNaN(temp) || isNaN(dur) || temp <= 0 || dur <= 0) {
      return;
    }

    onAdd({
      date: date.toISOString(),
      temperature: temp,
      duration: dur,
      notes: notes.trim() || undefined,
    });

    // Reset form
    setDate(new Date());
    setTemperature("");
    setDuration("");
    setNotes("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Eisbad hinzufügen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Neues Eisbad hinzufügen</DialogTitle>
          <DialogDescription>
            Trage die Details deines Eisbads ein.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Datum</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && setDate(d)}
              className="rounded-md border"
            />
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
            <Label htmlFor="duration">Dauer (Sekunden)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="z.B. 180"
              required
            />
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
          <div className="flex justify-end gap-2">
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

