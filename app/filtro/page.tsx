"use client"


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

                    </div>
                    <div className="24h-service">
                        
                    </div>
                </div>
                <div className="section-2">
                    <div className="area-radius">

                    </div>
                    <div className="public-units">
                        
                    </div>
                </div>
            </div>
        </main>
    )
}