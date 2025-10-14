'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import { getUnidades } from '../api/unidade';
import UnitCard, { UnitCardProps } from '../components/unitCard/UnitCard';
import UnitInfo from '../components/unitInfo/UnitInfo';
import SearchBar from '../components/searchbar/SearchBar';

const LocationMap = dynamic(() => import('../components/map/LocationMap'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>Carregando mapa...</div>
});

export default function UnitPage() {
  const [unidades, setUnidades] = useState<UnitCardProps[]>([])
  const [isUnitDivVisible, setIsUnitDivVisible] = useState(true)
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null)
  const [selectedUnitCoords, setSelectedUnitCoords] = useState<{ lat: number; lng: number } | null>(null)

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
      // Remover caracteres não numéricos
      const cepLimpo = cep.replace(/\D/g, '')
            
      // Usar API do Nominatim com CEP brasileiro
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&country=Brazil&postalcode=${cepLimpo}&limit=1`
      )
      
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          const coords = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          }
          console.log('Coordenadas encontradas:', coords)
          return coords
        }
      }
      
      console.warn('Nenhuma coordenada encontrada para o CEP:', cepLimpo)
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

  

  return (
    <main className={styles.main}>
      {isUnitDivVisible && (
        <div className={styles.unitDiv}>
          {selectedUnitId ? (
            <UnitInfo unitId={selectedUnitId} />
          ) : (
            <div className={styles.unitList}>
              {unidades.map((unidade) => (
                <UnitCard
                  key={unidade.id}
                  id={unidade.id}
                  name={unidade.name}
                  waitTime={unidade.waitTime}
                  onLearnMore={handleLearnMore}
                />
              ))}
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
          />
        </div>
      </div>
    </main>
  )
}