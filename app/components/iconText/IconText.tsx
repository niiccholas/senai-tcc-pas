"use client";
import styles from './IconText.module.css'; 
import React, { useState, useRef, useEffect } from "react";

interface IconTextProps {
  img: string;
  text: string;
}

export default function IconText({ img, text }: IconTextProps) {
  return (
    <div className={styles.icontext}>
      <img src={img} />
      <span>{text}</span>
    </div>
  );
}
