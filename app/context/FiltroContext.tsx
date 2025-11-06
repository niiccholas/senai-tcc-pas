"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface SelectedFiltersState {
  especialidade: number | null;
  categoria: string | null;
  disponibilidade: number | null; // 0 ou 1 como retorna da API
  distanciaRaio: number; // Raio em km (5, 10, 15, 20, 25)
  unidadeProxima: boolean | null; // Se deve buscar unidade mais próxima
}

export interface UserLocation {
  lat: number;
  lng: number;
}

interface FiltrosContextType {
  selectedFilters: SelectedFiltersState;
  setFilter: <K extends keyof SelectedFiltersState>(tipo: K, valor: SelectedFiltersState[K]) => void;
  userLocation: UserLocation | null;
  setUserLocation: (location: UserLocation | null) => void;
}

const FiltrosContext = createContext<FiltrosContextType | undefined>(undefined);

export function FiltrosProvider({ children }: { children: ReactNode }) {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFiltersState>({
    especialidade: null,
    categoria: null,
    disponibilidade: null,
    distanciaRaio: 10, // Valor padrão de 10km
    unidadeProxima: null,
  });

  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  function setFilter<K extends keyof SelectedFiltersState>(tipo: K, valor: SelectedFiltersState[K]) {
    console.log('=== SETFILTER DEBUG ===');
    console.log('Tipo:', tipo);
    console.log('Valor:', valor);
    console.log('Estado anterior:', selectedFilters);
    
    setSelectedFilters(prev => {
      const newState = { ...prev, [tipo]: valor };
      console.log('Novo estado:', newState);
      return newState;
    });
  }

  return (
    <FiltrosContext.Provider value={{ selectedFilters, setFilter, userLocation, setUserLocation }}>
      {children}
    </FiltrosContext.Provider>
  )
}

export function useFiltros() {
  const context = useContext(FiltrosContext);
  if (!context) throw new Error("useFiltros deve ser usado dentro de FiltrosProvider");
  return context;
}