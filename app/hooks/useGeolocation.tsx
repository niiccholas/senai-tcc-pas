"use client";

import { useState, useEffect } from 'react';
import { useFiltros } from '../context/FiltroContext';

export function useGeolocation() {
  const { userLocation, setUserLocation } = useFiltros();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🌍 useGeolocation - Estado atual:', { userLocation, loading });
    
    if (!userLocation) {
      console.log('🌍 Iniciando obtenção de localização...');
      setLoading(true);
      
      if (navigator.geolocation) {
        console.log('🌍 Geolocalização suportada, solicitando posição...');
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            console.log('🎯 Localização do usuário obtida:', coords);
            setUserLocation(coords);
            setLoading(false);
          },
          (error) => {
            console.warn('❌ Erro ao obter localização:', error);
            setError('Não foi possível obter sua localização');
            // Fallback para Jandira (já que você está lá)
            const fallbackCoords = {
              lat: -23.5381,
              lng: -46.9042
            };
            console.log('🔄 Usando localização fallback (Jandira):', fallbackCoords);
            setUserLocation(fallbackCoords);
            setLoading(false);
          },
          { timeout: 10000, enableHighAccuracy: true }
        );
      } else {
        console.warn('❌ Geolocalização não suportada');
        setError('Geolocalização não suportada pelo navegador');
        const fallbackCoords = {
          lat: -23.5381,
          lng: -46.9042
        };
        console.log('🔄 Usando localização fallback (Jandira):', fallbackCoords);
        setUserLocation(fallbackCoords);
        setLoading(false);
      }
    }
  }, [userLocation, setUserLocation]);

  // Função para calcular distância entre duas coordenadas (fórmula de Haversine)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distância em km
  };

  return {
    userLocation,
    loading,
    error,
    calculateDistance
  };
}
