"use client";

import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale/de";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icebath } from "@/types/icebath";
import { formatDuration } from "@/lib/stats";
import { Trash2, Pencil } from "lucide-react";
import { EditIcebathDialog } from "@/components/edit-icebath-dialog";

interface IcebathListProps {
  icebaths: Icebath[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, icebath: Omit<Icebath, "id">) => Promise<void>;
}

export function IcebathList({ icebaths, onDelete, onUpdate }: IcebathListProps) {
  const [editingIcebath, setEditingIcebath] = useState<Icebath | null>(null);

  if (icebaths.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Noch keine Eisbäder erfasst. Füge deinen ersten hinzu!
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Deine Eisbäder</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum & Uhrzeit</TableHead>
                <TableHead>Temperatur</TableHead>
                <TableHead>Dauer</TableHead>
                <TableHead>Notizen</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {icebaths.map((icebath) => (
                <TableRow key={icebath.id}>
                  <TableCell>
                    {format(new Date(icebath.date), "dd.MM.yyyy HH:mm", {
                      locale: de,
                    })}
                  </TableCell>
                  <TableCell>{icebath.temperature}°C</TableCell>
                  <TableCell>{formatDuration(icebath.duration)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {icebath.notes || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingIcebath(icebath)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(icebath.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editingIcebath && (
        <EditIcebathDialog
          icebath={editingIcebath}
          open={!!editingIcebath}
          onOpenChange={(open) => !open && setEditingIcebath(null)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
}

