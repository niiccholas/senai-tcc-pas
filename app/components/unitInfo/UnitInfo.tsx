'use client'

import React, { useEffect, useState } from 'react'
import styles from './UnitInfo.module.css'
import Specialty from '../specialty/specialty'
import { getUnidadesById } from "../../api/unidade"

interface UnitInfoProps {
  unitId: string
}

interface UnitData {
  id: number
  nome: string
  telefone: string
  disponibilidade_24h: number
  tempo_espera_geral: string
  foto: string
  local: {
    endereco: Array<{
      logradouro: string
      bairro: string
      cidade: string
    }>
  }
  categoria: {
    categoria: Array<{
      nome: string
    }>
  }
  especialidades: {
    especialidades: Array<{
      id: number
      nome: string
      foto_claro: string
      foto_escuro: string
      tempo_espera: string
    }>
  }
}

export default function UnitInfo({ unitId }: UnitInfoProps) {
  const [unitData, setUnitData] = useState<UnitData | null>(null)
  const [showSpecialties, setShowSpecialties] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUnitData() {
      try {
        setLoading(true)
        const data = await getUnidadesById(unitId)
        
        if (data.status) {
          console.log('Dados da unidade recebidos:', data.unidadeDeSaude)
          setUnitData(data.unidadeDeSaude)
        }
      } catch (error) {
        console.error('Erro ao buscar dados da unidade:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUnitData()
  }, [unitId])

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>
  }

  if (!unitData) {
    return <div className={styles.error}>Erro ao carregar informações da unidade</div>
  }

  const address = unitData.local?.endereco?.[0]
  const category = unitData.categoria?.categoria?.[0]?.nome || 'Não informado'
  const waitTimeGeneral = unitData.tempo_espera_geral 
  const especialidades = unitData.especialidades?.especialidades || []

  if (!address) {
    return <div className={styles.error}>Endereço não disponível para esta unidade</div>
  }

  return (
    <div className={styles.unitCard}>
      <div className={styles.generalInfo}>
        <div className={styles.imgTitle}>
          <img src={unitData.foto} alt={unitData.nome} />
          <h2>{unitData.nome}</h2>
        </div>
        <div className={styles.info}>
          <div className={styles.infoElement}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#134E83" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu-icon lucide-menu">
              <path d="M4 5h16"/>
              <path d="M4 12h16"/>
              <path d="M4 19h16"/>
            </svg>
            <div>
              <span className={styles.label}>Tipo</span>
              <span className={styles.element}>{category}</span>
            </div>
          </div>
          <div className={styles.infoElement}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#134E83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock-icon lucide-clock">
              <path d="M12 6v6l4 2"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
            <div>
              <span className={styles.label}>Tempo de espera</span>
              <span className={styles.element}>{waitTimeGeneral}</span>
            </div>
          </div>
          <div className={styles.infoElement}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#134E83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin-icon lucide-map-pin">
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <div>
              <span className={styles.label}>Endereço</span>
              <span className={styles.element}>
                {address.logradouro}, {address.bairro}, {address.cidade}
              </span>
            </div>
          </div>
          <div className={styles.infoElement}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#134E83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone-icon lucide-phone">
              <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>
            </svg>
            <div>
              <span className={styles.label}>Telefone</span>
              <span className={styles.element}>{unitData.telefone}</span>
            </div>
          </div>
        </div>
      </div>
      <button 
        className={styles.specialtyBtn} 
        onClick={() => setShowSpecialties(!showSpecialties)}
      >
        {showSpecialties ? 'Ocultar especialidades' : 'Ver especialidades'}
      </button>
      {showSpecialties && (
        <div className={styles.specialityList}>
          {especialidades.length > 0 ? (
            especialidades.map((specialty) => (
              <Specialty
                key={specialty.id}
                id={String(specialty.id)}
                name={specialty.nome}
                waitTime={specialty.tempo_espera}
              />
            ))
          ) : (
            <p className={styles.noSpecialties}>Nenhuma especialidade disponível</p>
          )}
        </div>
      )}
    </div>
  )
}