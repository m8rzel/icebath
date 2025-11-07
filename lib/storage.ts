import { Icebath } from "@/types/icebath";

const STORAGE_KEY = "icebath-sessions";

export function getIcebaths(): Icebath[] {
  if (typeof window === "undefined") return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveIcebath(icebath: Icebath): void {
  if (typeof window === "undefined") return;
  
  const icebaths = getIcebaths();
  icebaths.push(icebath);
  icebaths.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(icebaths));
}

export function deleteIcebath(id: string): void {
  if (typeof window === "undefined") return;
  
  const icebaths = getIcebaths();
  const filtered = icebaths.filter((ib) => ib.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function clearAllIcebaths(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

