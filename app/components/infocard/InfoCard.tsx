"use client";
import React, { useState, useRef, useEffect } from "react";
import "./InfoCard.css"; // se quiser css separado

interface InfoCardProps {
  image: string;
  alt: string;
  text: string;
}

export default function InfoCard({ image, alt, text }: InfoCardProps) {
  const [openCard, setOpenCard] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setOpenCard(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="info-card" ref={cardRef}>
      <img
        src={image}
        alt={alt}
        onClick={() => setOpenCard(!openCard)}
      />
      {openCard && <p>{text}</p>}
    </div>
  );
}
