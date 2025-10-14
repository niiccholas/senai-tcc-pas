import SearchBar from "../components/searchbar/SearchBar"
import InfoCard from "../components/infocard/InfoCard"
import styles from "./page.module.css"
import { getCampanhas } from "../api/campanha"
import React from 'react';

export default async function HomePage() {

  const campanhas = await getCampanhas()
<<<<<<< HEAD

  return (
    <main className={styles.main}>
      <SearchBar />
      <h1>Informações</h1>
      <div className={styles.infofeed}>
=======
  
  return (
    <main className="main">
      <SearchBar />
      <h1>Informações</h1>
>>>>>>> nicolas
        <ul>
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
<<<<<<< HEAD
        </ul>
      </div>
=======
        </ul> 
        
>>>>>>> nicolas
    </main>
  )
}