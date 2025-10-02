"use client"

import IconText from "../components/iconText/IconText"
import SearchBar from "../components/searchbar/SearchBar"
import "./page.css"

export default function FilterPage(){
    return(
        <main>
            <SearchBar></SearchBar>
            <h1>SELECIONE O QUE PRECISA:</h1>
            <div className="filter-card">
                <div className="section-1">
                    <div id="specialties" className="filter-list">
                        <h2>Especialidades</h2>
                        <div className="specialty-list">
                        <ul>
                        <IconText img = "../../../public/images/clinica-geral.png" text = "Clínica geral"/>
                        <IconText img = "../../../public/images/clinica-geral.png" text = "Clínica geral"/>
                        <IconText img = "../../../public/images/clinica-geral.png" text = "Clínica geral"/>
                        <IconText img = "../../../public/images/clinica-geral.png" text = "Clínica geral"/>
                        <IconText img = "../../../public/images/clinica-geral.png" text = "Clínica geral"/>
                        <IconText img = "../../../public/images/clinica-geral.png" text = "Clínica geral"/>
                        <IconText img = "../../../public/images/clinica-geral.png" text = "Clínica geral"/>
                        <IconText img = "../../../public/images/clinica-geral.png" text = "Clínica geral"/>
                        <IconText img = "../../../public/images/clinica-geral.png" text = "Clínica geral"/>
                        </ul>
                    </div>
                    </div>
                    <div id="availability" className="filter-list">
                        <h2>Atendimento 24h</h2>
                        <div className="option-row" >
                            <ul>
                            <IconText
                                img = "../../../public/images/clinica-geral.png"
                                text = "Sim"
                            />
                            <IconText
                                img = "../../../public/images/clinica-geral.png"
                                text = "Não"
                            />
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="section-2">
                    <div id="area-radius" className="filter-list">
                        <h2>Localização</h2>
                        <ul>
                            <IconText
                                img = "../../../public/images/clinica-geral.png"
                                text = "Unidade mais proxima"
                            />
                            <IconText
                                img = "../../../public/images/clinica-geral.png"
                                text = "Distância"
                            />
                        </ul>
                        <div className="randius-bar" ></div>
                    </div>
                    <div id="public-units" className="filter-list">
                        <h2>Unidades Públicas</h2>
                        <div id="unity-list">
                            <IconText img = "../../../public/images/clinica-geral.png" text = "Hospital geral"/>
                            <IconText img = "../../../public/images/clinica-geral.png" text = "UPA (Unidade de Pronto Atendimento)"/>
                            <IconText img = "../../../public/images/clinica-geral.png" text = "UBS (Unidade Básica de Saúde)"/>
                            <IconText img = "../../../public/images/clinica-geral.png" text = "AMA (Assistência Médica Ambulatorial)"/>
                            <IconText img = "../../../public/images/clinica-geral.png" text = "CAPS (Centro de Atenção Psicossocial)"/>
                        </div>
                    </div>
                </div>
            </div>
            <button className="send-filter">FILTRAR</button>
        </main>
    )
}