'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
//import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
//import L from 'leaflet';
//import 'leaflet/dist/leaflet.css';
import styles from './page.module.css';
import { getUnidades } from '../api/unidade';
import UnitCard, { UnitCardProps } from '../components/unitCard/UnitCard';
import UnitInfo from '../components/unitInfo/UnitInfo';
import SearchBar from '../components/searchbar/SearchBar';

// Carrega o LocationMap apenas no lado do cliente para evitar erro de SSR
const LocationMap = dynamic(() => import('../components/map/LocationMap'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>Carregando mapa...</div>
});

export default function UnitPage() {
  const [unidades, setUnidades] = useState<UnitCardProps[]>([])
  const [isUnitDivVisible, setIsUnitDivVisible] = useState(true)
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null)

  const toggleUnitDiv = () => {
    if (selectedUnitId) {
      // Se estiver mostrando detalhes, volta para a lista
      setSelectedUnitId(null)
    } else {
      // Se estiver na lista, fecha a div
      setIsUnitDivVisible(!isUnitDivVisible)
    }
  }

  const handleLearnMore = (unitId: string) => {
    setSelectedUnitId(unitId)
  }

  const handleLocationSelect = (address: string, lat: number, lng: number) => {
    console.log('Local selecionado:', { address, lat, lng })
    // Aqui você pode implementar a lógica para usar a localização selecionada
  }

  useEffect(() => {
    async function fetchUnidades() {
      try {
        const response = await getUnidades()
        if (response.status) {
          const unidadesFormatadas = response.unidadesDeSaude.map((unidade: any) => ({
            id: String(unidade.id),
            name: unidade.nome,
            waitTime: unidade.disponibilidade_24h ? 0 : 30,
          }));
          setUnidades(unidadesFormatadas)
        }
      } catch (error) {
        console.error('Erro ao buscar unidades:', error)
      }
    }

    fetchUnidades()
  }, [])

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
        {/* SearchBar sobreposto */}
        <div className={styles.searchBarOverlay}>
          <SearchBar />
        </div>
        
        {/* Botão para mostrar lista de unidades */}
        {!isUnitDivVisible && (
          <button className={styles.showUnitList} onClick={toggleUnitDiv} type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#134879" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
              <line x1="4" x2="20" y1="12" y2="12"/>
              <line x1="4" x2="20" y1="6" y2="6"/>
              <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </button>
        )}
        
        {/* Mapa ocupando todo o espaço */}
        <div className={styles.mapContainer}>
          <LocationMap onLocationSelect={handleLocationSelect} />
        </div>
      </div>
    </main>
  )
}