'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import SearchBar from '../components/searchbar/SearchBar';
import { LazyLocationMap } from '../components/LazyComponents';

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
        <LazyLocationMap 
          onLocationSelect={handleLocationSelect} 
          showAllUnits={true}
        />
      </div>
    </main>
  );
}