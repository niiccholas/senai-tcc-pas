"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./InfoCard.module.css";

interface InfoCardProps {
  image: string;
  alt?: string;
  description: string;
  audience?: string;
  campaignType: string;
  unitType: string;
  observations?: string;
  city: string[];
  availableUnits?: string[];
  startDate?: string;
  endDate?: string;
  dayHours?: string;
}

export default function InfoCard({ image, alt, description, audience,  campaignType, unitType, observations, city, availableUnits, startDate, endDate, dayHours}: InfoCardProps) {
  const [openCard, setOpenCard] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);
  const [openDates, setOpenDates] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setOpenCard(false);
        setOpenInfo(false);
        setOpenLocation(false);
        setOpenDates(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.infocard} ref={cardRef}>
      <img
        src={image}
        alt={alt}
        onClick={() => setOpenCard(!openCard)}
      />
      {openCard && <p>{description}</p>}
      {openCard && (
        <>
          <button
            className="more-info"
            onClick={() => setOpenInfo((prev) => !prev)}
          >
            Outras informações
          </button>
          {openInfo && 
            <div className="other-info">
              <p>Tipo da campanha: {campaignType}</p>
              <p>Público-alvo: {audience}</p>
              <p>Observacões: {observations}</p>
            </div> 
            }
          <button
            className="more-info"
            onClick={() => setOpenLocation((prev) => !prev)}
          >
            Localização
          </button>
          {openLocation && 
            <div className="location-info">
            <p>Cidades: {city}</p>
            <p>Tipo de unidade disponível: {unitType}</p>
            <p>Unidades disponíveis: {availableUnits}</p>
          </div> 
          }
          <button
            className="more-info"
            onClick={() => setOpenDates((prev) => !prev)}
          >
            Datas da campanha
          </button>
          {openDates &&  
            <div className="campaign-dates">
            <p>Início da campanha: {startDate}</p>
            <p>Término da campanha: {endDate}</p>
            <p>{dayHours}</p>
          </div> 
          }
        </>
      )}
    </div>
  );
}