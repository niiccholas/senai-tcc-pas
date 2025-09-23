"use client";

import React from "react";
import styles from "./input.module.css";

interface InputProps {
  name: string
  srcImg?: string
  heightImg: string
  isCPF?: boolean
  type: string
  value?: string
  onChange?: (digits: string) => void // argumento onChange que precisa passar o value, "void" significa que não vai retornar nada
}

function onlyDigits(s: string) { // não permite espaços, apenas digitos
  return s.replace(/\D/g, "")
}

function formatCPF(raw: string) { // "raw" é o cpf cru
  const d = onlyDigits(raw).slice(0, 11);
  if (d.length <= 3) return d // retorna os valores normais
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}` // retorna o primeiro e o segundo pedaço
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}` // retorna primeiro, segundo e terceiro pedaço
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}` // cpf inteiramente formatado
}

export default function Input({ name, srcImg, heightImg, isCPF, type }: InputProps) {
  const [value, setValue] = React.useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { // a 
    if (isCPF) { // se o input for cpf vai fazer a formatação
      const digits = onlyDigits(e.target.value).slice(0, 11)
      setValue(formatCPF(digits))
    } else {
      setValue(e.target.value)
    }
  }

  return (
    <div className={styles.divInput}>
      {srcImg && (
        <img
          src={srcImg}
          alt={`${name} Icon`}
          style={{ height: heightImg }}
        />
      )}
      <span>{name.toUpperCase()}:</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        required
        inputMode={isCPF ? "numeric" : "text"} // condição ? valorSeTrue : valorSeFalse
        maxLength={isCPF ? 14 : undefined}     // limita o cpf até 14 digitos
      />
    </div>
  );
}