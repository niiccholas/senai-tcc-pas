"use client"

import { NextPage } from 'next'
import IconText from '../iconText/IconText'

interface Categoria { // tem q ser igualzinho da api
  id: number
  nome: string
  foto_claro: string
  foto_escuro: string
}

interface Props {
    categorias: Categoria[] // pois quero passar um array de campanhas
}

const Filtro: NextPage<Props> = ({ categorias }) => {

  return (
    // colocar estilo dps
    <ul> 
        {/* <IconText img="/images/clinica-geral.png" text="Clínica geral"/>
        <IconText img="/images/clinica-geral.png" text="Clínica geral"/>
        <IconText img="/images/clinica-geral.png" text="Clínica geral"/>
        <IconText img="/images/clinica-geral.png" text="Clínica geral"/> */}

        {categorias.map ((categoria, index) => <IconText key={index} img={categoria.foto_claro} text={categoria.nome}/>)} 

    </ul>)
}

export default Filtro