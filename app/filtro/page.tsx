import { getCategorias, getEspecialidades } from "../api/filtro"
import Filtro from "../components/filtro/Filtro"
import IconText from "../components/iconText/IconText"
import SearchBar from "../components/searchbar/SearchBar"
import FilterButton from "./FilterButton"
import ExpandableList from "./ExpandableList"
import styles from "./page.module.css"

export default async function FilterPage() {
  const categorias = await getCategorias()
  const especialidades = await getEspecialidades()
  
  return (
    <main className={styles.main}>
      <SearchBar />
      <h1 className={styles.title}>SELECIONE O QUE PRECISA:</h1>
      
      <div className={styles.filterCard}>
        <div className={styles.section1}>
          {/* Especialidades com lista expansível */}
          <div id="specialties" className={styles.filterList}>
            <h2 className={styles.subtitle}>Especialidades</h2>
            <div className={styles.specialtyList}>
              <ExpandableList items={especialidades} maxVisible={6} />
            </div>
          </div>
          
          {/* Atendimento 24h */}
          <div id="availability" className={styles.filterList}>
            <h2 className={styles.subtitle}>Atendimento 24h</h2>
            <div className={styles.optionRow}>
              <ul>
                <IconText tipo="disponibilidade" id={true} name="Sim" />
                <IconText tipo="disponibilidade" id={false} name="Não" />
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.section2}>
          {/* Localização */}
          <div id="area-radius" className={styles.filterList}>
            <h2 className={styles.subtitle}>Localização</h2>
            {/* CÓDIGO A SER ARRUMADO NA SPRINT 3 */}
            {/* 
            <ul>
              <IconText id={"Unidade mais próxima"} lightImg="images/placemarker.png" name="Unidade mais próxima" tipo="unidadeProxima"/> 
              <IconText id={"Distância"} lightImg="images/depth.png" name="Distância" tipo="distancia"/>
            </ul> 
            */}
            <div className={styles.radiusBar}></div>
          </div>

          {/* Unidades Públicas com lista expansível */}
          <div id="public-units" className={styles.filterList}>
            <h2 className={styles.subtitle}>Unidades Públicas</h2>
            <div id="unity-list">
              <ExpandableList items={categorias} maxVisible={6} />
            </div>
          </div>
        </div>
      </div>

      {/* Botão de filtrar */}
      <FilterButton />
    </main>
  )
}