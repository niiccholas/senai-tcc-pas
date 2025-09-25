import SearchBar from "../components/searchbar/SearchBar"
import InfoCard from "../components/infocard/InfoCard"
import styles from "./page.module.css"
import { getCampanhas } from "../api/campanha"
import React from 'react';
export default async function HomePage() {

  const campanhas = await getCampanhas()

  return (
    // <main className={styles.main}>
    //   <SearchBar />
    //   <h1>Informações</h1>
    //   <div className={styles.infoFeed}>
    //     <ul>
    //     {campanhas.map ((campanha, index) => 
    //      <InfoCard
    //      image={campanha.foto}
    //      alt={campanha.nome}
    //      text={campanha.descricao}
    //      key={index}
    //    />
    //     )}
    //     </ul>

    //   </div> 
    // </main>
  
    <main className={styles.main}>

      <h1>Informações</h1>
      <div className={styles.infoFeed}>
        <ul>
        {campanhas.map ((campanha, index) => 
         <InfoCard
         image={campanha.foto}
         alt={campanha.nome}
         text={campanha.descricao}
         key={index}
       />
        )}
        </ul>
      </div>

    </main>
  )
}
