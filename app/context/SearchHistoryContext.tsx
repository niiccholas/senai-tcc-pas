"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  type: 'unit' | 'general'; // tipo de busca
  unitId?: number; // se foi busca por unidade específica
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: {
    especialidade: number | null;
    categoria: string | null;
    disponibilidade: number | null;
    distanciaRaio: number;
    unidadeProxima: boolean | null;
  };
  timestamp: number;
  isFavorite: boolean;
}

interface SearchHistoryContextType {
  // Histórico de buscas
  searchHistory: SearchHistoryItem[];
  addToHistory: (query: string, type: 'unit' | 'general', unitId?: number) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
  
  // Filtros salvos
  savedFilters: SavedFilter[];
  saveFilter: (name: string, filters: any) => void;
  loadFilter: (id: string) => SavedFilter | null;
  deleteFilter: (id: string) => void;
  toggleFilterFavorite: (id: string) => void;
  updateFilterName: (id: string, newName: string) => void;
}

const SearchHistoryContext = createContext<SearchHistoryContextType | undefined>(undefined);

const MAX_HISTORY_ITEMS = 20;
const MAX_SAVED_FILTERS = 10;

export function SearchHistoryProvider({ children }: { children: ReactNode }) {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('pas-search-history');
      const savedFiltersData = localStorage.getItem('pas-saved-filters');
      
      if (savedHistory) {
        const historyData = JSON.parse(savedHistory);
        setSearchHistory(historyData);
      }
      
      if (savedFiltersData) {
        const filtersData = JSON.parse(savedFiltersData);
        setSavedFilters(filtersData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
    }
  }, []);

  // Salvar histórico no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('pas-search-history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Salvar filtros no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('pas-saved-filters', JSON.stringify(savedFilters));
  }, [savedFilters]);

  const addToHistory = (query: string, type: 'unit' | 'general', unitId?: number) => {
    if (!query.trim()) return;

    const newItem: SearchHistoryItem = {
      id: Date.now().toString(),
      query: query.trim(),
      timestamp: Date.now(),
      type,
      unitId
    };

    setSearchHistory(prev => {
      // Remove item duplicado se existir
      const filtered = prev.filter(item => 
        !(item.query.toLowerCase() === query.toLowerCase().trim() && item.type === type)
      );
      
      // Adiciona novo item no início e limita o tamanho
      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      return updated;
    });
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const removeFromHistory = (id: string) => {
    setSearchHistory(prev => prev.filter(item => item.id !== id));
  };

  const saveFilter = (name: string, filters: any) => {
    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: name.trim(),
      filters: { ...filters },
      timestamp: Date.now(),
      isFavorite: false
    };

    setSavedFilters(prev => {
      // Remove filtro com mesmo nome se existir
      const filtered = prev.filter(filter => 
        filter.name.toLowerCase() !== name.toLowerCase().trim()
      );
      
      // Adiciona novo filtro no início e limita o tamanho
      const updated = [newFilter, ...filtered].slice(0, MAX_SAVED_FILTERS);
      return updated;
    });
  };

  const loadFilter = (id: string): SavedFilter | null => {
    return savedFilters.find(filter => filter.id === id) || null;
  };

  const deleteFilter = (id: string) => {
    setSavedFilters(prev => prev.filter(filter => filter.id !== id));
  };

  const toggleFilterFavorite = (id: string) => {
    setSavedFilters(prev => 
      prev.map(filter => 
        filter.id === id 
          ? { ...filter, isFavorite: !filter.isFavorite }
          : filter
      )
    );
  };

  const updateFilterName = (id: string, newName: string) => {
    if (!newName.trim()) return;
    
    setSavedFilters(prev => 
      prev.map(filter => 
        filter.id === id 
          ? { ...filter, name: newName.trim() }
          : filter
      )
    );
  };

  return (
    <SearchHistoryContext.Provider value={{
      searchHistory,
      addToHistory,
      clearHistory,
      removeFromHistory,
      savedFilters,
      saveFilter,
      loadFilter,
      deleteFilter,
      toggleFilterFavorite,
      updateFilterName
    }}>
      {children}
    </SearchHistoryContext.Provider>
  );
}

export function useSearchHistory() {
  const context = useContext(SearchHistoryContext);
  if (!context) {
    throw new Error("useSearchHistory deve ser usado dentro de SearchHistoryProvider");
  }
  return context;
}
