import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L, { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import styles from './LocationMap.module.css'
import { getUnidades } from '../../api/unidade'
import { formatWaitTime } from '../../utils/timeFormatter'

// Fix para ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [35, 51],
  iconAnchor: [17, 51],
  popupAnchor: [1, -44],
  shadowSize: [51, 51]
})

export interface UnidadeLocation {
  id: number
  lat: number
  lng: number
  address: string
  nome: string
  telefone: string
  disponibilidade_24h: boolean
  categoria: string
  especialidades: string[]
  tempo_espera_geral?: string
}

export interface LocationMapProps {
  onLocationSelect?: (address: string, lat: number, lng: number) => void
  navigateToCoords?: { lat: number; lng: number } | null
  filteredUnits?: any[] // Unidades já filtradas para mostrar no mapa
  showAllUnits?: boolean // Se true, busca todas as unidades (para página /mapa)
}

// Componente para controlar navegação
function MapUpdater({ navigateToCoords }: { navigateToCoords?: { lat: number; lng: number } | null }) {
  const map = useMap()
  
  useEffect(() => {
    if (navigateToCoords) {
      console.log('MapUpdater: navegando para', navigateToCoords)
      map.flyTo([navigateToCoords.lat, navigateToCoords.lng], 19, {
        animate: true,
        duration: 2
      })
    }
  }, [navigateToCoords, map])
  return null
}

const LocationMap: React.FC<LocationMapProps> = ({ onLocationSelect, navigateToCoords, filteredUnits, showAllUnits = false }) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([-23.5505, -46.6333])
  const [unidadesLocations, setUnidadesLocations] = useState<UnidadeLocation[]>([])
  const [isLocating, setIsLocating] = useState(false)
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null)
  const [selectedUnit, setSelectedUnit] = useState<{ nome: string; tempoEspera: string; lat: number; lng: number } | null>(null)

  const geocodeByCEP = async (cep: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      console.log('Geocodificando CEP:', cep)
      
      // Usar nossa API server-side para evitar CORS
      const response = await fetch(`/api/geocoding?cep=${encodeURIComponent(cep)}`)
      
      if (response.ok) {
        const coords = await response.json()
        if (coords.lat && coords.lng) {
          console.log('✅ Coordenadas encontradas:', coords)
          return coords
        }
      }
    } catch (error) {
      console.error('❌ Erro ao geocodificar CEP:', error)
    }
    return null
  }

  const getUserLocation = async () => {
    setIsLocating(true)
    const defaultLat = -23.5505
    const defaultLng = -46.6333
    
    if (!navigator.geolocation) {
      setUserLocation({ lat: defaultLat, lng: defaultLng, address: 'São Paulo, SP' })
      setIsLocating(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ lat: latitude, lng: longitude, address: 'Sua localização' })
        setMapCenter([latitude, longitude])
        
        // Centralizar o mapa na localização do usuário
        if (mapInstance) {
          mapInstance.flyTo([latitude, longitude], 17, {
            animate: true,
            duration: 2
          })
        }
        
        setIsLocating(false)
      },
      async () => {
        setUserLocation({ lat: defaultLat, lng: defaultLng, address: 'Jandira, SP' })
        setMapCenter([defaultLat, defaultLng])
        
        // Centralizar no padrão se não conseguir localização
        if (mapInstance) {
          mapInstance.flyTo([defaultLat, defaultLng], 15, {
            animate: true,
            duration: 2
          })
        }
        
        setIsLocating(false)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    )
  }

  const processUnidadesData = async (unidadesData: any[]) => {
    const unidadesComLocalizacao: UnidadeLocation[] = []
    
    for (const unidade of unidadesData) {
      if (unidade.local?.endereco?.[0]?.cep) {
        const cep = unidade.local.endereco[0].cep
        const endereco = unidade.local.endereco[0]
        const enderecoCompleto = `${endereco.logradouro}, ${endereco.bairro}, ${endereco.cidade}`
        
        console.log(`🔍 Processando: ${unidade.nome} - CEP: ${cep}`)
        const coords = await geocodeByCEP(cep)
        
        if (coords) {
          console.log(`✓ ${unidade.nome} geocodificado:`, coords)
          unidadesComLocalizacao.push({
            id: unidade.id,
            lat: coords.lat,
            lng: coords.lng,
            address: enderecoCompleto,
            nome: unidade.nome,
            telefone: unidade.telefone,
            disponibilidade_24h: unidade.disponibilidade_24h === 1,
            categoria: unidade.categoria?.categoria?.[0]?.nome || 'Não informado',
            especialidades: unidade.especialidades?.especialidades?.map((esp: any) => esp.nome) || [],
            tempo_espera_geral: unidade.tempo_espera_geral || '-'
          })
        } else {
          console.warn(`Não foi possível geocodificar ${unidade.nome}`)
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    console.log(`Total: ${unidadesComLocalizacao.length} unidades no mapa`)
    setUnidadesLocations(unidadesComLocalizacao)
  }

  const fetchUnidadesLocations = async () => {
    try {
      console.log('Buscando todas as unidades...')
      const response = await getUnidades()
      
      if (response.status && response.unidadesDeSaude) {
        await processUnidadesData(response.unidadesDeSaude)
      }
    } catch (error) {
      console.error('Erro ao buscar unidades:', error)
    }
  }

  const processFilteredUnits = async () => {
    if (filteredUnits && filteredUnits.length > 0) {
      console.log('Processando unidades filtradas para o mapa:', filteredUnits.length)
      await processUnidadesData(filteredUnits)
    } else {
      console.log('Nenhuma unidade filtrada, limpando mapa')
      setUnidadesLocations([])
    }
  }

  useEffect(() => {
    getUserLocation()
    
    // Se showAllUnits for true (página /mapa), busca todas as unidades
    // Se filteredUnits for fornecido (página /unidades), usa apenas as filtradas
    if (showAllUnits) {
      fetchUnidadesLocations()
    } else if (filteredUnits !== undefined) {
      processFilteredUnits()
    } else {
      // Fallback: se nenhuma das condições acima, busca todas
      fetchUnidadesLocations()
    }
  }, [showAllUnits, filteredUnits])

  // Log quando navigateToCoords muda
  useEffect(() => {
    if (navigateToCoords) {
      console.log('Navegação solicitada para:', navigateToCoords)
    }
  }, [navigateToCoords])

  // Centralizar mapa quando a instância do mapa e localização estiverem disponíveis
  useEffect(() => {
    if (mapInstance && userLocation && !isLocating) {
      mapInstance.flyTo([userLocation.lat, userLocation.lng], 17, {
        animate: true,
        duration: 2
      })
    }
  }, [mapInstance, userLocation, isLocating])

  const isUnitSelected = (unidade: UnidadeLocation) => {
    if (!navigateToCoords) return false
    const latMatch = Math.abs(unidade.lat - navigateToCoords.lat) < 0.001
    const lngMatch = Math.abs(unidade.lng - navigateToCoords.lng) < 0.001
    return latMatch && lngMatch
  }

  // Função para dar zoom ao clicar no marker
  const handleMarkerClick = (lat: number, lng: number, nome: string) => {
    console.log(`Clique no pin: ${nome}`)
    if (mapInstance) {
      mapInstance.flyTo([lat, lng], 19, {
        animate: true,
        duration: 1.5
      })
    }
  }

  const MapPin = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )

  // Componente interno para capturar instância do mapa
  function MapInstanceCapture() {
    const map = useMap()
    
    useEffect(() => {
      setMapInstance(map)
    }, [map])
    
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.mapArea}>
        <MapContainer 
          center={mapCenter as LatLngExpression} 
          zoom={15} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          
          <MapUpdater navigateToCoords={navigateToCoords} />
          <MapInstanceCapture />
          
          {userLocation && (
            <Marker 
              position={[userLocation.lat, userLocation.lng] as LatLngExpression}
              icon={redIcon}
            >
              <Popup>
                <div className={styles.popupContent}>
                  <p className={styles.popupTitle}>{userLocation.address}</p>
                </div>
              </Popup>
            </Marker>
          )}
          
          {unidadesLocations.map((unidade) => {
            const selected = isUnitSelected(unidade)
            return (
              <Marker 
                key={unidade.id} 
                position={[unidade.lat, unidade.lng] as LatLngExpression}
                icon={selected ? greenIcon : blueIcon}
                eventHandlers={{
                  click: () => handleMarkerClick(unidade.lat, unidade.lng, unidade.nome)
                }}
              >
                <Popup>
                  <div className={styles.popupContent}>
                    <p className={styles.popupTitle}>{unidade.nome}</p>
                    <p className={styles.popupText}><span>Tempo de espera: </span> {formatWaitTime(unidade.tempo_espera_geral)}</p>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
        
       
        <div className={styles.controlButtons}>
          <button
            onClick={getUserLocation}
            disabled={isLocating}
            className={styles.locationButton}
            title="Minha localização"
          >
            <div className={isLocating ? styles.spinner : ''}>
              <MapPin />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default LocationMap