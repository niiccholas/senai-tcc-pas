'use client'

import React from 'react'
import styles from './Specialty.module.css'
import { formatWaitTime } from '../../utils/timeFormatter'

interface SpecialtyProps {
  id: string
  name: string
  waitTime?: string
}

export default function Specialty({ id, name, waitTime }: SpecialtyProps) {
  return (
    <div className={styles.specialtyCard}>
      <h4 className={styles.specialtyName}>{name}</h4>
      <div className={styles.waitInfo}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#134E83" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock-icon lucide-clock">
          <path d="M12 6v6l4 2"/>
          <circle cx="12" cy="12" r="10"/>
        </svg>
        <div>
          <span className={styles.label}>Tempo de espera</span>
          <span className={styles.time}>{formatWaitTime(waitTime) || 'N/A'}</span>
        </div>
      </div>
    </div>
  )
}