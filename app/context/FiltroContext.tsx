"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FiltrosContextType {
  selectedFilters: number[];
  toggleFilter: (id: number) => void;
}

const FiltrosContext = createContext<FiltrosContextType | undefined>(undefined);

export function FiltrosProvider({ children }: { children: ReactNode }) {
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);

  function toggleFilter(id: number) {
    setSelectedFilters(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  }

  return (
    <FiltrosContext.Provider value={{ selectedFilters, toggleFilter }}>
      {children}
    </FiltrosContext.Provider>
  );
}

export function useFiltros() {
  const context = useContext(FiltrosContext);
  if (!context) throw new Error("useFiltros deve ser usado dentro de FiltrosProvider");
  return context;
}
