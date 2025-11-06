"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  nome: string;
  cpf: string;
  naturalidade: string;
  nascimento: string;
  nome_mae: string;
  email: string;
  cep: string;
  telefone: string;
  id: string;
  foto?: string; // URL da foto de perfil (opcional)
}

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Carregar dados do usuário do localStorage na inicialização
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('pas-user');
      console.log('🔍 Verificando localStorage:', savedUser ? 'Dados encontrados' : 'Nenhum dado encontrado');
      
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        console.log('✅ Dados do usuário carregados:', userData.nome);
        setUser(userData);
      } else {
        console.log('❌ Nenhum usuário salvo encontrado');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados do usuário:', error);
      localStorage.removeItem('pas-user');
    } finally {
      setLoading(false);
      console.log('🏁 Carregamento do contexto finalizado');
    }
  }, []);

  const login = (userData: User) => {
    console.log('🔑 Login realizado para:', userData.nome);
    setUser(userData);
    localStorage.setItem('pas-user', JSON.stringify(userData));
    console.log('💾 Dados salvos no localStorage');
  };

  const logout = () => {
    console.log('🚪 Logout realizado');
    setUser(null);
    localStorage.removeItem('pas-user');
    console.log('🗑️ Dados removidos do localStorage');
  };

  const isLoggedIn = user !== null;

  return (
    <UserContext.Provider value={{ user, isLoggedIn, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser deve ser usado dentro de UserProvider");
  }
  return context;
}
