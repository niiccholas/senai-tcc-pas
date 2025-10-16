"use client";

import { useState } from "react";
import IconText from "../iconText/IconText";
import styles from "./Filtro.module.css"

interface Item {
  id: string | number; // removido boolean
  nome: string
  lightImg?: string
  darkImg?: string
  foto_claro?: string
  foto_escuro?: string
}

interface FiltrosProps {
  items: Item[];
  tipo: keyof import("../../context/FiltroContext").SelectedFiltersState;
  maxVisible?: number; // opcional, padrão será 6
}

export default function Filtros({ items, tipo, maxVisible = 6 }: FiltrosProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const visibleItems = isExpanded ? items : items.slice(0, maxVisible);
  const hasMoreItems = items.length > maxVisible;

  return (
    <div className={styles.filtroList}>
      {visibleItems.map(item => (
        <IconText
          key={String(item.id)}  // converte para string para key
          id={item.id}
          tipo={tipo}
          name={item.nome}
          lightImg={item.lightImg || item.foto_claro}
          darkImg={item.darkImg || item.foto_escuro}
        />
      ))}
      
      {hasMoreItems && !isExpanded && (
        <div onClick={() => setIsExpanded(true)} style={{ cursor: 'pointer' }}>
          <IconText 
            id="ver-mais"
            name="Ver mais"
            lightImg="https://file.garden/aOx43sIeICuTJI2s/Plus%20Math.png"
          />
        </div>
      )}
      {isExpanded && (
        <div onClick={() => setIsExpanded(false)} style={{ cursor: 'pointer' }}>
          <IconText 
            id="ver-menos"
            name="Ver menos"
            lightImg="https://file.garden/aOx43sIeICuTJI2s/Subtract.png"
          />
        </div>
      )}
    </div>
  )
}