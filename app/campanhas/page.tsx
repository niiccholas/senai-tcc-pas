"use client";
import SearchBar from "../components/searchbar/SearchBar";
import InfoCard from "../components/infocard/infoCard";
import "./page.css";

export default function HomePage() {
  return (
    <main>
      <SearchBar />
      <h1>Informações</h1>
      <div className="info-feed">
        <InfoCard
          image="/images/vacina.png"
          alt="Campanha Vacinação"
          text="A poliomielite, também conhecida como paralisia infantil, é uma doença contagiosa que pode causar sequelas permanentes e não tem cura. A vacinação é a única forma de prevenção. Durante o período da campanha, todas as crianças menores de 5 anos devem ser levadas às Unidades Básicas de Saúde para receber a dose. Além disso, os pais ou responsáveis podem aproveitar o momento para apresentar a caderneta de vacinação e atualizar outras vacinas em atraso. Vacinar é rápido, seguro e gratuito, e garante proteção para toda a vida."
        />
      </div>
    </main>
  );
}
