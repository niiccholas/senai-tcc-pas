"use client";

import { useEffect } from "react";
import { useFiltros } from "../../context/FiltroContext";
import styles from "./IconText.module.css"

interface IconTextProps {
  tipo?: keyof import("../../context/FiltroContext").SelectedFiltersState;
  id: string | number;
  name: string;
  lightImg?: string;
  darkImg?: string;
}

export default function IconText({ tipo, id, name, lightImg, darkImg }: IconTextProps) {
  const { selectedFilters, setFilter } = useFiltros();

  // Verificação de segurança
  if (!tipo) {
    console.warn('IconText: tipo não definido para', name);
    return null;
  }

  // Garantir que a comparação seja feita com o mesmo tipo
  const idAsNumber = typeof id === 'string' ? parseInt(id, 10) : id;
  const checked = selectedFilters[tipo] === idAsNumber;
  
  console.log(`IconText ${name}:`, { tipo, id, idAsNumber, checked, selectedValue: selectedFilters[tipo] });

  useEffect(() => {
    console.log("SelectedFilters mudou:", selectedFilters);
  }, [selectedFilters]);

  const handleClick = () => {
    console.log('Clicou no IconText:', { tipo, id, checked });
    
    // Se já está selecionado, desseleciona (define como null)
    // Se não está selecionado, seleciona
    if (checked) {
      console.log('Desselecionando...');
      setFilter(tipo, null);
    } else {
      console.log('Selecionando...', { tipo, idAsNumber });
      setFilter(tipo, idAsNumber);
    }
  };

  return (
    <div 
      className={`${styles.icontext} ${checked ? styles.selected : ''}`}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <input
        type="radio"
        name={tipo} // para comportamento único
        checked={checked}
        readOnly
        style={ {display: "none"} }
      />
      <img src={lightImg}/>
      <span>{name}</span>
    </div>
  );
}