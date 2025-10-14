"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCategorias, getEspecialidades } from "../api/filtro"
import Filtro from "../components/filtro/Filtro"
import IconText from "../components/iconText/IconText"
import SearchBar from "../components/searchbar/SearchBar"
import { useFiltros } from "../context/FiltroContext"
import styles from "./page.module.css"

export default function FilterPage(){
    const router = useRouter()
    const { selectedFilters } = useFiltros()
    const [categorias, setCategorias] = useState([])
    const [especialidades, setEspecialidades] = useState([])
    const [loading, setLoading] = useState(true)

    const handleFiltrar = () => {
        console.log('Filtros selecionados:', selectedFilters)
        router.push("/unidades")
    }

    useEffect(() => {
        async function loadData() {
            try {
                const [categoriasData, especialidadesData] = await Promise.all([
                    getCategorias(),
                    getEspecialidades()
                ])
                setCategorias(categoriasData)
                setEspecialidades(especialidadesData)
            } catch (error) {
                console.error('Erro ao carregar dados:', error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    if (loading) {
        return <div className={styles.main}>Carregando...</div>
    }
    
    return(
        <main className={styles.main}>
            <SearchBar />
            <h1 className={styles.title}>SELECIONE O QUE PRECISA:</h1>
            
            <div className={styles.filterCard}>
                <div className={styles.section1}>

                    <div id="specialties" className={styles.filterList}>
                        <h2 className={styles.subtitle}>Especialidades</h2>
                        <div className="specialty-list">
                            
                            <Filtro items={especialidades} tipo="especialidade" maxVisible={6} />

                        </div>
                    </div>
                    
                    <div id="availability" className={styles.filterList}>
                        <h2 className={styles.subtitle}>Atendimento 24h</h2>
                        <div className={styles.optionRow}>
                            <ul>
                                <IconText tipo="disponibilidade" id={true} name="Sim" lightImg="https://file.garden/aOx43sIeICuTJI2s/Done.png"/>
                                <IconText tipo="disponibilidade" id={false} name="Não" lightImg="https://file.garden/aOx43sIeICuTJI2s/Close.png"/>
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
                            
                            <Filtro items={categorias} tipo="categoria" maxVisible={5} />
                        
                        </div>
                    </div>
                </div>
            </div>

            <button 
                type="submit" 
                className={styles.sendFilter} 
                onClick={handleFiltrar}
            >
                FILTRAR
            </button>
        </main>
    )
}