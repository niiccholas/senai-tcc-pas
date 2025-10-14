"use client";

import { useEffect } from "react";
import { useFiltros } from "../../context/FiltroContext";
import styles from "./IconText.module.css"

interface IconTextProps {
  tipo: keyof import("../../context/FiltroContext").SelectedFiltersState;
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
    <label className={styles.icontext}>
      <input
        type="radio"
        name={tipo} // para comportamento único
        checked={checked}
        onChange={() => setFilter(tipo, id)}
        style={ {display: "none"} }
      />
      <img src={lightImg}/>
      <span>{name}</span>
    </label>
  );
}