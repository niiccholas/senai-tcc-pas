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
  onChange?: (digits: string) => void
}

function onlyDigits(s: string) {
  return s.replace(/\D/g, "")
}

function formatCPF(raw: string) {
  const d = onlyDigits(raw).slice(0, 11);
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`
}

export default function Input({ name, srcImg, heightImg, isCPF, type }: InputProps) {
  const [value, setValue] = React.useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCPF) {
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
        inputMode={isCPF ? "numeric" : "text"}
        maxLength={isCPF ? 14 : undefined}
      />
    </div>
  );
}