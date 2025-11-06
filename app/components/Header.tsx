"use client";

import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

export default function Header() {
  const router = useRouter();
  const { isLoggedIn, loading } = useUser();

  const handleProfileClick = () => {
    // Não fazer nada se ainda estiver carregando
    if (loading) return;
    
    if (isLoggedIn) {
      router.push("/perfil-e-configuracoes");
    } else {
      router.push("/login");
    }
  };

  return (
    <header>
      <div className="logo">
        <img src="/images/paslogo.png" alt="Logo"/>
      </div>
      
      <div className="menu">
        <nav className="navigation">
        <a href="/inicio">INÍCIO</a>
        <a href="/mapa">MAPA</a>
        </nav>

        <button 
          className="usericon"
          type="button"
          onClick={handleProfileClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="user-icon">
            <path d="M18 20a6 6 0 0 0-12 0"/>
            <circle cx="12" cy="10" r="4"/>
            <circle cx="12" cy="12" r="10"/>
          </svg>
        </button>
      </div>
    </header>
  );
}
