"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getUnidadesByNome } from "../../api/unidade";
import styles from './SearchBar.module.css';

interface Unidade {
  id: number;
  nome: string;
  local: {
    endereco: Array<{
      logradouro: string;
      bairro: string;
      cidade: string;
    }>;
  };
}

export default function SearchBar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Unidade[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleFilterClick = () => {
    if (window.location.pathname === "/filtro") {
      router.back(); 
    } else {
      router.push("/filtro");
    }
  };

  const searchUnidades = async (term: string) => {
    if (!term.trim() || term.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await getUnidadesByNome(term);
      const unidades = data.unidadesDeSaude || [];
      setResults(unidades.slice(0, 5)); 
      setShowDropdown(unidades.length > 0);
    } catch (error) {
      console.error('Erro na busca:', error);
      setResults([]);
      setShowDropdown(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleUnitSelect = (unidade: Unidade) => {
    setSearchTerm('');
    setShowDropdown(false);
    router.push(`/unidades?unitId=${unidade.id}`);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUnidades(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className={styles.searchContainer}>
      <div className={styles.searchbox}>
        <button 
          className={styles.filterbtn}
          type="button" 
          onClick={handleFilterClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
               viewBox="0 0 24 24" fill="none" stroke="#ffffff" 
               strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
               className="lucide lucide-chevron-down">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>

        <input 
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Procure por uma unidade de saúde..." 
          onFocus={() => searchTerm.length >= 2 && results.length > 0 && setShowDropdown(true)}
        />

        <button
          className={styles.filterbtn}
          type="button"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                 viewBox="0 0 24 24" fill="none" stroke="#ffffff" 
                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                 className="animate-spin">
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                 viewBox="0 0 24 24" fill="none" stroke="#ffffff" 
                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                 className="lucide lucide-search">
              <path d="m21 21-4.34-4.34"/>
              <circle cx="11" cy="11" r="8"/>
            </svg>
          )}
        </button>
      </div>

      {showDropdown && (
        <div className={styles.dropdown}>
          {results.map((unidade) => (
            <div 
              key={unidade.id}
              className={styles.dropdownItem}
              onClick={() => handleUnitSelect(unidade)}
            >
              <div className={styles.unitName}>{unidade.nome}</div>
              <div className={styles.unitAddress}>
                {unidade.local?.endereco?.[0] && (
                  `${unidade.local.endereco[0].logradouro}, ${unidade.local.endereco[0].bairro}`
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
