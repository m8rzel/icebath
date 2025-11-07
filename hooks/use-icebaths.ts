"use client";

import { useState, useEffect, useCallback } from "react";
import { Icebath } from "@/types/icebath";

export function useIcebaths() {
  const [icebaths, setIcebaths] = useState<Icebath[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIcebaths = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/icebaths");
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setIcebaths(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Error fetching icebaths:", err);
      
      // Fallback: Zeige hilfreiche Fehlermeldung
      if (errorMessage.includes("MONGODB_URI") || errorMessage.includes("connection")) {
        setError("MongoDB-Verbindung fehlgeschlagen. Bitte prüfe deine .env.local Datei.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIcebaths();
  }, [fetchIcebaths]);

  const addIcebath = async (icebath: Omit<Icebath, "id">) => {
    try {
      setError(null);
      const response = await fetch("/api/icebaths", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(icebath),
      });

      if (!response.ok) {
        throw new Error("Failed to create icebath");
      }

      const newIcebath = await response.json();
      setIcebaths((prev) => [newIcebath, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error creating icebath:", err);
      throw err;
    }
  };

  const removeIcebath = async (id: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/icebaths?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete icebath");
      }

      setIcebaths((prev) => prev.filter((ib) => ib.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error deleting icebath:", err);
      throw err;
    }
  };

  return {
    icebaths,
    isLoading,
    error,
    addIcebath,
    removeIcebath,
    refetch: fetchIcebaths,
  };
}

