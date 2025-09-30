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
                    <div className="specialties">
                        <h2>Especialidades</h2>
                    </div>
                    <div className="specialty-list">
                        <ul>
                        <IconText
                            img = "../../../public/images/clinica-geral.png"
                            text = "Clínica geral"
                        />
                        <IconText
                            img = "../../../public/images/clinica-geral.png"
                            text = "Clínica geral"
                        />
                        <IconText
                            img = "../../../public/images/clinica-geral.png"
                            text = "Clínica geral"
                        />
                        <IconText
                            img = "../../../public/images/clinica-geral.png"
                            text = "Clínica geral"
                        />
                        <IconText
                            img = "../../../public/images/clinica-geral.png"
                            text = "Clínica geral"
                        />
                        <IconText
                            img = "../../../public/images/clinica-geral.png"
                            text = "Clínica geral"
                        />
                        <IconText
                            img = "../../../public/images/clinica-geral.png"
                            text = "Clínica geral"
                        />
                        <IconText
                            img = "../../../public/images/clinica-geral.png"
                            text = "Clínica geral"
                        />
                        </ul>
                    </div>
                    <div className="24h-service">
                        <h2>Atendimento 24h</h2>
                        <div className="option-row">
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
                    <div className="area-radius">
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
                        <div className="randius-bar"></div>
                    </div>
                    <div className="public-units">
                        <h2>Unidades Públicas</h2>
                        <div className="unity-list">
                            <IconText
                                img = "../../../public/images/clinica-geral.png"
                                text = "Hospital geral"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <button>FILTRAR</button>
        </main>
    )
}