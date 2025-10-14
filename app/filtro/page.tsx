import { getCategorias, getEspecialidades } from "../api/filtro"
import Filtro from "../components/filtro/Filtro"
import IconText from "../components/iconText/IconText"
import SearchBar from "../components/searchbar/SearchBar"
import { FiltrosProvider } from "../context/FiltroContext"
import styles from "./page.module.css"

export default async function FilterPage(){

    const categorias = await getCategorias()
    const especialidades = await getEspecialidades()
    
    return(
        <FiltrosProvider>
            <main className={styles.main}>
                <SearchBar />
                <h1 className={styles.title}>SELECIONE O QUE PRECISA:</h1>
                
                <div className={styles.filterCard}>
                    <div className={styles.section1}>

                        <div id="specialties" className={styles.filterList}>
                            <h2 className={styles.subtitle}>Especialidades</h2>
                            <div className="specialty-list">
                                
                                <Filtro items={especialidades} tipo="especialidade" />

                            </div>
                        </div>
                        
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
                        <div id="area-radius" className={styles.filterList}>
                            <h2 className={styles.subtitle}>Localização</h2>

                                       {/* CÓDIGO A SER ARRUMADO NA SPRINT 3 */}
                            {/*                             
                            <ul>
                                <IconText id={"Unidade mais próxima"} lightImg="images/placemarker.png" name="Unidade mais próxima" tipo="unidadeProxima"/> 
                     
                                <IconText id={"Distância"} lightImg="images/depth.png" name="Distância" tipo="distancia"/>
                            </ul> */
                            }

                            <div className="randius-bar"></div>
                        </div>

                        <div id="public-units" className={styles.filterList}>
                            <h2 className={styles.subtitle}>Unidades Públicas</h2>
                            <div id="unity-list">
                                
                                <Filtro items={categorias} tipo="categoria"></Filtro>
                            
                            </div>
                        </div>
                    </div>
                </div>

                <button className={styles.sendFilter}>FILTRAR</button>
            </main>
        </FiltrosProvider>
    )
}
