'use client'

import { useState } from 'react'
import IconText from '../components/iconText/IconText'

interface ExpandableListProps {
  items: Array<{ id: number; nome: string; foto_claro: string }>
  maxVisible: number
}

export default function ExpandableList({ items, maxVisible }: ExpandableListProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const visibleItems = isExpanded ? items : items.slice(0, maxVisible)
  const hasMoreItems = items.length > maxVisible

  return (
    <div>
      <ul>
        {visibleItems.map((item) => (
          <IconText 
            key={item.id}
            img={item.foto_claro } 
            text={item.nome}
          />
        ))}
      </ul>
      {hasMoreItems && !isExpanded && (
        <div onClick={() => setIsExpanded(true)} style={{ cursor: 'pointer' }}>
          <IconText 
            img= "https://file.garden/aOx43sIeICuTJI2s/Plus%20Math.png"
            text="Ver mais"
          />
        </div>
      )}
      {isExpanded && (
        <div onClick={() => setIsExpanded(false)} style={{ cursor: 'pointer' }}>
          <IconText 
            img="https://file.garden/aOx43sIeICuTJI2s/Subtract.png" 
            text="Ver menos"
          />
        </div>
      )}
    </div>
  )
}