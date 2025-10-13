import { getEspecialidade } from "../api/especialidade"
import { getCategoria } from "../api/categoria"
import IconText from "../components/iconText/IconText"
import SearchBar from "../components/searchbar/SearchBar"
import FilterButton from "./FilterButton"
import styles from "./page.module.css"

export default async function FilterPage(){
    const especialidades = await getEspecialidade()
    const categorias = await getCategoria()

    return(
        <main className={styles.main}>
            <SearchBar></SearchBar>
            <h1>SELECIONE O QUE PRECISA:</h1>
            <div className={styles.filterCard}>
                <div className={styles.section1}>
                    <div id="specialties" className={styles.filterList}>
                        <h2>Especialidades</h2>
                        <div className={styles.specialtyList}>
                        <ul>
                        {especialidades.map ((especialidade, index) => 
                                    <IconText
                                    img={especialidade.foto_claro}
                                    text={especialidade.nome}
                                    key={index}
                                />
                                )}
                        </ul>
                    </div>
                    </div>
                    <div id="availability" className={styles.filterList}>
                        <h2>Atendimento 24h</h2>
                        <div className={styles.optionRow}>
                            <ul>
                                <IconText img = "images/done.png" text = "Sim"/>
                                <IconText img = "images/close.png" text = "Não"/>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={styles.section2}>
                    <div id="area-radius" className={styles.filterList}>
                        <h2>Localização</h2>
                        <ul>
                            <IconText img = "images/placemarker.png" text = "Unidade mais proxima"/>
                            <IconText img = "images/depth.png" text = "Distância"/>
                        </ul>
                        <div className={styles.randiusBar}></div>
                    </div>
                    <div id="public-units" className={styles.filterList}>
                        <h2>Unidades Públicas</h2>
                        <div id="unity-list">
                            <ul>
                                {categorias.map ((categoria, index) => 
                                    <IconText
                                    img={categoria.foto_claro}
                                    text={categoria.nome}
                                    key={index}
                                />
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <FilterButton />
        </main>
    )
}