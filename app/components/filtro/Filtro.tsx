"use client";

import { useState } from "react";
import IconText from "../iconText/IconText";
import styles from "./Filtro.module.css"

interface Item {
  id: string | number; 
  nome: string
  lightImg?: string
  darkImg?: string
  foto_claro?: string
  foto_escuro?: string
}

interface FiltrosProps {
  items: Item[];
  tipo: keyof import("../../context/FiltroContext").SelectedFiltersState;
  maxVisible?: number; 
}

export default function Filtros({ items, tipo, maxVisible = 6 }: FiltrosProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const visibleItems = isExpanded ? items : items.slice(0, maxVisible);
  const hasMoreItems = items.length > maxVisible;

  return (
    <div className={styles.filtroList}>
      {visibleItems.map(item => (
        <IconText
          key={String(item.id)}  
          id={item.id}
          tipo={tipo}
          name={item.nome}
          lightImg={item.lightImg || item.foto_claro}
          darkImg={item.darkImg || item.foto_escuro}
        />
      ))}
      
      {hasMoreItems && !isExpanded && (
        <div className={styles.verMaisMenos} onClick={() => setIsExpanded(true)}>
          <img 
            src="https://file.garden/aOx43sIeICuTJI2s/Plus%20Math.png" 
            alt="Ver mais" 
            width={16} 
            height={16}
          />
          <span>Ver mais</span>
        </div>
      )}
      {isExpanded && (
        <div className={styles.verMaisMenos} onClick={() => setIsExpanded(false)}>
          <img 
            src="https://file.garden/aOx43sIeICuTJI2s/Subtract.png" 
            alt="Ver menos" 
            width={16} 
            height={16}
          />
          <span>Ver menos</span>
        </div>
      )}
    </div>
  )
}