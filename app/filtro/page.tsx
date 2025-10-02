"use client"

import IconText from "../components/iconText/IconText"
import SearchBar from "../components/searchbar/SearchBar"
import styles from "./page.module.css"

export default function FilterPage(){
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
                            <IconText img = "/images/clinica-geral.png" text = "Clínica geral"/>
                            <IconText img = "/images/clinica-geral.png" text = "Clínica geral"/>
                            <IconText img = "/images/clinica-geral.png" text = "Clínica geral"/>
                            <IconText img = "/images/clinica-geral.png" text = "Clínica geral"/>
                            <IconText img = "/images/clinica-geral.png" text = "Clínica geral"/>
                            <IconText img = "/images/clinica-geral.png" text = "Clínica geral"/>
                            <IconText img = "/images/clinica-geral.png" text = "Clínica geral"/>
                            <IconText img = "/images/clinica-geral.png" text = "Clínica geral"/>
                            <IconText img = "/images/clinica-geral.png" text = "Clínica geral"/>
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
                            <IconText img = "images/clinica-geral.png" text = "Hospital geral"/>
                            <IconText img = "images/clinica-geral.png" text = "UPA (Unidade de Pronto Atendimento)"/>
                            <IconText img = "/images/clinica-geral.png" text = "UBS (Unidade Básica de Saúde)"/>
                            <IconText img = "/images/clinica-geral.png" text = "AMA (Assistência Médica Ambulatorial)"/>
                            <IconText img = "/images/clinica-geral.png" text = "CAPS (Centro de Atenção Psicossocial)"/>
                        </div>
                    </div>
                </div>
            </div>
            <button className={styles.sendFilter}>FILTRAR</button>
        </main>
    )
}