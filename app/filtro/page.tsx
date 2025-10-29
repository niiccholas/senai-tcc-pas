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
    const { selectedFilters, setFilter } = useFiltros()
    const [categorias, setCategorias] = useState([])
    const [especialidades, setEspecialidades] = useState([])
    const [loading, setLoading] = useState(true)

    const handleFiltrar = () => {
        console.log('Filtros selecionados ao clicar em Filtrar:', selectedFilters)
        router.push("/unidades")
    }

    const handleLimparFiltros = () => {
        console.log('Limpando filtros')
        setFilter('especialidade', null)
        setFilter('categoria', null)
        setFilter('disponibilidade', null)
        setFilter('distanciaRaio', 10)
        setFilter('unidadeProxima', null)
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
                            
                            <Filtro items={especialidades} tipo="especialidade" maxVisible={7} />

                        </div>
                    </div>
                    
                    <div id="availability" className={styles.filterList}>
                        <h2 className={styles.subtitle}>Atendimento 24h</h2>
                        <div className={styles.optionRow}>
                            <ul>
                                <IconText tipo="disponibilidade" id={1} name="Sim" lightImg="https://file.garden/aOx43sIeICuTJI2s/Done.png"/>
                                <IconText tipo="disponibilidade" id={0} name="Não" lightImg="https://file.garden/aOx43sIeICuTJI2s/Close.png"/>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={styles.section2}>
                    <div id="area-radius" className={styles.filterList}>
                        <h2 className={styles.subtitle}>Localização</h2>
                        
                        <div className={styles.locationOptions}>
                            <IconText 
                                id="unidade-proxima" 
                                lightImg="https://file.garden/aOx43sIeICuTJI2s/Place%20Marker.png" 
                                name="Unidade mais próxima" 
                                tipo="unidadeProxima"
                            />
                        </div>

                        <div className={styles.distanceFilter}>
                            <div className={styles.distanceHeader}>
                                <img 
                                    src="https://file.garden/aOx43sIeICuTJI2s/Depth.png" 
                                    alt="Distância" 
                                    className={styles.distanceIcon}
                                />
                                <span className={styles.distanceLabel}>Distância</span>
                            </div>
                            
                            <div className={styles.sliderContainer}>
                                <input
                                    type="range"
                                    min="5"
                                    max="25"
                                    step="5"
                                    value={selectedFilters.distanciaRaio}
                                    onChange={(e) => setFilter('distanciaRaio', parseInt(e.target.value))}
                                    className={styles.distanceSlider}
                                />
                                <div className={styles.sliderLabels}>
                                    <span>5km</span>
                                    <span>10km</span>
                                    <span>15km</span>
                                    <span>20km</span>
                                    <span>25km</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="public-units" className={styles.filterList}>
                        <h2 className={styles.subtitle}>Unidades Públicas</h2>
                        <div id="unity-list">
                            <Filtro items={categorias} tipo="categoria" maxVisible={4} />
                        
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