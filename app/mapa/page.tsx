'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import SearchBar from '../components/searchbar/SearchBar';

const LocationMap = dynamic(() => import('../components/map/LocationMap'), {
  ssr: false,
  loading: () => <div className={styles.mapLoading}>Carregando mapa...</div>
});

export default function MapaPage() {
  const handleLocationSelect = (address: string, lat: number, lng: number) => {
    console.log('Local selecionado:', { address, lat, lng });
  };

  return (
    <main className={styles.main}>
      <div className={styles.searchBarOverlay}>
        <SearchBar />
      </div>
      
      <div className={styles.mapContainer}>
        <LocationMap onLocationSelect={handleLocationSelect} />
      </div>
    </main>
  );
}