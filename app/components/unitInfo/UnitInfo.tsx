'use client'

import React from 'react'
import styles from './UnitInfo.module.css'

interface UnitInfoProps {
  id: string
  name: string
  image: string
  alt: string
  category: string
  waitTime: string
  address: string
  phone: string
  specialties: string[]
}

export default function UnitInfo({id, name, image, category, waitTime, address, phone, specialties, alt }: UnitInfoProps) {
  return (
    <div className={styles.unitCard}>
        <div className={styles.generalInfo}>
            <div className={styles.imgTitle}>
                <img src={image} alt={alt} />
                <h2>{name}</h2>
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
                        <span className={styles.element}>{waitTime}</span>
                    </div>
                </div>
                <div className={styles.infoElement}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#134E83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin-icon lucide-map-pin">
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
                    <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <div>
                        <span className={styles.label}>Endereço</span>
                        <span className={styles.element}>{address}</span>
                    </div>
                </div>
                <div className={styles.infoElement}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#134E83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone-icon lucide-phone">
                    <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>
                    </svg>
                    <div>
                        <span className={styles.label}>Telefone</span>
                        <span className={styles.element}>{phone}</span>
                    </div>
                </div>
            </div>
      </div>
      <button className={styles.specialtyBtn}>Selecione uma especialidade</button>
      <div className={styles.specialityList}></div>
    </div>
  )
}