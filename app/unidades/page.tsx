'use client';

import React, { useEffect, useState } from 'react'
import styles from './page.module.css'
import { getUnidades } from '../api/unidade'
import UnitCard,  {UnitCardProps}  from '../components/unitCard/UnitCard';
import SearchBar from '../components/searchbar/SearchBar';

export default function FilterPage() {
  const [unidades, setUnidades] = useState<UnitCardProps[]>([])

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
        <div className={styles.unitDiv}>
            <div className={styles.unitList}>
                {unidades.map((unidade) => (
                <UnitCard
                    key={unidade.id}
                    id={unidade.id}
                    name={unidade.name}
                    waitTime={unidade.waitTime}
                />
                ))}
            </div>
            <button className={styles.closeUnitList} type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#134879" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
        </div>
      <div className={styles.unitMap}>
        <SearchBar></SearchBar>
      </div>
    </main>
  )
}