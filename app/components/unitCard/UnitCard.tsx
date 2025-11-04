'use client'

import React from 'react'
import { useTheme } from '../../context/ThemeContext'
import styles from './UnitCard.module.css'
import { formatWaitTime } from '../../utils/timeFormatter'

interface UnitCardProps {
  id: string
  name: string
  waitTimeGeneral?: string
  onLearnMore?: (unitId: string) => void
}

export default function UnitCard({ id, name, waitTimeGeneral, onLearnMore }: UnitCardProps) {
  const { isDark } = useTheme()
  const handleLearnMoreClick = () => onLearnMore?.(id)

  return (
    <div className={styles.unitCard}> 
      
        <h3 className={styles.unitName}>{name}</h3>

        <div className={styles.lowerDiv}>
                <div className={styles.waitContainer}>
                    <div className={styles.clockIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={isDark ? "#ffffff" : "#000000"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock-icon lucide-clock"><path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/></svg>
                    </div>

                    <div className={styles.waitBox}>
                        <span className={styles.waitLabel}>Tempo de espera</span>
                        <span className={styles.waitValue}>
                            <b>{formatWaitTime(waitTimeGeneral)}</b> 
                        </span>
                    </div>
                </div>

            <button className={styles.learnMoreBtn} onClick={handleLearnMoreClick} type="button">
                Saber mais
            </button>
        </div>
    </div>
  )
}

export type { UnitCardProps }