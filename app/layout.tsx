import { ReactNode } from 'react'
import './global.css'
import { FiltrosProvider } from './context/FiltroContext'

export const metadata = {
  title: 'PAS',
  description: 'Painel de Acesso à Saúde (PAS)',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
        <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rubik:wght@100;200;300;400;500;600;700&display=swap"></link>
        </head>
        
      <FiltrosProvider>
      <body className="rubik.className">
        <header>
            <div className="logo">
            <img src="/images/paslogo.png" alt="Logo"/>
            </div>
           
            <nav className="navigation">
                <a href="/inicio">INÍCIO</a>
                <a href="/mapa">MAPA</a>
            </nav>

            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="user-icon"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>

        </header>

        {children}

      </body>
      </FiltrosProvider>
    </html>
  )
}