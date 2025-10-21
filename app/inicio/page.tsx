"use client"

import { useEffect, useState } from "react"
import SearchBar from "../components/searchbar/SearchBar"
import InfoCard from "../components/infocard/InfoCard"
import styles from "./page.module.css"
import { getCampanhas } from "../api/campanha"
import React from 'react';

export default function HomePage() {
  const [campanhas, setCampanhas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCampanhas() {
      try {
        const data = await getCampanhas()
        setCampanhas(data)
      } catch (error) {
        console.error('Erro ao carregar campanhas:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCampanhas()
  }, [])

  if (loading) {
    return <div className={styles.main}>Carregando...</div>
  }

  return (
    <main className={styles.main}>
      <SearchBar />
      <h1>Informações</h1>
      <div className={styles.infofeed}>
        {campanhas.map ((campanha, index) => 
          <InfoCard
          image={campanha.foto}
          alt={campanha.nome}
          description={campanha.descricao}
          audience={campanha.publico_alvo}
          campaignType={campanha.tipo}
          unitType={campanha.tipo_unidade_disponivel}
          observations={campanha.observacoes}
          city={campanha.cidades}
          startDate={campanha.data_inicio}
          endDate={campanha.data_termino}
          dayHours={campanha.dias_horario}
          key={index}
          />
        )}
      </div>
    </main>
  )
}