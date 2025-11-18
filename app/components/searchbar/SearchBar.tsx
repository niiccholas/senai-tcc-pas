"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getUnidadesByNome } from "../../api/unidade"
import { useSearchHistory } from '../../context/SearchHistoryContext'
import styles from './SearchBar.module.css'

interface Unidade {
  id: number
  nome: string
  local: {
    endereco: Array<{
      logradouro: string
      bairro: string
      cidade: string
    }>
  }
}

export default function SearchBar() {
  const router = useRouter()
  const { searchHistory, addToHistory } = useSearchHistory()
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<Unidade[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [isFilterActive, setIsFilterActive] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Verificar se está na página de filtro ao carregar
  useEffect(() => {
    setIsFilterActive(window.location.pathname === "/filtro")
  }, [])

  const handleFilterClick = () => {
    if (window.location.pathname === "/filtro") {
      setIsFilterActive(false)
      router.back() 
    } else {
      setIsFilterActive(true)
      router.push("/filtro")
    }
  }

  const searchUnidades = async (term: string) => {
    if (!term.trim() || term.length < 2) {
      setResults([])
      setShowDropdown(false)
      setShowHistory(false)
      return
    }

    setIsLoading(true)
    setShowHistory(false)
    try {
      const data = await getUnidadesByNome(term)
      const unidades = data.unidadesDeSaude || []
      setResults(unidades.slice(0, 5)) 
      setShowDropdown(unidades.length > 0)
    } catch (error) {
      console.error('Erro na busca:', error)
      setResults([])
      setShowDropdown(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setIsTyping(true)
    
    // Reset typing state after user stops typing for 300ms
    const timeoutId = setTimeout(() => {
      setIsTyping(false)
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }

  const handleUnitSelect = async (unidade: Unidade) => {
    // Adicionar ao histórico
    addToHistory(unidade.nome, 'unit', unidade.id)
    
    setSearchTerm('')
    setShowDropdown(false)
    setShowHistory(false)
    
    // Se estamos na página de unidades, navegar para a unidade e centralizar no mapa
    if (window.location.pathname === "/unidades") {
      // Usar URLSearchParams para manter outros parâmetros e adicionar unitId
      const currentUrl = new URL(window.location.href)
      currentUrl.searchParams.set('unitId', unidade.id.toString())
      
      // Atualizar a URL sem recarregar a página
      window.history.pushState({}, '', currentUrl.toString())
      
      // Disparar evento personalizado para que a página de unidades saiba da mudança
      window.dispatchEvent(new CustomEvent('unitSelected', { 
        detail: { unitId: unidade.id.toString() } 
      }))
    } else {
      // Se não estamos na página de unidades, navegar para lá
      router.push(`/unidades?unitId=${unidade.id}`)
    }
  }

  const handleHistorySelect = (historyItem: any) => {
    setSearchTerm(historyItem.query)
    setShowHistory(false)
    
    if (historyItem.type === 'unit' && historyItem.unitId) {
      // Navegar diretamente para a unidade
      if (window.location.pathname === "/unidades") {
        const currentUrl = new URL(window.location.href)
        currentUrl.searchParams.set('unitId', historyItem.unitId.toString())
        window.history.pushState({}, '', currentUrl.toString())
        window.dispatchEvent(new CustomEvent('unitSelected', { 
          detail: { unitId: historyItem.unitId.toString() } 
        }))
      } else {
        router.push(`/unidades?unitId=${historyItem.unitId}`)
      }
    } else {
      // Busca geral
      searchUnidades(historyItem.query)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUnidades(searchTerm)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
        setShowHistory(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
               className={`lucide lucide-chevron-down ${!isFilterActive ? styles.rotated : ''}`}>
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>

        <input 
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Procure por uma unidade de saúde..." 
          onFocus={() => {
            if (searchTerm.length >= 2 && results.length > 0) {
              setShowDropdown(true)
            } else if (searchTerm.length === 0 && searchHistory.length > 0) {
              setShowHistory(true)
            }
          }}
        />

        <button
          className={styles.filterbtn}
          type="button"
          disabled={isLoading}
        >
          {(isLoading || isTyping) ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                 viewBox="0 0 24 24" fill="none" stroke="#ffffff" 
                 strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                 className={styles.spin}>
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
              <div className={styles.itemIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className={styles.itemContent}>
                <div className={styles.unitName}>{unidade.nome}</div>
                <div className={styles.unitAddress}>
                  {unidade.local?.endereco?.[0] && (
                    `${unidade.local.endereco[0].logradouro}, ${unidade.local.endereco[0].bairro}`
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showHistory && searchHistory.length > 0 && (
        <div className={styles.dropdown}>
          <div className={styles.historyHeader}>
            <span>Buscas recentes</span>
            <button 
              className={styles.clearHistory}
              onClick={() => {
                // Implementar limpeza do histórico se necessário
                setShowHistory(false)
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m18 6-12 12"/>
                <path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>
          {searchHistory.slice(0, 5).map((item) => (
            <div 
              key={item.id}
              className={`${styles.dropdownItem} ${styles.historyItem}`}
              onClick={() => handleHistorySelect(item)}
            >
              <div className={styles.itemIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
              </div>
              <div className={styles.itemContent}>
                <div className={styles.unitName}>{item.query}</div>
                <div className={styles.unitAddress}>
                  {item.type === 'unit' ? 'Unidade de saúde' : 'Busca geral'} • {new Date(item.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}