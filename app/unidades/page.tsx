'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import { useFiltros } from '../context/FiltroContext';
import { useTheme } from '../context/ThemeContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { filterUnitsByDistance } from '../utils/geocoding';
import { LazyLocationMap, LazyUnitCard, LazyUnitInfo } from '../components/LazyComponents';
import SearchBar from '../components/searchbar/SearchBar';

export interface UnitCardProps {
  id: string;
  name: string;
  waitTimeGeneral: string;
  onLearnMore?: (unitId: string) => void;
}

function UnitPageContent() {
  const { selectedFilters } = useFiltros()
  const { isDark } = useTheme()
  const { userLocation, calculateDistance } = useGeolocation()
  const searchParams = useSearchParams()
  const [unidades, setUnidades] = useState<UnitCardProps[]>([])
  const [unidadesRaw, setUnidadesRaw] = useState<any[]>([]) // Dados brutos para o mapa
  const [isUnitDivVisible, setIsUnitDivVisible] = useState(true)
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null)
  const [selectedUnitCoords, setSelectedUnitCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [shouldCenterFirstUnit, setShouldCenterFirstUnit] = useState(false)

  // Verificar se há unitId na URL
  useEffect(() => {
    const unitIdFromUrl = searchParams.get('unitId')
    if (unitIdFromUrl) {
      setSelectedUnitId(unitIdFromUrl)
      setIsUnitDivVisible(true)
    }
  }, [searchParams])


  // Hook personalizado para debounce
  const useDebounce = (value: any, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value)
    
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)
      
      return () => {
        clearTimeout(handler)
      }
    }, [value, delay])
    
    return debouncedValue
  }

  // Debounce dos filtros para evitar chamadas excessivas
  const debouncedFilters = useDebounce(selectedFilters, 300)
  

  
  // Memoizar a chave dos filtros para evitar re-renders desnecessários
  const filterKey = useMemo(() => {
    return JSON.stringify(debouncedFilters)
  }, [debouncedFilters])

  // useEffect para buscar unidades filtradas
  useEffect(() => {
    console.log('=== useEffect executado ===')
    console.log('debouncedFilters:', debouncedFilters)
    console.log('userLocation:', userLocation)
    
    setLoading(true)
    setShouldCenterFirstUnit(true)
    
    // Verificar se há filtros que precisam ser enviados para a API
    // Nota: disponibilidade é tratada localmente, não via API
    const hasApiFilters = debouncedFilters.especialidade !== null || 
                         debouncedFilters.categoria !== null
    
    console.log('Tem filtros para API?', hasApiFilters)
    console.log('Filtros detalhados:', {
      especialidade: debouncedFilters.especialidade,
      categoria: debouncedFilters.categoria,
      disponibilidade: debouncedFilters.disponibilidade,
      unidadeProxima: debouncedFilters.unidadeProxima,
      distanciaRaio: debouncedFilters.distanciaRaio
    })

    async function buscarUnidades() {
      try {
        let unidadesData

        if (hasApiFilters) {
          console.log('📡 Aplicando filtros via API:', debouncedFilters)
          
          // Criar objeto de filtros para a API (removendo valores null e campos tratados localmente)
          let filtrosParaAPI: any = {}
          
          if (debouncedFilters.especialidade !== null) {
            filtrosParaAPI.especialidade = debouncedFilters.especialidade
            console.log('📡 Adicionando especialidade ao filtro API:', debouncedFilters.especialidade)
          }
          
          if (debouncedFilters.categoria !== null) {
            filtrosParaAPI.categoria = debouncedFilters.categoria
            console.log('📡 Adicionando categoria ao filtro API:', debouncedFilters.categoria)
          }
          
          console.log('📡 Filtros finais para API:', filtrosParaAPI)
          console.log('📡 JSON que será enviado:', JSON.stringify(filtrosParaAPI))
          
          try {
            // Fazer fetch direto para evitar problemas com Server Actions
            const response = await fetch('https://api-tcc-node-js-1.onrender.com/v1/pas/unidades/filtrar', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(filtrosParaAPI)
            })
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`)
            }
            
            const responseData = await response.json()
            console.log('Resposta completa da API filtrar:', responseData)
            console.log('Status da resposta:', response.status)
            console.log('Unidades na resposta:', responseData.unidadesDeSaude)
            
            // Tentar diferentes estruturas de resposta
            if (responseData.unidadesDeSaude && Array.isArray(responseData.unidadesDeSaude)) {
              unidadesData = responseData.unidadesDeSaude
            } else if (responseData.data && Array.isArray(responseData.data)) {
              unidadesData = responseData.data
            } else if (Array.isArray(responseData)) {
              unidadesData = responseData
            } else {
              console.log('Estrutura de resposta da API filtrar não reconhecida')
              unidadesData = []
            }
          } catch (error) {
            console.error('Erro ao chamar API filtrar:', error)
            unidadesData = []
          }
        } else {
          console.log('Carregando todas as unidades')
          // Fazer fetch direto para evitar problemas com Server Actions
          const response = await fetch('https://api-tcc-node-js-1.onrender.com/v1/pas/unidades/')
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          
          const responseData = await response.json()
          console.log('Resposta completa da API getUnidades:', responseData)

          // Tentar diferentes estruturas de resposta
          if (responseData.unidadesDeSaude && Array.isArray(responseData.unidadesDeSaude)) {
            unidadesData = responseData.unidadesDeSaude
            console.log('✅ Usando responseData.unidadesDeSaude')
          } else if (responseData.unidades && Array.isArray(responseData.unidades)) {
            unidadesData = responseData.unidades
            console.log('✅ Usando responseData.unidades')
          } else if (Array.isArray(responseData)) {
            unidadesData = responseData
            console.log('✅ Usando responseData direto (array)')
          } else if (responseData.data && Array.isArray(responseData.data)) {
            unidadesData = responseData.data
            console.log('✅ Usando response.data')
          } else {
            console.log('⚠️ Estrutura de resposta não reconhecida, usando array vazio')
            console.log('Estrutura recebida:', Object.keys(responseData))
            unidadesData = []
          }

          console.log('Dados das unidades extraídos:', unidadesData)
        }

        // IMPORTANTE: Extrair objetos de arrays aninhados ANTES de aplicar filtros locais
        console.log('🔧 Verificando estrutura dos dados...')
        if (Array.isArray(unidadesData) && unidadesData.length > 0) {
          console.log('🔧 Primeiro item:', unidadesData[0])
          console.log('🔧 É array?', Array.isArray(unidadesData[0]))
          
          if (Array.isArray(unidadesData[0])) {
            console.log('🔧 Extraindo objetos de arrays aninhados...')
            unidadesData = unidadesData.map((item: any) => Array.isArray(item) ? item[0] : item)
            console.log('🔧 Dados após extração:', unidadesData)
            console.log('🔧 Primeiro item após extração:', unidadesData[0])
          }
        }

        // Aplicar filtro de disponibilidade localmente se necessário
        if (debouncedFilters.disponibilidade !== null && Array.isArray(unidadesData)) {
          console.log('🕐 Aplicando filtro de disponibilidade local:', debouncedFilters.disponibilidade)
          console.log('🕐 Unidades ANTES do filtro de disponibilidade:', unidadesData.length)
          
          const unidadesAntes = unidadesData.length
          unidadesData = unidadesData.filter((unidade: any) => {
            const resultado = debouncedFilters.disponibilidade === 1 
              ? unidade.disponibilidade_24h === 1
              : debouncedFilters.disponibilidade === 0 
                ? unidade.disponibilidade_24h === 0
                : true
            
            if (!resultado) {
              console.log(`🕐 Unidade "${unidade.nome}" filtrada (disponibilidade_24h: ${unidade.disponibilidade_24h})`)
            }
            return resultado
          })
          console.log(`🕐 Unidades DEPOIS do filtro de disponibilidade: ${unidadesData.length} (removidas: ${unidadesAntes - unidadesData.length})`)
        }

        // Aplicar filtro por distância se necessário
        console.log('🔍 DEBUG FILTRO DISTÂNCIA:', {
          userLocation,
          unidadeProxima: debouncedFilters.unidadeProxima,
          distanciaRaio: debouncedFilters.distanciaRaio,
          isArray: Array.isArray(unidadesData),
          unidadesCount: unidadesData.length
        })
        
        if (userLocation && debouncedFilters.unidadeProxima && Array.isArray(unidadesData)) {
          console.log('🎯 Aplicando filtro por distância')
          unidadesData = await filterUnitsByDistance(
            unidadesData,
            userLocation,
            debouncedFilters.distanciaRaio,
            calculateDistance
          )
          console.log('✅ Unidades após filtro de distância:', unidadesData.length)
        } else {
          console.log('❌ Filtro de distância NÃO aplicado porque:', {
            temUserLocation: !!userLocation,
            temUnidadeProxima: !!debouncedFilters.unidadeProxima,
            temArray: Array.isArray(unidadesData)
          })
        }

        // Resumo final dos filtros aplicados
        console.log('=== RESUMO DOS FILTROS APLICADOS ===')
        console.log('✅ Filtros API (especialidade/categoria):', hasApiFilters ? 'SIM' : 'NÃO')
        console.log('✅ Filtro disponibilidade:', debouncedFilters.disponibilidade !== null ? `SIM (${debouncedFilters.disponibilidade})` : 'NÃO')
        console.log('✅ Filtro distância:', (userLocation && debouncedFilters.unidadeProxima) ? `SIM (${debouncedFilters.distanciaRaio}km)` : 'NÃO')
        console.log('📊 Total de unidades após todos os filtros:', Array.isArray(unidadesData) ? unidadesData.length : 0)
        console.log('=====================================')
        
        // Transformar dados para o formato esperado pelo UnitCard
        console.log('Dados antes da transformação:', unidadesData)
        console.log('É array?', Array.isArray(unidadesData))
        console.log('Comprimento de unidadesData:', Array.isArray(unidadesData) ? unidadesData.length : 'não é array')
        
        // Garantir que unidadesData é um array
        if (!Array.isArray(unidadesData)) {
          console.log('unidadesData não é um array, convertendo...')
          unidadesData = []
        }
        
        // Função para converter tempo "HH:MM:SS" para minutos totais
        const timeToMinutes = (timeStr: string): number => {
          if (!timeStr || timeStr === '-') return Infinity
          
          const parts = timeStr.split(':')
          if (parts.length !== 3) return Infinity
          
          const hours = parseInt(parts[0]) || 0
          const minutes = parseInt(parts[1]) || 0
          const seconds = parseInt(parts[2]) || 0
          
          return hours * 60 + minutes + seconds / 60
        }

        const unidadesFormatadas: UnitCardProps[] = unidadesData
          .filter((unidade: any) => unidade.id != null && unidade.nome) // Filtrar unidades sem ID ou nome
          .map((unidade: any, index: number) => {
            console.log('Transformando unidade:', unidade.nome, 'ID:', unidade.id, 'Tempo:', unidade.tempo_espera_geral)
            return {
              id: String(unidade.id),
              name: unidade.nome,
              waitTimeGeneral: unidade.tempo_espera_geral || '-',
              onLearnMore: handleLearnMore
            }
          })
          .filter((unidade, index, array) => {
            // Remover duplicatas baseadas no ID
            return array.findIndex(u => u.id === unidade.id) === index
          })
          .sort((a, b) => {
            // Ordenar por tempo de espera (menor primeiro)
            const tempoA = timeToMinutes(a.waitTimeGeneral)
            const tempoB = timeToMinutes(b.waitTimeGeneral)
            console.log(`Comparando: ${a.name} (${a.waitTimeGeneral} -> ${tempoA.toFixed(1)}min) vs ${b.name} (${b.waitTimeGeneral} -> ${tempoB.toFixed(1)}min)`)
            return tempoA - tempoB
          })

        console.log('Unidades formatadas e ordenadas:', unidadesFormatadas.map(u => `${u.name}: ${u.waitTimeGeneral}`))
        setUnidades(unidadesFormatadas)
        setUnidadesRaw(unidadesData) // Salvar dados brutos para o mapa
        console.log('Estado unidades após setUnidades:', unidadesFormatadas.length)
        
        // Marcar para centralizar a primeira unidade se houver unidades
        if (unidadesFormatadas.length > 0) {
          setShouldCenterFirstUnit(true)
        }
        
      } catch (error) {
        console.error('Erro ao buscar unidades:', error)
        setUnidades([])
        setUnidadesRaw([])
      } finally {
        setLoading(false)
      }
    }

    buscarUnidades()
  }, [filterKey, userLocation]) // Incluir userLocation para reprocessar quando localização chegar

  // useEffect para centralizar a primeira unidade quando necessário
  useEffect(() => {
    const centerFirstUnit = async () => {
      if (shouldCenterFirstUnit && unidades.length > 0 && !selectedUnitId) {
        const primeiraUnidade = unidades[0]
        console.log('Centralizando primeira unidade:', primeiraUnidade.name)
        
        try {
          const response = await fetch(`https://api-tcc-node-js-1.onrender.com/v1/pas/unidades/${primeiraUnidade.id}`)
          const data = await response.json()
          
          if (data.status && data.unidadeDeSaude) {
            const unidade = data.unidadeDeSaude
            
            if (unidade.local?.endereco?.[0]?.cep) {
              const cep = unidade.local.endereco[0].cep
              const coords = await geocodeByCEP(cep)
              
              if (coords) {
                console.log('Centralizando mapa na primeira unidade:', coords)
                setSelectedUnitCoords(coords)
              }
            }
          }
        } catch (error) {
          console.error('Erro ao centralizar primeira unidade:', error)
        }
        
        setShouldCenterFirstUnit(false)
      }
    }
    
    centerFirstUnit()
  }, [shouldCenterFirstUnit, unidades, selectedUnitId])

  const toggleUnitDiv = () => {
    if (selectedUnitId) {
      setSelectedUnitId(null)
      setSelectedUnitCoords(null)
    } else {
      setIsUnitDivVisible(!isUnitDivVisible)
    }
  }

  const geocodeByCEP = async (cep: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      // Usar nossa API server-side para evitar CORS
      const response = await fetch(`/api/geocoding?cep=${encodeURIComponent(cep)}`)
      
      if (response.ok) {
        const coords = await response.json()
        if (coords.lat && coords.lng) {
          console.log('Coordenadas encontradas:', coords)
          return coords
        }
      }
      
      console.warn('Nenhuma coordenada encontrada para o CEP:', cep)
    } catch (error) {
      console.error('Erro ao geocodificar CEP:', error)
    }
    return null
  }

  const handleLearnMore = async (unitId: string) => {
    try {
      console.log('🔍 handleLearnMore: Iniciando busca para unitId:', unitId)
      console.log('🔍 handleLearnMore: Tipo do unitId:', typeof unitId)
      
      const response = await fetch(`https://api-tcc-node-js-1.onrender.com/v1/pas/unidades/${unitId}`)
      const data = await response.json()
      
      console.log('🔍 handleLearnMore: Resposta da API:', data)
      
      if (data.status && data.unidadesDeSaude) {
        // A API retorna um array, então pegamos o primeiro elemento
        const unidade = Array.isArray(data.unidadesDeSaude) ? data.unidadesDeSaude[0] : data.unidadesDeSaude
        console.log('🔍 handleLearnMore: Dados da unidade:', unidade)
        
        if (unidade.local?.endereco?.[0]?.cep) {
          const cep = unidade.local.endereco[0].cep
          console.log('🔍 handleLearnMore: CEP da unidade:', cep)
          
          const coords = await geocodeByCEP(cep)
          
          if (coords) {
            console.log('🔍 handleLearnMore: Navegando para:', unidade.nome, coords)
            setSelectedUnitCoords(coords)
          } else {
            console.error('🔍 handleLearnMore: Não foi possível obter coordenadas para o CEP:', cep)
          }
        } else {
          console.error('🔍 handleLearnMore: CEP não encontrado nos dados da unidade')
        }
      } else {
        console.error('🔍 handleLearnMore: API não retornou dados válidos:', data)
      }
      
      console.log('🔍 handleLearnMore: Definindo selectedUnitId como:', unitId)
      setSelectedUnitId(unitId)
    } catch (error) {
      console.error('🔍 handleLearnMore: Erro ao buscar dados da unidade:', error)
      console.log('🔍 handleLearnMore: Definindo selectedUnitId mesmo com erro:', unitId)
      setSelectedUnitId(unitId)
    }
  }

  // Listener para evento de unidade selecionada via SearchBar
  useEffect(() => {
    const handleUnitSelected = (event: CustomEvent) => {
      const { unitId } = event.detail
      console.log('Evento unitSelected recebido:', unitId)
      handleLearnMore(unitId)
    }

    window.addEventListener('unitSelected', handleUnitSelected as EventListener)
    
    return () => {
      window.removeEventListener('unitSelected', handleUnitSelected as EventListener)
    }
  }, [])

  const handleLocationSelect = (address: string, lat: number, lng: number) => {
    console.log('Local selecionado:', { address, lat, lng })
  }

  console.log('=== RENDER ===')
  console.log('Estado atual das unidades:', unidades)
  console.log('Loading:', loading)
  console.log('Número de unidades:', unidades.length)
  console.log('🔍 selectedUnitId atual:', selectedUnitId)
  console.log('🔍 isUnitDivVisible:', isUnitDivVisible)
  

  return (
    <main className={styles.main}>
      {isUnitDivVisible && (
        <div className={styles.unitDiv}>
          {selectedUnitId ? (
            <LazyUnitInfo unitId={selectedUnitId} />
          ) : (
            <div className={styles.unitList}>
              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  Carregando unidades...
                </div>
              ) : unidades.length > 0 ? (
                unidades.map((unidade) => (
                  <LazyUnitCard
                    key={unidade.id}
                    id={unidade.id}
                    name={unidade.name}
                    waitTimeGeneral={unidade.waitTimeGeneral}
                    onLearnMore={handleLearnMore}
                  />
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  Nenhuma unidade encontrada com os filtros aplicados.
                </div>
              )}
            </div>
          )}
          <button className={styles.closeUnitList} onClick={toggleUnitDiv} type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isDark ? "#ffffff" : "#134879"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
              <line x1="4" x2="20" y1="6" y2="6"/>
              <line x1="4" x2="20" y1="12" y2="12"/>
              <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </button>
        </div>
      )}
      <div className={`${styles.unitMap} ${!isUnitDivVisible ? styles.unitMapFull : ''}`}>
        <div className={styles.searchBarOverlay}>
          <SearchBar />
        </div>
        
        {!isUnitDivVisible && (
          <button className={styles.showUnitList} onClick={toggleUnitDiv} type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isDark ? "#ffffff" : "#134879"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
              <line x1="4" x2="20" y1="12" y2="12"/>
              <line x1="4" x2="20" y1="6" y2="6"/>
              <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </button>
        )}

        <LazyLocationMap 
          onLocationSelect={handleLocationSelect}
          onUnitPinClick={handleLearnMore}
          navigateToCoords={selectedUnitCoords}
          filteredUnits={unidadesRaw}
          showAllUnits={false}
        />
      </div>
    </main>
  )
}

export default function UnitPage() {
  return (
    <Suspense fallback={<div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Carregando...</div>}>
      <UnitPageContent />
    </Suspense>
  )
}