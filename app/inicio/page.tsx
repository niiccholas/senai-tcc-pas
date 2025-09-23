import SearchBar from "../components/searchbar/SearchBar"
import InfoCard from "../components/infocard/InfoCard"
import "./page.css"
import { getCampanhas } from "../api/campanha"
import React from 'react';

export default async function HomePage() {

  const campanhas = await getCampanhas()

  return (
    <main>
      <SearchBar />
      <h1>Informações</h1>
      <div className="info-feed">
        <ul>
        {campanhas.map ((campanha) => 
         <InfoCard
         image="/images/vacina.png"
         alt={campanha.nome}
         text={campanha.descricao}
       />
        )}
        </ul>
        
      </div>
    </main>
  )
}
