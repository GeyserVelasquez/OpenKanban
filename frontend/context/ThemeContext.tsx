"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeType } from "@/types/kanban";
import api from "@/lib/axios";

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>("light");
  const [mounted, setMounted] = useState(false);

  // Load theme from backend on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        await api.get("http://localhost:8000/sanctum/csrf-cookie");
        const response = await api.get("http://localhost:8000/api/user/preferences");
        const savedTheme = response.data.theme as ThemeType;
        if (savedTheme && ["light", "dark", "playful"].includes(savedTheme)) {
          setThemeState(savedTheme);
        }
      } catch (error) {
        console.error("Error cargando tema desde backend:", error);
        // Fallback to light theme if API fails
      }
      setMounted(true);
    };
    loadTheme();
  }, []);

  // Apply theme to DOM and save to backend
  useEffect(() => {
    if (!mounted) return;

    const saveTheme = async () => {
      try {
        await api.get("http://localhost:8000/sanctum/csrf-cookie");
        await api.put("http://localhost:8000/api/user/preferences", {
          theme: theme,
        });
      } catch (error) {
        console.error("Error guardando tema en backend:", error);
      }
    };

    const root = document.documentElement;
    root.classList.remove("light", "dark", "playful");
    root.classList.add(theme);

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    saveTheme();
  }, [theme, mounted]);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
