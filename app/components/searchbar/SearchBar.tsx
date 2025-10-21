"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUnidadesByNome } from "../../api/unidade";
import styles from './SearchBar.module.css';

export default function SearchBar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleFilterClick = () => {
    if (window.location.pathname === "/filtro") {
      router.back(); 
    } else {
      router.push("/filtro");
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      const data = await getUnidadesByNome(searchTerm);
      setResults(data.unidadesDeSaude || []);
      console.log('Resultados:', data.unidadesDeSaude);
    } catch (error) {
      console.error('Erro na busca:', error);
      setResults([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div>
      <form className={styles.searchbox} onSubmit={handleSubmit}>
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
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Procure por uma unidade de saúde..." 
      />

      <button
        className={styles.filterbtn}
        id={styles.searchbtn}
        type="submit" 
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
             viewBox="0 0 24 24" fill="none" stroke="#ffffff" 
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
             className="lucide lucide-search">
          <path d="m21 21-4.34-4.34"/>
          <circle cx="11" cy="11" r="8"/>
        </svg>
      </button>
      </form>

      {/* Resultados da busca */}
      {results.length > 0 && (
        <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
          <h3>Resultados ({results.length}):</h3>
          {results.map((unidade) => (
            <div key={unidade.id} style={{ padding: '5px', borderBottom: '1px solid #ddd' }}>
              <strong>{unidade.nome}</strong>
              <br />
              <small>{unidade.local?.endereco?.[0]?.logradouro}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}