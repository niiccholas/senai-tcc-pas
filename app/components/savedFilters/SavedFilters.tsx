"use client";

import React, { useState } from 'react';
import { useSearchHistory, SavedFilter } from '../../context/SearchHistoryContext';
import { useFiltros } from '../../context/FiltroContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './SavedFilters.module.css';

interface SavedFiltersProps {
  onFilterLoad?: () => void;
}

export default function SavedFilters({ onFilterLoad }: SavedFiltersProps) {
  const { savedFilters, saveFilter, deleteFilter, toggleFilterFavorite, updateFilterName } = useSearchHistory();
  const { selectedFilters, setFilter } = useFiltros();
  const { isDark } = useTheme();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [editingFilter, setEditingFilter] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const hasActiveFilters = () => {
    return selectedFilters.especialidade !== null || 
           selectedFilters.categoria !== null || 
           selectedFilters.disponibilidade !== null || 
           selectedFilters.unidadeProxima !== null ||
           selectedFilters.distanciaRaio !== 10;
  };

  const handleSaveFilter = () => {
    if (!filterName.trim()) return;
    
    saveFilter(filterName.trim(), selectedFilters);
    setFilterName('');
    setShowSaveDialog(false);
  };

  const handleLoadFilter = (filter: SavedFilter) => {
    // Aplicar todos os filtros
    setFilter('especialidade', filter.filters.especialidade);
    setFilter('categoria', filter.filters.categoria);
    setFilter('disponibilidade', filter.filters.disponibilidade);
    setFilter('distanciaRaio', filter.filters.distanciaRaio);
    setFilter('unidadeProxima', filter.filters.unidadeProxima);
    
    onFilterLoad?.();
  };

  const handleEditName = (filterId: string, currentName: string) => {
    setEditingFilter(filterId);
    setEditName(currentName);
  };

  const handleSaveEdit = (filterId: string) => {
    if (editName.trim()) {
      updateFilterName(filterId, editName.trim());
    }
    setEditingFilter(null);
    setEditName('');
  };

  const getFilterDescription = (filter: SavedFilter) => {
    const parts = [];
    
    if (filter.filters.especialidade) parts.push('Especialidade');
    if (filter.filters.categoria) parts.push('Categoria');
    if (filter.filters.disponibilidade !== null) parts.push('24h');
    if (filter.filters.unidadeProxima) parts.push(`${filter.filters.distanciaRaio}km`);
    
    return parts.length > 0 ? parts.join(' • ') : 'Filtros básicos';
  };

  // Ordenar filtros: favoritos primeiro, depois por data
  const sortedFilters = [...savedFilters].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return b.timestamp - a.timestamp;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Filtros Salvos</h3>
        {hasActiveFilters() && (
          <button 
            className={styles.saveButton}
            onClick={() => setShowSaveDialog(true)}
            title="Salvar filtros atuais"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17,21 17,13 7,13 7,21"/>
              <polyline points="7,3 7,8 15,8"/>
            </svg>
            Salvar
          </button>
        )}
      </div>

      {savedFilters.length === 0 ? (
        <div className={styles.emptyState}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22,4 12,14.01 9,11.01"/>
          </svg>
          <p>Nenhum filtro salvo ainda</p>
          <span>Configure seus filtros e clique em "Salvar" para salvá-los</span>
        </div>
      ) : (
        <div className={styles.filtersList}>
          {sortedFilters.map((filter) => (
            <div key={filter.id} className={styles.filterItem}>
              <div className={styles.filterContent}>
                <div className={styles.filterHeader}>
                  {editingFilter === filter.id ? (
                    <div className={styles.editInput}>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(filter.id);
                          if (e.key === 'Escape') setEditingFilter(null);
                        }}
                        autoFocus
                      />
                      <button onClick={() => handleSaveEdit(filter.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20,6 9,17 4,12"/>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className={styles.filterName}>
                        {filter.isFavorite && (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                          </svg>
                        )}
                        <span>{filter.name}</span>
                      </div>
                      <div className={styles.filterActions}>
                        <button 
                          onClick={() => toggleFilterFavorite(filter.id)}
                          className={`${styles.actionButton} ${filter.isFavorite ? styles.favorited : ''}`}
                          title={filter.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={filter.isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleEditName(filter.id, filter.name)}
                          className={styles.actionButton}
                          title="Editar nome"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button 
                          onClick={() => deleteFilter(filter.id)}
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          title="Excluir filtro"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"/>
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <div className={styles.filterDescription}>
                  {getFilterDescription(filter)}
                </div>
                <div className={styles.filterDate}>
                  Salvo em {new Date(filter.timestamp).toLocaleDateString()}
                </div>
              </div>
              <button 
                className={styles.loadButton}
                onClick={() => handleLoadFilter(filter)}
                title="Aplicar este filtro"
              >
                Aplicar
              </button>
            </div>
          ))}
        </div>
      )}

      {showSaveDialog && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h4>Salvar Filtros</h4>
            <p>Dê um nome para este conjunto de filtros:</p>
            <input
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Ex: Cardiologia próxima"
              maxLength={50}
              autoFocus
            />
            <div className={styles.modalActions}>
              <button 
                onClick={() => setShowSaveDialog(false)}
                className={styles.cancelButton}
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveFilter}
                className={styles.confirmButton}
                disabled={!filterName.trim()}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
