"use client";
import "./IconText.css"; // se quiser css separado

interface IconTextProps {
  img: string;
  text: string;
}

export default function IconText({ img, text }: IconTextProps) {
  return (
    <div className="icon-text">
      <img src={img}/>
      <span>{text}</span>
    </div>
  );
}
