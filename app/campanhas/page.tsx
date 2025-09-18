import SearchBar from "../components/searchbar/SearchBar";

export default function HomePage(){
    return(
        <main>
            <SearchBar></SearchBar>
            <h1>Informações</h1>
            <div className="info-feed">
                <div className="info-card">
                    <img src="/images/vacina.png" alt="" />
                    <p></p>
                </div>
            </div>
        </main>
    )
}