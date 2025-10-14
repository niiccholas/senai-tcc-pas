"use client";

import IconText from "../iconText/IconText";
import styles from "./Filtro.module.css"

interface Item {
  id: string | number | boolean; // aceita boolean agora
  nome: string
  foto_claro?: string
  foto_escuro?: string
}

interface FiltrosProps {
  items: Item[];
  tipo: keyof import("../../context/FiltroContext").SelectedFiltersState;
}

export default function Filtros({ items, tipo }: FiltrosProps) {
  return (
    <div className={styles.filtroList}>
      {items.map(item => (
        <IconText
          key={String(item.id)}  // converte para string para key
          id={item.id}
          tipo={tipo}
          name={item.nome}
          lightImg={item.foto_claro}
          darkImg={item.foto_escuro}
        />
      ))}
    </div>
  )
}