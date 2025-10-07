"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./InfoCard.module.css";

interface CidadeInfo {
  cidade: string;
  unidades_disponiveis: string[];
}

interface InfoCardProps {
  image: string;
  alt?: string;
  description: string;
  audience?: string;
  campaignType: string;
  unitType: string;
  observations?: string;
  city: CidadeInfo[];
  startDate?: string;
  endDate?: string;
  dayHours?: string;
}

export default function InfoCard({
  image,
  alt,
  description,
  audience,
  campaignType,
  unitType,
  observations,
  city,
  startDate,
  endDate,
  dayHours,
}: InfoCardProps) {
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
        className={styles.infocardImg}
        onClick={() => setOpenCard(!openCard)}
      />
      {openCard && <p className={styles.infocardP}>{description}</p>}
      {openCard && (
        <>
          <div className={styles.buttonsContainer}>
            <button
            className={styles.moreInfo}
            onClick={() => setOpenInfo((prev) => !prev)}
            >
            Outras informações
            </button>
            {openInfo && (
              <div className={styles.otherInfo}>
                <p>Observações: <span>{observations}</span></p>
                <p>Tipo da campanha: <span>{campaignType}</span></p>
                <p>Público-alvo: <span>{audience}</span></p>
              </div>
            )}
            <button
              className={styles.moreInfo}
              onClick={() => setOpenLocation((prev) => !prev)}
            >
              Localização
            </button>
            {openLocation && (
              <div className={styles.locationInfo}>
                <p>
                  Disponível em: <span>{unitType}</span>
                </p>
                {city.map((cidadeObj, idx) => (
                  <div key={idx} className={styles.cityBlock}>
                    <p>
                      Cidade: <span>{cidadeObj.cidade}</span>
                    </p>
                    <p>Unidades: </p>
                    <ul className={styles.unitList}>
                      {cidadeObj.unidades_disponiveis.map((unidade, unidadeIdx) => (<li key={unidadeIdx}>{unidade}</li>))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
            <button
              className={styles.moreInfo}
              onClick={() => setOpenDates((prev) => !prev)}
            >
              Datas da campanha
            </button>
            {openDates && (
              <div className={styles.campaignDates}>
                <p>Início da campanha: <span>{startDate}</span></p>
                <p>Término da campanha: <span>{endDate}</span></p>
                <p>Dias e horários: <span>{dayHours}</span></p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}