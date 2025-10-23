'use client';

import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import { getUnidades } from '../api/unidade';
import { filtrar } from '../api/filtro';
import { useFiltros } from '../context/FiltroContext';
import UnitCard, { UnitCardProps } from '../components/unitCard/UnitCard';
import UnitInfo from '../components/unitInfo/UnitInfo';
import SearchBar from '../components/searchbar/SearchBar';

const LocationMap = dynamic(() => import('../components/map/LocationMap'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>Carregando mapa...</div>
});

export default function UnitPage() {
  const { selectedFilters } = useFiltros()
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

  // Memoizar a chave dos filtros para evitar re-renders desnecessários
  const filterKey = useMemo(() => {
    return JSON.stringify(selectedFilters)
  }, [selectedFilters])

  // useEffect para buscar unidades filtradas
  useEffect(() => {
    console.log('=== useEffect executado ===')
    console.log('selectedFilters:', selectedFilters)
    
    async function buscarUnidades() {
      try {
        setLoading(true)
        
        // Verificar se há filtros aplicados (exceto disponibilidade, distanciaRaio e unidadeProxima que serão tratados localmente)
        const temFiltrosAPI = selectedFilters.especialidade !== null || 
                             selectedFilters.categoria !== null
        
        console.log('Tem filtros para API?', temFiltrosAPI)
        console.log('Filtros detalhados:', {
          especialidade: selectedFilters.especialidade,
          categoria: selectedFilters.categoria,
          disponibilidade: selectedFilters.disponibilidade
        })

        let unidadesData

        if (temFiltrosAPI) {
          console.log('Aplicando filtros via API:', selectedFilters)
          
          // Criar objeto de filtros para a API (removendo valores null e campos tratados localmente)
          let filtrosParaAPI = Object.fromEntries(
            Object.entries(selectedFilters).filter(([key, value]) => 
              value !== null && !['disponibilidade', 'distanciaRaio', 'unidadeProxima'].includes(key)
            )
          )
          
          console.log('Filtros para API:', filtrosParaAPI)
          
          try {
            const response = await filtrar(filtrosParaAPI)
            console.log('Resposta completa da API filtrar:', response)
            console.log('Status da resposta:', response.status)
            console.log('Unidades na resposta:', response.unidadesDeSaude)
            
            // Tentar diferentes estruturas de resposta
            if (response.unidadesDeSaude && Array.isArray(response.unidadesDeSaude)) {
              unidadesData = response.unidadesDeSaude
            } else if (response.data && Array.isArray(response.data)) {
              unidadesData = response.data
            } else if (Array.isArray(response)) {
              unidadesData = response
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
          const response = await getUnidades()
          console.log('Resposta completa da API getUnidades:', response)

          // Tentar diferentes estruturas de resposta
          if (response.unidadesDeSaude && Array.isArray(response.unidadesDeSaude)) {
            unidadesData = response.unidadesDeSaude
            console.log('✅ Usando response.unidadesDeSaude')
          } else if (response.unidades && Array.isArray(response.unidades)) {
            unidadesData = response.unidades
            console.log('✅ Usando response.unidades')
          } else if (Array.isArray(response)) {
            unidadesData = response
            console.log('✅ Usando response direto (array)')
          } else if (response.data && Array.isArray(response.data)) {
            unidadesData = response.data
            console.log('✅ Usando response.data')
          } else {
            console.log('⚠️ Estrutura de resposta não reconhecida, usando array vazio')
            console.log('Estrutura recebida:', Object.keys(response))
            unidadesData = []
          }

          console.log('Dados das unidades extraídos:', unidadesData)
        }

        // Aplicar filtro de disponibilidade localmente se necessário
        if (selectedFilters.disponibilidade !== null && Array.isArray(unidadesData)) {
          console.log('Aplicando filtro de disponibilidade local:', selectedFilters.disponibilidade)
          unidadesData = unidadesData.filter((unidade: any) => {
            if (selectedFilters.disponibilidade === 1) {
              // Filtrar apenas unidades 24h (disponibilidade_24h === 1)
              return unidade.disponibilidade_24h === 1
            } else if (selectedFilters.disponibilidade === 0) {
              // Filtrar apenas unidades não 24h (disponibilidade_24h === 0)
              return unidade.disponibilidade_24h === 0
            }
            return true
          })
          console.log('Unidades após filtro de disponibilidade:', unidadesData.length)
        }

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

        const unidadesFormatadas = unidadesData.map((unidade: any) => {
          console.log('Transformando unidade:', unidade.nome, 'Tempo:', unidade.tempo_espera_geral)
          return {
            id: String(unidade.id),
            name: unidade.nome,
            waitTimeGeneral: unidade.tempo_espera_geral || '-'
          }
        }).sort((a, b) => {
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
  }, [filterKey]) // eslint-disable-line react-hooks/exhaustive-deps

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
      console.log('Buscando dados da unidade:', unitId)
      
      const response = await fetch(`https://api-tcc-node-js-1.onrender.com/v1/pas/unidades/${unitId}`)
      const data = await response.json()
      
      if (data.status && data.unidadeDeSaude) {
        const unidade = data.unidadeDeSaude
        console.log('Dados da unidade:', unidade)
        
        if (unidade.local?.endereco?.[0]?.cep) {
          const cep = unidade.local.endereco[0].cep
          console.log('CEP da unidade:', cep)
          
          const coords = await geocodeByCEP(cep)
          
          if (coords) {
            console.log('Navegando para:', unidade.nome, coords)
            setSelectedUnitCoords(coords)
          } else {
            console.error('Não foi possível obter coordenadas para o CEP:', cep)
          }
        } else {
          console.error('CEP não encontrado nos dados da unidade')
        }
      }
      
      setSelectedUnitId(unitId)
    } catch (error) {
      console.error('Erro ao buscar dados da unidade:', error)
      setSelectedUnitId(unitId)
    }
  }

  const handleLocationSelect = (address: string, lat: number, lng: number) => {
    console.log('Local selecionado:', { address, lat, lng })
  }

  console.log('=== RENDER ===')
  console.log('Estado atual das unidades:', unidades)
  console.log('Loading:', loading)
  console.log('Número de unidades:', unidades.length)
  

  return (
    <main className={styles.main}>
      {isUnitDivVisible && (
        <div className={styles.unitDiv}>
          {selectedUnitId ? (
            <UnitInfo unitId={selectedUnitId} />
          ) : (
            <div className={styles.unitList}>
              {loading ? (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  Carregando unidades...
                </div>
              ) : unidades.length > 0 ? (
                unidades.map((unidade) => (
                  <UnitCard
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#134879" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#134879" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
              <line x1="4" x2="20" y1="12" y2="12"/>
              <line x1="4" x2="20" y1="6" y2="6"/>
              <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </button>
        )}
        
        <div className={styles.mapContainer}>
          <LocationMap 
            onLocationSelect={handleLocationSelect}
            navigateToCoords={selectedUnitCoords}
            filteredUnits={unidadesRaw}
            showAllUnits={false}
          />
        </div>
      </div>
    </main>
  )
}