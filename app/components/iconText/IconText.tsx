"use client";

import { useEffect } from "react";
import { useFiltros } from "../../context/FiltroContext";

interface IconTextProps {
  tipo?: keyof import("../../context/FiltroContext").SelectedFiltersState;
  id: string | number | boolean;
  name: string;
  lightImg?: string;
  darkImg?: string;
}

export default function IconText({ tipo, id, name, lightImg, darkImg }: IconTextProps) {
  const { selectedFilters, setFilter } = useFiltros();

  const checked = selectedFilters[tipo] === id;

  useEffect(() => {
  console.log("SelectedFilters mudou:", selectedFilters);
}, [selectedFilters]);

  return (
    <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
      <input
        type="radio"
        name={tipo} // para comportamento único
        checked={checked}
        onChange={() => setFilter(tipo, id)}
        style={{ }}
      />
      {lightImg && <img src={lightImg} alt={name} />}
      <span>{name}</span>
    </label>
  );
}