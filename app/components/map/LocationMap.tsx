// LocationMap.tsx
import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L, { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import styles from './LocationMap.module.css'

// Fix para ícones do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

export interface Location {
  lat: number
  lng: number
  address: string
}

export interface LocationMapProps {
  onLocationSelect?: (address: string, lat: number, lng: number) => void
}

// Componente para capturar cliques no mapa
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

// Componente para controlar o mapa
function MapController({ center, map, setMap }: { center: [number, number], map: any, setMap: (map: any) => void }) {
  const mapInstance = useMapEvents({})
  
  React.useEffect(() => {
    if (mapInstance && !map) {
      setMap(mapInstance)
    }
  }, [mapInstance, map, setMap])
  
  React.useEffect(() => {
    if (mapInstance) {
      mapInstance.setView(center, mapInstance.getZoom())
    }
  }, [center, mapInstance])
  
  return null
}

const LocationMap: React.FC<LocationMapProps> = ({ onLocationSelect }) => {
  const [userLocation, setUserLocation] = useState<Location | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([-23.5505, -46.6333])
  const [nearbyAddresses, setNearbyAddresses] = useState<Location[]>([])
  const [isLocating, setIsLocating] = useState(false)
  const [clickedLocation, setClickedLocation] = useState<Location | null>(null)
  const [map, setMap] = useState<any>(null)

  // Função para obter a localização do usuário
  const getUserLocation = async () => {
    setIsLocating(true)
    
    const defaultLat = -23.5505
    const defaultLng = -46.6333
    
    if (!navigator.geolocation) {
      console.warn('⚠️ Geolocalização não suportada pelo navegador')
      setMapCenter([defaultLat, defaultLng])
      setUserLocation({ lat: defaultLat, lng: defaultLng, address: 'São Paulo, SP (geolocalização não suportada)' })
      await getNearbyAddresses(defaultLat, defaultLng)
      setIsLocating(false)
      return
    }

    console.log('🌍 Obtendo localização...')
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        console.log(`✅ Localização obtida: ${latitude}, ${longitude}`)
        
        setMapCenter([latitude, longitude])
        setUserLocation({ lat: latitude, lng: longitude, address: 'Obtendo endereço...' })
        
        await getAddressFromCoords(latitude, longitude, true)
        setIsLocating(false)
      },
      async (error) => {
        console.error('❌ Erro ao obter localização:', error.message)
        
        setMapCenter([defaultLat, defaultLng])
        setUserLocation({ lat: defaultLat, lng: defaultLng, address: 'São Paulo, SP (localização não disponível)' })
        await getNearbyAddresses(defaultLat, defaultLng)
        setIsLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    )
  }

  // Função para obter endereço a partir de coordenadas
  const getAddressFromCoords = async (lat: number, lng: number, isUserLocation = true) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      )
      
      if (response.ok) {
        const data = await response.json()
        const address = data.display_name || 'Endereço não encontrado'
        
        if (isUserLocation) {
          setUserLocation(prev => prev ? { ...prev, address } : { lat, lng, address })
          await getNearbyAddresses(lat, lng)
        } else {
          setClickedLocation({ lat, lng, address })
          console.log(`📍 Marcador adicionado em: ${address}`)
        }
      }
    } catch (error) {
      console.error('Erro ao buscar endereço:', error)
    }
  }

  // Função para buscar endereços próximos
  const getNearbyAddresses = async (lat: number, lng: number) => {
    try {
      console.log(`🔍 Buscando endereços próximos a: ${lat}, ${lng}`)
      
      const searches = [
        'hospital',
        'clinic',
        'pharmacy',
        'emergency'
      ]
      
      const nearbyResults: Location[] = []
      
      for (const searchTerm of searches) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${searchTerm}&lat=${lat}&lon=${lng}&limit=2&bounded=1&viewbox=${lng-0.02},${lat+0.02},${lng+0.02},${lat-0.02}`
          )
          
          if (response.ok) {
            const data = await response.json()
            const results = data.map((item: any) => ({
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              address: item.display_name
            }))
            
            nearbyResults.push(...results)
          }
          
          await new Promise(resolve => setTimeout(resolve, 200))
        } catch (error) {
          console.warn(`Erro ao buscar ${searchTerm}:`, error)
        }
      }
      
      if (nearbyResults.length > 0) {
        console.log(`📍 ${nearbyResults.length} endereços encontrados`)
        setNearbyAddresses(nearbyResults.slice(0, 8))
      } else {
        console.log('📍 Nenhum endereço encontrado próximo')
        setNearbyAddresses([])
      }
      
    } catch (error) {
      console.error('❌ Erro ao buscar endereços próximos:', error)
      setNearbyAddresses([])
    }
  }

  // Função para buscar endereço por texto
  const searchAddress = async (query: string) => {
    if (!query.trim()) return
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      )
      
      if (response.ok) {
        const data = await response.json()
        const addresses: Location[] = data.map((item: any) => ({
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          address: item.display_name
        }))
        
        setNearbyAddresses(addresses)
        
        if (addresses.length > 0) {
          setMapCenter([addresses[0].lat, addresses[0].lng])
        }
      }
    } catch (error) {
      console.error('Erro ao buscar endereço:', error)
    }
  }

  // Efeito para obter localização quando o componente montar
  useEffect(() => {
    getUserLocation()
  }, [])

  // Ícones SVG inline
  const MapPin = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )

  const Search = () => (
    <svg className={styles.iconSmall} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )

  return (
    <div className={styles.container}>
      {/* Map area */}
      <div className={styles.mapArea}>
        <MapContainer 
          center={mapCenter as LatLngExpression} 
          zoom={15} 
          style={{ height: '100%', width: '100%' }}
          key={`${mapCenter[0]}-${mapCenter[1]}`}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Marcador da localização do usuário */}
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng] as LatLngExpression}>
              <Popup>
                <div className={styles.popupContent}>
                  <p className={styles.popupTitle}>Sua localização atual</p>
                  <p className={styles.popupText}>{userLocation.address}</p>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Marcadores dos endereços próximos */}
          {nearbyAddresses.map((location, index) => (
            <Marker 
              key={index} 
              position={[location.lat, location.lng] as LatLngExpression}
            >
              <Popup>
                <div className={styles.popupContent}>
                  <p className={styles.popupTitle}>Endereço próximo</p>
                  <p className={styles.popupText}>{location.address}</p>
                  {onLocationSelect && (
                    <button
                      onClick={() => onLocationSelect(location.address, location.lat, location.lng)}
                      className={styles.popupSelectButton}
                    >
                      Selecionar
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Marcador da localização clicada */}
          {clickedLocation && (
            <Marker 
              position={[clickedLocation.lat, clickedLocation.lng] as LatLngExpression}
            >
              <Popup>
                <div className={styles.popupContent}>
                  <p className={styles.popupTitle}>Local selecionado</p>
                  <p className={styles.popupText}>{clickedLocation.address}</p>
                  {onLocationSelect && (
                    <button
                      onClick={() => onLocationSelect(clickedLocation.address, clickedLocation.lat, clickedLocation.lng)}
                      className={styles.popupSelectButton}
                    >
                      Selecionar
                    </button>
                  )}
                  <button
                    onClick={() => setClickedLocation(null)}
                    className={styles.popupRemoveButton}
                  >
                    Remover
                  </button>
                </div>
              </Popup>
            </Marker>
          )}

          <MapClickHandler onMapClick={async (lat, lng) => {
            console.log(`📍 Clique no mapa: ${lat}, ${lng}`)
            await getAddressFromCoords(lat, lng, false)
          }} />
          
          <MapController center={mapCenter} map={map} setMap={setMap} />
        </MapContainer>
        
        {/* Overlay com informações */}
        <div className={styles.overlay}>
          <h2 className={styles.overlayTitle}>
            {isLocating ? (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                Obtendo sua localização...
              </div>
            ) : 'Localização no mapa'}
          </h2>
          {userLocation && !isLocating && (
            <div className={styles.locationInfo}>
              <p className={styles.locationText}>
                📍 {userLocation.address}
              </p>
            </div>
          )}
          {clickedLocation && (
            <p className={styles.selectedLocationText}>
              🎯 Local selecionado: {clickedLocation.address.split(',')[0]}
            </p>
          )}
        </div>
        
        {/* Botões de controle */}
        <div className={styles.controlButtons}>
          {clickedLocation && (
            <button
              onClick={() => setClickedLocation(null)}
              className={styles.removeMarkerButton}
              title="Remover marcador"
            >
              <svg className={styles.iconXSmall} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          <button
            onClick={getUserLocation}
            disabled={isLocating}
            className={styles.locationButton}
            title="Obter minha localização atual"
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