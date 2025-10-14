"use client";

import IconText from "../iconText/IconText";

interface Item {
  id: string | number | boolean; // aceita boolean agora
  nome: string
  lightImg?: string
  darkImg?: string
}

interface FiltrosProps {
  items: Item[];
  tipo: keyof import("../../context/FiltroContext").SelectedFiltersState;
}

export default function Filtros({ items, tipo }: FiltrosProps) {
  return (
    <div>
      {items.map(item => (
        <IconText
          key={String(item.id)}  // converte para string para key
          id={item.id}
          tipo={tipo}
          name={item.nome}
          lightImg={item.lightImg}
          darkImg={item.darkImg}
        />
      ))}
    </div>
  )
}