"use client";

import { useState, useEffect } from "react";
import { Icebath } from "@/types/icebath";
import { getIcebaths, saveIcebath, deleteIcebath } from "@/lib/storage";

export function useIcebaths() {
  const [icebaths, setIcebaths] = useState<Icebath[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIcebaths(getIcebaths());
    setIsLoading(false);
  }, []);

  const addIcebath = (icebath: Omit<Icebath, "id">) => {
    const newIcebath: Icebath = {
      ...icebath,
      id: crypto.randomUUID(),
    };
    saveIcebath(newIcebath);
    setIcebaths(getIcebaths());
  };

  const removeIcebath = (id: string) => {
    deleteIcebath(id);
    setIcebaths(getIcebaths());
  };

  return {
    icebaths,
    isLoading,
    addIcebath,
    removeIcebath,
  };
}

